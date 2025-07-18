// Cache simples para reduzir chamadas repetidas à API
class APICache {
  constructor(ttl = 300000) { // 5 minutos de TTL por padrão
    this.cache = new Map();
    this.ttl = ttl;
  }

  generateKey(entity, method, params = {}) {
    const paramString = JSON.stringify(params);
    return `${entity}_${method}_${paramString}`;
  }

  set(key, data) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new APICache();

// Rate limiter simples
class RateLimiter {
  constructor(maxRequests = 50, windowMs = 60000) { // 50 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    
    // Remove requests older than the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getWaitTime() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const waitTime = this.windowMs - (Date.now() - oldestRequest);
    return Math.max(0, waitTime);
  }
}

export const rateLimiter = new RateLimiter();

// Função helper para fazer chamadas com cache e rate limiting
export async function cachedAPICall(entity, method, params = {}) {
  const cacheKey = apiCache.generateKey(entity.name, method, params);
  
  // Tentar buscar do cache primeiro
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Verificar rate limiting
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    console.warn(`Rate limit exceeded. Waiting ${waitTime}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 5000)));
  }
  
  try {
    let result;
    switch (method) {
      case 'list':
        result = await entity.list(...(Array.isArray(params) ? params : []));
        break;
      case 'filter':
        result = await entity.filter(params);
        break;
      case 'get':
        result = await entity.get(params);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    // Armazenar no cache
    apiCache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('Rate limit hit, implementing exponential backoff...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error('Rate limit exceeded - please try again in a moment');
    }
    throw error;
  }
}