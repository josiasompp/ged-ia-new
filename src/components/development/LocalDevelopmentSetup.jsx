import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LocalDevelopmentSetup() {
  const [copiedText, setCopiedText] = useState('');
  const { toast } = useToast();

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
    setTimeout(() => setCopiedText(''), 2000);
  };

  const callbackUrls = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
            Configuração para Desenvolvimento Local
          </span>
        </h1>
        <p className="text-gray-600">
          Resolva o erro "Callback domain is not valid" para desenvolvimento
        </p>
      </div>

      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Erro Atual:</strong> {"Callback domain is not valid"} - Este erro ocorre porque sua URL local não está autorizada nas configurações do base44.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Passo 1: Configurar URLs de Callback no base44.app
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Onde encontrar as configurações:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Acesse <strong>base44.app</strong> e faça login</li>
              <li>Selecione seu projeto <strong>FIRSTDOCY GED AI</strong></li>
              <li>No menu lateral, clique em <Badge variant="outline">Security</Badge></li>
              <li>Procure por: <strong>"Authorized Callback URLs"</strong>, <strong>"Redirect URIs"</strong> ou <strong>"Allowed Origins"</strong></li>
              <li>Adicione as URLs abaixo na lista de URLs permitidas</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-3">URLs para adicionar (copie uma de cada vez):</h3>
            <div className="space-y-2">
              {callbackUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono">{url}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(url, `URL ${index + 1}`)}
                    className="gap-2"
                  >
                    {copiedText === `URL ${index + 1}` ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedText === `URL ${index + 1}` ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Use a URL exata que aparece no seu terminal quando você roda <code>npm run dev</code>. 
              Se for diferente das listadas acima, adicione a URL específica que você está usando.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passo 2: Configuração Alternativa via Arquivo .env</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Se você não conseguir encontrar as configurações no base44.app, tente criar um arquivo de configuração local:
          </p>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono">.env.local</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`# Configurações para desenvolvimento local
NEXT_PUBLIC_BASE_URL=http://localhost:5173
VITE_BASE_URL=http://localhost:5173
NEXT_PUBLIC_CALLBACK_URL=http://localhost:5173
VITE_CALLBACK_URL=http://localhost:5173
NODE_ENV=development

# URLs de callback permitidas
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173`, 'Arquivo .env')}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <pre className="text-xs overflow-x-auto">
{`# Configurações para desenvolvimento local
NEXT_PUBLIC_BASE_URL=http://localhost:5173
VITE_BASE_URL=http://localhost:5173
NEXT_PUBLIC_CALLBACK_URL=http://localhost:5173
VITE_CALLBACK_URL=http://localhost:5173
NODE_ENV=development

# URLs de callback permitidas
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173`}
            </pre>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Como usar:</strong> Crie um arquivo chamado <code>.env.local</code> na raiz do seu projeto 
              (no mesmo diretório do package.json) e cole o conteúdo acima. Depois reinicie o servidor com <code>npm run dev</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passo 3: Se ainda não funcionar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Opção A: Contato com Suporte</h4>
              <p className="text-sm text-gray-600 mb-3">
                Entre em contato com o suporte do base44 para autorizar suas URLs de desenvolvimento.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                Abrir Suporte base44
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Opção B: Modo Offline</h4>
              <p className="text-sm text-gray-600 mb-3">
                Configure um usuário mock para desenvolvimento sem autenticação.
              </p>
              <Button variant="outline" className="w-full">
                Ver Configuração Offline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comandos para Testar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <code className="text-sm">npm run dev</code>
              <Badge variant="secondary">Iniciar desenvolvimento</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <code className="text-sm">npm run build && npm run preview</code>
              <Badge variant="secondary">Testar produção local</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}