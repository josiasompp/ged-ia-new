
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Building2, 
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { Proposal } from "@/api/entities";
import { AuditLog } from "@/api/entities";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import ReportCard from "../components/reports/ReportCard";
import DocumentsReport from "../components/reports/DocumentsReport";
import UsersReport from "../components/reports/UsersReport";
import ProposalsReport from "../components/reports/ProposalsReport";
import ActivityReport from "../components/reports/ActivityReport";

export default function Reports() {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30_days");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Relatórios | Analytics e Insights";
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
      const [docsData, usersData, companiesData, proposalsData, auditData] = await Promise.all([
        Document.list("-created_date", 500),
        User.list("-created_date"),
        Company.list("-created_date"),
        Proposal.list("-created_date", 200),
        AuditLog.list("-created_date", 1000)
      ]);

      setDocuments(docsData);
      setUsers(usersData);
      setCompanies(companiesData);
      setProposals(proposalsData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error("Erro ao carregar dados dos relatórios:", error);
    }
    setIsLoading(false);
  };

  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case "7_days":
        return { start: subDays(now, 7), end: now };
      case "30_days":
        return { start: subDays(now, 30), end: now };
      case "90_days":
        return { start: subDays(now, 90), end: now };
      case "this_month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const filterByPeriod = (items, dateField = 'created_date') => {
    const { start, end } = getDateRange();
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const calculateGrowth = (items, dateField) => {
    const { start } = getDateRange();
    const previousPeriodStart = new Date(start.getTime() - (Date.now() - start.getTime()));
    
    const currentPeriod = items.filter(item => {
      const date = new Date(item[dateField]);
      return date >= start;
    }).length;

    const previousPeriod = items.filter(item => {
      const date = new Date(item[dateField]);
      return date >= previousPeriodStart && date < start;
    }).length;

    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
  };
  
  const stats = () => {
    const filteredDocs = filterByPeriod(documents);
    const filteredUsers = filterByPeriod(users);
    const filteredProposals = filterByPeriod(proposals);
    const filteredAudit = filterByPeriod(auditLogs);

    return {
      documents: {
        total: filteredDocs.length,
        approved: filteredDocs.filter(d => d.status === 'aprovado').length,
        pending: filteredDocs.filter(d => d.status === 'pendente_aprovacao').length,
        growth: calculateGrowth(documents, 'created_date')
      },
      users: {
        total: filteredUsers.length,
        active: filteredUsers.filter(u => u.is_active).length,
        growth: calculateGrowth(users, 'created_date')
      },
      proposals: {
        total: filteredProposals.length,
        accepted: filteredProposals.filter(p => p.status === 'aceita').length,
        totalValue: filteredProposals.reduce((sum, p) => sum + (p.total_value || 0), 0),
        growth: calculateGrowth(proposals, 'created_date')
      },
      activity: {
        total: filteredAudit.length,
        views: filteredAudit.filter(a => a.action === 'visualizar').length,
        downloads: filteredAudit.filter(a => a.action === 'download').length
      }
    };
  };

  const currentStats = stats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Relatórios e Analytics
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Análise detalhada do desempenho do sistema</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7_days">Últimos 7 dias</SelectItem>
              <SelectItem value="30_days">Últimos 30 dias</SelectItem>
              <SelectItem value="90_days">Últimos 90 dias</SelectItem>
              <SelectItem value="this_month">Este mês</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Documentos"
          value={currentStats.documents.total}
          subtitle={`${currentStats.documents.approved} aprovados`}
          icon={FileText}
          growth={currentStats.documents.growth}
          color="blue"
          isLoading={isLoading}
        />
        <ReportCard
          title="Usuários Ativos"
          value={currentStats.users.active}
          subtitle={`${currentStats.users.total} total`}
          icon={Users}
          growth={currentStats.users.growth}
          color="green"
          isLoading={isLoading}
        />
        <ReportCard
          title="Propostas"
          value={currentStats.proposals.total}
          subtitle={`${currentStats.proposals.accepted} aceitas`}
          icon={BarChart3}
          growth={currentStats.proposals.growth}
          color="purple"
          isLoading={isLoading}
        />
        <ReportCard
          title="Valor de Propostas"
          value={`R$ ${(currentStats.proposals.totalValue / 1000).toFixed(0)}k`}
          subtitle="Valor total"
          icon={TrendingUp}
          growth={15}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DocumentsReport 
          documents={filterByPeriod(documents)}
          isLoading={isLoading}
        />
        <ProposalsReport 
          proposals={filterByPeriod(proposals)}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UsersReport 
          users={filterByPeriod(users)}
          companies={companies}
          isLoading={isLoading}
        />
        <ActivityReport 
          auditLogs={filterByPeriod(auditLogs)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
