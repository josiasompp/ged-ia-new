
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import {
  Users,
  Clock,
  UserPlus,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  MapPin,
  Camera,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Timer,
  TrendingUp,
  Download,
  Activity,
  Shield,
  Globe,
  ClipboardList, // New
  CalendarDays,  // New
  ShieldCheck    // New
} from "lucide-react";
import { Employee } from "@/api/entities";
import { TimeEntry } from "@/api/entities";
import { HiringProcess } from "@/api/entities";
import { VacationRequest } from "@/api/entities";
import { WorkSchedule } from "@/api/entities";
import { Payroll } from "@/api/entities";
import { User } from "@/api/entities";
import { Department } from "@/api/entities";

import EmployeeList from "../components/hr/EmployeeList";
import EmployeeForm from "../components/hr/EmployeeForm";
import TimeEntryManager from "../components/hr/TimeEntryManager";
import HiringManager from "../components/hr/HiringManager";
import VacationManager from "../components/hr/VacationManager";
import PayrollManager from "../components/hr/PayrollManager";
import WorkScheduleManager from "../components/hr/WorkScheduleManager";
import HRDashboard from "../components/hr/HRDashboard";
import TimeClockInterface from "../components/hr/TimeClockInterface";
import EmployeeControlDashboard from "../components/hr/EmployeeControlDashboard";
import OnlineHiringPortal from "../components/hr/OnlineHiringPortal";
import ComplianceManager from "../components/hr/ComplianceManager";

