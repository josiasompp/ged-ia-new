import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Link, Sparkles, Upload, Shield, Lightbulb, Search } from 'lucide-react';

const GoogleDriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.457 9.416 8.74 3.028 5.023 9.416h7.434zm-3.07-5.83.15.266 3.454 6.01-1.65.953H5.068l-1.65-.953 3.454-6.01.15-.266z"/>
    <path d="M3.213 13.33 1.004 9.69h2.383l2.209 3.64-2.383.001zm11.782-3.64h2.383l-2.209 3.64-2.383-.001 2.209-3.64z"/>
  </svg>
);

export default function GoogleDriveAndAIGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      {/* Google Drive Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <GoogleDriveIcon />
            Sincronizando com o Google Drive
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Conecte seus arquivos diretamente do Google Drive para gerenciá-los no FIRSTDOCY sem precisar fazer o upload. O arquivo original permanece seguro no seu Drive.
          </p>
          <h3 className="font-semibold text-lg">Como Funciona:</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>O sistema cria um <strong>link seguro</strong> para o seu documento, não uma cópia.</li>
            <li>Você gerencia permissões, tags e histórico no FIRSTDOCY, enquanto o arquivo mestre fica no seu Google Drive.</li>
            <li>Qualquer atualização no documento original no Google Drive será refletida aqui.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-4">Passo a Passo para Conectar um Documento:</h3>
          <ol className="list-decimal list-inside space-y-3 pl-4">
            <li>Navegue até o diretório desejado e clique em <strong>"Novo Documento"</strong>.</li>
            <li>Selecione a aba <strong>"Link do Google Drive"</strong>.</li>
            <li>
              No Google Drive, abra seu arquivo, clique em <strong>"Compartilhar"</strong> e depois em "Copiar link".
              <Alert className="mt-2 border-amber-200 bg-amber-50">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Importante!</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Certifique-se de que a permissão do link esteja como <strong>"Qualquer pessoa com o link pode visualizar"</strong>. Isso garante que o sistema FIRSTDOCY possa acessá-lo para análise e preview.
                </AlertDescription>
              </Alert>
            </li>
            <li>Cole o link copiado no campo "Link de Compartilhamento do Google Drive".</li>
            <li>Preencha as informações do documento (título, categoria, etc.) e clique em <strong>"Conectar Documento"</strong>.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Gemini AI Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-firstdocy-blue" />
            Potencialize sua Gestão com IA (Gemini)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Nossa Inteligência Artificial, potencializada pelo Google Gemini, trabalha para você, extraindo informações valiosas e economizando seu tempo.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-600"/> Resumo Executivo Automático</h4>
                <p className="text-sm">Ao visualizar um documento, clique em <strong>"Analisar com IA"</strong>. O sistema lerá o conteúdo e gerará um resumo conciso com os pontos mais importantes.</p>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-blue-600"/> Busca Semântica Inteligente</h4>
                <p className="text-sm">Use a <strong>"Busca Inteligente"</strong> para pesquisar por ideias, não apenas palavras. Ex: "Contratos assinados no último mês" e a IA encontrará os documentos relevantes.</p>
            </div>
          </div>
          <Alert className="mt-4 border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sua Privacidade é Nossa Prioridade</AlertTitle>
            <AlertDescription className="text-green-700">
              A análise de IA ocorre em um ambiente seguro. Seus documentos e dados <strong>nunca</strong> são usados para treinar modelos de IA externos. Todo o processamento é confidencial e restrito à sua empresa.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}