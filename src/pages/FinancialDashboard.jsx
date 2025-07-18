import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Building2,
  BarChart3,
  Eye,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";
import { FinancialUsage } from "@/api/entities";
import { FinancialBill } from "@/api/entities";
import { Company } from "@/api/entities";
import { Department } from "@/api/entities";
import { User } from "@/api/entities";

import UsageAnalytics from "../components/financial/UsageAnalytics";
import CostBreakdown from "../components/financial/CostBreakdown";

export default function FinancialDashboard() {
  const [usageData, setUsageData] = useState([]);
  const [bills, setBills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  useEffect(() => {
    loadFinancialData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Dashboard Financeiro | Visualização de Custos";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadFinancialData = async () => {
    setIsLoading(true);
    try {
      // Filtrar dados apenas para a empresa do usuário
      const companyFilter = currentUser?.company_id ? { company_id: currentUser.company_id } : {};
      
      const [
        usageDataResult,
        billsData,
        companiesData,
        departmentsData
      ] = await Promise.all([
        FinancialUsage.filter(companyFilter, "-usage_period", 500),
        FinancialBill.filter(companyFilter, "-created_date", 100),
        currentUser?.company_id ? [await Company.get(currentUser.company_id)] : Company.list("-created_date", 10),
        Department.filter(companyFilter)
      ]);

      setUsageData(usageDataResult);
      setBills(billsData);
      setCompanies(companiesData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
    setIsLoading(false);
  };

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyUsage = usageData.filter(usage => 
      usage.usage_period && usage.usage_period.startsWith(currentMonth)
    );

    const totalCost = monthlyUsage.reduce((sum, usage) => sum + (usage.total_cost || 0), 0);
    const totalOverage = monthlyUsage.reduce((sum, usage) => sum + (usage.overage_cost || 0), 0);
    const totalUsageItems = monthlyUsage.length;
    const avgDailyCost = totalCost / new Date().getDate();

    return {
      totalCost,
      totalOverage,
      totalUsageItems,
      avgDailyCost
    };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Dashboard Financeiro
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Visualização de custos e uso dos recursos da sua empresa
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Eye className="w-4 h-4" />
          Modo Visualização
        </Badge>
      </div>

      {/* Alerta informativo */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Esta é uma visualização dos custos da sua empresa. Para configurações avançadas de preços e faturamento, entre em contato com o administrador do sistema.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Custo Mensal</p>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  R$ {stats.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-green-500 mt-1">Período atual</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Excesso de Uso</p>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  R$ {stats.totalOverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-amber-500 mt-1">Cobranças extras</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Média Diária</p>
                <div className="text-2xl font-bold text-blue-700 mt-1">
                  R$ {stats.avgDailyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-blue-500 mt-1">Custo por dia</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Itens de Uso</p>
                <div className="text-2xl font-bold text-purple-700 mt-1">{stats.totalUsageItems}</div>
                <p className="text-xs text-purple-500 mt-1">Registros ativos</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs - Apenas Analytics e Breakdown */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Detalhamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <UsageAnalytics 
            usageData={usageData}
            companies={companies}
            departments={departments}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="breakdown">
          <CostBreakdown 
            usageData={usageData}
            companies={companies}
            departments={departments}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}