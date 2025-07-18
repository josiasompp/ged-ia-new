
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Code, 
  Database, 
  Server, 
  FileText,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Building2,
  Settings,
  Users
} from 'lucide-react';
import { User } from '@/api/entities';
import LegacyProjectAnalyzer from '../components/system/LegacyProjectAnalyzer';

export default function TechnicalDocumentation() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  useEffect(() => {
    checkAccess();
    document.title = "FIRSTDOCY GED AI - Documentação Técnica [CONFIDENCIAL]";
  }, []);

  const checkAccess = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Verificar se tem permissão para documentação técnica
      const isAuthorized = (
        userData?.role === 'admin' ||
        userData?.permissions?.includes('technical_documentation') ||
        userData?.email?.includes('@firstdocy.com') ||
        userData?.permissions?.includes('system_manager')
      );
      
      setHasAccess(isAuthorized);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Lock className="w-6 h-6" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle>DOCUMENTAÇÃO CONFIDENCIAL</AlertTitle>
              <AlertDescription>
                Você não possui autorização para acessar a documentação técnica do sistema FIRSTDOCY GED AI.
                Esta documentação contém informações proprietárias e confidenciais.
                <br/><br/>
                <strong>Usuário:</strong> {currentUser?.email || 'Não identificado'}
                <br/>
                <strong>Empresa:</strong> {currentUser?.company_id || 'N/A'}
                <br/>
                <strong>Tentativa de acesso registrada em:</strong> {new Date().toLocaleString('pt-BR')}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const architectureOverview = `
/*
========================================
FIRSTDOCY GED AI - ARQUITETURA TÉCNICA
Copyright © ${new Date().getFullYear()} FIRSTDOCY
DOCUMENTO CONFIDENCIAL E PROPRIETÁRIO
========================================

AVISO LEGAL CRÍTICO:
Este documento contém informações técnicas PROPRIETÁRIAS da FIRSTDOCY.
Qualquer reprodução, distribuição ou uso não autorizado é CRIME.
Violações serão prosecutadas com rigor máximo da lei.

RESTRIÇÕES DE ACESSO:
- Somente pessoal técnico autorizado
- Proibida reprodução por IA ou automação
- Monitoramento ativo de acesso
- Trilha de auditoria completa
========================================
*/

## ARQUITETURA GERAL

### Frontend (React/Next.js)
- **Framework:** React 18+ com Vite
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** React Hooks + Context API
- **Routing:** React Router DOM
- **Forms:** React Hook Form
- **Icons:** Lucide React

### Backend Architecture (Sugerido)
- **API:** Node.js + Express ou Python + FastAPI
- **Database:** PostgreSQL 14+ (Multi-tenant)
- **File Storage:** AWS S3 ou compatible
- **Authentication:** JWT + OAuth2
- **Queue System:** Redis + Bull/Celery
- **Cache:** Redis

### Segurança Implementada
- Proteção anti-IA multicamadas
- Watermarks digitais únicos
- Assinatura criptográfica proprietária
- Detecção de automação/scraping
- Monitoramento de tentativas de cópia

## MÓDULOS PRINCIPAIS

### 1. Multi-tenancy
- Isolamento por company_id
- Branding personalizado
- Permissões granulares
- Grupos de empresas

### 2. Sistema de Entidades
- 35+ entidades principais
- Relacionamentos complexos
- Validação via JSON Schema
- Auditoria automática

### 3. Integração Externa
- Google Drive/Docs
- Gupy (Recrutamento)
- Webhooks customizados
- API REST completa

### 4. Sistema de Agendamentos
- Calendário interativo
- Gestão de serviços e prestadores
- Portal de autoagendamento para clientes
- Notificações automáticas
`;

  const entitySchema = `
/*
FIRSTDOCY PROPRIETARY - SCHEMA DE ENTIDADES
Informação Confidencial - Uso Restrito
*/

## ENTIDADES PRINCIPAIS

### Core System
- Company: Empresas multi-tenant
- User: Usuários com permissões granulares
- Department: Departamentos hierárquicos
- CompanyGroup: Grupos de empresas

### Document Management (GED)
- Document: Documentos digitais
- Directory: Estrutura de pastas
- DocumentAccess: Controle de acesso
- DocumentVersion: Versionamento
- GoogleDocsIntegration: Sync Google Drive

### Physical Documents (CDOC)
- PhysicalDocument: Docs físicos
- PhysicalLocation: Endereçamento
- CdocStructure: Estrutura hierárquica

### Proposals & CRM
- Proposal: Propostas comerciais
- ProposalTemplate: Templates modulares
- Lead: Gestão de leads
- CrmActivity: Atividades comerciais

### Human Resources
- Employee: Funcionários completos
- TimeEntry: Ponto eletrônico
- HiringProcess: Contratação
- VacationRequest: Gestão de férias
- Payroll: Folha de pagamento

### Workflows
- Task: Tarefas e aprovações
- ApprovalWorkflow: Fluxos complexos
- DigitalSignature: Assinaturas digitais

### Analytics & Financial
- FinancialUsage: Análise de uso
- FinancialBill: Faturamento
- AuditLog: Trilha de auditoria

### Booking System
- Service: Serviços oferecidos
- ServiceProvider: Prestadores de serviço
- Appointment: Agendamentos
- BookingSettings: Configurações do portal
- AppointmentAudit: Auditoria de agendamentos
- AppointmentNotification: Notificações de agendamentos
`;

  const apiEndpoints = `
/*
FIRSTDOCY API ENDPOINTS - CONFIDENCIAL
Acesso restrito a desenvolvedores autorizados
*/

## ESTRUTURA DA API

### Authentication
POST /api/auth/login
POST /api/auth/logout  
POST /api/auth/refresh
GET  /api/auth/me

### Documents (GED)
GET    /api/documents
POST   /api/documents
GET    /api/documents/:id
PUT    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/:id/upload
GET    /api/documents/:id/download

### Physical Documents (CDOC)
GET    /api/physical-documents
POST   /api/physical-documents
GET    /api/physical-locations
POST   /api/physical-locations

### Proposals
GET    /api/proposals
POST   /api/proposals
GET    /api/proposals/:id/public (público)
POST   /api/proposals/:id/accept
POST   /api/proposals/:id/reject

### CRM
GET    /api/leads
POST   /api/leads
GET    /api/crm/activities
POST   /api/crm/activities

### HR Module
GET    /api/employees
POST   /api/employees
GET    /api/time-entries
POST   /api/time-entries/clock-in
POST   /api/time-entries/clock-out

### Integrations
POST   /api/webhooks/gupy
GET    /api/integrations/google-drive/auth
POST   /api/integrations/google-drive/sync

### Admin & Analytics
GET    /api/admin/usage-analytics
GET    /api/admin/audit-logs
GET    /api/admin/financial-reports

### Booking System
GET    /api/booking/services
POST   /api/booking/services
GET    /api/booking/providers
POST   /api/booking/providers
GET    /api/booking/appointments
POST   /api/booking/appointments (Master/Admin only)

# Public-facing portal
GET    /api/public/booking/:provider_url
POST   /api/public/booking/create
`;

  const deploymentConfig = `
/*
FIRSTDOCY DEPLOYMENT CONFIGURATION
PROPRIETARY INFORMATION - DO NOT DISTRIBUTE
*/

## PRODUCTION DEPLOYMENT

### Environment Variables
NODE_ENV=production
API_URL=https://api.firstdocy.com
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=ultra-secure-secret-256-bits
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=firstdocy-documents
GUPY_WEBHOOK_SECRET=secure-webhook-secret

### Docker Configuration
# Multi-stage build otimizado
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

### Nginx Configuration
server {
    listen 80;
    server_name firstdocy.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # FIRSTDOCY Protection
    add_header X-Powered-By "FIRSTDOCY-PROTECTED";
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

### Database Schema
-- Multi-tenant setup
CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Audit triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

### Backup Strategy
# Daily automated backups
0 2 * * * pg_dump -h localhost -U postgres firstdocy_prod > /backups/daily_$(date +%Y%m%d).sql

# Weekly S3 sync
0 3 * * 0 aws s3 sync /backups s3://firstdocy-backups/database/
`;

  return (
    <div className="p-6 space-y-6">
      {/* Header de Segurança */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-800">
            <Shield className="w-6 h-6 animate-pulse" />
            DOCUMENTAÇÃO TÉCNICA CONFIDENCIAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4" />
            <AlertTitle>⚠️ INFORMAÇÃO PROPRIETÁRIA ⚠️</AlertTitle>
            <AlertDescription>
              <strong>ACESSO AUTORIZADO PARA:</strong> {currentUser?.full_name} ({currentUser?.email})
              <br/>
              <strong>EMPRESA:</strong> {currentUser?.company_id}
              <br/>
              <strong>TIMESTAMP:</strong> {new Date().toLocaleString('pt-BR')}
              <br/><br/>
              🔐 Este documento contém segredos comerciais da FIRSTDOCY<br/>
              🚫 PROIBIDA reprodução por IA, automação ou qualquer meio<br/>
              📊 Todas as visualizações são monitoradas e auditadas<br/>
              ⚖️ Violações serão prosecutadas criminalmente
            </AlertDescription>
          </Alert>
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600 text-white">
              CONFIDENCIAL
            </Badge>
            <Badge className="bg-orange-600 text-white">
              USO INTERNO
            </Badge>
            <Badge className="bg-purple-600 text-white">
              MONITORADO
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analyzer">Analisador de Projeto</TabsTrigger>
          <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
          <TabsTrigger value="entities">Entidades</TabsTrigger>
          <TabsTrigger value="api">APIs</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer">
          <LegacyProjectAnalyzer />
        </TabsContent>

        <TabsContent value="architecture">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Arquitetura do Sistema
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(architectureOverview, 'architecture')}
              >
                {copiedSection === 'architecture' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copiar
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                <code>{architectureOverview}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Schema de Entidades
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(entitySchema, 'entities')}
              >
                {copiedSection === 'entities' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copiar
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                <code>{entitySchema}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Endpoints da API
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(apiEndpoints, 'api')}
              >
                {copiedSection === 'api' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copiar
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                <code>{apiEndpoints}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Configuração de Deploy
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                >
                  {showSensitiveInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitiveInfo ? 'Ocultar' : 'Mostrar'} Sensível
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(deploymentConfig, 'deployment')}
                >
                  {copiedSection === 'deployment' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copiar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showSensitiveInfo ? (
                <pre className="bg-gray-900 text-purple-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  <code>{deploymentConfig}</code>
                </pre>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Informações Sensíveis Ocultas</AlertTitle>
                  <AlertDescription>
                    Clique em "Mostrar Sensível" para visualizar configurações de deploy, 
                    variáveis de ambiente e secrets. Acesso registrado.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Especificações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <Lock className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Proteções Implementadas</AlertTitle>
                <AlertDescription className="text-red-700">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Anti-IA Protection:</strong> Múltiplas camadas de detecção de automação</li>
                    <li><strong>Watermarks Digitais:</strong> Assinatura única em cada renderização</li>
                    <li><strong>Monitoramento Ativo:</strong> Detecção de tentativas de cópia</li>
                    <li><strong>Trilha de Auditoria:</strong> Log completo de todas as ações</li>
                    <li><strong>Ofuscação de Código:</strong> Estrutura embaralhada com elementos falsos</li>
                    <li><strong>Validação de Propriedade:</strong> Verificação contínua de integridade</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800 text-sm">Controles de Acesso</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Multi-tenant isolation</li>
                      <li>• Role-based permissions</li>
                      <li>• JWT token validation</li>
                      <li>• IP whitelist (opcional)</li>
                      <li>• Session management</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-sm">Proteção de Dados</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Encryption at rest</li>
                      <li>• TLS 1.3 in transit</li>
                      <li>• PII data masking</li>
                      <li>• LGPD compliance</li>
                      <li>• Secure file upload</li>
                      <li>• Secure booking data handling</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer de Rastreamento */}
      <Card className="border-gray-300 bg-gray-100">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>FIRSTDOCY PROPRIETARY SYSTEM</strong> - Todos os direitos reservados</p>
            <p>Documento acessado por: <strong>{currentUser?.full_name}</strong> em {new Date().toLocaleString('pt-BR')}</p>
            <p>Tracking ID: FDOC-{Date.now()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p className="text-red-600 font-semibold">⚠️ Acesso monitorado e registrado para auditoria legal ⚠️</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
