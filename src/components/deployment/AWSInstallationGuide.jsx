import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Download, 
  FileText, 
  Terminal, 
  Server, 
  Database, 
  Cloud,
  CheckCircle,
  AlertTriangle,
  Code
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AWSInstallationGuide = () => {
  const [copiedSection, setCopiedSection] = useState('');

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const dockerComposeContent = `version: '3.8'

services:
  firstdocy-app:
    image: firstdocy/ged-ai:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      # Banco de dados
      - DATABASE_URL=\${DATABASE_URL}
      
      # AWS Credentials
      - AWS_ACCESS_KEY_ID=\${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=\${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=\${AWS_REGION}
      - S3_BUCKET=\${S3_BUCKET}
      
      # Aplicação
      - NODE_ENV=production
      - DOMAIN_NAME=\${DOMAIN_NAME}
      - BASE44_APP_ID=\${BASE44_APP_ID}
      
      # Email (SES)
      - SMTP_HOST=\${SMTP_HOST}
      - SMTP_USERNAME=\${SMTP_USERNAME}
      - SMTP_PASSWORD=\${SMTP_PASSWORD}
      
      # Segurança
      - JWT_SECRET=\${JWT_SECRET}
      - ENCRYPTION_KEY=\${ENCRYPTION_KEY}
      
    restart: unless-stopped
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    depends_on:
      - redis
    
    volumes:
      - app_data:/app/data
      - ./logs:/app/logs
    
    networks:
      - firstdocy-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - firstdocy-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - firstdocy-app
    restart: unless-stopped
    networks:
      - firstdocy-network

volumes:
  app_data:
  redis_data:

networks:
  firstdocy-network:
    driver: bridge`;

  const dockerFileContent = `# Use Node.js 18 LTS como base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Alterar ownership dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Comando para iniciar a aplicação
CMD ["npm", "start"]`;

  const envFileContent = `# Configurações do Banco de Dados
DATABASE_URL=postgresql://firstdocy_admin:SUA_SENHA_FORTE_PARA_O_BANCO@firstdocy-db.xxx.rds.amazonaws.com:5432/firstdocy

# Configurações da AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
S3_BUCKET=firstdocy-files-xxx

# Configurações da Aplicação
NODE_ENV=production
DOMAIN_NAME=app.suaempresa.com
BASE44_APP_ID=seu-app-id-base44

# Configurações de Email (Amazon SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_USERNAME=AKIA...
SMTP_PASSWORD=xxx

# Configurações de Segurança
JWT_SECRET=sua-chave-jwt-super-secreta-de-pelo-menos-32-caracteres
ENCRYPTION_KEY=sua-chave-de-criptografia-de-exatos-32-caracteres

# Configurações de Desenvolvimento (remover em produção)
DEBUG=false
LOG_LEVEL=info`;

  const nginxConfigContent = `events {
    worker_connections 1024;
}

http {
    upstream firstdocy_app {
        server firstdocy-app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name app.suaempresa.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name app.suaempresa.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Proxy to app
        location / {
            proxy_pass http://firstdocy_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Rate limiting for API endpoints
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://firstdocy_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Rate limiting for login
        location /auth/ {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://firstdocy_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://firstdocy_app;
        }
    }
}`;

  const packageJsonContent = `{
  "name": "firstdocy-ged-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-calendar": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-button": "^1.0.3",
    "@radix-ui/react-input": "^1.0.3",
    "@radix-ui/react-textarea": "^1.0.3",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-badge": "^1.0.0",
    "@radix-ui/react-card": "^1.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-skeleton": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-sidebar": "^1.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "react-hook-form": "^7.47.0",
    "react-router-dom": "^6.18.0",
    "react-markdown": "^9.0.1",
    "recharts": "^2.8.0",
    "framer-motion": "^10.16.4",
    "lodash": "^4.17.21",
    "axios": "^1.5.0",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "aws-sdk": "^2.1480.0",
    "redis": "^4.6.10",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "node-cron": "^3.0.3",
    "uuid": "^9.0.1",
    "sharp": "^0.32.6",
    "pdf-parse": "^1.1.1",
    "tesseract.js": "^5.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.51.0",
    "eslint-config-next": "^14.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.4"
  }
}`;

  const installationSteps = `#!/bin/bash

# =============================================================================
# FIRSTDOCY GED AI - Instalação Completa na AWS (Passos 4-7)
# =============================================================================
# 
# Este script deve ser executado em uma instância EC2 que já tenha:
# - Docker e Docker Compose instalados
# - Git instalado
# - Acesso à internet
# 
# Pré-requisitos:
# - Instância RDS PostgreSQL criada e acessível
# - Bucket S3 criado
# - Credenciais AWS configuradas
# =============================================================================

set -e

echo "🚀 Iniciando instalação do FIRSTDOCY GED AI..."

# Passo 4: Clonar o repositório da aplicação
echo "📦 Passo 4: Clonando repositório da aplicação..."
cd /home/ec2-user
git clone https://github.com/seu-usuario/firstdocy-ged-ai.git
cd firstdocy-ged-ai

# Passo 5: Configurar variáveis de ambiente
echo "⚙️ Passo 5: Configurando variáveis de ambiente..."
cp .env.example .env

echo "📝 IMPORTANTE: Edite o arquivo .env com suas configurações:"
echo "   - DATABASE_URL: URL do RDS PostgreSQL"
echo "   - AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY"
echo "   - S3_BUCKET: Nome do bucket S3"
echo "   - DOMAIN_NAME: Seu domínio"
echo "   - Outras configurações necessárias"
echo ""
echo "Execute: nano .env"
echo "Pressione Enter quando terminar de editar o arquivo .env..."
read

# Passo 6: Construir e iniciar a aplicação
echo "🏗️ Passo 6: Construindo e iniciando a aplicação..."

# Construir a imagem Docker
echo "Construindo imagem Docker..."
docker build -t firstdocy/ged-ai:latest .

# Iniciar os serviços
echo "Iniciando serviços com Docker Compose..."
docker-compose up -d

# Aguardar os serviços iniciarem
echo "Aguardando serviços iniciarem..."
sleep 30

# Verificar se os serviços estão rodando
echo "Verificando status dos serviços..."
docker-compose ps

# Passo 7: Configurar SSL/TLS (se necessário)
echo "🔒 Passo 7: Configurando SSL/TLS..."
echo "Se você tem certificados SSL, coloque-os na pasta ./ssl/"
echo "Certificados necessários:"
echo "  - ./ssl/cert.pem (certificado)"
echo "  - ./ssl/key.pem (chave privada)"
echo ""
echo "Se você não tem certificados SSL, pode usar o Let's Encrypt:"
echo "  sudo apt install certbot"
echo "  sudo certbot certonly --standalone -d app.suaempresa.com"
echo ""

# Verificar saúde da aplicação
echo "🏥 Verificando saúde da aplicação..."
sleep 10
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Aplicação está respondendo corretamente!"
else
    echo "❌ Aplicação não está respondendo. Verificando logs..."
    docker-compose logs firstdocy-app
fi

# Finalização
echo "🎉 Instalação concluída!"
echo ""
echo "🌐 Acesse sua aplicação em:"
echo "   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure seu domínio para apontar para este IP"
echo "   2. Configure SSL/TLS se ainda não fez"
echo "   3. Configure backup automático"
echo "   4. Configure monitoramento"
echo ""
echo "📚 Para mais informações, consulte a documentação completa."`;

  const troubleshootingGuide = `# Guia de Resolução de Problemas - FIRSTDOCY GED AI

## Problemas Comuns

### 1. Aplicação não inicia
**Sintomas:** Docker Compose falha ao iniciar
**Soluções:**
- Verificar se todas as variáveis de ambiente estão configuradas
- Verificar se o RDS está acessível: \`telnet seu-rds-endpoint.rds.amazonaws.com 5432\`
- Verificar logs: \`docker-compose logs firstdocy-app\`

### 2. Erro de conexão com banco de dados
**Sintomas:** Erro "connection refused" ou "timeout"
**Soluções:**
- Verificar Security Group do RDS (deve permitir conexões na porta 5432)
- Verificar se a DATABASE_URL está correta
- Testar conexão: \`psql "postgresql://user:pass@host:5432/dbname"\`

### 3. Problemas com S3
**Sintomas:** Erro ao fazer upload de arquivos
**Soluções:**
- Verificar se as credenciais AWS estão corretas
- Verificar se o bucket S3 existe
- Verificar permissões IAM para o S3

### 4. Aplicação mostra tela do base44
**Sintomas:** Redirect para login do base44
**Soluções:**
- Verificar se a aplicação está realmente rodando na porta 3000
- Verificar configuração do Nginx
- Verificar se o BASE44_APP_ID está configurado corretamente

### 5. Problemas de SSL
**Sintomas:** Certificado inválido ou conexão insegura
**Soluções:**
- Verificar se os certificados estão no local correto
- Verificar configuração do Nginx
- Usar Let's Encrypt para certificados gratuitos

## Comandos Úteis

### Verificar status dos serviços
\`\`\`bash
docker-compose ps
\`\`\`

### Ver logs da aplicação
\`\`\`bash
docker-compose logs firstdocy-app
docker-compose logs nginx
\`\`\`

### Reiniciar serviços
\`\`\`bash
docker-compose restart
\`\`\`

### Atualizar aplicação
\`\`\`bash
git pull origin main
docker-compose build
docker-compose up -d
\`\`\`

### Backup do banco de dados
\`\`\`bash
pg_dump "postgresql://user:pass@host:5432/dbname" > backup.sql
\`\`\`

### Monitorar recursos
\`\`\`bash
docker stats
htop
df -h
\`\`\``;

  const downloadFiles = () => {
    const files = [
      { name: 'docker-compose.yml', content: dockerComposeContent },
      { name: 'Dockerfile', content: dockerFileContent },
      { name: '.env.example', content: envFileContent },
      { name: 'nginx.conf', content: nginxConfigContent },
      { name: 'package.json', content: packageJsonContent },
      { name: 'install.sh', content: installationSteps },
      { name: 'troubleshooting.md', content: troubleshootingGuide }
    ];

    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast({
      title: "Arquivos baixados!",
      description: "Todos os arquivos necessários foram baixados.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
            FIRSTDOCY GED AI - Instalação Completa AWS
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Guia completo com todos os arquivos necessários para finalizar a instalação
        </p>
        <Badge className="mt-2 bg-green-100 text-green-800">
          Passos 4-7: Instalação da Aplicação
        </Badge>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Pré-requisitos:</strong> Instância EC2 com Docker, Docker Compose e Git já instalados. 
          RDS PostgreSQL e S3 Bucket criados e configurados.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center mb-6">
        <Button onClick={downloadFiles} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
          <Download className="w-5 h-5 mr-2" />
          Baixar Todos os Arquivos
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="docker">Docker</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="nginx">Nginx</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="troubleshooting">Problemas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resumo da Instalação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Passo 4: Clonar Repositório
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fazer o clone do código da aplicação FIRSTDOCY GED AI
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Passo 5: Configurar Ambiente
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configurar variáveis de ambiente (.env) com credenciais AWS, banco de dados, etc.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Passo 6: Construir e Iniciar
                    </h3>
                    <p className="text-sm text-gray-600">
                      Construir a imagem Docker e iniciar todos os serviços
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Passo 7: Configurar SSL
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configurar certificados SSL/TLS para conexões seguras
                    </p>
                  </div>
                </div>
                
                <Alert className="border-green-200 bg-green-50">
                  <Server className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Arquivos Incluídos:</strong> docker-compose.yml, Dockerfile, .env.example, 
                    nginx.conf, package.json, install.sh e guia de resolução de problemas.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Docker Compose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{dockerComposeContent}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(dockerComposeContent, 'docker-compose')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'docker-compose' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Dockerfile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{dockerFileContent}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(dockerFileContent, 'dockerfile')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'dockerfile' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Variáveis de Ambiente (.env)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-orange-200 bg-orange-50 mb-4">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Importante:</strong> Substitua todos os valores marcados com "xxx" e "SUA_..." 
                  pelas suas configurações reais.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{envFileContent}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(envFileContent, 'env')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'env' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Package.json
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{packageJsonContent}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(packageJsonContent, 'package')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'package' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nginx" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Configuração do Nginx
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-200 bg-blue-50 mb-4">
                <Server className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Esta configuração inclui SSL/TLS, rate limiting e headers de segurança.
                  Substitua "app.suaempresa.com" pelo seu domínio real.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{nginxConfigContent}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(nginxConfigContent, 'nginx')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'nginx' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Script de Instalação (install.sh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-green-200 bg-green-50 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Como usar:</strong> Faça upload deste script para sua instância EC2, 
                  dê permissão de execução (chmod +x install.sh) e execute (./install.sh).
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{installationSteps}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(installationSteps, 'script')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'script' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Guia de Resolução de Problemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{troubleshootingGuide}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-green-400 hover:text-green-300"
                  onClick={() => copyToClipboard(troubleshootingGuide, 'troubleshooting')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'troubleshooting' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800">
              Instalação Completa Pronta!
            </h3>
            <p className="text-green-700">
              Todos os arquivos necessários foram fornecidos. Siga os passos do script de instalação 
              e sua aplicação FIRSTDOCY GED AI estará rodando na AWS.
            </p>
            <div className="flex justify-center">
              <Button onClick={downloadFiles} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Baixar Todos os Arquivos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AWSInstallationGuide;