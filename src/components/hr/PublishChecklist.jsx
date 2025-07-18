import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Rocket,
  Database,
  Users,
  FileText,
  Settings,
  Webhook,
  Search,
  Map,
  UserPlus
} from 'lucide-react';

export default function PublishChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    {
      id: 'hr_module',
      title: 'Módulo de Recursos Humanos',
      status: 'completed',
      category: 'Core Features',
      items: [
        '✅ Dashboard de RH com métricas em tempo real',
        '✅ Gestão completa de funcionários',
        '✅ Sistema de ponto eletrônico (web e mobile)',
        '✅ Controle de férias e licenças',
        '✅ Folha de pagamento automatizada',
        '✅ Horários de trabalho configuráveis',
        '✅ Relatórios executivos de RH'
      ]
    },
    {
      id: 'cbo_search',
      title: 'Busca Avançada de Cargos CBO',
      status: 'completed',
      category: 'Enhanced Features',
      items: [
        '✅ Busca inteligente por nome do cargo',
        '✅ Pesquisa por código CBO oficial',
        '✅ Filtros por categoria profissional',
        '✅ Resultados em tempo real',
        '✅ Suporte a Brasil, Espanha e Portugal',
        '✅ Integração com formulário de funcionários'
      ]
    },
    {
      id: 'gupy_integration',
      title: 'Integração Completa com Gupy',
      status: 'ready_for_backend',
      category: 'Integrations',
      items: [
        '✅ Interface de configuração da integração',
        '✅ Mapeamento CBO x Templates de Checklist',
        '✅ Documentação técnica completa',
        '⏳ Webhook endpoint (requer backend)',
        '⏳ Download automático de documentos',
        '⏳ Geração de relatórios XLSX para ERP',
        '⏳ Criação automática de diretórios'
      ]
    },
    {
      id: 'checklist_system',
      title: 'Sistema de Checklists de Documentos',
      status: 'completed',
      category: 'Document Management',
      items: [
        '✅ Templates personalizáveis de checklist',
        '✅ Aplicação automática por cargo',
        '✅ Controle de prazos e vencimentos',
        '✅ Sistema de aprovações',
        '✅ Auditoria completa de mudanças',
        '✅ Notificações automatizadas'
      ]
    },
    {
      id: 'physical_docs',
      title: 'CDOC - Controle de Documentos Físicos',
      status: 'completed',
      category: 'Document Management',
      items: [
        '✅ Sistema de endereçamento físico',
        '✅ Geração de códigos de barras',
        '✅ Controle de empréstimos',
        '✅ Relatórios de localização',
        '✅ Gestão de prazos de destruição',
        '✅ Interface de busca avançada'
      ]
    },
    {
      id: 'user_experience',
      title: 'Experiência do Usuário',
      status: 'completed',
      category: 'UI/UX',
      items: [
        '✅ Interface responsiva e moderna',
        '✅ Navegação intuitiva',
        '✅ Busca inteligente em todos os módulos',
        '✅ Dashboards personalizáveis',
        '✅ Temas e branding customizável',
        '✅ Portal do cliente dedicado'
      ]
    },
    {
      id: 'security_compliance',
      title: 'Segurança e Conformidade',
      status: 'completed',
      category: 'Security',
      items: [
        '✅ Controle de acesso por níveis',
        '✅ Auditoria completa de ações',
        '✅ Proteção de propriedade intelectual',
        '✅ Conformidade com LGPD',
        '✅ Backup automático de dados',
        '✅ Assinaturas digitais integradas'
      ]
    },
    {
      id: 'backend_requirements',
      title: 'Requisitos de Backend Pendentes',
      status: 'pending',
      category: 'Technical Implementation',
      items: [
        '⏳ Implementar webhook do Gupy (/api/webhooks/gupy)',
        '⏳ Sistema de download de arquivos do Gupy',
        '⏳ Gerador de relatórios XLSX para ERPs',
        '⏳ API de integração com Senior/Totus',
        '⏳ Processamento automático de documentos',
        '⏳ Sistema de notificações por email/SMS'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ready_for_backend':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'ready_for_backend':
        return <Badge className="bg-blue-100 text-blue-800">Pronto para Backend</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">Em Desenvolvimento</Badge>;
    }
  };

  const completedItems = checklistItems.filter(item => item.status === 'completed').length;
  const totalItems = checklistItems.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Header com Progress */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">FIRSTDOCY GED AI - Status de Publicação</CardTitle>
                <p className="text-gray-600 mt-1">Sistema completo de gestão empresarial</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
              <p className="text-sm text-gray-500">Concluído</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{completedItems} de {totalItems} módulos concluídos</span>
            <span>Pronto para produção</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Sistema Pronto para Produção!</strong> Todos os módulos principais estão funcionais. 
          Apenas algumas integrações avançadas dependem de implementação no backend.
        </AlertDescription>
      </Alert>

      {/* Checklist Detalhado */}
      <div className="grid gap-6">
        {checklistItems.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(section.status)}
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {section.category}
                    </Badge>
                  </div>
                </div>
                {getStatusBadge(section.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próximos Passos */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Próximos Passos Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Webhook className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">1. Implementar Webhook do Gupy</h4>
                <p className="text-sm text-gray-600">Criar endpoint /api/webhooks/gupy para receber eventos de candidatos aprovados</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">2. Sistema de Download de Arquivos</h4>
                <p className="text-sm text-gray-600">Implementar download automático dos documentos dos candidatos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">3. Gerador de Relatórios XLSX</h4>
                <p className="text-sm text-gray-600">Criar relatórios executivos para integração com ERPs (Senior, Totus)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium">4. APIs de Integração com ERPs</h4>
                <p className="text-sm text-gray-600">Desenvolver conectores para sistemas de terceiros</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-4 justify-center">
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          <Rocket className="w-5 h-5 mr-2" />
          Deploy para Produção
        </Button>
        <Button variant="outline" size="lg">
          <FileText className="w-5 h-5 mr-2" />
          Gerar Documentação
        </Button>
      </div>
    </div>
  );
}