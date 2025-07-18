import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  MessageSquare,
  Users,
  User,
  PlusCircle,
  Send,
  Lock,
  Lightbulb,
  Info
} from 'lucide-react';

export default function SupportChatGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <MessageSquare className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Suporte ao Cliente via Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O módulo de Suporte ao Cliente oferece um canal de comunicação direto e em tempo real entre os clientes e a equipe de gestão do sistema, garantindo um atendimento rápido e eficiente.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Dois Lados da Conversa</AlertTitle>
            <AlertDescription className="text-blue-700">
              Este guia cobre as duas perspectivas: a do <strong>Cliente</strong>, que inicia o contato, e a do <strong>Gestor</strong>, que responde através do painel de controle.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Guia para o Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-firstdocy-primary" />
            Para Clientes: Como Pedir Suporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              1. Iniciando uma Nova Conversa
            </h3>
            <p>No seu portal, acesse a seção <strong>"Meu Suporte"</strong> e depois clique em <strong>"Chat"</strong>. Para iniciar, clique no botão <strong>"Nova Conversa"</strong>, dê um título claro para sua solicitação (ex: "Dúvida sobre upload de NF") e clique em "Criar".</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-green-600" />
              2. Enviando e Recebendo Mensagens
            </h3>
            <p>Uma vez que a conversa é criada, ela aparecerá na sua lista. Selecione-a para abrir a janela de chat. Digite sua mensagem no campo inferior e clique no ícone de avião de papel para enviar. Você será notificado quando um gestor responder.</p>
          </div>
          <Alert className="mt-4 border-green-200 bg-green-50">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Dica para um Bom Atendimento</AlertTitle>
            <AlertDescription className="text-green-700">
              Seja o mais claro possível na sua primeira mensagem. Inclua detalhes, nomes de documentos ou qualquer informação que ajude o gestor a entender seu problema rapidamente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      {/* Guia para o Gestor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-red-600" />
            Para Gestores: Atendendo Solicitações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Acesso Exclusivo
            </h3>
            <p>O dashboard de suporte só é acessível por usuários com perfil de <strong>administrador (gestor)</strong>. Ele se encontra no menu principal, sob o item <strong>"Suporte ao Cliente"</strong>.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              Gerenciando o Painel
            </h3>
            <p>O painel é dividido em duas partes:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
              <li><strong>Lista de Conversas (esquerda):</strong> Todas as solicitações dos clientes. As que possuem mensagens não lidas por você terão um indicador numérico. Use o filtro para ver conversas "Abertas", "Em Andamento" ou "Fechadas".</li>
              <li><strong>Janela de Chat (direita):</strong> Onde a conversa acontece. Selecione uma solicitação na lista para ver o histórico e responder.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              Encerrando uma Conversa
            </h3>
            <p>Quando a dúvida do cliente for resolvida, clique no botão <strong>"Encerrar Conversa"</strong> no topo da janela de chat. Isso muda o status para "Fechada" e arquiva a solicitação, mas o histórico permanece disponível para consulta.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}