import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch,
  Key,
  Link,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function BitbucketIntegration({ onAnalysisComplete }) {
  const [connectionType, setConnectionType] = useState('public'); // 'public' ou 'private'
  const [repoUrl, setRepoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [showToken, setShowToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionLog, setConnectionLog] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);

  const { toast } = useToast();

  const connectToBitbucket = async () => {
    if (!repoUrl) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do repositório Bitbucket.",
        variant: "destructive"
      });
      return;
    }

    if (connectionType === 'private' && !accessToken) {
      toast({
        title: "Token obrigatório",
        description: "Para repositórios privados, é necessário fornecer um token de acesso.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    setConnectionLog([]);
    setConnectionProgress(0);

    try {
      // Simular conexão com Bitbucket
      const steps = [
        { log: 'Conectando ao Bitbucket...', progress: 10 },
        { log: 'Validando credenciais...', progress: 25 },
        { log: 'Acessando repositório...', progress: 40 },
        { log: 'Listando arquivos do projeto...', progress: 60 },
        { log: 'Baixando arquivos de código...', progress: 80 },
        { log: 'Conexão estabelecida com sucesso!', progress: 100 }
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setConnectionLog(prev => [...prev, steps[currentStep].log]);
          setConnectionProgress(steps[currentStep].progress);
          currentStep++;
        } else {
          clearInterval(interval);
          
          // Simular informações do repositório
          const mockRepoInfo = {
            name: repoUrl.split('/').pop().replace('.git', ''),
            branch: branch,
            language: 'PHP',
            framework: 'Laravel',
            filesCount: 156,
            size: '2.3 MB',
            lastCommit: '2024-01-15',
            contributors: ['dev@empresa.com', 'admin@empresa.com']
          };
          
          setRepoInfo(mockRepoInfo);
          setIsConnecting(false);
          
          toast({
            title: "Conectado ao Bitbucket!",
            description: "Repositório conectado com sucesso. Pronto para análise."
          });
        }
      }, 800);

    } catch (error) {
      console.error("Erro na conexão:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao repositório. Verifique a URL e credenciais.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const startAnalysis = () => {
    if (onAnalysisComplete && repoInfo) {
      onAnalysisComplete({
        source: 'bitbucket',
        repoInfo: repoInfo,
        analysisData: {
          framework: repoInfo.framework,
          filesAnalyzed: repoInfo.filesCount,
          entitiesFound: 8,
          apiRoutes: 15,
          securityIssues: 1,
          suggestions: [
            "Implementar rate limiting nas APIs principais.",
            "Adicionar validação de entrada mais robusta.",
            "Otimizar consultas N+1 nos relacionamentos.",
            "Implementar cache Redis para sessões."
          ],
          migrationPlan: [
            "Mapear Models Laravel para entidades base44.",
            "Converter Controllers para componentes React.",
            "Migrar sistema de autenticação para JWT.",
            "Implementar upload de arquivos com AWS S3."
          ]
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-blue-600" />
            Integração com Bitbucket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={connectionType} onValueChange={setConnectionType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Repositório Público</TabsTrigger>
              <TabsTrigger value="private">Repositório Privado</TabsTrigger>
            </TabsList>

            <TabsContent value="public" className="space-y-4 mt-4">
              <Alert>
                <Link className="h-4 w-4" />
                <AlertTitle>Repositório Público</AlertTitle>
                <AlertDescription>
                  Para repositórios públicos, apenas a URL é necessária.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repo-url">URL do Repositório</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://bitbucket.org/usuario/projeto.git"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="private" className="space-y-4 mt-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertTitle>Repositório Privado</AlertTitle>
                <AlertDescription>
                  Para repositórios privados, você precisa fornecer um App Password do Bitbucket.
                  <br />
                  <a 
                    href="https://bitbucket.org/account/settings/app-passwords/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Criar App Password →
                  </a>
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repo-url-private">URL do Repositório</Label>
                  <Input
                    id="repo-url-private"
                    placeholder="https://bitbucket.org/usuario/projeto.git"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="access-token">App Password</Label>
                  <div className="relative">
                    <Input
                      id="access-token"
                      type={showToken ? "text" : "password"}
                      placeholder="Seu App Password do Bitbucket"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="branch-private">Branch</Label>
                  <Input
                    id="branch-private"
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={connectToBitbucket} 
            disabled={isConnecting} 
            className="w-full mt-6"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Conectar ao Repositório
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isConnecting && (
        <Card>
          <CardHeader>
            <CardTitle>Conectando ao Bitbucket</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={connectionProgress} className="w-full mb-4" />
            <div className="h-32 bg-gray-900 text-white font-mono text-sm p-4 rounded-md overflow-y-auto">
              {connectionLog.map((log, index) => (
                <p key={index} className="animate-fade-in">{`> ${log}`}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {repoInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Repositório Conectado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold">{repoInfo.name}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Framework</p>
                <Badge variant="secondary">{repoInfo.framework}</Badge>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Arquivos</p>
                <p className="font-semibold">{repoInfo.filesCount}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tamanho</p>
                <p className="font-semibold">{repoInfo.size}</p>
              </div>
            </div>

            <Alert className="mb-4">
              <Download className="h-4 w-4" />
              <AlertTitle>Pronto para Análise</AlertTitle>
              <AlertDescription>
                Repositório '{repoInfo.name}' conectado com sucesso. 
                Clique no botão abaixo para iniciar a análise automática do código.
              </AlertDescription>
            </Alert>

            <Button onClick={startAnalysis} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Iniciar Análise do Código
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}