import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckSquare, 
  ClipboardList, 
  PlayCircle,
  Users,
  FileText,
  Lightbulb,
  Info,
  Settings
} from 'lucide-react';

export default function TasksApprovalsGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <CheckSquare className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Tarefas e Aprovações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Este módulo centraliza a gestão de atividades e automatiza os processos de aprovação, garantindo que nada se perca e que as decisões sejam tomadas de forma rápida e rastreável.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-firstdocy-primary" />
            Principais Conceitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Tarefas:</strong> Atividades individuais com responsável, prazo e prioridade. Ideal para demandas do dia a dia. Ex: "Preparar relatório mensal".</li>
            <li><strong>Aprovações de Documentos:</strong> Um tipo especial de tarefa que aparece automaticamente quando um documento que exige aprovação é criado no GED.</li>
            <li><strong>Workflows de Aprovação:</strong> Fluxos de trabalho com múltiplas etapas e aprovadores. São usados para processos mais complexos e recorrentes. Ex: Um workflow para aprovar um novo contrato, que passa pelo Jurídico e depois pela Diretoria.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Operações Essenciais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              1. Criando uma Tarefa Simples
            </h3>
            <p>Clique em <strong>"Nova Tarefa"</strong>. Preencha o título, descrição, defina o responsável, a prioridade e a data de vencimento. A tarefa aparecerá na lista do usuário designado.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              2. Aprovando um Documento
            </h3>
            <p>Quando alguém no GED subir um documento que necessita da sua aprovação, ele aparecerá na aba <strong>"Aprovações"</strong>. Você poderá visualizar o documento e clicar em "Aprovar" ou "Rejeitar". Simples assim!</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-orange-600" />
              3. Configurando um Workflow
            </h3>
            <p>Para processos recorrentes, vá para a aba <strong>"Configurar"</strong> e clique em "Criar Workflow". Defina um nome (ex: "Aprovação de Compras") e adicione as etapas. Em cada etapa, defina quem são os aprovadores.</p>
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Automação Poderosa</AlertTitle>
              <AlertDescription className="text-blue-700">
                Uma vez que um workflow é criado, o sistema gerencia o envio para os aprovadores corretos em cada etapa, enviando notificações e garantindo que o processo flua sem intervenção manual.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Boas Práticas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Use Títulos Claros:</strong> Facilite a vida do seu time com tarefas e aprovações bem descritas.</li>
            <li><strong>Defina Prazos Realistas:</strong> Use as datas de vencimento para organizar prioridades.</li>
            <li><strong>Padronize com Workflows:</strong> Para qualquer processo que envolva mais de uma pessoa para aprovar, crie um workflow. Isso garante conformidade e agilidade.</li>
            <li><strong>Acompanhe o Analytics:</strong> Use a aba "Analytics" para identificar gargalos nos seus processos de aprovação.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}