import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FileSignature,
  PenTool,
  Shield,
  Send,
  Eye,
  CheckCircle,
  Zap,
  Lightbulb,
  Info,
  Settings
} from 'lucide-react';

export default function SignaturesGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <FileSignature className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Assinaturas Digitais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O módulo de Assinaturas Digitais oferece um ambiente seguro e com validade jurídica para enviar, assinar e gerenciar documentos eletronicamente.
          </p>
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Segurança e Conformidade</AlertTitle>
            <AlertDescription className="text-green-700">
              Todas as assinaturas coletadas possuem uma trilha de auditoria completa, incluindo carimbo de data/hora, endereço IP e outras informações, garantindo a autenticidade do processo.
            </AlertDescription>
          </Alert>
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
            <li><strong>Workflow de Assinatura:</strong> É o processo completo para um documento. Você anexa o arquivo, define quem precisa assinar e em qual ordem (sequencial ou todos de uma vez).</li>
            <li><strong>Signatários:</strong> São as pessoas que precisam assinar o documento. Podem ser usuários internos ou contatos externos (clientes, fornecedores).</li>
            <li><strong>Templates:</strong> Modelos pré-configurados para documentos que você envia com frequência (ex: Contrato de Serviço, Termo de Confidencialidade), já com os locais da assinatura definidos.</li>
            <li><strong>Trilha de Auditoria (Audit Trail):</strong> Um documento gerado ao final que registra cada passo do processo (quem visualizou, quem assinou, quando, de onde), servindo como prova jurídica.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Coletando uma Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              1. Iniciando um Novo Workflow
            </h3>
            <p>Clique em <strong>"Novo Workflow"</strong>. Dê um nome, anexe o documento PDF que precisa ser assinado e adicione os signatários (nome e e-mail).</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              2. Enviando para Assinatura
            </h3>
            <p>Após configurar, clique em "Enviar". O sistema enviará um e-mail para cada signatário com um link seguro para acessar e assinar o documento.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-orange-600" />
              3. A Experiência do Signatário
            </h3>
            <p>O signatário clica no link, visualiza o documento e é guiado até o local da assinatura. Ele pode desenhar, digitar ou subir uma imagem da sua assinatura. Após confirmar, a assinatura é aplicada com as credenciais de segurança.</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              4. Acompanhando o Progresso
            </h3>
            <p>Na tela principal, você pode ver o status de cada workflow: quem já assinou, quem ainda está pendente e quem visualizou. O sistema envia lembretes automáticos.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Use Templates:</strong> Para documentos padrão, crie um "Template de Assinatura". Isso economiza muito tempo.</li>
            <li><strong>Ordem Sequencial:</strong> Para contratos importantes, use a ordem sequencial para garantir que a pessoa A assine antes da pessoa B.</li>
            <li><strong>Mensagem Personalizada:</strong> Adicione uma mensagem clara no e-mail de convite para dar contexto ao signatário.</li>
            <li><strong>Baixe o Documento Final:</strong> Após todos assinarem, baixe o PDF final, que virá com as assinaturas e a trilha de auditoria anexada.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}