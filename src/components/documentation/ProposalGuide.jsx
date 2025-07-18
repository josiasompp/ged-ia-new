import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FileSignature, 
  Layout, 
  Send, 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  Lightbulb, 
  Video,
  Palette,
  MessageSquare
} from 'lucide-react';

export default function ProposalGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <FileSignature className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Módulo de Propostas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O módulo de Propostas transforma a maneira como você cria, envia e gerencia suas propostas comerciais. Crie documentos digitais, interativos e com rastreamento completo.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-firstdocy-primary" />
            Principais Conceitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Templates:</strong> Modelos pré-configurados que servem como base para suas propostas. Um template é composto por várias seções (texto, vídeo, preços, etc.) que podem ser reutilizadas.</li>
            <li><strong>Propostas:</strong> O documento final enviado ao cliente. É criado a partir de um template e preenchido com os dados específicos do cliente e do negócio.</li>
            <li><strong>Seções Interativas:</strong> Blocos de conteúdo como vídeos do YouTube, imagens, tabelas de preços e cronogramas que tornam a proposta mais dinâmica.</li>
            <li><strong>Status de Rastreamento:</strong> Acompanhe cada etapa da proposta: Rascunho, Enviada, Visualizada, Aceita, Recusada e Expirada.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Criando e Enviando uma Proposta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">1. Crie seu Primeiro Template</h3>
            <p>Vá para a tela de <strong>"Templates"</strong> e clique em "Novo Template". Defina um nome, categoria e adicione seções. Arraste e solte para reordenar as seções. Essa é a estrutura base de suas futuras propostas.</p>
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <Video className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Dica: Use Vídeos!</AlertTitle>
              <AlertDescription className="text-blue-700">
                Adicione uma seção de vídeo com uma apresentação da sua empresa ou um recado personalizado para o cliente. Isso aumenta drasticamente o engajamento!
              </AlertDescription>
            </Alert>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">2. Crie a Proposta</h3>
            <p>Vá para <strong>"Propostas"</strong> e clique em "Nova Proposta". Preencha as informações do cliente e, o mais importante, selecione o template que você criou. Você também pode anexar arquivos PDF, como escopo ou apresentações.</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-2">3. Personalize a Aparência (Opcional)</h3>
            <p>Dentro do formulário da proposta, na aba <strong>"Personalização Visual"</strong>, você pode alterar cores, fontes e até adicionar o logo do cliente para criar uma experiência única e impressionar.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">4. Compartilhe o Link Mágico</h3>
            <p>Após salvar, cada proposta gera um <strong>link único de compartilhamento</strong>. Envie este link para o seu cliente. Não há necessidade de enviar anexos pesados por e-mail!</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            A Experiência do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <p>Quando o cliente abre o link, ele vê uma página web interativa, não um PDF estático. Ele pode:</p>
           <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Assistir aos vídeos diretamente na página.</li>
            <li>Fazer perguntas em uma seção de comentários.</li>
            <li>Clicar em um botão para <strong>Aceitar</strong> ou <strong>Recusar</strong> a proposta.</li>
            <li>A assinatura digital (se configurada) é coletada no momento do aceite.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Acompanhe os Resultados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>O sistema notifica você e atualiza o status da proposta automaticamente:</p>
          <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
            <li><strong>Visualizada:</strong> Assim que o cliente abre o link pela primeira vez.</li>
            <li><strong>Aceita/Recusada:</strong> Quando o cliente toma uma decisão.</li>
          </ul>
          <p className="mt-2">Use o Dashboard de Propostas para ver suas taxas de visualização e conversão, identificando o que funciona melhor.</p>
        </CardContent>
      </Card>
    </div>
  );
}