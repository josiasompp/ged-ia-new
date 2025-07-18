
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Bot, FileBox, FileSignature, Target, Briefcase, CheckSquare, Truck, Zap, Stethoscope, Mail, MessageSquare, Clock, Calendar } from 'lucide-react';
import GedGuide from '../components/documentation/GedGuide';
import CdocGuide from '../components/documentation/CdocGuide';
import ProposalGuide from '../components/documentation/ProposalGuide';
import CrmGuide from '../components/documentation/CrmGuide';
import RhrGuide from '../components/documentation/RhrGuide';
import RhrPointGuide from '../components/documentation/RhrPointGuide';
import TasksApprovalsGuide from '../components/documentation/TasksApprovalsGuide';
import SignaturesGuide from '../components/documentation/SignaturesGuide';
import ServiceOrdersGuide from '../components/documentation/ServiceOrdersGuide';
import GoogleDriveAndAIGuide from '../components/documentation/GoogleDriveAndAIGuide';
import MedicalExamsGuide from '../components/documentation/MedicalExamsGuide';
import EmailConfigurationGuide from '../components/documentation/EmailConfigurationGuide';
import SupportChatGuide from '../components/documentation/SupportChatGuide';
import BookingSystemGuide from '../components/documentation/BookingSystemGuide'; // New import for BookingSystemGuide

export default function SystemDocumentation() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Documentação do Sistema";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
                Guias de Uso do Sistema
              </span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg">
              Documentação completa, políticas e guias práticos para usar todas as funcionalidades do FIRSTDOCY GED AI.
            </p>
          </div>
        </div>

        {/* Tabs Container */}
        <Card className="w-full">
          <CardContent className="p-0">
            <Tabs defaultValue="ged" className="w-full">
              {/* Responsive TabsList that wraps */}
              <div className="border-b bg-white px-2 sm:px-4 py-2">
                <TabsList className="flex flex-wrap h-auto bg-transparent p-0 gap-1 sm:gap-2">
                  <TabsTrigger 
                    value="overview" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Visão Geral</span>
                      <span className="sm:hidden">ISO</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="ged" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>GED</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="cdoc" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <FileBox className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>CDOC</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="service-orders" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Ordens de Serviço</span>
                      <span className="sm:hidden">O.S.</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="proposals" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <FileSignature className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">Propostas</span>
                      <span className="md:hidden">Props</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="crm" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>CRM</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="rhr" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>RHR</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="rhr-point" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Ponto RHR</span>
                      <span className="lg:hidden">Ponto</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="medical-exams" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Saúde Ocupacional</span>
                      <span className="lg:hidden">Saúde</span>
                    </div>
                  </TabsTrigger>

                  {/* New TabsTrigger for Booking System */}
                  <TabsTrigger 
                    value="booking-system" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Agendamentos</span>
                      <span className="lg:hidden">Agenda</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="tasks" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">Tarefas</span>
                      <span className="md:hidden">Tasks</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="signatures" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <FileSignature className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Assinaturas</span>
                      <span className="lg:hidden">Sign</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="integrations" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Integrações</span>
                      <span className="lg:hidden">IA</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="email-config" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Config. Email</span>
                      <span className="lg:hidden">Email</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="support-chat" 
                    className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Suporte</span>
                      <span className="lg:hidden">Chat</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Content Area */}
              <div className="p-4 sm:p-6">
                <TabsContent value="overview" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Política de Segurança da Informação e Padrões ISO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm sm:text-base">
                      <p>
                        O sistema FIRSTDOCY GED AI é desenvolvido seguindo as melhores práticas de segurança e gestão, alinhadas com os princípios das normas da família ISO/IEC 27001. Nosso compromisso é garantir a Confidencialidade, Integridade e Disponibilidade (CID) das informações dos nossos clientes.
                      </p>
                      <p>
                        A segurança da informação é parte integrante de todos os processos do FIRSTDOCY GED AI, desde a concepção até a operação. Implementamos controles rigorosos para proteger os dados contra acessos não autorizados, perdas, alterações indevidas ou destruição.
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold">Princípios Chave:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Confidencialidade:</strong> Assegurar que as informações sejam acessíveis apenas por indivíduos autorizados.
                        </li>
                        <li>
                          <strong>Integridade:</strong> Manter a exatidão e a completude das informações e métodos de processamento.
                        </li>
                        <li>
                          <strong>Disponibilidade:</strong> Garantir que os usuários autorizados tenham acesso à informação e aos ativos relacionados sempre que necessário.
                        </li>
                      </ul>
                      <h3 className="text-base sm:text-lg font-semibold">Conformidade ISO/IEC 27001:</h3>
                      <p>
                        Embora não sejamos formalmente certificados, nossas políticas e procedimentos internos são modelados nos requisitos da ISO/IEC 27001, a norma internacional para Sistemas de Gestão de Segurança da Informação (SGSI). Isso inclui:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Gestão de Riscos de Segurança da Informação.</li>
                        <li>Controles de Acesso Lógico e Físico.</li>
                        <li>Gestão de Incidentes de Segurança.</li>
                        <li>Conscientização e Treinamento em Segurança.</li>
                        <li>Segurança em Desenvolvimento e Manutenção de Sistemas.</li>
                      </ul>
                      <p>
                        Nosso objetivo é proporcionar um ambiente seguro e confiável para a gestão de documentos e processos, protegendo os ativos de informação dos nossos clientes e mantendo a continuidade dos negócios.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ged" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <GedGuide />
                  </div>
                </TabsContent>

                <TabsContent value="cdoc" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <CdocGuide />
                  </div>
                </TabsContent>

                <TabsContent value="service-orders" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <ServiceOrdersGuide />
                  </div>
                </TabsContent>
                
                <TabsContent value="proposals" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <ProposalGuide />
                  </div>
                </TabsContent>
                
                <TabsContent value="crm" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <CrmGuide />
                  </div>
                </TabsContent>
                
                <TabsContent value="rhr" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <RhrGuide />
                  </div>
                </TabsContent>

                <TabsContent value="rhr-point" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <RhrPointGuide />
                  </div>
                </TabsContent>

                <TabsContent value="medical-exams" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <MedicalExamsGuide />
                  </div>
                </TabsContent>

                {/* New TabsContent for Booking System */}
                <TabsContent value="booking-system" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <BookingSystemGuide />
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <TasksApprovalsGuide />
                  </div>
                </TabsContent>
                
                <TabsContent value="signatures" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <SignaturesGuide />
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <GoogleDriveAndAIGuide />
                  </div>
                </TabsContent>

                <TabsContent value="email-config" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <EmailConfigurationGuide />
                  </div>
                </TabsContent>

                <TabsContent value="support-chat" className="mt-0">
                  <div className="w-full overflow-hidden">
                    <SupportChatGuide />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
