
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Upload,
  Download,
  Building2,
  Lightbulb,
  Info,
  Target,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react';

export default function OccupationalHealthGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-gray-800">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Saúde Ocupacional</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistema completo para gerenciamento de exames médicos ocupacionais, ASOs e conformidade com eSocial
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Conformidade Legal:</strong> O módulo de Saúde Ocupacional está alinhado com as normas regulamentadoras 
          NR-7 (PCMSO) e NR-9 (PPRA), garantindo a conformidade legal da sua empresa.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="exam-types">Tipos de Exames</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamentos</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="aso-management">Gestão de ASO</TabsTrigger>
          <TabsTrigger value="esocial">eSocial</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-firstdocy-primary" />
                  Como Funciona o Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O módulo de Exames Médicos Ocupacionais automatiza todo o ciclo de saúde ocupacional da sua empresa:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">📋 Fluxo Completo:</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                      <li>Funcionário é cadastrado no sistema</li>
                      <li>Exame é agendado conforme tipo necessário</li>
                      <li>Integração envia dados para a clínica</li>
                      <li>Clínica realiza o exame e envia resultados</li>
                      <li>ASO é gerado automaticamente</li>
                      <li>Eventos eSocial são criados e enviados</li>
                      <li>Sistema monitora prazos de validade</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">🔧 Principais Benefícios:</h4>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Conformidade Legal:</strong> Atende NR-7 e eSocial</li>
                      <li><strong>Automatização:</strong> Reduz 90% do trabalho manual</li>
                      <li><strong>Integração:</strong> Conecta com 7 sistemas do mercado</li>
                      <li><strong>Controle:</strong> Dashboard em tempo real</li>
                      <li><strong>Auditoria:</strong> Histórico completo de todas as ações</li>
                      <li><strong>Alertas:</strong> Notificações automáticas de vencimentos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Primeiros Passos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Configuração Inicial</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Antes de agendar o primeiro exame, configure pelo menos uma integração com clínica/laboratório.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">1. Configure Integrações</h4>
                    <p className="text-sm text-blue-700">Vá em "Integrações" e configure sua primeira clínica ou laboratório.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">2. Cadastre Funcionários</h4>
                    <p className="text-sm text-green-700">Certifique-se de que os funcionários estão no sistema RH.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">3. Agende Primeiro Exame</h4>
                    <p className="text-sm text-purple-700">Use o botão "Agendar Exame" para começar.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tipos de Exames */}
        <TabsContent value="exam-types" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-firstdocy-primary" />
                  Tipos de Exames e Quando Usar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {/* Exame Admissional */}
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                        <Users className="w-4 h-4 mr-1" />
                        ADMISSIONAL
                      </Badge>
                      <h4 className="font-semibold text-blue-900">Exame Admissional</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-blue-800 mb-2"><strong>Quando usar:</strong></p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Antes do primeiro dia de trabalho</li>
                          <li>• Obrigatório para todos os funcionários</li>
                          <li>• Prazo: até o dia anterior ao início</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-blue-800 mb-2"><strong>Exemplo prático:</strong></p>
                        <div className="bg-blue-100 p-3 rounded text-sm text-blue-800">
                          <strong>Situação:</strong> Maria foi contratada para iniciar em 15/01.<br/>
                          <strong>Ação:</strong> Agendar exame admissional até 14/01.<br/>
                          <strong>Resultado:</strong> ASO liberado = Maria pode iniciar.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exame Periódico */}
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        PERIÓDICO
                      </Badge>
                      <h4 className="font-semibold text-green-900">Exame Periódico</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-green-800 mb-2"><strong>Quando usar:</strong></p>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Anualmente (padrão)</li>
                          <li>• A cada 6 meses (atividades de risco)</li>
                          <li>• Para todos os funcionários ativos</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-green-800 mb-2"><strong>Exemplo prático:</strong></p>
                        <div className="bg-green-100 p-3 rounded text-sm text-green-800">
                          <strong>Situação:</strong> João fez admissional em jan/2023.<br/>
                          <strong>Sistema:</strong> Alerta automático em dez/2023.<br/>
                          <strong>Ação:</strong> Agendar periódico até jan/2024.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mudança de Função */}
                  <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1">
                        <Activity className="w-4 h-4 mr-1" />
                        MUDANÇA DE FUNÇÃO
                      </Badge>
                      <h4 className="font-semibold text-yellow-900">Mudança de Função</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-yellow-800 mb-2"><strong>Quando usar:</strong></p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Mudança de cargo ou setor</li>
                          <li>• Alteração de riscos ocupacionais</li>
                          <li>• Antes da nova função</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-yellow-800 mb-2"><strong>Exemplo prático:</strong></p>
                        <div className="bg-yellow-100 p-3 rounded text-sm text-yellow-800">
                          <strong>Situação:</strong> Carlos sai do administrativo para produção.<br/>
                          <strong>Sistema:</strong> Detecta mudança de risco.<br/>
                          <strong>Ação:</strong> Exame antes de assumir nova função.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Retorno de Afastamento */}
                  <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">
                        <Clock className="w-4 h-4 mr-1" />
                        RETORNO DE AFASTAMENTO
                      </Badge>
                      <h4 className="font-semibold text-purple-900">Retorno de Afastamento</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-800 mb-2"><strong>Quando usar:</strong></p>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Após licença médica maior que 30 dias</li>
                          <li>• Retorno de auxílio-doença</li>
                          <li>• Afastamento por acidente de trabalho</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-purple-800 mb-2"><strong>Exemplo prático:</strong></p>
                        <div className="bg-purple-100 p-3 rounded text-sm text-purple-800">
                          <strong>Situação:</strong> Ana ficou 45 dias afastada por cirurgia.<br/>
                          <strong>Sistema:</strong> Alerta para exame de retorno.<br/>
                          <strong>Ação:</strong> ASO para liberar volta ao trabalho.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demissional */}
                  <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        DEMISSIONAL
                      </Badge>
                      <h4 className="font-semibold text-red-900">Exame Demissional</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-red-800 mb-2"><strong>Quando usar:</strong></p>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Sempre no desligamento</li>
                          <li>• Até 10 dias após última atividade</li>
                          <li>• Obrigatório para homologação</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-red-800 mb-2"><strong>Exemplo prático:</strong></p>
                        <div className="bg-red-100 p-3 rounded text-sm text-red-800">
                          <strong>Situação:</strong> Pedro será desligado em 30/06.<br/>
                          <strong>Sistema:</strong> Agenda automaticamente demissional.<br/>
                          <strong>Prazo:</strong> Realizar até 10/07 para homologação.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agendamentos */}
        <TabsContent value="scheduling" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-firstdocy-primary" />
                  Como Agendar Exames Médicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Processo Simplificado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    O sistema detecta automaticamente quando funcionários precisam de exames e sugere agendamentos.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📋 Passo a Passo Completo:</h4>
                  
                  <div className="grid gap-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h5 className="font-semibold text-blue-800">1. Acesse o Módulo</h5>
                      <p className="text-sm text-gray-700">Vá em <strong>RHR → Exames Médicos Ocupacionais</strong></p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h5 className="font-semibold text-green-800">2. Clique em "Agendar Exame"</h5>
                      <p className="text-sm text-gray-700">Botão azul no canto superior direito da tela</p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h5 className="font-semibold text-purple-800">3. Preencha os Dados Básicos</h5>
                      <ul className="text-sm text-gray-700 mt-1 space-y-1">
                        <li>• <strong>Funcionário:</strong> Selecione da lista de funcionários ativos</li>
                        <li>• <strong>Tipo de Exame:</strong> Escolha conforme necessidade</li>
                        <li>• <strong>Data e Hora:</strong> Quando o exame será realizado</li>
                        <li>• <strong>Status:</strong> Geralmente "Agendado"</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                      <h5 className="font-semibold text-yellow-800">4. Configure a Clínica</h5>
                      <ul className="text-sm text-gray-700 mt-1 space-y-1">
                        <li>• <strong>Provedor/Sistema:</strong> Escolha a integração configurada</li>
                        <li>• <strong>Nome da Clínica:</strong> Ex: "Clínica Saúde Ocupacional"</li>
                        <li>• <strong>Médico Responsável:</strong> Nome do médico do trabalho</li>
                        <li>• <strong>CRM:</strong> Número do registro profissional</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <h5 className="font-semibold text-red-800">5. Salve e Monitore</h5>
                      <p className="text-sm text-gray-700">O sistema enviará automaticamente os dados para a clínica</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">💡 Exemplo Prático de Agendamento:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Cenário:</h5>
                      <p className="text-sm">Nova funcionária Maria Silva, contratada para começar dia 15/01/2024 como Analista Financeiro.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Ação no Sistema:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Funcionário:</strong> Maria Silva</li>
                        <li>• <strong>Tipo:</strong> Admissional</li>
                        <li>• <strong>Data:</strong> 12/01/2024 14:00</li>
                        <li>• <strong>Clínica:</strong> Clínica OcupMed</li>
                        <li>• <strong>Status:</strong> Agendado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Monitoramento e Alertas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O sistema monitora automaticamente todos os prazos e envia alertas:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800">🔔 Tipos de Alertas:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">VENCIMENTO</Badge>
                        <span>Exame vence em 30 dias</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">VENCIDO</Badge>
                        <span>Exame passou da validade</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">AGENDADO</Badge>
                        <span>Exame agendado para hoje</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">PENDENTE</Badge>
                        <span>ASO não foi emitido</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">📊 No Dashboard:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Taxa de conformidade em tempo real</li>
                      <li>• Exames agendados para os próximos 7 dias</li>
                      <li>• Lista de exames em atraso</li>
                      <li>• Funcionários que precisam de exames</li>
                      <li>• Status das integrações com clínicas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrações */}
        <TabsContent value="integrations" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-firstdocy-primary" />
                  Configurando Integrações com Clínicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Importante</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    As integrações permitem comunicação direta com clínicas e laboratórios, 
                    automatizando agendamentos e recebimento de resultados.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <h4 className="font-semibold text-lg">🏥 Sistemas Suportados:</h4>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h5 className="font-semibold text-blue-800">Stak Care</h5>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">API REST DataSnap, JSON/XML/CSV</p>
                      <Badge className="bg-blue-100 text-blue-800">API Key</Badge>
                    </div>

                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-green-600" />
                        <h5 className="font-semibold text-green-800">SGGNet</h5>
                      </div>
                      <p className="text-sm text-green-700 mb-2">API REST para ERP, eSocial</p>
                      <Badge className="bg-green-100 text-green-800">OAuth2</Badge>
                    </div>

                    <div className="border rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        <h5 className="font-semibold text-purple-800">Peoplenet SST</h5>
                      </div>
                      <p className="text-sm text-purple-700 mb-2">API REST, eventos eSocial/XML</p>
                      <Badge className="bg-purple-100 text-purple-800">Basic Auth</Badge>
                    </div>

                    <div className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-yellow-600" />
                        <h5 className="font-semibold text-yellow-800">B31/SOC</h5>
                      </div>
                      <p className="text-sm text-yellow-700 mb-2">Web Service SOAP/REST</p>
                      <Badge className="bg-yellow-100 text-yellow-800">Certificado</Badge>
                    </div>

                    <div className="border rounded-lg p-4 bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-red-600" />
                        <h5 className="font-semibold text-red-800">Salú</h5>
                      </div>
                      <p className="text-sm text-red-700 mb-2">API Key, JSON</p>
                      <Badge className="bg-red-100 text-red-800">API Key</Badge>
                    </div>

                    <div className="border rounded-lg p-4 bg-indigo-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        <h5 className="font-semibold text-indigo-800">SIGOWEB</h5>
                      </div>
                      <p className="text-sm text-indigo-700 mb-2">API REST para ERPs TOTVS</p>
                      <Badge className="bg-indigo-100 text-indigo-800">OAuth2</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">⚙️ Como Configurar uma Integração:</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-blue-800 mb-2">1. Acesse as Configurações</h5>
                      <p className="text-sm text-blue-700">No módulo de Exames → aba "Integrações" → "Nova Integração"</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-semibold text-green-800 mb-2">2. Escolha o Sistema</h5>
                      <p className="text-sm text-green-700">Selecione o sistema da sua clínica na lista de "Sistemas Disponíveis"</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h5 className="font-semibold text-purple-800 mb-2">3. Configure as Credenciais</h5>
                      <p className="text-sm text-purple-700">Preencha com dados fornecidos pela clínica:</p>
                      <ul className="text-sm text-purple-600 mt-1 space-y-1">
                        <li>• URL da API</li>
                        <li>• Chaves de autenticação</li>
                        <li>• Certificados (se necessário)</li>
                        <li>• Timeout e configurações</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <h5 className="font-semibold text-yellow-800 mb-2">4. Teste a Conexão</h5>
                      <p className="text-sm text-yellow-700">Use o botão "Testar" para verificar se a conexão está funcionando</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">💡 Exemplo de Configuração (Stak Care):</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>URL da API:</strong> https://api.stakcare.com.br/v1/</p>
                    <p><strong>Tipo de Auth:</strong> API Key</p>
                    <p><strong>API Key:</strong> sk_live_abc123def456...</p>
                    <p><strong>Timeout:</strong> 30 segundos</p>
                    <p><strong>Retry:</strong> 3 tentativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Monitoramento de Integrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O sistema monitora continuamente a saúde das integrações:</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-800">Saudável</h4>
                    <p className="text-sm text-green-700">Conexão funcionando perfeitamente</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-800">Degradado</h4>
                    <p className="text-sm text-yellow-700">Conexão lenta ou instável</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-red-800">Inativo</h4>
                    <p className="text-sm text-red-700">Conexão não disponível</p>
                  </div>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Dica de Monitoramento</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    O sistema faz verificações automáticas a cada 5 minutos. Em caso de problemas, 
                    você será notificado imediatamente por email e no dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestão de ASO */}
        <TabsContent value="aso-management" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-firstdocy-primary" />
                  Gestão Automática de ASO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Processo Automatizado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    O ASO (Atestado de Saúde Ocupacional) é gerado automaticamente quando o exame é concluído pela clínica.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📄 O que é o ASO?</h4>
                  <p>O ASO é um documento obrigatório que comprova:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Se o funcionário está <strong>apto</strong> ou <strong>inapto</strong> para o trabalho</li>
                    <li>Quais são as <strong>restrições médicas</strong> (se houver)</li>
                    <li><strong>Data de validade</strong> do exame</li>
                    <li><strong>Próxima data</strong> para novo exame</li>
                    <li><strong>Assinatura digital</strong> do médico responsável</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🔄 Fluxo Automático do ASO:</h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h5 className="font-semibold text-blue-800">Exame Realizado</h5>
                        <p className="text-sm text-blue-700">Clínica conclui exame e envia resultados</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h5 className="font-semibold text-green-800">ASO Gerado</h5>
                        <p className="text-sm text-green-700">Sistema gera ASO automaticamente com assinatura digital</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h5 className="font-semibold text-purple-800">Notificação Enviada</h5>
                        <p className="text-sm text-purple-700">RH e gestor são notificados sobre o resultado</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h5 className="font-semibold text-yellow-800">Arquivo Disponível</h5>
                        <p className="text-sm text-yellow-700">ASO em PDF disponível para download no sistema</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">💡 Exemplo Prático:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Situação:</h5>
                      <p className="text-sm">João Silva realizou exame periódico na Clínica OcupMed no dia 15/01/2024.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Resultado Automático:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Status:</strong> Apto</li>
                        <li>• <strong>Restrições:</strong> Não levantar mais de 20kg</li>
                        <li>• <strong>Próximo exame:</strong> Jan/2025</li>
                        <li>• <strong>ASO #:</strong> ASO-2024-0001</li>
                        <li>• <strong>PDF:</strong> Disponível para download</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Como Acessar e Usar os ASOs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📱 Onde Encontrar:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h5 className="font-semibold text-blue-800 mb-2">Na Lista de Exames:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Coluna "ASO" mostra se está disponível</li>
                        <li>• Ícone verde = ASO pronto</li>
                        <li>• Botão de download direto</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h5 className="font-semibold text-green-800 mb-2">Na Aba "ASOs":</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Lista apenas exames com ASO</li>
                        <li>• Filtro por período</li>
                        <li>• Download em lote</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📋 Informações no ASO:</h4>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Dados do Funcionário:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Nome completo</li>
                          <li>• CPF e RG</li>
                          <li>• Data de nascimento</li>
                          <li>• Função exercida</li>
                          <li>• Setor de trabalho</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Dados do Exame:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Tipo de exame realizado</li>
                          <li>• Data da realização</li>
                          <li>• Médico responsável</li>
                          <li>• CRM do médico</li>
                          <li>• Resultado (apto/inapto)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <Shield className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Validade Legal</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Todos os ASOs gerados possuem assinatura digital qualificada e têm validade jurídica completa, 
                    atendendo às exigências da NR-7 e legislação trabalhista.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* eSocial */}
        <TabsContent value="esocial" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-firstdocy-primary" />
                  Integração Automática com eSocial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Automação Completa</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    O sistema gera e envia automaticamente os eventos eSocial S-2220 e S-2240 
                    quando os exames são concluídos, garantindo conformidade total.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📊 Eventos eSocial Suportados:</h4>
                  
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                          <Upload className="w-4 h-4 mr-1" />
                          S-2220
                        </Badge>
                        <h4 className="font-semibold text-green-900">Monitoramento da Saúde do Trabalhador</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-800 mb-2"><strong>Quando é enviado:</strong></p>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Após conclusão de qualquer exame médico</li>
                            <li>• Quando ASO é emitido</li>
                            <li>• Automaticamente em 24h</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-green-800 mb-2"><strong>Informações enviadas:</strong></p>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Dados do exame realizado</li>
                            <li>• Resultado de aptidão</li>
                            <li>• Restrições médicas</li>
                            <li>• Data do próximo exame</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                          <Upload className="w-4 h-4 mr-1" />
                          S-2240
                        </Badge>
                        <h4 className="font-semibold text-blue-900">Condições Ambientais do Trabalho</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-800 mb-2"><strong>Quando é enviado:</strong></p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Mudança de função com novos riscos</li>
                            <li>• Alteração de ambiente de trabalho</li>
                            <li>• Novos agentes nocivos identificados</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-blue-800 mb-2"><strong>Informações enviadas:</strong></p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Agentes nocivos presentes</li>
                            <li>• EPI necessários</li>
                            <li>• Periodicidade de exames</li>
                            <li>• Condições ambientais</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🔄 Fluxo Automático eSocial:</h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h5 className="font-semibold text-blue-800">Exame Concluído</h5>
                        <p className="text-sm text-blue-700">ASO é gerado e validado no sistema</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h5 className="font-semibold text-green-800">XML Gerado</h5>
                        <p className="text-sm text-green-700">Sistema cria XML no formato oficial eSocial</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h5 className="font-semibold text-purple-800">Envio Automático</h5>
                        <p className="text-sm text-purple-700">XML é enviado para o eSocial via Web Service</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h5 className="font-semibold text-yellow-800">Recibo Recebido</h5>
                        <p className="text-sm text-yellow-700">Sistema recebe e armazena recibo de protocolo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">💡 Exemplo Prático de Evento:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Dados do Evento:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Evento:</strong> S-2220</li>
                        <li>• <strong>Funcionário:</strong> Maria Silva</li>
                        <li>• <strong>CPF:</strong> 123.456.789-00</li>
                        <li>• <strong>Exame:</strong> Admissional</li>
                        <li>• <strong>Data:</strong> 15/01/2024</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Status do Envio:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Status:</strong> Processado</li>
                        <li>• <strong>Recibo:</strong> 1.2.202401.0012345</li>
                        <li>• <strong>Enviado em:</strong> 16/01/2024 08:30</li>
                        <li>• <strong>Processado em:</strong> 16/01/2024 08:35</li>
                        <li>• <strong>Próximo evento:</strong> Jan/2025</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Monitoramento de Eventos eSocial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O sistema monitora todos os eventos enviados ao eSocial:</p>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-800">Pendente</h4>
                    <p className="text-sm text-yellow-700">Aguardando envio</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-800">Enviado</h4>
                    <p className="text-sm text-blue-700">Enviado ao eSocial</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-800">Processado</h4>
                    <p className="text-sm text-green-700">Aceito pelo eSocial</p>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-red-800">Rejeitado</h4>
                    <p className="text-sm text-red-700">Erro no envio</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">🔍 Como Acompanhar:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Dashboard</Badge>
                      <span>Contador de eventos por status</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Aba eSocial</Badge>
                      <span>Lista completa de todos os eventos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Notificações</Badge>
                      <span>Alertas em caso de rejeição</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Relatórios</Badge>
                      <span>Relatório mensal de conformidade</span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Conformidade Garantida</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Com o envio automático, sua empresa mantém 100% de conformidade com as obrigações 
                    do eSocial relacionadas à saúde ocupacional, evitando multas e penalidades.
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
