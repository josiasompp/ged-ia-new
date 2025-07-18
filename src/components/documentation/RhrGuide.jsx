import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Briefcase,
  Users,
  Clock,
  UserPlus,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Lightbulb,
  Info,
  CheckCircle,
  BarChart3,
  Download
} from 'lucide-react';

export default function RhrGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <Briefcase className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Módulo RHR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O RHR (Recursos Humanos) é um sistema completo para gerenciar todo o ciclo de vida do funcionário, desde a contratação até o desligamento, integrando ponto eletrônico, folha de pagamento, férias e muito mais.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Automação e Conformidade</AlertTitle>
            <AlertDescription className="text-blue-700">
              O módulo foi projetado para automatizar processos, reduzir erros manuais e garantir a conformidade com as legislações trabalhistas do Brasil, Espanha e Portugal.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-firstdocy-primary" />
            Principais Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Gestão de Funcionários:</strong> Perfil completo com dados pessoais, contratuais, bancários e documentação.</li>
            <li><strong>Ponto Eletrônico:</strong> Registro de ponto via web e mobile com geolocalização e reconhecimento facial.</li>
            <li><strong>Gestão de Ponto:</strong> Tratamento de inconsistências, aprovação de horas extras e banco de horas.</li>
            <li><strong>Processo de Contratação:</strong> Fluxo de admissão digital com checklists de documentos automatizados.</li>
            <li><strong>Gestão de Férias:</strong> Solicitação e aprovação de férias com cálculo de saldo automático.</li>
            <li><strong>Folha de Pagamento:</strong> Cálculo e gerenciamento de pagamentos, proventos e descontos.</li>
            <li><strong>Horários de Trabalho:</strong> Criação de escalas e jornadas de trabalho flexíveis.</li>
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
              <UserPlus className="w-5 h-5 text-blue-600" />
              1. Contratando um Novo Funcionário
            </h3>
            <p className="mb-3">O processo é simplificado através da aba <strong>"Contratação"</strong>:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Clique em <strong>"Novo Processo"</strong> e preencha os dados iniciais do candidato.</li>
              <li>O sistema aplicará automaticamente os <strong>templates de checklist</strong> de documentos necessários (ex: Admissão CLT).</li>
              <li>O candidato (ou o RH) anexa os documentos solicitados. O sistema valida e aprova.</li>
              <li>Ao final, clique em <strong>"Contratar"</strong> para que o perfil do funcionário seja criado automaticamente na aba "Funcionários".</li>
            </ol>
             <Alert className="mt-4 border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Integração com Gupy!</AlertTitle>
              <AlertDescription className="text-green-700">
                Se a integração com o Gupy estiver ativa, os processos de contratação podem ser iniciados automaticamente quando um candidato é aprovado por lá.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              2. Gerenciando o Ponto Eletrônico
            </h3>
            <p className="mb-3">A gestão do ponto é dividida em duas partes:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Bater Ponto:</strong> Na aba <strong>"Ponto"</strong>, o funcionário pode registrar entradas, saídas e intervalos. O sistema captura foto e localização.</li>
                <li><strong>Gestão de Ponto:</strong> Na aba <strong>"Gestão Ponto"</strong>, gestores e RH podem visualizar o espelho de ponto, tratar inconsistências, aprovar horas extras e exportar relatórios.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              3. Solicitando e Aprovando Férias
            </h3>
            <p className="mb-3">Na aba <strong>"Férias"</strong>, o processo é simples:</p>
             <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>O funcionário clica em "Solicitar Férias", informa o período e o sistema mostra o saldo disponível.</li>
              <li>A solicitação é enviada para o gestor, que recebe uma notificação.</li>
              <li>O gestor aprova ou recusa. Após a aprovação, o saldo do funcionário é atualizado e o status alterado para "férias" durante o período.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Relatórios e Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tipos de Documento e Checklists
              </h4>
              <p className="text-sm text-blue-700">
                Em <strong>Configurações</strong> no menu lateral, você pode acessar "Tipos de Documento (RH)" e "Templates de Checklist" para customizar completamente os documentos exigidos em cada processo.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportação de Dados
              </h4>
              <p className="text-sm text-green-700">
                Utilize os botões de exportação dentro de cada aba (Gestão de Ponto, Folha de Pagamento) para gerar relatórios em formatos como PDF e Excel (XLSX), prontos para a contabilidade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-yellow-200 bg-yellow-50">
        <Lightbulb className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Melhores Práticas</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Mantenha os "Horários de Trabalho" bem configurados para que os cálculos de horas e banco de horas sejam precisos. Use a aba "Dashboard" para ter uma visão geral da saúde do seu departamento de RH.
        </AlertDescription>
      </Alert>
    </div>
  );
}