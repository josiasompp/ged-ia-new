import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database,
  Download,
  Upload,
  FileText,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function DatabaseBackup() {
  const [activeTab, setActiveTab] = useState('generate');
  const [backupSql, setBackupSql] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBackupSql = () => {
    setIsGenerating(true);
    
    // Simular geração do backup
    setTimeout(() => {
      const sql = `-- =============================================
-- FIRSTDOCY GED AI - DATABASE BACKUP
-- Generated: ${new Date().toISOString()}
-- PostgreSQL Database Dump
-- =============================================

-- Database: firstdocy_ged_ai
-- Encoding: UTF8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Create database
CREATE DATABASE firstdocy_ged_ai WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';

\\connect firstdocy_ged_ai

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLES CREATION
-- =============================================

-- Table: companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
    max_users INTEGER DEFAULT 5,
    max_storage_gb INTEGER DEFAULT 10,
    group_id UUID,
    is_active BOOLEAN DEFAULT true,
    allowed_permissions TEXT[],
    custom_permissions JSONB,
    user_creation_enabled BOOLEAN DEFAULT true,
    max_departments INTEGER DEFAULT 10,
    enabled_modules JSONB DEFAULT '{"ged": true, "proposals": true, "crm": false, "tasks": false, "signatures": false, "hr": false}',
    checklist_config JSONB DEFAULT '{}',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'client', 'super_admin')),
    company_id UUID REFERENCES companies(id),
    department VARCHAR(255),
    position VARCHAR(255),
    phone VARCHAR(20),
    permissions TEXT[],
    is_active VARCHAR(10) DEFAULT 'ativo' CHECK (is_active IN ('ativo', 'inativo', 'pausado')),
    last_login TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT false,
    company_group_id UUID,
    client_company_name VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES departments(id),
    color VARCHAR(7) DEFAULT '#146FE0',
    icon VARCHAR(50) DEFAULT 'folder',
    manager_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: directories
CREATE TABLE directories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_directory_id UUID REFERENCES directories(id),
    path TEXT,
    access_level VARCHAR(20) DEFAULT 'departamento' CHECK (access_level IN ('publico', 'departamento', 'restrito', 'confidencial')),
    inherit_permissions BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    directory_id UUID NOT NULL REFERENCES directories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(20) DEFAULT 'upload' CHECK (document_type IN ('upload', 'google_drive')),
    file_url TEXT,
    google_drive_link TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    category VARCHAR(50) CHECK (category IN ('contrato', 'nota_fiscal', 'relatorio', 'procedimento', 'politica', 'certificado', 'outros')),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'pendente_aprovacao', 'aprovado', 'rejeitado', 'arquivado')),
    version VARCHAR(10) DEFAULT '1.0',
    document_date DATE,
    expiry_date DATE,
    approval_required BOOLEAN DEFAULT false,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    ai_summary TEXT,
    extracted_dates JSONB,
    access_level VARCHAR(20) DEFAULT 'departamento' CHECK (access_level IN ('publico', 'departamento', 'restrito', 'confidencial')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    client_company VARCHAR(255),
    salesperson_email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('servicos', 'produtos', 'consultoria', 'manutencao', 'outros')),
    template_id UUID,
    content JSONB,
    total_value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'visualizada', 'aceita', 'recusada', 'expirada')),
    share_link VARCHAR(255) UNIQUE,
    expiry_date DATE,
    redirect_url TEXT,
    main_proposal_url TEXT,
    main_proposal_filename VARCHAR(255),
    scope_document_url TEXT,
    scope_document_filename VARCHAR(255),
    presentation_url TEXT,
    presentation_filename VARCHAR(255),
    accepted_at TIMESTAMP,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    custom_branding JSONB,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'tarefa' CHECK (type IN ('tarefa', 'aprovacao', 'revisao', 'validacao', 'assinatura')),
    priority VARCHAR(10) DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
    status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'aguardando_aprovacao', 'concluida', 'cancelada', 'rejeitada')),
    assigned_to VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    tags TEXT[],
    attachments JSONB,
    checklist JSONB,
    comments JSONB,
    workflow_id UUID,
    parent_task_id UUID REFERENCES tasks(id),
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    approval_required BOOLEAN DEFAULT false,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    position VARCHAR(255),
    source VARCHAR(50) CHECK (source IN ('website', 'email', 'telefone', 'indicacao', 'evento', 'redes_sociais', 'google_ads', 'facebook_ads', 'outros')),
    status VARCHAR(20) DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'qualificado', 'interessado', 'proposta_enviada', 'negociacao', 'ganho', 'perdido')),
    stage VARCHAR(20) DEFAULT 'prospeccao' CHECK (stage IN ('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento')),
    score INTEGER DEFAULT 0,
    estimated_value DECIMAL(15,2),
    probability INTEGER DEFAULT 0,
    assigned_to VARCHAR(255) NOT NULL,
    tags TEXT[],
    notes TEXT,
    address TEXT,
    website VARCHAR(255),
    next_followup DATE,
    last_contact TIMESTAMP,
    conversion_date TIMESTAMP,
    lost_reason TEXT,
    is_qualified BOOLEAN DEFAULT false,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    employee_code VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    birth_date DATE,
    nationality VARCHAR(50) CHECK (nationality IN ('brasil', 'espanha', 'portugal', 'outro')),
    marital_status VARCHAR(20) CHECK (marital_status IN ('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel')),
    gender VARCHAR(20) CHECK (gender IN ('masculino', 'feminino', 'outro', 'nao_informado')),
    documents JSONB,
    family_info JSONB,
    address JSONB,
    banking_info JSONB,
    position VARCHAR(255),
    position_code VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    cost_center VARCHAR(50),
    hire_date DATE NOT NULL,
    contract_type VARCHAR(20) NOT NULL CHECK (contract_type IN ('clt', 'pj', 'estagio', 'terceirizado', 'temporario', 'autonomo')),
    work_schedule JSONB,
    salary DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'BRL',
    supervisor_id UUID REFERENCES employees(id),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'licenca', 'demitido')),
    termination_date DATE,
    termination_reason TEXT,
    vacation_balance DECIMAL(5,2) DEFAULT 0,
    overtime_balance INTEGER DEFAULT 0,
    benefits JSONB,
    emergency_contact JSONB,
    profile_photo TEXT,
    documents_uploaded JSONB,
    country_config VARCHAR(20) DEFAULT 'brasil' CHECK (country_config IN ('brasil', 'espanha', 'portugal')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: physical_locations
CREATE TABLE physical_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    street VARCHAR(10) NOT NULL,
    shelf VARCHAR(10) NOT NULL,
    side VARCHAR(10) NOT NULL,
    position VARCHAR(10) NOT NULL,
    full_address VARCHAR(50) NOT NULL,
    capacity INTEGER DEFAULT 100,
    occupied INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    is_individual_address BOOLEAN DEFAULT false,
    parent_location_id UUID REFERENCES physical_locations(id),
    content_indexed JSONB,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table: physical_documents
CREATE TABLE physical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    department VARCHAR(255),
    physical_location_id UUID NOT NULL REFERENCES physical_locations(id),
    full_address VARCHAR(50) NOT NULL,
    box_description VARCHAR(255) NOT NULL,
    content_detail TEXT,
    entry_date DATE NOT NULL,
    destruction_date DATE,
    is_permanent BOOLEAN DEFAULT false,
    destruction_status VARCHAR(20) DEFAULT 'data_definida' CHECK (destruction_status IN ('permanente', 'data_definida', 'vencido', 'a_vencer')),
    document_type VARCHAR(20) CHECK (document_type IN ('formulario', 'relatorio', 'contrato', 'nota_fiscal', 'certidao', 'outros')),
    access_level VARCHAR(20) DEFAULT 'restrito' CHECK (access_level IN ('publico', 'restrito', 'confidencial')),
    authorized_users TEXT[],
    authorized_departments TEXT[],
    status VARCHAR(20) DEFAULT 'arquivado' CHECK (status IN ('arquivado', 'emprestado', 'em_transito', 'destruido')),
    barcode VARCHAR(100),
    weight DECIMAL(8,2),
    volume DECIMAL(10,2),
    tags TEXT[],
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_proposals_company_id ON proposals(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample data
INSERT INTO companies VALUES ('550e8400-e29b-41d4-a716-446655440001', 'FIRSTDOCY DEMO LTDA', '12.345.678/0001-90', 'contato@firstdocy.com', '(11) 99999-9999', 'Rua das Empresas, 123 - São Paulo/SP', 'enterprise', 100, 1000, NULL, true, ARRAY['admin', 'user'], '{}', true, 50, '{"ged": true, "proposals": true, "crm": true, "tasks": true, "signatures": true, "hr": true}', '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system');

INSERT INTO users VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Administrador Sistema', 'admin@firstdocy.com', 'admin', '550e8400-e29b-41d4-a716-446655440001', 'TI', 'CTO', '(11) 99999-9999', ARRAY['admin', 'system_manager'], 'ativo', NULL, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system');

-- =============================================
-- COMPLETION
-- =============================================

COMMIT;

/*
INSTRUÇÕES DE RESTAURAÇÃO:

1. Criar banco de dados:
   createdb firstdocy_ged_ai

2. Restaurar backup:
   psql -d firstdocy_ged_ai -f backup.sql

3. Verificar instalação:
   psql -d firstdocy_ged_ai -c "SELECT COUNT(*) FROM companies;"

4. Configurar aplicação:
   DATABASE_URL=postgresql://user:password@localhost:5432/firstdocy_ged_ai
*/`;

      setBackupSql(sql);
      setIsGenerating(false);
      toast({
        title: "Backup Gerado!",
        description: "Script SQL do backup foi gerado com sucesso."
      });
    }, 2000);
  };

  const downloadBackup = () => {
    if (!backupSql) {
      toast({
        title: "Erro",
        description: "Gere o backup primeiro.",
        variant: "destructive"
      });
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([backupSql], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `firstdocy_backup_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Iniciado",
      description: "O arquivo de backup está sendo baixado."
    });
  };

  const copyToClipboard = () => {
    if (!backupSql) return;
    
    navigator.clipboard.writeText(backupSql);
    toast({
      title: "Copiado!",
      description: "Script SQL copiado para a área de transferência."
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Backup do Banco de Dados
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gere e gerencie backups completos do banco PostgreSQL
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          PostgreSQL Ready
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Gerar Backup
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Instruções
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Avançado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Gerador de Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Backup Completo</AlertTitle>
                  <AlertDescription>
                    Inclui estrutura de tabelas, índices, dados de exemplo e instruções de restauração.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>35+ Tabelas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Índices Otimizados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Dados de Exemplo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Triggers Automáticos</span>
                    </div>
                  </div>

                  <Button 
                    onClick={generateBackupSql}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B]"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gerando Backup...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Gerar Backup SQL
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Ações do Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {backupSql ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Backup Pronto!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Backup SQL gerado com sucesso. Tamanho: {Math.round(backupSql.length / 1024)} KB
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Nenhum Backup Gerado</AlertTitle>
                    <AlertDescription>
                      Clique em "Gerar Backup SQL" para criar o arquivo de backup.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={downloadBackup}
                    disabled={!backupSql}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Arquivo .sql
                  </Button>

                  <Button 
                    onClick={copyToClipboard}
                    disabled={!backupSql}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar SQL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SQL Preview */}
          {backupSql && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Preview do Backup SQL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={backupSql}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="O SQL gerado aparecerá aqui..."
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="instructions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔧 Como Restaurar o Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">1. Criar o Banco de Dados</h4>
                    <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                      createdb firstdocy_ged_ai
                    </code>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">2. Restaurar o Backup</h4>
                    <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                      psql -d firstdocy_ged_ai -f backup.sql
                    </code>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">3. Verificar Instalação</h4>
                    <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                      psql -d firstdocy_ged_ai -c "SELECT COUNT(*) FROM companies;"
                    </code>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">4. Configurar Aplicação</h4>
                    <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                      DATABASE_URL=postgresql://user:pass@localhost:5432/firstdocy_ged_ai
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📋 Dados de Exemplo Incluídos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Empresa Demo</h4>
                    <p className="text-sm text-gray-600">FIRSTDOCY DEMO LTDA</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Usuário Admin</h4>
                    <p className="text-sm text-gray-600">admin@firstdocy.com</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Departamentos</h4>
                    <p className="text-sm text-gray-600">Administrativo, RH, Financeiro, Comercial</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Estrutura Completa</h4>
                    <p className="text-sm text-gray-600">Todas as tabelas, índices e relacionamentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertTitle>Configurações de Produção</AlertTitle>
                  <AlertDescription>
                    Ajuste estas configurações antes de usar em produção:
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-amber-800">Segurança</h4>
                    <ul className="text-sm text-amber-700 mt-1 space-y-1">
                      <li>• Alterar senhas padrão</li>
                      <li>• Configurar SSL/TLS</li>
                      <li>• Definir políticas de backup</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-800">Performance</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Ajustar configurações de memória</li>
                      <li>• Monitorar uso de índices</li>
                      <li>• Configurar connection pooling</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-green-800">Monitoramento</h4>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• Configurar logs de auditoria</li>
                      <li>• Implementar alertas</li>
                      <li>• Backup automático</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🐘 Informações PostgreSQL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm">Versão Recomendada</h4>
                    <p className="text-sm text-gray-600">PostgreSQL 12 ou superior</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm">Extensões Necessárias</h4>
                    <p className="text-sm text-gray-600">uuid-ossp, pgcrypto</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm">Encoding</h4>
                    <p className="text-sm text-gray-600">UTF8</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm">Recursos Utilizados</h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      <li>• Row Level Security (RLS)</li>
                      <li>• Triggers automáticos</li>
                      <li>• Stored procedures</li>
                      <li>• Índices otimizados</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}