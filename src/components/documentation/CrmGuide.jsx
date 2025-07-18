import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Phone,
  Mail,
  Calendar,
  FileText,
  Lightbulb,
  Info,
  CheckCircle,
  BarChart3,
  Settings
} from 'lucide-react';

export default function CrmGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <Target className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Módulo CRM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O Customer Relationship Management (CRM) é seu centro de comando para gerenciar relacionamentos com clientes, acompanhar leads e converter oportunidades em vendas.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Sistema Integrado</AlertTitle>
            <AlertDescription className="text-blue-700">
              O CRM está totalmente integrado com Propostas e Tarefas, criando um fluxo de trabalho completo do lead ao fechamento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-firstdocy-primary" />
            Principais Conceitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Leads:</strong> Potenciais clientes com informações de contato, empresa e valor estimado do negócio.</li>
            <li><strong>Pipeline de Vendas:</strong> Funil com estágios: Prospecção → Qualificação → Proposta → Negociação → Fechamento.</li>
            <li><strong>Atividades:</strong> Registro de todas as interações: chamadas, e-mails, reuniões, notas e follow-ups.</li>
            <li><strong>Status do Lead:</strong> Novo, Contatado, Qualificado, Interessado, Proposta Enviada, Negociação, Ganho ou Perdido.</li>
            <li><strong>Scoring:</strong> Pontuação automática de leads baseada em comportamento e perfil.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Gerenciando seu Funil de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              1. Cadastrando um Novo Lead
            </h3>
            <p className="mb-3">Na aba <strong>"Leads"</strong>, clique em "Novo Lead" e preencha:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
              <li><strong>Dados Básicos:</strong> Nome, e-mail, telefone e empresa</li>
              <li><strong>Origem:</strong> Como chegou até você (website, indicação, evento, etc.)</li>
              <li><strong>Valor Estimado:</strong> Potencial de receita do negócio</li>
              <li><strong>Responsável:</strong> Vendedor que cuidará do lead</li>
              <li><strong>Próximo Follow-up:</strong> Quando fazer o próximo contato</li>
            </ul>
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Dica de Qualificação!</AlertTitle>
              <AlertDescription className="text-green-700">
                Use as observações para anotar detalhes importantes sobre dor, necessidades e timeline do cliente. Isso será valioso para criar propostas personalizadas.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              2. Registrando Atividades
            </h3>
            <p className="mb-3">Para cada interação com o lead, registre uma atividade:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800">Tipos de Atividade:</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• <strong>Chamada:</strong> Conversas telefônicas</li>
                  <li>• <strong>E-mail:</strong> Correspondências enviadas</li>
                  <li>• <strong>Reunião:</strong> Encontros presenciais/virtuais</li>
                  <li>• <strong>Demo:</strong> Apresentações do produto</li>
                  <li>• <strong>Follow-up:</strong> Acompanhamentos</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800">Resultado da Atividade:</h4>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• <strong>Positivo:</strong> Cliente interessado</li>
                  <li>• <strong>Neutro:</strong> Precisa mais informações</li>
                  <li>• <strong>Negativo:</strong> Não interessado</li>
                  <li>• <strong>Sem Resposta:</strong> Não conseguiu contato</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              3. Convertendo Lead em Proposta
            </h3>
            <p className="mb-3">Quando o lead está qualificado e interessado:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Na lista de leads, clique no menu de ações (⋮)</li>
              <li>Selecione <strong>"Criar Proposta"</strong></li>
              <li>O sistema cria automaticamente uma proposta com os dados do lead</li>
              <li>Uma tarefa de follow-up é agendada automaticamente</li>
              <li>O status do lead muda para "Proposta Enviada"</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              4. Gerenciando o Pipeline
            </h3>
            <p className="mb-3">Use a aba <strong>"Pipeline"</strong> para visualizar todos os leads por estágio:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Estágios do Funil:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="bg-blue-100 p-2 rounded text-center">
                  <strong>Prospecção</strong><br/>
                  <span className="text-xs">Leads novos e contatados</span>
                </div>
                <div className="bg-yellow-100 p-2 rounded text-center">
                  <strong>Qualificação</strong><br/>
                  <span className="text-xs">Avaliando necessidades</span>
                </div>
                <div className="bg-orange-100 p-2 rounded text-center">
                  <strong>Proposta</strong><br/>
                  <span className="text-xs">Apresentando solução</span>
                </div>
                <div className="bg-red-100 p-2 rounded text-center">
                  <strong>Negociação</strong><br/>
                  <span className="text-xs">Discutindo termos</span>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <strong>Fechamento</strong><br/>
                  <span className="text-xs">Ganho ou perdido</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Dashboard e Análises
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>O Dashboard do CRM oferece insights valiosos sobre sua performance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Métricas Principais:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Total de leads no funil</li>
                <li>Leads qualificados vs. não qualificados</li>
                <li>Taxa de conversão por estágio</li>
                <li>Valor total do pipeline</li>
                <li>Tempo médio no funil</li>
                <li>Leads por fonte de origem</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Gráficos Disponíveis:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Funil de vendas por estágio</li>
                <li>Distribuição por status</li>
                <li>Performance por vendedor</li>
                <li>Tendência de conversões</li>
                <li>Análise de origem dos leads</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Integração com Outros Módulos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Integração com Propostas
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Criação automática de propostas a partir de leads</li>
                <li>• Dados do cliente preenchidos automaticamente</li>
                <li>• Acompanhamento do status da proposta</li>
                <li>• Notificações quando proposta é aceita/recusada</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Integração com Tarefas
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Tarefas de follow-up criadas automaticamente</li>
                <li>• Lembretes para próximos contatos</li>
                <li>• Gestão de atividades pendentes</li>
                <li>• Histórico completo de interações</li>
              </ul>
            </div>
          </div>

          <Alert className="border-purple-200 bg-purple-50">
            <Calendar className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-800">Fluxo Automatizado</AlertTitle>
            <AlertDescription className="text-purple-700">
              O sistema cria automaticamente um fluxo: Lead → Qualificação → Proposta → Tarefa de Follow-up → Fechamento. 
              Isso garante que nenhuma oportunidade seja perdida.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Faça Sempre:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Registre todas as interações com leads</li>
                <li>Mantenha dados de contato sempre atualizados</li>
                <li>Defina next follow-up para todos os leads</li>
                <li>Use as observações para contexto importante</li>
                <li>Qualifique leads antes de enviar propostas</li>
                <li>Acompanhe métricas de conversão regularmente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-800 mb-2">❌ Evite:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Deixar leads sem follow-up agendado</li>
                <li>Criar propostas para leads não qualificados</li>
                <li>Esquecer de registrar atividades importantes</li>
                <li>Ignorar leads com status "Sem Resposta"</li>
                <li>Não atualizar status conforme progresso</li>
                <li>Perder leads por falta de organização</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Próximos Passos</AlertTitle>
        <AlertDescription className="text-blue-700">
          Para dominar completamente o CRM, pratique o fluxo completo: cadastre alguns leads de teste, 
          registre atividades, crie propostas e acompanhe o pipeline. A integração com outros módulos tornará seu processo de vendas muito mais eficiente.
        </AlertDescription>
      </Alert>
    </div>
  );
}