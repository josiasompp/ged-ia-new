import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Code, 
  Settings, 
  Download, 
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Terminal,
  Database,
  Webhook,
  FileCheck,
  Users
} from 'lucide-react';

export default function GupyIntegrationDocs() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const webhookPayloadExample = `{
  "event": "candidate_approved",
  "event_id": "gupy_event_12345",
  "timestamp": "2024-01-15T10:30:00Z",
  "company_id": "12345",
  "candidate": {
    "id": "candidate_67890",
    "name": "João Silva Santos",
    "email": "joao.silva@email.com",
    "phone": "+55 11 99999-9999",
    "cpf": "123.456.789-10",
    "birth_date": "1990-05-15",
    "address": {
      "street": "Rua das Flores, 123",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567"
    },
    "documents": [
      {
        "type": "resume",
        "name": "Curriculo_Joao_Silva.pdf",
        "url": "https://gupy.io/files/resume_67890.pdf",
        "size": 1024000,
        "mime_type": "application/pdf"
      },
      {
        "type": "photo",
        "name": "Foto_3x4_Joao.jpg",
        "url": "https://gupy.io/files/photo_67890.jpg",
        "size": 512000,
        "mime_type": "image/jpeg"
      },
      {
        "type": "document",
        "name": "RG_Joao_Silva.pdf",
        "url": "https://gupy.io/files/rg_67890.pdf",
        "size": 2048000,
        "mime_type": "application/pdf"
      }
    ]
  },
  "job": {
    "id": "job_54321",
    "title": "Analista de Sistemas Jr",
    "department": "Tecnologia da Informação",
    "cbo_code": "212410",
    "contract_type": "clt",
    "salary_range": {
      "min": 4000,
      "max": 6000,
      "currency": "BRL"
    },
    "start_date": "2024-02-01",
    "location": "São Paulo - SP"
  },
  "hiring_manager": {
    "name": "Maria Santos",
    "email": "maria.santos@empresa.com",
    "department": "Recursos Humanos"
  }
}`;

  const backendWebhookCode = `// Exemplo de implementação do webhook endpoint
// POST /api/webhooks/gupy

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const router = express.Router();

// Validar assinatura do webhook
function validateSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Endpoint principal do webhook
router.post('/gupy', async (req, res) => {
  try {
    const signature = req.headers['x-gupy-signature'];
    const payload = JSON.stringify(req.body);
    
    // 1. Validar assinatura
    const integration = await getGupyIntegration(req.body.company_id);
    if (!validateSignature(payload, signature, integration.webhook_secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Processar evento
    const result = await processGupyEvent(req.body, integration);
    
    // 3. Retornar sucesso
    res.json({ success: true, result });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Processar evento do Gupy
async function processGupyEvent(eventData, integration) {
  const { event, candidate, job } = eventData;
  
  // 1. Criar processo de contratação
  const hiringProcess = await createHiringProcess({
    company_id: integration.company_id,
    candidate_name: candidate.name,
    candidate_email: candidate.email,
    candidate_phone: candidate.phone,
    position: job.title,
    cbo_code: job.cbo_code,
    contract_type: job.contract_type,
    candidate_data: candidate,
    job_data: job
  });

  // 2. Criar diretório para o candidato
  const candidateDirectory = await createCandidateDirectory(
    integration.company_id,
    candidate.name,
    job.department
  );

  // 3. Baixar documentos do candidato
  const downloadedDocs = await downloadCandidateDocuments(
    candidate.documents,
    candidateDirectory.id
  );

  // 4. Aplicar checklist baseado no CBO
  const appliedChecklists = await applyChecklistsByCBO(
    hiringProcess.id,
    job.cbo_code,
    job.contract_type
  );

  // 5. Gerar relatório de documentos
  const documentReport = await generateDocumentReport(
    hiringProcess.id,
    downloadedDocs,
    appliedChecklists
  );

  // 6. Gerar planilha XLSX para ERP
  const xlsxReport = await generateERPSpreadsheet(
    hiringProcess,
    candidate,
    job,
    documentReport
  );

  return {
    hiring_process_id: hiringProcess.id,
    directory_id: candidateDirectory.id,
    documents_downloaded: downloadedDocs.length,
    checklists_applied: appliedChecklists.length,
    report_url: documentReport.url,
    xlsx_url: xlsxReport.url
  };
}

// Baixar documentos do candidato
async function downloadCandidateDocuments(documents, directoryId) {
  const downloadedDocs = [];
  
  for (const doc of documents) {
    try {
      // Baixar arquivo
      const response = await axios.get(doc.url, { responseType: 'stream' });
      
      // Salvar no sistema de arquivos
      const fileName = \`\${Date.now()}_\${doc.name}\`;
      const filePath = path.join(uploadsDir, fileName);
      
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Criar registro no banco
      const savedDoc = await createDocument({
        directory_id: directoryId,
        title: doc.name,
        file_url: \`/uploads/\${fileName}\`,
        file_name: doc.name,
        file_size: doc.size,
        file_type: doc.mime_type,
        document_type: 'upload',
        category: mapDocumentCategory(doc.type)
      });

      downloadedDocs.push(savedDoc);
      
    } catch (error) {
      console.error(\`Error downloading \${doc.name}:\`, error);
    }
  }
  
  return downloadedDocs;
}

// Aplicar checklists baseado no CBO
async function applyChecklistsByCBO(hiringProcessId, cboCode, contractType) {
  // Buscar mapeamento CBO → Template
  const mapping = await getCBOMapping(cboCode);
  if (!mapping) return [];

  const templates = await getChecklistTemplates({
    applies_to_positions: cboCode,
    applies_to_contract_types: contractType,
    template_type: 'admissao'
  });

  const appliedChecklists = [];
  
  for (const template of templates) {
    const checklist = await createHiringProcessChecklist({
      hiring_process_id: hiringProcessId,
      template_id: template.id,
      required_documents: template.required_document_types
    });
    
    appliedChecklists.push(checklist);
  }

  return appliedChecklists;
}

// Gerar relatório de documentos
async function generateDocumentReport(hiringProcessId, downloadedDocs, checklists) {
  const requiredDocs = [];
  const existingDocs = downloadedDocs.map(doc => ({
    name: doc.title,
    type: doc.category,
    status: 'received',
    file_url: doc.file_url
  }));

  // Extrair documentos obrigatórios dos checklists
  for (const checklist of checklists) {
    for (const reqDoc of checklist.required_documents) {
      requiredDocs.push({
        name: reqDoc.document_type,
        type: reqDoc.document_type,
        is_mandatory: reqDoc.is_mandatory,
        deadline: reqDoc.deadline_date,
        status: 'pending'
      });
    }
  }

  // Comparar documentos existentes vs obrigatórios
  const missingDocs = requiredDocs.filter(req => 
    !existingDocs.some(existing => existing.type === req.type)
  );

  const report = {
    hiring_process_id: hiringProcessId,
    total_required: requiredDocs.length,
    total_received: existingDocs.length,
    total_missing: missingDocs.length,
    completion_percentage: (existingDocs.length / requiredDocs.length) * 100,
    existing_documents: existingDocs,
    missing_documents: missingDocs,
    generated_at: new Date().toISOString()
  };

  // Salvar relatório
  const savedReport = await saveDocumentReport(report);
  return savedReport;
}

// Gerar planilha XLSX para ERP
async function generateERPSpreadsheet(hiringProcess, candidate, job, documentReport) {
  const workbook = XLSX.utils.book_new();

  // Aba 1: Dados do Candidato
  const candidateData = [
    ['Campo', 'Valor'],
    ['Nome Completo', candidate.name],
    ['Email', candidate.email],
    ['Telefone', candidate.phone],
    ['CPF', candidate.cpf],
    ['Data Nascimento', candidate.birth_date],
    ['Endereço', \`\${candidate.address.street}, \${candidate.address.city} - \${candidate.address.state}\`],
    ['CEP', candidate.address.zip_code],
    ['Cargo', job.title],
    ['Departamento', job.department],
    ['CBO', job.cbo_code],
    ['Tipo Contrato', job.contract_type],
    ['Salário Min', job.salary_range.min],
    ['Salário Max', job.salary_range.max],
    ['Data Início', job.start_date]
  ];
  
  const candidateSheet = XLSX.utils.aoa_to_sheet(candidateData);
  XLSX.utils.book_append_sheet(workbook, candidateSheet, 'Dados Candidato');

  // Aba 2: Documentos Recebidos
  const docsData = [
    ['Documento', 'Status', 'Data Recebimento', 'Arquivo']
  ];
  
  documentReport.existing_documents.forEach(doc => {
    docsData.push([doc.name, doc.status, new Date().toISOString(), doc.file_url]);
  });
  
  const docsSheet = XLSX.utils.aoa_to_sheet(docsData);
  XLSX.utils.book_append_sheet(workbook, docsSheet, 'Documentos Recebidos');

  // Aba 3: Documentos Pendentes
  const pendingData = [
    ['Documento', 'Obrigatório', 'Prazo', 'Status']
  ];
  
  documentReport.missing_documents.forEach(doc => {
    pendingData.push([doc.name, doc.is_mandatory ? 'Sim' : 'Não', doc.deadline, doc.status]);
  });
  
  const pendingSheet = XLSX.utils.aoa_to_sheet(pendingData);
  XLSX.utils.book_append_sheet(workbook, pendingSheet, 'Documentos Pendentes');

  // Salvar arquivo
  const fileName = \`contratacao_\${hiringProcess.id}_\${Date.now()}.xlsx\`;
  const filePath = path.join(reportsDir, fileName);
  
  XLSX.writeFile(workbook, filePath);

  return {
    url: \`/reports/\${fileName}\`,
    file_path: filePath,
    generated_at: new Date().toISOString()
  };
}

module.exports = router;`;

  const apiIntegrationCode = `// Exemplo de integração com API do Gupy
// Para buscar dados adicionais quando necessário

const axios = require('axios');

class GupyAPI {
  constructor(apiKey, companyId) {
    this.apiKey = apiKey;
    this.companyId = companyId;
    this.baseURL = 'https://api.gupy.io/v1';
  }

  // Buscar dados do candidato
  async getCandidate(candidateId) {
    try {
      const response = await axios.get(
        \`\${this.baseURL}/candidates/\${candidateId}\`,
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar candidato:', error);
      throw error;
    }
  }

  // Buscar documentos do candidato
  async getCandidateDocuments(candidateId) {
    try {
      const response = await axios.get(
        \`\${this.baseURL}/candidates/\${candidateId}/documents\`,
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  }

  // Baixar arquivo específico
  async downloadFile(fileUrl, destinationPath) {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });

      const writer = fs.createWriteStream(destinationPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }

  // Atualizar status no Gupy (feedback)
  async updateCandidateStatus(candidateId, status, notes) {
    try {
      const response = await axios.patch(
        \`\${this.baseURL}/candidates/\${candidateId}/status\`,
        {
          status: status,
          notes: notes,
          updated_by: 'FIRSTDOCY_INTEGRATION'
        },
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
}

module.exports = GupyAPI;`;

  const databaseSchema = `-- Schema para suporte à integração Gupy

-- Tabela de configuração da integração
CREATE TABLE gupy_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    gupy_company_id VARCHAR(255) NOT NULL,
    api_key TEXT NOT NULL,
    webhook_secret VARCHAR(255) NOT NULL,
    webhook_url TEXT NOT NULL,
    sync_enabled BOOLEAN DEFAULT true,
    auto_create_hiring_process BOOLEAN DEFAULT true,
    auto_apply_checklists BOOLEAN DEFAULT true,
    sync_events TEXT[] DEFAULT ARRAY['candidate_approved', 'candidate_hired'],
    field_mapping JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP,
    sync_errors JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de eventos recebidos do webhook
CREATE TABLE gupy_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    gupy_event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    candidate_data JSONB NOT NULL,
    job_data JSONB,
    processed BOOLEAN DEFAULT false,
    processing_result JSONB,
    received_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    raw_payload TEXT,
    UNIQUE(company_id, gupy_event_id)
);

-- Tabela de mapeamento CBO → Checklist
CREATE TABLE cbo_checklist_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    cbo_code VARCHAR(10) NOT NULL,
    position_name VARCHAR(255) NOT NULL,
    checklist_template_id UUID NOT NULL REFERENCES document_checklist_templates(id),
    contract_types TEXT[] DEFAULT ARRAY['clt'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, cbo_code, checklist_template_id)
);

-- Tabela de relatórios de documentos
CREATE TABLE hiring_document_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hiring_process_id UUID NOT NULL REFERENCES hiring_processes(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    total_required INTEGER NOT NULL,
    total_received INTEGER NOT NULL,
    total_missing INTEGER NOT NULL,
    completion_percentage DECIMAL(5,2) NOT NULL,
    existing_documents JSONB DEFAULT '[]',
    missing_documents JSONB DEFAULT '[]',
    xlsx_report_url TEXT,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_gupy_integrations_company ON gupy_integrations(company_id);
CREATE INDEX idx_gupy_webhook_events_company ON gupy_webhook_events(company_id);
CREATE INDEX idx_gupy_webhook_events_processed ON gupy_webhook_events(processed);
CREATE INDEX idx_cbo_mappings_company_cbo ON cbo_checklist_mappings(company_id, cbo_code);
CREATE INDEX idx_hiring_reports_process ON hiring_document_reports(hiring_process_id);`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Documentação de Integração Gupy
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Guia técnico completo para implementação da integração com o sistema Gupy
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          Versão 1.0
        </Badge>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Esta documentação técnica contém todos os códigos, schemas e exemplos necessários para implementar a integração completa com o Gupy no backend da plataforma.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="examples">Exemplos</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Fluxo da Integração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">1. Recebimento do Webhook</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Candidato aprovado no Gupy</li>
                    <li>• Webhook enviado para nossa plataforma</li>
                    <li>• Validação da assinatura de segurança</li>
                    <li>• Processamento do evento</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">2. Processamento Automático</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Criação do processo de contratação</li>
                    <li>• Download de documentos do candidato</li>
                    <li>• Criação de diretório personalizado</li>
                    <li>• Aplicação de checklists baseados no CBO</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">3. Geração de Relatórios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Relatório de Documentos</h4>
                    <p className="text-sm text-gray-600">Lista documentos recebidos vs. obrigatórios baseados no checklist do cargo</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Planilha XLSX para ERP</h4>
                    <p className="text-sm text-gray-600">Dados formatados para importação em sistemas como Senior, Totvs, etc.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Implementação do Webhook Endpoint
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(backendWebhookCode, 'webhook')}>
                {copiedSection === 'webhook' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Endpoint:</strong> POST /api/webhooks/gupy<br/>
                    <strong>Segurança:</strong> Validação de assinatura HMAC SHA-256<br/>
                    <strong>Formato:</strong> JSON com dados do candidato e vaga
                  </AlertDescription>
                </Alert>
                
                <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto max-h-96">
                  <code>{backendWebhookCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Exemplo de Payload do Webhook</CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookPayloadExample, 'payload')}>
                {copiedSection === 'payload' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto max-h-96">
                <code>{webhookPayloadExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Classe de Integração com API do Gupy
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiIntegrationCode, 'api')}>
                {copiedSection === 'api' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Esta classe permite buscar dados adicionais do candidato e fazer atualizações no Gupy quando necessário.
                  </AlertDescription>
                </Alert>
                
                <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto max-h-96">
                  <code>{apiIntegrationCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Schema do Banco de Dados
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(databaseSchema, 'database')}>
                {copiedSection === 'database' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Execute este SQL no PostgreSQL para criar as tabelas necessárias para a integração.
                  </AlertDescription>
                </Alert>
                
                <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto max-h-96">
                  <code>{databaseSchema}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Mapeamento CBO → Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <strong>CBO 212410</strong> (Analista de Sistemas)<br/>
                    <span className="text-sm text-gray-600">→ Checklist TI + Documentos Técnicos</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <strong>CBO 142105</strong> (Gerente de RH)<br/>
                    <span className="text-sm text-gray-600">→ Checklist Gestão + Documentos Gerenciais</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <strong>CBO 411030</strong> (Auxiliar Administrativo)<br/>
                    <span className="text-sm text-gray-600">→ Checklist Operacional + Documentos Básicos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Estrutura de Diretórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div>📁 Departamento: Tecnologia</div>
                  <div className="ml-4">📁 João Silva Santos</div>
                  <div className="ml-8">📄 Curriculo_Joao_Silva.pdf</div>
                  <div className="ml-8">📄 Foto_3x4_Joao.jpg</div>
                  <div className="ml-8">📄 RG_Joao_Silva.pdf</div>
                  <div className="ml-8">📄 CPF_Joao_Silva.pdf</div>
                  <div className="ml-8">📊 Relatorio_Documentos.xlsx</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Implementação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Criar tabelas no banco de dados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Implementar endpoint do webhook</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Configurar classe de integração com API</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Testar validação de assinatura</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Implementar download de arquivos</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Configurar geração de relatórios XLSX</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Testar integração completa</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variáveis de Ambiente Necessárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-gray-50 rounded">GUPY_WEBHOOK_ENDPOINT=/api/webhooks/gupy</div>
                <div className="p-2 bg-gray-50 rounded">UPLOADS_DIR=/app/uploads</div>
                <div className="p-2 bg-gray-50 rounded">REPORTS_DIR=/app/reports</div>
                <div className="p-2 bg-gray-50 rounded">MAX_FILE_SIZE=10MB</div>
                <div className="p-2 bg-gray-50 rounded">ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}