export default function HumanResources() {
  const [employees, setEmployees] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [hiringProcesses, setHiringProcesses] = useState([]);
  const [vacationRequests, setVacationRequests] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { toast } = useToast();

  const handleExportToXLSX = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A exportação para Excel será implementada no backend. Formatos disponíveis: Excel, CSV, PDF.",
      variant: "info",
    });
  };

  const handleAdvancedReports = () => {
    toast({
      title: "Relatórios Avançados",
      description: "Em breve: Relatórios de produtividade, análise de presença e relatórios gerenciais.",
    });
  };

  useEffect(() => {
    loadData();
    loadCurrentUser();

    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
    
    document.title = "RHR - Reestruturação Completa do Módulo de Ponto";
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
      const [
        employeesData,
        timeEntriesData,
        hiringData,
        vacationsData,
        schedulesData,
        payrollsData,
        departmentsData
      ] = await Promise.all([
        Employee.list("-created_date", 200),
        TimeEntry.list("-created_date", 500),
        HiringProcess.list("-created_date", 100),
        VacationRequest.list("-created_date", 100),
        WorkSchedule.list("-created_date"),
        Payroll.list("-created_date", 100),
        Department.list()
      ]);

      setEmployees(employeesData);
      setTimeEntries(timeEntriesData);
      setHiringProcesses(hiringData);
      setVacationRequests(vacationsData);
      setWorkSchedules(schedulesData);
      setPayrolls(payrollsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Erro ao carregar dados de RH:", error);
    }
    setIsLoading(false);
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (selectedEmployee) {
        await Employee.update(selectedEmployee.id, employeeData);
      } else {
        await Employee.create({
          ...employeeData,
          company_id: currentUser?.company_id || "default_company",
          employee_code: `EMP${Date.now()}`,
          status: "ativo"
        });
      }
      setShowEmployeeForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const getHRStats = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'ativo').length;
    const totalEmployees = employees.length;
    const pendingHires = hiringProcesses.filter(hp => hp.status === 'documentos_pendentes' || hp.status === 'em_analise').length;
    const pendingVacations = vacationRequests.filter(vr => vr.status === 'solicitada').length;

    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(te => te.entry_date === today);

    const employeesWithEntries = new Map();
    todayEntries.forEach(entry => {
      if (!employeesWithEntries.has(entry.employee_id)) {
        employeesWithEntries.set(entry.employee_id, []);
      }
      employeesWithEntries.get(entry.employee_id).push(entry);
    });

    let activeShifts = 0;
    employeesWithEntries.forEach((entries) => {
      const sortedEntries = entries.sort((a, b) => b.entry_time.localeCompare(a.entry_time));
      if (sortedEntries[0]?.entry_type === 'entrada') {
        activeShifts++;
      }
    });

    const pendingApprovals = timeEntries.filter(te => te.status === 'pendente_aprovacao').length;

    const employeesOnVacation = employees.filter(emp => emp.status === 'ferias').length;
    const employeesOnLeave = employees.filter(emp => emp.status === 'licenca').length;
    const recentHires = employees.filter(emp => {
      if (!emp.hire_date) return false;
      const hireDate = new Date(emp.hire_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate >= thirtyDaysAgo;
    }).length;

    return {
      activeEmployees,
      totalEmployees,
      pendingHires,
      pendingVacations,
      activeShifts,
      pendingApprovals,
      employeesOnVacation,
      employeesOnLeave,
      recentHires,
      onlineEmployees: Math.floor(activeEmployees * 0.3),
      avgAttendance: activeEmployees > 0 ? Math.round((activeShifts / activeEmployees) * 100) : 0
    };
  };

  const stats = getHRStats();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Recursos Humanos
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-base lg:text-lg">
            Sistema completo de gestão de pessoal com IA e automação
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📊 {stats.totalEmployees} funcionários</span>
            <span>🏢 {departments.length} departamentos</span>
            <span>⏰ {stats.activeShifts} em expediente</span>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <Button
            onClick={handleAdvancedReports}
            variant="outline"
            className="gap-2 text-xs sm:text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </Button>
          <Button
            onClick={handleExportToXLSX}
            variant="outline"
            className="gap-2 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button
            onClick={() => setActiveTab("time-clock")}
            variant="outline"
            className="gap-2 border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white text-xs sm:text-sm"
          >
            <Clock className="w-4 h-4" />
            Bater Ponto
          </Button>
          <Button
            onClick={handleCreateEmployee}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg text-xs sm:text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Funcionários Ativos</p>
                <div className="text-2xl font-bold text-blue-700 mt-1">{stats.activeEmployees}</div>
                <p className="text-xs text-blue-500 mt-1">Total: {stats.totalEmployees}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Em Expediente</p>
                <div className="text-2xl font-bold text-green-700 mt-1">{stats.activeShifts}</div>
                <p className="text-xs text-green-500 mt-1">Presença: {stats.avgAttendance}%</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Contratações</p>
                <div className="text-2xl font-bold text-amber-700 mt-1">{stats.pendingHires}</div>
                <p className="text-xs text-amber-500 mt-1">Em andamento</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Aprovações</p>
                <div className="text-2xl font-bold text-purple-700 mt-1">{stats.pendingApprovals + stats.pendingVacations}</div>
                <p className="text-xs text-purple-500 mt-1">Pendentes</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-medium">Em Férias</p>
                <div className="text-2xl font-bold text-cyan-700 mt-1">{stats.employeesOnVacation}</div>
                <p className="text-xs text-cyan-500 mt-1">Licenças: {stats.employeesOnLeave}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm font-medium">Contratações Recentes</p>
                <div className="text-2xl font-bold text-rose-700 mt-1">{stats.recentHires}</div>
                <p className="text-xs text-rose-500 mt-1">Últimos 30 dias</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Funcionários</span>
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Controle</span>
            </TabsTrigger>
            <TabsTrigger value="online-hiring" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Contratação</span>
            </TabsTrigger>
            <TabsTrigger value="time-clock" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Ponto</span>
            </TabsTrigger>
            <TabsTrigger value="time-entries" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Gestão Ponto</span>
            </TabsTrigger>
            <TabsTrigger value="work-schedules" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Turnos</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Conformidade</span>
            </TabsTrigger>
            <TabsTrigger value="hiring" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Admissão</span>
            </TabsTrigger>
            <TabsTrigger value="vacations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Férias</span>
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Folha</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <HRDashboard
            employees={employees}
            timeEntries={timeEntries}
            hiringProcesses={hiringProcesses}
            vacationRequests={vacationRequests}
            payrolls={payrolls}
            stats={stats}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <EmployeeList
            employees={employees}
            departments={departments}
            currentUser={currentUser}
            onEdit={handleEditEmployee}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <EmployeeControlDashboard
            employees={employees}
            currentUser={currentUser}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="online-hiring" className="space-y-4">
          <OnlineHiringPortal
            hiringProcesses={hiringProcesses}
            employees={employees}
            departments={departments}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="time-clock" className="space-y-4">
          <TimeClockInterface
            employees={employees}
            currentUser={currentUser}
            onTimeEntry={loadData}
          />
        </TabsContent>

        <TabsContent value="time-entries" className="space-y-4">
          <TimeEntryManager
            timeEntries={timeEntries}
            employees={employees}
            workSchedules={workSchedules}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="work-schedules" className="space-y-4">
          <WorkScheduleManager
            workSchedules={workSchedules}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceManager
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="hiring" className="space-y-4">
          <HiringManager
            hiringProcesses={hiringProcesses}
            employees={employees}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="vacations" className="space-y-4">
          <VacationManager
            vacationRequests={vacationRequests}
            employees={employees}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollManager
            payrolls={payrolls}
            employees={employees}
            timeEntries={timeEntries}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {showEmployeeForm && (
        <EmployeeForm
          employee={selectedEmployee}
          workSchedules={workSchedules}
          departments={departments}
          employees={employees}
          onSave={handleSaveEmployee}
          onClose={() => setShowEmployeeForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
