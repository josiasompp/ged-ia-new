import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  FileText,
  Upload,
  Search,
  CheckCircle,
  Clock,
  Users,
  Building2,
  BarChart3,
  FileSignature,
  Target,
  Briefcase,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Eye,
  Download,
  Share2,
  MessageSquare,
  Bell,
  Settings,
  Zap,
  Brain,
  Shield,
  Sparkles,
  TrendingUp,
  Home,
  X
} from 'lucide-react';

const DemoCard = ({ icon: Icon, title, description, progress, status, onClick, isActive }) => (
  <Card 
    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          {progress !== undefined && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const mockData = {
  documents: [
    { id: 1, name: "Contrato de Prestação de Serviços", type: "PDF", size: "2.3 MB", date: "2024-01-15", status: "Aprovado" },
    { id: 2, name: "Proposta Comercial - Cliente ABC", type: "DOCX", size: "1.8 MB", date: "2024-01-14", status: "Em Revisão" },
    { id: 3, name: "Manual de Procedimentos", type: "PDF", size: "5.2 MB", date: "2024-01-13", status: "Aprovado" },
    { id: 4, name: "Relatório Mensal Janeiro", type: "XLSX", size: "3.1 MB", date: "2024-01-12", status: "Pendente" }
  ],
  proposals: [
    { id: 1, client: "Empresa XYZ Ltda", value: "R$ 45.000", status: "Enviada", date: "2024-01-15" },
    { id: 2, client: "Construtora ABC", value: "R$ 78.500", status: "Aceita", date: "2024-01-14" },
    { id: 3, client: "Tech Solutions", value: "R$ 32.000", status: "Em Análise", date: "2024-01-13" }
  ],
  leads: [
    { id: 1, name: "João Silva", company: "Metalúrgica São Paulo", stage: "Qualificado", value: "R$ 25.000" },
    { id: 2, name: "Maria Santos", company: "Logística Express", stage: "Proposta", value: "R$ 18.000" },
    { id: 3, name: "Pedro Costa", company: "Indústria Norte", stage: "Negociação", value: "R$ 42.000" }
  ],
  employees: [
    { id: 1, name: "Ana Carolina", position: "Analista RH", status: "Ativo", documents: "12/15" },
    { id: 2, name: "Carlos Eduardo", position: "Desenvolvedor", status: "Ativo", documents: "15/15" },
    { id: 3, name: "Fernanda Lima", position: "Gerente Comercial", status: "Ativo", documents: "10/15" }
  ]
};

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userType, setUserType] = useState('gestor'); // 'gestor' ou 'usuario'
  const [activeDemo, setActiveDemo] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullScreen, setShowFullScreen] = useState(false);

  const demoSteps = {
    gestor: [
      { title: "Dashboard Executivo", content: "dashboard", duration: 3000 },
      { title: "Gestão de Documentos", content: "documents", duration: 4000 },
      { title: "Propostas Comerciais", content: "proposals", duration: 3500 },
      { title: "CRM e Leads", content: "crm", duration: 3000 },
      { title: "Recursos Humanos", content: "hr", duration: 3500 },
      { title: "Relatórios e Analytics", content: "reports", duration: 3000 }
    ],
    usuario: [
      { title: "Meus Documentos", content: "my-documents", duration: 3000 },
      { title: "Upload de Arquivos", content: "upload", duration: 3500 },
      { title: "Busca Inteligente", content: "search", duration: 3000 },
      { title: "Aprovações Pendentes", content: "approvals", duration: 3000 },
      { title: "Meu Perfil", content: "profile", duration: 2500 }
    ]
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const steps = demoSteps[userType];
        setCurrentStep(prev => {
          const next = (prev + 1) % steps.length;
          setActiveDemo(steps[next].content);
          return next;
        });
      }, demoSteps[userType][currentStep]?.duration || 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, userType]);

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    setActiveDemo(demoSteps[userType][stepIndex].content);
    setIsPlaying(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Documentos</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Propostas Aceitas</p>
                <p className="text-3xl font-bold">89</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Leads Ativos</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Funcionários</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Documento aprovado", user: "Ana Silva", time: "há 5 min" },
                { action: "Nova proposta enviada", user: "Carlos Santos", time: "há 15 min" },
                { action: "Lead qualificado", user: "Maria Costa", time: "há 30 min" },
                { action: "Upload de documento", user: "João Oliveira", time: "há 1 hora" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">por {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Documentos Processados</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Taxa de Conversão</span>
                  <span>64%</span>
                </div>
                <Progress value={64} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Satisfação dos Clientes</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Documentos</h2>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Novo Documento
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Documentos Recentes</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Buscar documentos..." className="w-64" />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                </div>
                <Badge variant={doc.status === 'Aprovado' ? 'default' : doc.status === 'Em Revisão' ? 'secondary' : 'outline'}>
                  {doc.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProposals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Propostas Comerciais</h2>
        <Button className="gap-2">
          <FileSignature className="w-4 h-4" />
          Nova Proposta
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">34</div>
            <p className="text-gray-600">Propostas Aceitas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-gray-600">Em Análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">R$ 2.3M</div>
            <p className="text-gray-600">Valor Total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Propostas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.proposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <FileSignature className="w-8 h-8 text-purple-500" />
                <div className="flex-1">
                  <h3 className="font-medium">{proposal.client}</h3>
                  <p className="text-sm text-gray-500">{proposal.value} • {proposal.date}</p>
                </div>
                <Badge variant={proposal.status === 'Aceita' ? 'default' : proposal.status === 'Enviada' ? 'secondary' : 'outline'}>
                  {proposal.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeDemo) {
      case 'dashboard':
        return renderDashboard();
      case 'documents':
      case 'my-documents':
        return renderDocuments();
      case 'proposals':
        return renderProposals();
      case 'upload':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload de Documentos</h2>
            <Card className="border-2 border-dashed border-gray-300 p-12 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Arraste arquivos aqui</h3>
              <p className="text-gray-600 mb-4">ou clique para selecionar</p>
              <Button>Selecionar Arquivos</Button>
            </Card>
          </div>
        );
      case 'search':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Busca Inteligente com IA</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold mb-2">Busca Semântica Avançada</h3>
                    <p className="text-gray-600">Nossa IA entende o contexto da sua busca, não apenas palavras-chave</p>
                  </div>
                </div>
                <Input 
                  placeholder="Ex: contratos assinados no último trimestre com valor acima de 50 mil"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Sugestão da IA:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Encontrei 15 contratos que correspondem aos seus critérios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Demonstração FIRSTDOCY GED AI
              </h1>
              <p className="text-gray-600 mt-2">
                Explore as funcionalidades na perspectiva de {userType === 'gestor' ? 'Gestor' : 'Usuário'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={userType === 'gestor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setUserType('gestor');
                    setCurrentStep(0);
                    setActiveDemo('dashboard');
                    setIsPlaying(false);
                  }}
                >
                  Visão Gestor
                </Button>
                <Button
                  variant={userType === 'usuario' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setUserType('usuario');
                    setCurrentStep(0);
                    setActiveDemo('my-documents');
                    setIsPlaying(false);
                  }}
                >
                  Visão Usuário
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pausar' : 'Auto Demo'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(0);
                    setActiveDemo(demoSteps[userType][0].content);
                    setIsPlaying(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFullScreen(!showFullScreen)}
                >
                  {showFullScreen ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roteiro da Demo</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {demoSteps[userType].map((step, index) => (
                    <Button
                      key={index}
                      variant={currentStep === index ? 'default' : 'ghost'}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleStepClick(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep === index ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm">{step.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`bg-white rounded-lg shadow-sm ${showFullScreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
              <div className="p-6">
                {showFullScreen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => setShowFullScreen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Etapa {currentStep + 1} de {demoSteps[userType].length}
            </span>
            <Progress 
              value={((currentStep + 1) / demoSteps[userType].length) * 100} 
              className="flex-1 h-2"
            />
            <span className="text-sm text-gray-500">
              {demoSteps[userType][currentStep]?.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}