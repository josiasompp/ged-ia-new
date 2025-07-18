import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock,
  Shield,
  Monitor,
  CheckCircle,
  Settings,
  BarChart3,
  FileText,
  Lightbulb,
  Info,
  Target,
  Zap,
  Globe,
  Database,
  Smartphone,
  Users,
  Download,
  Upload,
  Activity,
  CalendarDays,
  Edit
} from 'lucide-react';

export default function RhrPointGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-gray-800">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
            <Clock className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Módulo de Ponto RHR</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistema completo para gestão de ponto, turnos, horas e conformidade com a Portaria 671.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Sistema Inteligente:</strong> O Ponto RHR é o sistema central para todos os cálculos de jornada, horas e banco de horas, garantindo precisão e conformidade.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="shifts">Gestão de Turnos</TabsTrigger>
          <TabsTrigger value="management">Gestão de Ponto</TabsTrigger>
          <TabsTrigger value="compliance">Conformidade (Port. 671)</TabsTrigger>
          <TabsTrigger value="brio-integration">Integração Brio!</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-firstdocy-primary" />
                  Principais Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">🎯 Gestão de Ponto e Jornada:</h4>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                      <li><strong>Registro de Ponto Web e Mobile:</strong> Batidas com geolocalização e informações do dispositivo.</li>
                      <li><strong>Gestão de Turnos Flexíveis:</strong> Suporte para jornadas fixas, 12x36, rotativas e mais.</li>
                      <li><strong>Cálculo Automático:</strong> O sistema calcula horas trabalhadas, extras, noturnas e DSR.</li>
                      <li><strong>Correção de Ponto:</strong> Interface para gestores corrigirem batidas com trilha de auditoria.</li>
                      <li><strong>Banco de Horas:</strong> Gestão automática de saldo com regras de compensação.</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">⚡ Conformidade e Integração:</h4>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                      <li><strong>Portaria 671:</strong> Conformidade total, incluindo importação de AFD e exportação de AEJ.</li>
                      <li><strong>Auditoria Completa:</strong> Rastreabilidade de todas as edições e aprovações.</li>
                      <li><strong>Relatórios Detalhados:</strong> Espelho de ponto, banco de horas e relatórios gerenciais.</li>
                      <li><strong>Integração Brio! APx:</strong> Sincronização de dados processados para o sistema legado.</li>
                      <li><strong>Interface Moderna:</strong> UX/UI otimizada para produtividade de gestores e RH.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
        
        {/* Gestão de Turnos */}
        <TabsContent value="shifts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-firstdocy-primary" />
                  Criação e Gestão de Turnos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Onde Gerenciar?</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Acesse <strong>RHR → Turnos</strong> para configurar todas as jornadas de trabalho da sua empresa.
                  </AlertDescription>
                </Alert>
                
                <h4 className="font-semibold text-lg">🔧 Configurando um Novo Turno:</h4>
                <ol className="list-decimal list-inside space-y-2 pl-4 text-sm">
                    <li>Clique em "Novo Turno" e preencha as <strong>Informações Gerais</strong> (Nome, tipo de turno, carga horária).</li>
                    <li>Defina os <strong>Horários Semanais</strong>, marcando os dias de trabalho e os horários de entrada/saída.</li>
                    <li>Nas <strong>Regras de Intervalo</strong>, configure se o intervalo é flexível ou se deve ser descontado automaticamente.</li>
                    <li>Em <strong>Hora Extra e Banco de Horas</strong>, habilite o banco, defina o fator de compensação e a política para feriados.</li>
                    <li>Salve o turno. Ele estará disponível para ser associado aos funcionários.</li>
                </ol>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">💡 Tipos de Turno Suportados:</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><strong className="text-blue-800">Fixo e Flexível:</strong> Para jornadas comerciais com ou sem horário fixo de entrada.</div>
                    <div><strong className="text-orange-800">Rotativo e 12x36:</strong> Ideal para operações contínuas e escalas especiais.</div>
                    <div><strong className="text-purple-800">Esporádico:</strong> Para freelancers ou jornadas sob demanda.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Gestão de Ponto */}
        <TabsContent value="management" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-firstdocy-primary" />
                  Gestão e Correção de Ponto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Onde Gerenciar?</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Acesse <strong>RHR → Gestão Ponto</strong> para visualizar, aprovar e corrigir as batidas.
                  </AlertDescription>
                </Alert>
                
                <h4 className="font-semibold text-lg">📝 Corrigindo uma Batida:</h4>
                <ol className="list-decimal list-inside space-y-2 pl-4 text-sm">
                    <li>Utilize os filtros para encontrar a batida desejada.</li>
                    <li>No menu de ações (⋮), selecione a opção <strong>"Corrigir Ponto"</strong>.</li>
                    <li>Na janela que abrir, ajuste o horário da batida.</li>
                    <li>Preencha o campo <strong>"Justificativa da Correção"</strong>. Este passo é obrigatório e fundamental para a auditoria.</li>
                    <li>Clique em "Salvar Correção". A batida será atualizada e o log de alteração será salvo.</li>
                </ol>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><Edit className="w-4 h-4"/> Trilha de Auditoria</h4>
                  <p className="text-sm">Toda correção de ponto gera um registro de auditoria que armazena o horário original, o novo horário, quem fez a alteração e a justificativa, garantindo total transparência e conformidade legal.</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Conformidade */}
        <TabsContent value="compliance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-firstdocy-primary" />
                  Conformidade (Portaria 671)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-800">Onde Gerenciar?</AlertTitle>
                  <AlertDescription className="text-purple-700">
                    Acesse <strong>RHR → Conformidade</strong> para importar e exportar arquivos legais.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Upload className="w-4 h-4"/> Importação de AFD</h4>
                        <p className="text-sm">Se você usa um Relógio de Ponto Eletrônico (REP-C), pode importar o <strong>Arquivo Fonte de Dados (AFD)</strong> diretamente no sistema. Ele fará a leitura e o registro de todas as batidas contidas no arquivo.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Download className="w-4 h-4"/> Exportação de AEJ</h4>
                        <p className="text-sm">Para fins de fiscalização, o sistema permite gerar o <strong>Arquivo Eletrônico de Jornada (AEJ)</strong>. Selecione o período desejado e o sistema irá compilar todas as informações de jornada, horários e batidas dos funcionários no formato exigido pela legislação.</p>
                    </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Integração Brio! */}
        <TabsContent value="brio-integration" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-firstdocy-primary" />
                  Integração com Sistema Brio! APx
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-purple-200 bg-purple-50">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-800">FIRSTDOCY como Fonte da Verdade</AlertTitle>
                  <AlertDescription className="text-purple-700">
                    O FIRSTDOCY GED AI é o sistema central que processa as regras de negócio e calcula as horas. O Brio! APx atua como um sistema integrado que recebe os dados já processados.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🔄 Fluxo de Dados Corrigido:</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h5 className="font-semibold text-blue-800">Registro e Processamento no FIRSTDOCY</h5>
                        <p className="text-sm text-blue-700">
                          Funcionário bate ponto, gestor corrige ou aprova. O FIRSTDOCY aplica as regras do turno, calcula horas extras, DSR e atualiza o banco de horas.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h5 className="font-semibold text-green-800">Sincronização com Brio! APx</h5>
                        <p className="text-sm text-green-700">
                          Periodicamente ou via gatilho, os dados já processados (espelho de ponto, totais de horas, saldo do banco) são enviados via API para o sistema Brio! APx para fins de histórico e integração com outros módulos legados.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}