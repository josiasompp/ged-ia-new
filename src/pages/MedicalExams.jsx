
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { MedicalExam } from "@/api/entities";
import { MedicalIntegrationConfig } from "@/api/entities";
import { Employee } from "@/api/entities";
import { User } from "@/api/entities";

import MedicalExamList from "../components/medical/MedicalExamList";
import MedicalExamForm from "../components/medical/MedicalExamForm";
import MedicalIntegrationManager from "../components/medical/MedicalIntegrationManager";
import MedicalDashboard from "../components/medical/MedicalDashboard";
import ESocialEventManager from "../components/medical/ESocialEventManager";

export default function MedicalExams() {
  const [medicalExams, setMedicalExams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [integrationConfigs, setIntegrationConfigs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Saúde Ocupacional | Sistema Integrado";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [examsData, employeesData, configsData] = await Promise.all([
        MedicalExam.list("-scheduled_date", 200),
        Employee.list("-created_date", 500),
        MedicalIntegrationConfig.list()
      ]);

      setMedicalExams(examsData);
      setEmployees(employeesData);
      setIntegrationConfigs(configsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleCreateExam = () => {
    setSelectedExam(null);
    setShowExamForm(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowExamForm(true);
  };

  const handleSaveExam = async (examData) => {
    try {
      if (selectedExam) {
        await MedicalExam.update(selectedExam.id, examData);
      } else {
        await MedicalExam.create({
          ...examData,
          company_id: currentUser?.company_id || "default_company"
        });
      }
      setShowExamForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar exame:", error);
    }
  };

  const getMedicalStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    const scheduledToday = medicalExams.filter(exam => 
      exam.scheduled_date?.startsWith(today)
    ).length;
    
    const pendingASO = medicalExams.filter(exam => 
      exam.status === 'pendente_aso'
    ).length;
    
    const completedThisMonth = medicalExams.filter(exam => 
      exam.status === 'concluido' && 
      exam.exam_date?.startsWith(thisMonth)
    ).length;
    
    const overdueExams = medicalExams.filter(exam => {
      if (!exam.scheduled_date) return false;
      const scheduledDate = new Date(exam.scheduled_date);
      const now = new Date();
      return scheduledDate < now && ['agendado', 'reagendado'].includes(exam.status);
    }).length;

    const examsByType = {
      admissional: medicalExams.filter(e => e.exam_type === 'admissional').length,
      periodico: medicalExams.filter(e => e.exam_type === 'periodico').length,
      mudanca_funcao: medicalExams.filter(e => e.exam_type === 'mudanca_funcao').length,
      demissional: medicalExams.filter(e => e.exam_type === 'demissional').length,
      retorno_afastamento: medicalExams.filter(e => e.exam_type === 'retorno_afastamento').length
    };

    return {
      scheduledToday,
      pendingASO,
      completedThisMonth,
      overdueExams,
      totalExams: medicalExams.length,
      examsByType,
      activeIntegrations: integrationConfigs.filter(c => c.is_active).length
    };
  };

  const stats = getMedicalStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Saúde Ocupacional
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Sistema integrado para gestão completa da saúde ocupacional
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>🏥 {stats.totalExams} exames</span>
            <span>📅 {stats.scheduledToday} hoje</span>
            <span>⚕️ {stats.activeIntegrations} integrações ativas</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={() => setActiveTab("integrations")}
            variant="outline"
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurar Integrações
          </Button>
          <Button 
            onClick={() => setActiveTab("esocial")}
            variant="outline"
            className="gap-2 border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
          >
            <Upload className="w-4 h-4" />
            eSocial
          </Button>
          <Button 
            onClick={handleCreateExam}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            Agendar Exame
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Agendados Hoje</p>
                <div className="text-2xl font-bold text-blue-700 mt-1">{stats.scheduledToday}</div>
                <p className="text-xs text-blue-500 mt-1">Exames do dia</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pendente ASO</p>
                <div className="text-2xl font-bold text-amber-700 mt-1">{stats.pendingASO}</div>
                <p className="text-xs text-amber-500 mt-1">Aguardando documento</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Concluídos</p>
                <div className="text-2xl font-bold text-green-700 mt-1">{stats.completedThisMonth}</div>
                <p className="text-xs text-green-500 mt-1">Este mês</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Em Atraso</p>
                <div className="text-2xl font-bold text-red-700 mt-1">{stats.overdueExams}</div>
                <p className="text-xs text-red-500 mt-1">Exames vencidos</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Integrações</p>
                <div className="text-2xl font-bold text-purple-700 mt-1">{stats.activeIntegrations}</div>
                <p className="text-xs text-purple-500 mt-1">Sistemas ativos</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-medium">Total</p>
                <div className="text-2xl font-bold text-cyan-700 mt-1">{stats.totalExams}</div>
                <p className="text-xs text-cyan-500 mt-1">Todos os exames</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-[800px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Exames</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agendamentos</span>
            </TabsTrigger>
            <TabsTrigger value="aso" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">ASOs</span>
            </TabsTrigger>
            <TabsTrigger value="esocial" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">eSocial</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Integrações</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <MedicalDashboard
            exams={medicalExams}
            employees={employees}
            integrationConfigs={integrationConfigs}
            stats={stats}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <MedicalExamList
            exams={medicalExams}
            employees={employees}
            currentUser={currentUser}
            onEdit={handleEditExam}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <MedicalExamList
            exams={medicalExams.filter(exam => ['agendado', 'reagendado'].includes(exam.status))}
            employees={employees}
            currentUser={currentUser}
            onEdit={handleEditExam}
            onRefresh={loadData}
            isLoading={isLoading}
            viewMode="schedule"
          />
        </TabsContent>

        <TabsContent value="aso" className="space-y-4">
          <MedicalExamList
            exams={medicalExams.filter(exam => exam.aso_document)}
            employees={employees}
            currentUser={currentUser}
            onEdit={handleEditExam}
            onRefresh={loadData}
            isLoading={isLoading}
            viewMode="aso"
          />
        </TabsContent>

        <TabsContent value="esocial" className="space-y-4">
          <ESocialEventManager
            exams={medicalExams}
            employees={employees}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <MedicalIntegrationManager
            configs={integrationConfigs}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Exam Form Modal */}
      {showExamForm && (
        <MedicalExamForm
          exam={selectedExam}
          employees={employees}
          integrationConfigs={integrationConfigs}
          onSave={handleSaveExam}
          onClose={() => setShowExamForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
