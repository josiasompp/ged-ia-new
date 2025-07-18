
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Plus,
  FileText,
  CheckSquare,
  Calendar,
  DollarSign,
  List,
  Kanban,
  Settings
} from "lucide-react";
import { Lead } from "@/api/entities";
import { CrmActivity } from "@/api/entities";
import { Proposal } from "@/api/entities";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { CrmPipeline } from "@/api/entities";
import { Deal } from "@/api/entities";
import { CrmContact } from "@/api/entities";

import LeadList from "../components/crm/LeadList";
import LeadForm from "../components/crm/LeadForm";
import ActivityTimeline from "../components/crm/ActivityTimeline";
import CrmDashboard from "../components/crm/CrmDashboard";
import PipelineManager from "../components/crm/PipelineManager";
import PipelineKanbanView from "../components/crm/PipelineKanbanView";
import { useToast } from "@/components/ui/use-toast";
import { cachedAPICall, apiCache } from "../components/utils/apiCache";

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leads");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [pipelines, setPipelines] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeLeadView, setActiveLeadView] = useState("kanban");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - CRM | Gestão de Relacionamento com Clientes";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      toast({
        title: "Erro ao Carregar Usuário",
        description: "Não foi possível carregar as informações do usuário atual.",
        variant: "destructive",
      });
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar dados com cache e rate limiting
      const dataPromises = [
        cachedAPICall(Proposal, 'list', ["-created_date"]).catch(() => []),
        cachedAPICall(Task, 'list', ["-created_date"]).catch(() => []),
        cachedAPICall(User, 'list').catch(() => []),
        cachedAPICall(Lead, 'list', ["-created_date"]).catch(() => []),
        cachedAPICall(CrmActivity, 'list', ["-created_date"]).catch(() => []),
        cachedAPICall(CrmPipeline, 'list').catch(() => []),
        cachedAPICall(Deal, 'list', ["-created_date"]).catch(() => []),
        cachedAPICall(CrmContact, 'list', ["-created_date"]).catch(() => [])
      ];

      // Executar as chamadas em lotes para evitar rate limiting
      const batchSize = 3; // Number of parallel requests per batch
      const results = [];
      
      for (let i = 0; i < dataPromises.length; i += batchSize) {
        const batch = dataPromises.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
        
        // Pequena pausa entre lotes para evitar rate limiting
        // Only pause if there are more batches to process
        if (i + batchSize < dataPromises.length) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms pause
        }
      }

      const [proposalsData, tasksData, usersData, leadsData, activitiesData, pipelinesData, dealsData, contactsData] = results;

      setProposals(proposalsData);
      setTasks(tasksData);
      setUsers(usersData);
      setLeads(leadsData);
      setActivities(activitiesData);
      setPipelines(pipelinesData);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Erro ao carregar dados do CRM:", error);
      if (error.message.includes('Rate limit')) {
        toast({ 
          title: "Muitas Requisições", 
          description: "Aguarde um momento e tente novamente. O sistema está otimizando as chamadas.",
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Erro ao Carregar Dados", 
          description: "Não foi possível buscar os dados do CRM.", 
          variant: "destructive" 
        });
      }
    }
    setIsLoading(false);
  };
  
  const handleCreateLead = () => {
    setSelectedLead(null);
    setShowLeadForm(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadForm(true);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (selectedLead) {
        await Lead.update(selectedLead.id, leadData);
      } else {
        await Lead.create({
          ...leadData,
          company_id: currentUser?.company_id || "default_company"
        });
      }
      
      // Invalidar cache relacionado aos leads
      apiCache.invalidate('Lead');
      
      setShowLeadForm(false);
      loadData();
      toast({
        title: "Sucesso!",
        description: `Lead ${selectedLead ? "atualizado" : "criado"} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast({
        title: "Erro ao salvar lead",
        description: "Verifique se todos os campos estão preenchidos corretamente ou tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateLead = async (leadId, data) => {
    try {
      await Lead.update(leadId, data);
      
      // Invalidar cache relacionado aos leads
      apiCache.invalidate('Lead');
      
      await loadData();
      toast({
        title: "Lead Atualizado",
        description: "O status do lead foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível mover o lead.",
        variant: "destructive",
      });
    }
  };

  const handleConvertToProposal = async (lead) => {
    try {
      const proposalData = {
        title: `Proposta para ${lead.company_name || lead.name}`,
        client_name: lead.name, 
        client_email: lead.email, 
        client_phone: lead.phone,
        client_company: lead.company_name, 
        category: "servicos", 
        total_value: lead.estimated_value,
        salesperson_email: lead.assigned_to, 
        company_id: currentUser?.company_id || "default_company",
        status: "rascunho"
      };
      
      await Proposal.create(proposalData);
      await Lead.update(lead.id, { status: "proposta_enviada", stage: "proposta" });
      await Task.create({
        title: `Follow-up: Proposta para ${lead.name}`,
        description: `Acompanhar proposta enviada para ${lead.name} (${lead.company_name})`,
        type: "tarefa", 
        priority: "alta", 
        status: "pendente", 
        assigned_to: lead.assigned_to,
        created_by: currentUser?.email, 
        company_id: currentUser?.company_id || "default_company",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      // Invalidar caches relacionados
      apiCache.invalidate('Lead');
      apiCache.invalidate('Proposal');
      apiCache.invalidate('Task');
      
      loadData();
      toast({
        title: "Proposta criada com sucesso!",
        description: "Uma tarefa de follow-up foi agendada."
      });
    } catch (error) {
      console.error("Erro ao converter lead:", error);
      toast({
        title: "Erro ao criar proposta",
        description: "Tente novamente. Verifique os dados do lead.",
        variant: "destructive"
      });
    }
  };

  const getStatsData = () => {
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.is_qualified).length;
    const convertedLeads = leads.filter(l => l.status === 'ganho').length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0);
    return {
      totalLeads, qualifiedLeads, convertedLeads, totalValue,
      conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0
    };
  };

  const stats = getStatsData();
  const defaultPipeline = pipelines.find(p => p.type === 'vendas' && p.is_default) || pipelines.find(p => p.type === 'vendas') || pipelines[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              CRM - Customer Relationship Management
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Gerencie relacionamentos e converta leads em clientes</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleCreateLead}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Leads</p>
              <div className="text-2xl font-bold text-blue-700">{stats.totalLeads}</div>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Qualificados</p>
              <div className="text-2xl font-bold text-green-700">{stats.qualifiedLeads}</div>
            </div>
            <CheckSquare className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Convertidos</p>
              <div className="text-2xl font-bold text-purple-700">{stats.convertedLeads}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Taxa Conversão</p>
              <div className="text-2xl font-bold text-amber-700">{stats.conversionRate}%</div>
            </div>
            <Calendar className="w-8 h-8 text-amber-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Valor Pipeline</p>
              <div className="text-xl font-bold text-emerald-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalValue)}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">
            Leads
            {leads.length > 0 && (<Badge variant="secondary" className="ml-2">{leads.length}</Badge>)}
          </TabsTrigger>
          <TabsTrigger value="activities">
            Atividades
            {activities.length > 0 && (<Badge variant="secondary" className="ml-2">{activities.length}</Badge>)}
          </TabsTrigger>
          <TabsTrigger value="config">
             <Settings className="w-4 h-4 mr-2"/>
            Configurações
          </TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <CrmDashboard 
            leads={leads} activities={activities} proposals={proposals}
            tasks={tasks} deals={deals} contacts={contacts} pipelines={pipelines}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
           <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                <Button variant={activeLeadView === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveLeadView('kanban')} className="gap-2">
                    <Kanban className="w-4 h-4"/> Kanban
                </Button>
                <Button variant={activeLeadView === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveLeadView('list')} className="gap-2">
                    <List className="w-4 h-4"/> Lista
                </Button>
            </div>
          </div>
          {activeLeadView === 'kanban' ? (
              <PipelineKanbanView
                leads={leads}
                pipeline={defaultPipeline}
                users={users}
                onUpdateLead={handleUpdateLead}
                onNewLead={handleCreateLead}
                onEditLead={handleEditLead}
              />
          ) : (
             <LeadList
                leads={leads}
                onEditLead={handleEditLead}
                onConvertToProposal={handleConvertToProposal}
                onRefresh={loadData}
                isLoading={isLoading}
             />
          )}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <ActivityTimeline
            activities={activities} leads={leads} currentUser={currentUser}
            onRefresh={loadData} isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4">
            <PipelineManager
                pipelines={pipelines}
                onRefresh={loadData}
                currentUser={currentUser}
                isLoading={isLoading}
            />
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Integração com Propostas e Tarefas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" />Propostas Vinculadas</h4>
                  <p className="text-sm text-gray-600 mb-3">{proposals.length} propostas criadas a partir de leads</p>
                  <Badge variant="outline">{proposals.filter(p => p.status === 'aceita').length} Aceitas</Badge>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4" />Tarefas de Follow-up</h4>
                  <p className="text-sm text-gray-600 mb-3">{tasks.filter(t => t.title.includes('Follow-up')).length} tarefas de acompanhamento</p>
                  <Badge variant="outline">{tasks.filter(t => t.status === 'pendente').length} Pendentes</Badge>
                </Card>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Como Funciona a Integração:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Quando um lead avança no pipeline, propostas são criadas automaticamente</li>
                  <li>• Tarefas de follow-up são agendadas para acompanhar leads qualificados</li>
                  <li>• Atividades do CRM são sincronizadas com o sistema de tarefas</li>
                  <li>• Propostas aceitas atualizam automaticamente o status do lead</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showLeadForm && (
        <LeadForm
          lead={selectedLead} users={users}
          onSave={handleSaveLead} onClose={() => setShowLeadForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
