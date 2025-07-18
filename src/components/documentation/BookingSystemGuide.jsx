import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Calendar,
  Users,
  Briefcase,
  Settings,
  Shield,
  Globe,
  BarChart3,
  MousePointerClick,
  FileEdit,
  History,
  Bell,
  Palette,
  Lightbulb,
  Info,
  CheckCircle,
  Target
} from 'lucide-react';

export default function BookingSystemGuide() {
  const StepCard = ({ icon, title, children }) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <div className="text-gray-600 space-y-2">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <Calendar className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Sistema de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O Sistema de Agendamentos permite que você crie um portal de agendamentos online completo, similar ao BookMyDay, com funcionalidades avançadas para gestão de serviços, prestadores e compromissos.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Portal Completo</AlertTitle>
            <AlertDescription className="text-blue-700">
              Este sistema cria um portal público onde seus clientes podem agendar serviços diretamente, enquanto você mantém controle total através do painel administrativo.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-firstdocy-primary" />
            Configuração Inicial: Primeiros Passos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepCard icon={<Palette className="w-6 h-6" />} title="1. Configure sua Marca">
            <p>Acesse <strong>Sistema de Agendamentos → Configurações</strong> e personalize:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Nome do Negócio:</strong> Aparecerá como título no portal público</li>
              <li><strong>Descrição:</strong> Texto de apresentação para seus clientes</li>
              <li><strong>Logo:</strong> Sua marca no topo do portal</li>
              <li><strong>Cor Primária:</strong> Personaliza botões e destaques</li>
            </ul>
          </StepCard>

          <StepCard icon={<Briefcase className="w-6 h-6" />} title="2. Cadastre seus Serviços">
            <p>Vá para <strong>Serviços</strong> e crie tudo o que você oferece:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Nome e Descrição:</strong> Ex: "Consulta Médica", "Reunião de Vendas"</li>
              <li><strong>Duração:</strong> Tempo necessário para o atendimento</li>
              <li><strong>Preço:</strong> Valor do serviço (opcional)</li>
              <li><strong>Categoria:</strong> Para organizar seus serviços</li>
              <li><strong>Buffer:</strong> Tempo extra entre atendimentos</li>
            </ul>
          </StepCard>

          <StepCard icon={<Users className="w-6 h-6" />} title="3. Adicione Prestadores">
            <p>Na aba <strong>Prestadores</strong>, cadastre quem realizará os atendimentos:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Dados Básicos:</strong> Nome, título, bio, foto</li>
              <li><strong>Contato:</strong> E-mail e telefone</li>
              <li><strong>Especialidades:</strong> Áreas de atuação</li>
              <li><strong>Serviços Vinculados:</strong> Quais serviços pode prestar</li>
              <li><strong>Horários de Trabalho:</strong> Disponibilidade semanal</li>
            </ul>
          </StepCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Gerenciamento Diário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepCard icon={<BarChart3 className="w-6 h-6" />} title="Dashboard">
            <p>Visão geral completa da sua agenda:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Agendamentos de hoje e próximos dias</li>
              <li>Estatísticas de ocupação</li>
              <li>Serviços mais populares</li>
              <li>Status dos compromissos</li>
            </ul>
          </StepCard>

          <StepCard icon={<Calendar className="w-6 h-6" />} title="Calendário">
            <p>Visualização mensal com funcionalidades avançadas:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ver todos os compromissos do mês</li>
              <li>Filtrar por prestador ou serviço</li>
              <li>Cores diferentes para cada tipo de serviço</li>
              <li>Clique em qualquer dia para ver detalhes</li>
            </ul>
          </StepCard>

          <StepCard icon={<FileEdit className="w-6 h-6" />} title="Gerenciar Agendamentos">
            <p>Lista completa de todos os compromissos:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Buscar por cliente, prestador ou serviço</li>
              <li>Filtrar por status ou período</li>
              <li>Editar detalhes de qualquer agendamento</li>
              <li>Cancelar ou reagendar compromissos</li>
            </ul>
          </StepCard>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Shield className="w-5 h-5" />
            Funções Especiais do Usuário Master
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-yellow-300 bg-yellow-100">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Controle Total</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Como usuário master, você tem acesso a funcionalidades especiais para gerenciar completamente a agenda.
            </AlertDescription>
          </Alert>

          <StepCard icon={<FileEdit className="w-6 h-6" />} title="Criação Manual de Agendamentos">
            <p>Ideal para agendamentos feitos por telefone ou presencialmente:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Criar compromissos para qualquer cliente</li>
              <li>Escolher prestador e horário disponível</li>
              <li>Definir observações especiais</li>
              <li>Notificar automaticamente as partes envolvidas</li>
            </ul>
          </StepCard>

          <StepCard icon={<History className="w-6 h-6" />} title="Trilha de Auditoria">
            <p>Todas as suas ações são registradas para total transparência:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Log de quem fez cada alteração</li>
              <li>Data e hora de todas as modificações</li>
              <li>Motivo das alterações</li>
              <li>Valores anteriores e novos</li>
            </ul>
          </StepCard>

          <StepCard icon={<Bell className="w-6 h-6" />} title="Notificações Automáticas">
            <p>Sistema inteligente de comunicação:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>E-mails de confirmação automáticos</li>
              <li>Lembretes antes dos compromissos</li>
              <li>Notificações de alterações</li>
              <li>Comunicação com cliente e prestador</li>
            </ul>
          </StepCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Portal Público do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">O portal público é onde seus clientes agendam serviços. O processo é simples e intuitivo:</p>

          <div className="grid gap-4">
            <StepCard icon={<span className="font-bold text-lg text-blue-600">1</span>} title="Escolher Serviço">
              <p>Cliente visualiza todos os serviços disponíveis com descrições, durações e preços.</p>
            </StepCard>

            <StepCard icon={<span className="font-bold text-lg text-green-600">2</span>} title="Selecionar Prestador">
              <p>Lista de profissionais habilitados para o serviço escolhido, com fotos e especialidades.</p>
            </StepCard>

            <StepCard icon={<span className="font-bold text-lg text-purple-600">3</span>} title="Escolher Data e Horário">
              <p>Calendário interativo mostra apenas horários realmente disponíveis, considerando a agenda do prestador.</p>
            </StepCard>

            <StepCard icon={<span className="font-bold text-lg text-orange-600">4</span>} title="Confirmar Agendamento">
              <p>Cliente preenche dados pessoais e recebe confirmação imediata por e-mail.</p>
            </StepCard>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Experiência Otimizada</AlertTitle>
            <AlertDescription className="text-green-700">
              O portal é responsivo e funciona perfeitamente em computadores, tablets e smartphones, oferecendo a melhor experiência para seus clientes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Dicas e Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Recomendações:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Configure buffers entre atendimentos para preparação</li>
                <li>Use descrições claras nos serviços</li>
                <li>Mantenha fotos e informações dos prestadores atualizadas</li>
                <li>Configure lembretes automáticos para reduzir faltas</li>
                <li>Revise regularmente as configurações de horário</li>
                <li>Use categorias para organizar muitos serviços</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-800 mb-2">❌ Evite:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Deixar prestadores sem serviços vinculados</li>
                <li>Horários muito próximos sem buffer</li>
                <li>Descrições de serviços muito técnicas</li>
                <li>Esquecer de testar o portal público</li>
                <li>Não configurar notificações adequadas</li>
                <li>Ignorar os logs de auditoria</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Próximos Passos</AlertTitle>
        <AlertDescription className="text-blue-700">
          Após configurar o sistema, teste o fluxo completo criando um agendamento de teste. Isso ajuda a identificar ajustes necessários antes de disponibilizar para seus clientes.
        </AlertDescription>
      </Alert>
    </div>
  );
}