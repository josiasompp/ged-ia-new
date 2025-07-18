import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Truck, 
  Package, 
  MapPin, 
  User,
  Calendar,
  Clock,
  CheckCircle,
  Lightbulb,
  Info,
  AlertTriangle,
  Phone,
  FileText
} from 'lucide-react';

export default function ServiceOrdersGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <Truck className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Ordens de Serviço (O.S.)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O módulo de Ordens de Serviço (O.S.) é uma extensão do CDOC que permite aos clientes solicitar movimentação de documentos físicos de forma digital, profissionalizando o atendimento e garantindo total rastreabilidade.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Fluxo Completo</AlertTitle>
            <AlertDescription className="text-blue-700">
              O sistema automatiza todo o processo: desde a solicitação do cliente até a conclusão do serviço, com notificações e acompanhamento em tempo real.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-firstdocy-primary" />
            Principais Conceitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Ordem de Serviço (O.S.):</strong> Uma solicitação formal do cliente para movimentação de documentos físicos arquivados no CDOC.</li>
            <li><strong>Status da O.S.:</strong> Acompanhamento em 5 estágios: Solicitada → Em Atendimento → Em Trânsito → Concluída ou Cancelada.</li>
            <li><strong>Tipos de Serviço:</strong> 
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li><strong>Retirada/Entrega:</strong> Cliente solicita a entrega de documentos em um endereço</li>
                <li><strong>Recolhimento:</strong> Buscar documentos no cliente para arquivamento</li>
                <li><strong>Descarte Seguro:</strong> Destruição controlada de documentos vencidos</li>
                <li><strong>Digitalização:</strong> Conversão de documentos físicos para digital</li>
              </ul>
            </li>
            <li><strong>Integração CDOC:</strong> O cliente seleciona exatamente quais caixas/documentos deseja através dos endereços cadastrados no sistema.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Portal do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              1. Acessando o Portal de O.S.
            </h3>
            <p className="mb-3">Como cliente, você tem duas formas de acessar suas ordens de serviço:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
              <li>No <strong>Portal do Cliente</strong>, clique no card "Ordens de Serviço" ou no botão "Ver Todas"</li>
              <li>No menu superior, clique em <strong>"Ordens de Serviço"</strong></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              2. Criando uma Nova Solicitação
            </h3>
            <p className="mb-3">Para solicitar um serviço, clique em <strong>"Solicitar Serviço"</strong> e preencha:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Tipo de Serviço:</strong> Escolha entre as opções disponíveis</li>
              <li><strong>Documentos/Caixas:</strong> Clique em "Adicionar Documento/Caixa" e selecione os itens que precisam ser movimentados</li>
              <li><strong>Dados de Contato:</strong> Confirme seu nome e telefone</li>
              <li><strong>Endereço:</strong> Informe o local para entrega ou recolhimento</li>
              <li><strong>Observações:</strong> Adicione instruções especiais, horários preferenciais, etc.</li>
            </ol>
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Seleção Inteligente!</AlertTitle>
              <AlertDescription className="text-green-700">
                O sistema mostra todos os documentos da sua empresa cadastrados no CDOC. Use a busca para encontrar rapidamente pela descrição ou endereço físico.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              3. Acompanhamento em Tempo Real
            </h3>
            <p className="mb-3">Após enviar a solicitação, você pode acompanhar o status:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Status Disponíveis:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>🔵 <strong>Solicitada:</strong> Aguardando atendimento</li>
                  <li>🟡 <strong>Em Atendimento:</strong> Equipe preparando</li>
                  <li>🟠 <strong>Em Trânsito:</strong> A caminho do destino</li>
                  <li>🟢 <strong>Concluída:</strong> Serviço finalizado</li>
                  <li>⚫ <strong>Cancelada:</strong> Cancelada por algum motivo</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Informações Visíveis:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Número único da O.S.</li>
                  <li>• Data da solicitação</li>
                  <li>• Tipo de serviço solicitado</li>
                  <li>• Status atual</li>
                  <li>• Histórico de alterações</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Guia para a Equipe Interna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              1. Gerenciando Solicitações
            </h3>
            <p className="mb-3">A equipe interna acessa o módulo <strong>"Ordens de Serviço"</strong> para:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Visualizar todas as O.S. organizadas por status (abas no topo)</li>
              <li>Clicar em "Ver Detalhes" para abrir informações completas</li>
              <li>Atualizar o status conforme o andamento do serviço</li>
              <li>Adicionar observações internas para controle da equipe</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              2. Detalhes de uma O.S.
            </h3>
            <p className="mb-3">Ao abrir uma O.S., a equipe visualiza:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Informações do Cliente:</h4>
                <ul className="text-sm space-y-1">
                  <li>• E-mail do solicitante</li>
                  <li>• Data da solicitação</li>
                  <li>• Endereço de entrega</li>
                  <li>• Dados de contato</li>
                  <li>• Observações do cliente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Controles Internos:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Alteração de status</li>
                  <li>• Notas internas da equipe</li>
                  <li>• Histórico completo de mudanças</li>
                  <li>• Lista detalhada dos itens solicitados</li>
                  <li>• Endereços físicos no CDOC</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              3. Fluxo de Trabalho Recomendado
            </h3>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Recebimento:</strong> Verificar a O.S. em "Solicitadas" e alterar para "Em Atendimento"</li>
              <li><strong>Preparação:</strong> Localizar os documentos no CDOC usando os endereços informados</li>
              <li><strong>Separação:</strong> Organizar os itens e preparar para transporte</li>
              <li><strong>Envio:</strong> Alterar status para "Em Trânsito" quando sair para entrega</li>
              <li><strong>Finalização:</strong> Marcar como "Concluída" após a entrega confirmada</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Para Clientes:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Seja específico nas observações sobre horários e instruções especiais</li>
                <li>Confirme o endereço de entrega cuidadosamente</li>
                <li>Mantenha os dados de contato atualizados</li>
                <li>Acompanhe o status regularmente</li>
                <li>Entre em contato em caso de urgência</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Para a Equipe:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Atualize o status imediatamente após cada etapa</li>
                <li>Use as notas internas para comunicação da equipe</li>
                <li>Confirme a localização física antes de alterar para "Em Atendimento"</li>
                <li>Documente qualquer problema ou observação</li>
                <li>Mantenha comunicação proativa com o cliente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Benefícios do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Para o Cliente</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Solicitação 24/7 online</li>
                <li>• Rastreamento em tempo real</li>
                <li>• Histórico completo</li>
                <li>• Processo transparente</li>
                <li>• Menos ligações telefônicas</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Para a Equipe</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Organização das demandas</li>
                <li>• Localização precisa dos itens</li>
                <li>• Comunicação centralizada</li>
                <li>• Histórico de atendimentos</li>
                <li>• Melhora na produtividade</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Para a Empresa</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Profissionalização do serviço</li>
                <li>• Redução de erros</li>
                <li>• Melhora na satisfação</li>
                <li>• Controle de custos</li>
                <li>• Diferencial competitivo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Integração Total</AlertTitle>
        <AlertDescription className="text-blue-700">
          O módulo de Ordens de Serviço está totalmente integrado ao CDOC, aproveitando toda a base de endereçamento físico já cadastrada. 
          Isso garante que não há duplicação de trabalho e que todas as informações estão sempre sincronizadas.
        </AlertDescription>
      </Alert>
    </div>
  );
}