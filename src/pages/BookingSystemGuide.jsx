import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
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
  Palette
} from 'lucide-react';

export default function BookingSystemGuide() {
  const StepCard = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="text-gray-600 space-y-2">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      <div className="text-center">
        <BookOpen className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
          Guia de Uso: Sistema de Agendamentos
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Aprenda a configurar, gerenciar e utilizar todas as funcionalidades da sua nova agenda online.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Primeiros Passos: Configuração Inicial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepCard icon={<Palette className="w-6 h-6" />} title="1. Configure sua Marca">
            <p>Acesse a aba <Badge variant="secondary">Configurações</Badge> e personalize a aparência do seu portal de agendamentos.</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Nome do Negócio:</strong> Será o título principal do seu portal.</li>
              <li><strong>Cor Primária:</strong> Influencia botões e destaques, deixando a página com a sua cara.</li>
            </ul>
          </StepCard>
          <StepCard icon={<Briefcase className="w-6 h-6" />} title="2. Crie seus Serviços">
            <p>Vá para a aba <Badge variant="secondary">Serviços</Badge> para cadastrar tudo o que você oferece.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Defina nome, duração, preço e categoria.</li>
              <li>Use o <Badge>Buffer</Badge> para adicionar um tempo de preparo entre um agendamento e outro.</li>
              <li>Marque um serviço como <Badge variant="outline">Inativo</Badge> para removê-lo temporariamente do portal sem apagar.</li>
            </ul>
          </StepCard>
          <StepCard icon={<Users className="w-6 h-6" />} title="3. Adicione Prestadores de Serviço">
            <p>Na aba <Badge variant="secondary">Prestadores</Badge>, gerencie quem irá realizar os atendimentos.</p>
             <ul className="list-disc list-inside space-y-1">
              <li>Cadastre nome, e-mail e especialidades.</li>
              <li><strong>Vincule os serviços</strong> que cada prestador pode oferecer. Isso é crucial para a agenda funcionar corretamente.</li>
              <li>Defina os <strong>horários de trabalho</strong> de cada um (em desenvolvimento).</li>
            </ul>
          </StepCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Gerenciamento Diário da Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepCard icon={<BarChart3 className="w-6 h-6" />} title="Dashboard">
             <p>Sua visão geral. Acompanhe rapidamente os agendamentos de hoje, serviços mais populares e o desempenho geral da sua agenda.</p>
          </StepCard>
           <StepCard icon={<Calendar className="w-6 h-6" />} title="Calendário">
             <p>Visualize todos os compromissos em uma grade mensal. Use os filtros para ver a agenda por prestador ou serviço específico. É perfeito para ter uma visão macro do mês.</p>
          </StepCard>
          <StepCard icon={<FileEdit className="w-6 h-6" />} title="Gerenciar Agendamentos">
            <p>A aba <Badge variant="secondary">Agendamentos</Badge> lista todos os compromissos. Aqui você pode:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Buscar por cliente, serviço ou prestador.</li>
              <li>Filtrar por status (agendado, confirmado, etc).</li>
              <li>Visualizar detalhes de cada agendamento.</li>
            </ul>
          </StepCard>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Shield className="w-5 h-5" />
            Funções do Usuário Master
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <StepCard icon={<FileEdit className="w-6 h-6" />} title="Controle Total sobre Agendamentos">
             <p>A aba <Badge className="bg-yellow-200 text-yellow-900">Master</Badge> dá a você superpoderes.</p>
             <ul className="list-disc list-inside space-y-1">
                <li><strong>Criar Agendamentos Manualmente:</strong> Ideal para agendamentos feitos por telefone.</li>
                <li><strong>Editar Qualquer Compromisso:</strong> Corrija horários, troque o prestador ou altere o serviço.</li>
                <li><strong>Cancelar Agendamentos:</strong> Remova um compromisso, registrando o motivo.</li>
             </ul>
          </StepCard>
          <StepCard icon={<History className="w-6 h-6" />} title="Trilha de Auditoria (Logs)">
             <p>Toda ação realizada no painel master é registrada. Para ver o histórico de um agendamento, clique no botão <Badge variant="outline">Log</Badge>.</p>
             <p>Isso garante total transparência, mostrando quem alterou, o que foi alterado e quando.</p>
          </StepCard>
           <StepCard icon={<Bell className="w-6 h-6" />} title="Notificações Automáticas">
             <p>Quando você cria ou altera um agendamento como master, o sistema automaticamente notifica o cliente e o prestador por e-mail/SMS, mantendo todos informados.</p>
          </StepCard>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Portal Público de Agendamento (Visão do Cliente)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <p>A aba <Badge variant="secondary">Portal Público</Badge> mostra exatamente o que seu cliente vê. O processo para ele é simples:</p>
           <StepCard icon={<span className="font-bold text-lg">1</span>} title="Escolher Serviço e Prestador">
             <p>O cliente seleciona o serviço desejado e, em seguida, o profissional de sua preferência (dentre os que oferecem aquele serviço).</p>
          </StepCard>
           <StepCard icon={<span className="font-bold text-lg">2</span>} title="Selecionar Data e Horário">
             <p>O sistema exibe o calendário e os horários disponíveis, já considerando a agenda do prestador e a duração do serviço. O cliente clica no melhor horário para ele.</p>
          </StepCard>
           <StepCard icon={<span className="font-bold text-lg">3</span>} title="Preencher Dados e Confirmar">
             <p>Por fim, o cliente informa seus dados (nome, e-mail, telefone) e confirma o agendamento. Ele receberá um e-mail de confirmação instantaneamente.</p>
          </StepCard>
        </CardContent>
      </Card>
    </div>
  );
}