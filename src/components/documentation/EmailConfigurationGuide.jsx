import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Settings, 
  TestTube, 
  FileText,
  Send,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Clock,
  BarChart3,
  Users,
  Zap,
  Building2
} from 'lucide-react';

export default function EmailConfigurationGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl text-gray-900">
            <Mail className="w-8 h-8 text-firstdocy-blue" />
            Guia Completo: Configuração de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Sistema completo de envio de emails para notificações automáticas do sistema, 
            com suporte a múltiplos provedores SMTP e templates personalizáveis.
          </p>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Sistema de Envio Apenas</AlertTitle>
            <AlertDescription className="text-blue-700">
              Este módulo é configurado apenas para <strong>envio de emails</strong>. 
              Não há funcionalidade de recebimento ou caixa de entrada. 
              Use-o para notificações automáticas do sistema, como aprovações de documentos, 
              propostas aceitas, lembretes, etc.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Configuração Simples</h4>
              </div>
              <p className="text-sm text-green-700">Interface intuitiva para configurar qualquer provedor SMTP em minutos.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Templates Inteligentes</h4>
              </div>
              <p className="text-sm text-purple-700">Crie templates com variáveis dinâmicas para diferentes eventos do sistema.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Monitoramento Completo</h4>
              </div>
              <p className="text-sm text-orange-700">Acompanhe estatísticas, logs e performance de todos os emails enviados.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="smtp-config">Config. SMTP</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="troubleshooting">Resolução</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-firstdocy-primary" />
                  Como Funciona o Sistema de Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O sistema de email do FIRSTDOCY é projetado para automatizar comunicações importantes:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">🔄 Fluxo Automatizado:</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                      <li>Evento acontece no sistema (ex: proposta aceita)</li>
                      <li>Sistema identifica template apropriado</li>
                      <li>Variáveis são preenchidas automaticamente</li>
                      <li>Email é enviado via servidor SMTP configurado</li>
                      <li>Log é registrado para auditoria</li>
                      <li>Estatísticas são atualizadas</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">✨ Principais Benefícios:</h4>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Automação Total:</strong> Emails enviados sem intervenção manual</li>
                      <li><strong>Personalização:</strong> Templates com variáveis dinâmicas</li>
                      <li><strong>Confiabilidade:</strong> Sistema de retry e logs detalhados</li>
                      <li><strong>Compliance:</strong> Auditoria completa de todos os envios</li>
                      <li><strong>Escalabilidade:</strong> Suporte a múltiplas empresas</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Acesso Restrito</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Apenas <strong>gestores da empresa</strong> podem configurar o sistema de email. 
                    Isso garante segurança e controle sobre as comunicações automatizadas.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Eventos que Disparam Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">📋 Módulo de Propostas:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                        Proposta aceita pelo cliente
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">✗</Badge>
                        Proposta recusada pelo cliente
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">👁</Badge>
                        Proposta visualizada pela primeira vez
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800">⏰</Badge>
                        Proposta próxima do vencimento
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">📄 Módulo de Documentos:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                        Documento aprovado
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">✗</Badge>
                        Documento rejeitado
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">📝</Badge>
                        Documento pendente de aprovação
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">📋</Badge>
                        Tarefa de aprovação criada
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuração SMTP */}
        <TabsContent value="smtp-config" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-firstdocy-blue" />
                  Passo a Passo: Configuração SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    Escolher Provedor de Email
                  </h3>
                  <p className="mb-4">Selecione um dos provedores pré-configurados ou configure manualmente:</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800">Gmail</h5>
                      <p className="text-sm text-gray-600 mt-1">smtp.gmail.com:587</p>
                      <p className="text-xs text-blue-600 mt-2">💡 Use senha de app, não sua senha normal</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800">Outlook</h5>
                      <p className="text-sm text-gray-600 mt-1">smtp-mail.outlook.com:587</p>
                      <p className="text-xs text-blue-600 mt-2">💡 Funciona com contas do Office 365</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800">SendGrid</h5>
                      <p className="text-sm text-gray-600 mt-1">smtp.sendgrid.net:587</p>
                      <p className="text-xs text-blue-600 mt-2">💡 Use "apikey" como username</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    Configurar Credenciais
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Campos Obrigatórios:</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Servidor SMTP:</strong> Endereço do servidor (ex: smtp.gmail.com)</li>
                      <li><strong>Porta:</strong> Geralmente 587 (TLS) ou 465 (SSL)</li>
                      <li><strong>Usuário:</strong> Seu email de login</li>
                      <li><strong>Senha:</strong> Senha ou token de API</li>
                      <li><strong>Email Remetente:</strong> Email que aparecerá como remetente</li>
                      <li><strong>Nome Remetente:</strong> Nome que aparecerá como remetente</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    Testar Configuração
                  </h3>
                  <p className="mb-4">Sempre teste antes de salvar:</p>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4">
                    <p className="text-green-800">
                      <strong>✓ Teste Bem-sucedido:</strong> Um email será enviado para o endereço configurado como "Email para Resposta". 
                      Verifique sua caixa de entrada e spam.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 mt-2">
                    <p className="text-red-800">
                      <strong>✗ Teste Falhou:</strong> Verifique as credenciais, configurações de firewall, 
                      e se a conta permite aplicações de terceiros.
                    </p>
                  </div>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Dicas Importantes</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    <ul className="space-y-1 mt-2">
                      <li>• <strong>Gmail:</strong> Ative a verificação em duas etapas e use senhas de app</li>
                      <li>• <strong>Outlook:</strong> Pode ser necessário ativar SMTP nas configurações da conta</li>
                      <li>• <strong>Empresarial:</strong> Verifique se sua empresa permite SMTP externo</li>
                      <li>• <strong>Firewall:</strong> Certifique-se que as portas 587/465 estão liberadas</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Gerenciamento de Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">🎨 Criando Templates Personalizados</h3>
                  <p className="mb-4">Templates permitem personalizar emails automáticos com informações dinâmicas:</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Exemplo de Template:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> Proposta Aceita</p>
                      <p><strong>Chave:</strong> proposal_accepted</p>
                      <p><strong>Assunto:</strong> Proposta #{"{{proposal_number}}"} - Aceita pelo Cliente</p>
                      <div className="bg-white p-3 rounded border">
                        <p><strong>Corpo do Email:</strong></p>
                        <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
                          <pre>{`<h2>🎉 Proposta Aceita!</h2>
<p>Olá!</p>
<p>A proposta <strong>{{proposal_title}}</strong> foi aceita pelo cliente <strong>{{client_name}}</strong>.</p>
<p><strong>Valor:</strong> {{proposal_value}}</p>`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">🔧 Variáveis Disponíveis</h3>
                  <p className="mb-4">Use estas variáveis em seus templates. Elas serão substituídas automaticamente:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">📋 Propostas:</h4>
                      <ul className="space-y-1 text-sm font-mono bg-gray-50 p-3 rounded">
                        <li>{"{{client_name}}"} - Nome do cliente</li>
                        <li>{"{{proposal_number}}"} - Número da proposta</li>
                        <li>{"{{proposal_title}}"} - Título da proposta</li>
                        <li>{"{{proposal_value}}"} - Valor da proposta</li>
                        <li>{"{{salesperson_name}}"} - Nome do vendedor</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">📄 Documentos:</h4>
                      <ul className="space-y-1 text-sm font-mono bg-gray-50 p-3 rounded">
                        <li>{"{{document_title}}"} - Título do documento</li>
                        <li>{"{{approved_by}}"} - Usuário que aprovou</li>
                        <li>{"{{department_name}}"} - Nome do departamento</li>
                        <li>{"{{document_category}}"} - Categoria do documento</li>
                        <li>{"{{approval_date}}"} - Data da aprovação</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">⚡ Templates Pré-Configurados</h3>
                  <p className="mb-4">O sistema inclui templates prontos para usar. Você pode ativá-los com um clique:</p>
                  
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">Proposta Aceita</h5>
                          <p className="text-sm text-gray-600">Notifica quando um cliente aceita uma proposta</p>
                          <Badge className="bg-green-100 text-green-800 mt-1">proposals</Badge>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Usar Template</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">Documento Aprovado</h5>
                          <p className="text-sm text-gray-600">Notifica quando um documento é aprovado</p>
                          <Badge className="bg-purple-100 text-purple-800 mt-1">documents</Badge>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Usar Template</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">Lembrete de Tarefa</h5>
                          <p className="text-sm text-gray-600">Lembra usuários sobre tarefas próximas do vencimento</p>
                          <Badge className="bg-orange-100 text-orange-800 mt-1">notifications</Badge>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Usar Template</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoramento */}
        <TabsContent value="monitoring" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Monitoramento e Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">📊 Dashboard de Emails</h3>
                  <p className="mb-4">Acompanhe o desempenho do seu sistema de email:</p>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Mail className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-blue-700">1,247</p>
                          <p className="text-sm text-blue-600">Total Enviados</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-green-700">1,198</p>
                          <p className="text-sm text-green-600">Entregues</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="text-2xl font-bold text-red-700">49</p>
                          <p className="text-sm text-red-600">Falharam</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold text-orange-700">12</p>
                          <p className="text-sm text-orange-600">Pendentes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">📋 Histórico Detalhado</h3>
                  <p className="mb-4">Visualize todos os emails enviados com informações completas:</p>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-700">
                        <span>Destinatário</span>
                        <span>Assunto</span>
                        <span>Status</span>
                        <span>Data/Hora</span>
                        <span>Origem</span>
                      </div>
                    </div>
                    <div className="divide-y">
                      <div className="p-3 grid grid-cols-5 gap-4 text-sm">
                        <span>cliente@empresa.com</span>
                        <span>Proposta #2024-001 - Aceita</span>
                        <Badge className="bg-green-100 text-green-800 w-fit">Enviado</Badge>
                        <span>15/01/2024 14:30</span>
                        <span>proposal_accepted</span>
                      </div>
                      <div className="p-3 grid grid-cols-5 gap-4 text-sm">
                        <span>gestor@empresa.com</span>
                        <span>Documento aprovado</span>
                        <Badge className="bg-green-100 text-green-800 w-fit">Enviado</Badge>
                        <span>15/01/2024 13:15</span>
                        <span>document_approved</span>
                      </div>
                      <div className="p-3 grid grid-cols-5 gap-4 text-sm">
                        <span>usuario@empresa.com</span>
                        <span>Lembrete de Tarefa</span>
                        <Badge className="bg-red-100 text-red-800 w-fit">Falhou</Badge>
                        <span>15/01/2024 12:00</span>
                        <span>task_reminder</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">⚠️ Limites e Alertas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Limite Diário</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Enviados hoje:</span>
                          <span className="font-semibold">127 / 1,000</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '12.7%'}}></div>
                        </div>
                        <p className="text-xs text-gray-600">12.7% do limite diário usado</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Taxa de Sucesso</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Últimos 30 dias:</span>
                          <span className="font-semibold text-green-600">96.1%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '96.1%'}}></div>
                        </div>
                        <p className="text-xs text-gray-600">Excelente taxa de entrega</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resolução de Problemas */}
        <TabsContent value="troubleshooting" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Resolução de Problemas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">🔧 Problemas Comuns e Soluções</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 bg-red-50 p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ "Falha na autenticação SMTP"</h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <p><strong>Possíveis causas:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Senha incorreta ou expirada</li>
                          <li>Autenticação de duas etapas não configurada (Gmail)</li>
                          <li>Aplicações de terceiros bloqueadas</li>
                        </ul>
                        <p><strong>Soluções:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Para Gmail: Use senhas de app específicas</li>
                          <li>Para Outlook: Ative SMTP autenticado</li>
                          <li>Verifique se a conta permite aplicações externas</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">⚠️ "Conexão recusada ou timeout"</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <p><strong>Possíveis causas:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Porta SMTP bloqueada pelo firewall</li>
                          <li>Servidor SMTP incorreto</li>
                          <li>Problemas de conectividade de rede</li>
                        </ul>
                        <p><strong>Soluções:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Verifique se as portas 587/465 estão liberadas</li>
                          <li>Teste com diferentes servidores SMTP</li>
                          <li>Entre em contato com seu provedor de internet</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">⏳ "Emails enviados mas não chegam"</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p><strong>Possíveis causas:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Emails sendo marcados como spam</li>
                          <li>Filtros de email do destinatário</li>
                          <li>Problema com reputação do servidor</li>
                        </ul>
                        <p><strong>Soluções:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Verifique a pasta de spam do destinatário</li>
                          <li>Configure SPF/DKIM no seu domínio</li>
                          <li>Use um email remetente confiável</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">🔍 Diagnóstico Avançado</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Checklist de Diagnóstico:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Configuração SMTP testada com sucesso</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Templates ativos e com variáveis corretas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Limite diário não excedido</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Logs do sistema verificados</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Firewall e portas de rede liberadas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Email de teste recebido com sucesso</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Suporte Técnico</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Se os problemas persistirem após seguir este guia, entre em contato com o suporte técnico 
                    incluindo as seguintes informações:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Provedor de email utilizado</li>
                      <li>Mensagens de erro específicas</li>
                      <li>Logs de teste de conexão</li>
                      <li>Configurações de firewall da empresa</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}