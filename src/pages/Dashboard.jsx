
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Search,
  BarChart3,
  Briefcase,
  Layers // Added Layers icon
} from "lucide-react";
import { Document } from "@/api/entities";
import { Company } from "@/api/entities";
import { User } from "@/api/entities";
import { AuditLog } from "@/api/entities";
import { Employee } from "@/api/entities";
import { HiringProcess } from "@/api/entities";
import { VacationRequest } from "@/api/entities";
import { CompanyGroup } from "@/api/entities"; // Added CompanyGroup entity

import StatsCard from "../components/dashboard/StatsCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import CompanyOverview from "../components/dashboard/CompanyOverview";
import DocumentPreview from "../components/dashboard/DocumentPreview";
import HRSummary from "../components/dashboard/HRSummary";
import ProactiveAI from "../components/ai/ProactiveAI"; // New import for ProactiveAI

export default function Dashboard() {
  // Data states
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [hiringProcesses, setHiringProcesses] = useState([]);
  const [vacationRequests, setVacationRequests] = useState([]);

  // UI and User states
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [previewingDoc, setPreviewingDoc] = useState(null);
  const [dashboardTitle, setDashboardTitle] = useState("FIRSTDOCY GED AI");
  const [dashboardSubtitle, setDashboardSubtitle] = useState("Visão Geral do Sistema");

  useEffect(() => {
    loadDashboardData();
    document.title = "FIRSTDOCY GED AI - Dashboard | Gestão Inteligente";
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);

      let companyIds = [];
      let companyData = [];

      // Determine the scope of data to be fetched based on user's company or company group
      if (userData.company_group_id && isValidObjectId(userData.company_group_id)) {
        try {
          const group = await CompanyGroup.get(userData.company_group_id);
          const companiesInGroup = await Company.filter({ group_id: userData.company_group_id });
          companyIds = companiesInGroup.map(c => c.id);
          companyData = companiesInGroup;
          setDashboardTitle(`Dashboard do Grupo: ${group.name}`);
          setDashboardSubtitle(`Visão consolidada de ${companyIds.length} empresas.`);
        } catch (error) {
          console.warn("Erro ao carregar grupo da empresa:", error);
          setDashboardTitle("Dashboard");
          setDashboardSubtitle("Erro ao carregar dados do grupo.");
        }
      } else if (userData.company_id && isValidObjectId(userData.company_id)) {
        try {
          const companies = await Company.filter({ id: userData.company_id });
          if (companies && companies.length > 0) {
              const company = companies[0];
              companyIds = [company.id];
              companyData = [company];
              setDashboardTitle(`Dashboard: ${company.name}`);
              setDashboardSubtitle("Visão geral da sua empresa.");
          } else {
              setDashboardTitle(`Dashboard`);
              setDashboardSubtitle("Empresa não encontrada.");
          }
        } catch (error) {
          console.warn("Erro ao carregar empresa do usuário:", error);
          setDashboardTitle("Dashboard");
          setDashboardSubtitle("Erro ao carregar dados da empresa.");
        }
      } else {
        // System Administrator, fetch all data
        try {
          companyData = await Company.list("-created_date", 10);
          companyIds = companyData.map(c => c.id);
          setDashboardTitle("Dashboard Administrativo Global");
          setDashboardSubtitle("Visão geral de toda a plataforma.");
        } catch (error) {
          console.warn("Erro ao carregar empresas:", error);
          setDashboardTitle("Dashboard");
          setDashboardSubtitle("Erro ao carregar dados do sistema.");
        }
      }

      // Create filter based on determined company scope
      const baseFilter = companyIds.length > 0 ? { company_id: { '$in': companyIds } } : {};

      // For Users, if admin, fetch all users. Otherwise, fetch users related to the company/group.
      const userFilter = userData.is_admin_global ? {} : baseFilter;

      try {
        const [
          docsData,
          usersData,
          logsData,
          employeesData,
          hiringData,
          vacationsData
        ] = await Promise.all([
          Document.filter(baseFilter, "-created_date", 20),
          User.filter(userFilter, "-created_date", 15),
          AuditLog.filter(baseFilter, "-created_date", 50),
          Employee.filter(baseFilter, "-created_date", 200),
          HiringProcess.filter(baseFilter, "-created_date", 50),
          VacationRequest.filter(baseFilter, "-created_date", 50)
        ]);

        setCompanies(companyData || []);
        setDocuments(docsData || []);
        setUsers(usersData || []);
        setAuditLogs(logsData || []);
        setEmployees(employeesData || []);
        setHiringProcesses(hiringData || []);
        setVacationRequests(vacationsData || []);
      } catch (error) {
        console.warn("Erro ao carregar dados do dashboard:", error);
        // Set empty arrays to avoid undefined errors
        setCompanies([]);
        setDocuments([]);
        setUsers([]);
        setAuditLogs([]);
        setEmployees([]);
        setHiringProcesses([]);
        setVacationRequests([]);
      }

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setDashboardTitle("Dashboard");
      setDashboardSubtitle("Erro ao carregar dados do sistema.");
    }
    setIsLoading(false);
  };

  // Helper function to validate ID format
  const isValidObjectId = (id) => {
    return id && typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
  };

  const handleAIActionTaken = (suggestion) => {
    // Navegar para a página apropriada baseada na sugestão
    switch (suggestion.type) {
      case 'follow_up':
        if (suggestion.entity_type === 'lead') {
          window.location.href = createPageUrl(`CRM?leadId=${suggestion.entity_id}`);
        }
        break;
      case 'send_proposal':
        window.location.href = createPageUrl("Proposals");
        break;
      case 'schedule_meeting':
        window.location.href = createPageUrl("BookingSystem");
        break;
      case 'document_reminder':
        window.location.href = createPageUrl("Documents");
        break;
      default:
        break;
    }
  };

  const stats = {
    totalDocuments: documents.length,
    pendingApprovals: documents.filter(doc => doc.status === 'pendente_aprovacao').length,
    activeCompanies: companies.filter(comp => comp.is_active).length,
    activeEmployees: employees.filter(emp => emp.status === 'ativo').length,
    totalUsers: users.length,
    documentsThisMonth: documents.filter(doc => {
      const created = new Date(doc.created_date);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    storageUsed: (documents.reduce((total, doc) => total + (doc.file_size || 0), 0) / (1024 * 1024 * 1024)).toFixed(2)
  };

  const handleDocumentUpdate = () => {
    loadDashboardData();
  };

  return (
    <div className="p-6 space-y-6 firstdocy-protected">
      {/* FIRSTDOCY Proprietary System Markers - Protected Content */}
      <div style={{display: 'none'}}
           data-system="FIRSTDOCY_GED_AI_PROPRIETARY"
           data-version="1.0.0"
           data-protection="MAXIMUM_SECURITY_ACTIVE"
           data-owner="FIRSTDOCY_EXCLUSIVE"
           data-license="PROPRIETARY_COPYRIGHT_PROTECTED">
        {/* FIRSTDOCY Unique System Identifier - DO NOT COPY */}
        FIRSTDOCY_PROPRIETARY_DASHBOARD_COMPONENT
      </div>

      {/* Hidden watermarks for system identification */}
      <span style={{display: 'none', visibility: 'hidden'}} className="firstdocy-watermark">
        FIRSTDOCY_GED_AI_DASHBOARD_PROPRIETARY_COMPONENT
      </span>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              {dashboardTitle} {/* Dynamic title */}
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">{dashboardSubtitle}</p> {/* Dynamic subtitle */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Sistema operacional</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("Documents")}>
            <Button variant="outline" className="gap-2 border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white">
              <Search className="w-4 h-4" />
              Buscar Documentos
            </Button>
          </Link>
          <Link to={createPageUrl("Documents")}>
            <Button className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg">
              <Upload className="w-4 h-4" />
              Novo Documento
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Documentos"
          value={stats.totalDocuments}
          icon={FileText}
          trend={`+${stats.documentsThisMonth} este mês`}
          color="firstdocy"
          isLoading={isLoading}
        />
        <StatsCard
          title="Funcionários Ativos"
          value={stats.activeEmployees}
          icon={Briefcase}
          trend="Total de colaboradores"
          color="purple"
          isLoading={isLoading}
        />
        <StatsCard
          title="Empresas Ativas"
          value={stats.activeCompanies}
          icon={Building2}
          trend="Multi-tenant"
          color="firstdocy_green"
          isLoading={isLoading}
        />
        <StatsCard
          title="Pendente Aprovação"
          value={stats.pendingApprovals}
          icon={Clock}
          trend="Documentos e tarefas"
          color="amber"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentDocuments
            documents={documents}
            isLoading={isLoading}
            onRefresh={loadDashboardData}
            onPreview={setPreviewingDoc}
          />
        </div>

        <div className="space-y-6">
          {/* Novo widget de IA Proativa */}
          <ProactiveAI
            user={currentUser}
            onActionTaken={handleAIActionTaken}
          />

          <ActivityFeed
            auditLogs={auditLogs}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <CompanyOverview
                companies={companies}
                isLoading={isLoading}
            />
        </div>
        <div>
            <HRSummary
                employees={employees}
                hiringProcesses={hiringProcesses}
                vacationRequests={vacationRequests}
                isLoading={isLoading}
            />
        </div>
      </div>

      {previewingDoc && (
        <DocumentPreview
          key={previewingDoc.id}
          document={previewingDoc}
          onClose={() => setPreviewingDoc(null)}
          onUpdate={handleDocumentUpdate}
        />
      )}
    </div>
  );
}
