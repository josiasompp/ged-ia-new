
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Database,
  Users,
  FileText,
  HeartPulse,
  Briefcase,
  Palette,
  DownloadCloud,
  PenSquare,
  ShieldCheck,
  Contact,
} from 'lucide-react';

const checklistItems = [
  {
    id: 'MOD_01',
    category: 'Módulos Principais',
    title: 'GED - Gestão Eletrônica de Documentos',
    description: 'Navegação por departamentos e diretórios, upload e preview de documentos, busca inteligente e controle de versões.',
    icon: FileText
  },
  {
    id: 'MOD_02',
    category: 'Módulos Principais',
    title: 'CRM - Gestão de Relacionamento com Cliente',
    description: 'Gestão de leads, funil de vendas (pipeline) Kanban, timeline de atividades e dashboard de performance.',
    icon: HeartPulse
  },
  {
    id: 'MOD_03',
    category: 'Módulos Principais',
    title: 'RH - Recursos Humanos',
    description: 'Admissão de funcionários, controle de documentos, gestão de férias, folha de pagamento e integração com Gupy.',
    icon: Briefcase
  },
  {
    id: 'MOD_04',
    category: 'Módulos Principais',
    title: 'CDOC - Gestão de Arquivo Físico',
    description: 'Endereçamento de caixas, gestão de localização física, relatórios de guarda e movimentação.',
    icon: Database
  },
  {
    id: 'DS_01',
    category: 'Módulos Principais',
    title: 'Assinatura Digital (Avançado)',
    description: 'Workflow completo com ordem sequencial/paralela, HASH SHA-256, trilha de auditoria e posicionamento de assinatura no documento.',
    icon: PenSquare
  },
  {
    id: 'DS_02',
    category: 'Módulos Principais',
    title: 'Portal de Verificação Pública',
    description: 'Página pública para verificação de autenticidade de documentos assinados via código e QR Code, garantindo transparência.',
    icon: ShieldCheck
  },
  {
    id: 'DS_03',
    category: 'Módulos Principais',
    title: 'Gestão de Contatos de Signatários',
    description: 'Entidade `SignerContact` para salvar e reutilizar informações dos participantes das assinaturas.',
    icon: Contact
  },
  {
    id: 'FE_01',
    category: 'Funcionalidades Adicionais',
    title: 'Portal do Cliente',
    description: 'Área exclusiva para clientes solicitarem serviços (O.S.), acompanharem o status e visualizarem documentos.',
    icon: Users
  },
  {
    id: 'FE_02',
    category: 'Funcionalidades Adicionais',
    title: 'Configuração de Branding',
    description: 'Personalização de logo, cores e fontes para adequar a plataforma à identidade visual da empresa.',
    icon: Palette
  },
  {
    id: 'FE_03',
    category: 'Funcionalidades Adicionais',
    title: 'Página de Exportação de Site Institucional',
    description: 'Permite o download do código HTML/CSS/JS completo e autônomo da Landing Page para implantação em qualquer ambiente (ex: WordPress).',
    icon: DownloadCloud
  }
];

const categoryOrder = [
  'Módulos Principais',
  'Funcionalidades Adicionais'
];

const ChecklistCategory = ({ title, items }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-slate-800 mb-4">{title}</h3>
    <ul className="space-y-4">
      {items.map(item => (
        <li key={item.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex-shrink-0 pt-1">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="w-4 h-4 text-slate-500" />}
              <span className="font-medium text-slate-900">{item.title}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
        </li>
      ))}
    </ul>
  </div>
);

export default function PublishChecklist() {
  const groupedItems = categoryOrder.reduce((acc, category) => {
    acc[category] = checklistItems.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div className="p-1">
      <Card>
        <CardHeader>
          <CardTitle>Status dos Módulos para Deploy</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryOrder.map(category => (
            <ChecklistCategory
              key={category}
              title={category}
              items={groupedItems[category]}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
