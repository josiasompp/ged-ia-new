import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Folder, 
  MapPin, 
  Users,
  BarChart3,
  Calculator,
  Building2,
  Download,
  Eye,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { FinancialUsage } from "@/api/entities";
import { FinancialPricing } from "@/api/entities";
import { FinancialBill } from "@/api/entities";
import { Company } from "@/api/entities";
import { Department } from "@/api/entities";
import { Document } from "@/api/entities";
import { Directory } from "@/api/entities";
import { PhysicalLocation } from "@/api/entities";
import { User } from "@/api/entities";

import UsageAnalytics from "../components/financial/UsageAnalytics";
import CostBreakdown from "../components/financial/CostBreakdown";
import BillingManager from "../components/financial/BillingManager";
import PricingConfiguration from "../components/financial/PricingConfiguration";
import UsageCalculator from "../components/financial/UsageCalculator";

export default function FinancialManager() {
  const [usageData, setUsageData] = useState([]);
  const [bills, setBills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  useEffect(() => {
    loadFinancialData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Gestor Financeiro | Analytics de Uso e Cobrança";
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
      const [
        usageDataResult,
        billsData,
        companiesData,
        departmentsData,
        pricingData
      ] = await Promise.all([
        FinancialUsage.list("-usage_period", 500),
        FinancialBill.list("-created_date", 100),
        Company.list("-created_date"),
        Department.list(),
        FinancialPricing.list()
      ]);

      setUsageData(usageDataResult);
      setBills(billsData);
      setCompanies(companiesData);
      setDepartments(departmentsData);
      setPricing(pricingData);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
    setIsLoading(false);
  };

  const generateUsageReport = async () => {
    setIsLoading(true);
    try {
      // Coletar dados de uso real
      const [documents, directories, locations, users] = await Promise.all([
        Document.list("-created_date", 1000),
        Directory.list(),
        PhysicalLocation.list(),
        User.list()
      ]);

      // Calcular uso por empresa e departamento
      const usageByCompany = {};
      
      // Processar documentos
      documents.forEach(doc => {
        if (!usageByCompany[doc.company_id]) {
          usageByCompany[doc.company_id] = {};
        }
        if (!usageByCompany[doc.company_id][doc.department_id]) {
          usageByCompany[doc.company_id][doc.department_id] = {
            documents: 0,
            directories: new Set(),
            storage_gb: 0
          };
        }
        usageByCompany[doc.company_id][doc.department_id].documents++;
        usageByCompany[doc.company_id][doc.department_id].storage_gb += (doc.file_size || 0) / (1024 * 1024 * 1024);
      });

      // Processar diretórios
      directories.forEach(dir => {
        if (usageByCompany[dir.company_id] && usageByCompany[dir.company_id][dir.department_id]) {
          usageByCompany[dir.company_id][dir.department_id].directories.add(dir.id);
        }
      });

      // Converter Set para número
      Object.keys(usageByCompany).forEach(companyId => {
        Object.keys(usageByCompany[companyId]).forEach(deptId => {
          usageByCompany[companyId][deptId].directories = usageByCompany[companyId][deptId].directories.size;
        });
      });

      // Calcular endereços CDOC por empresa
      const cdocUsage = {};
      locations.forEach(loc => {
        if (!cdocUsage[loc.company_id]) {
          cdocUsage[loc.company_id] = 0;
        }
        cdocUsage[loc.company_id]++;
      });

      console.log("Relatório de uso gerado:", { usageByCompany, cdocUsage });
      
    } catch (error) {
      console.error("Erro ao gerar relatório de uso:", error);
    }
    setIsLoading(false);
  };

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyUsage = usageData.filter(usage => 
      usage.usage_period && usage.usage_period.startsWith(currentMonth)
    );

    const totalRevenue = monthlyUsage.reduce((sum, usage) => sum + (usage.total_cost || 0), 0);
    const totalOverage = monthlyUsage.reduce((sum, usage) => sum + (usage.overage_cost || 0), 0);
    const activeCompanies = new Set(monthlyUsage.map(usage => usage.company_id)).size;
    const totalUsageItems = monthlyUsage.length;

    return {
      totalRevenue,
      totalOverage,
      activeCompanies,
      totalUsageItems
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
              Gestor Financeiro
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Analytics de uso, cobrança e gestão de custos por empresa e departamento
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={generateUsageReport}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            <Calculator className="w-4 h-4" />
            Calcular Uso Atual
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Receita Mensal</p>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-green-500 mt-1">Período atual</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Empresas Ativas</p>
                <div className="text-2xl font-bold text-blue-700 mt-1">{stats.activeCompanies}</div>
                <p className="text-xs text-blue-500 mt-1">Com uso no período</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
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

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Itens de Uso</p>
                <div className="text-2xl font-bold text-purple-700 mt-1">{stats.totalUsageItems}</div>
                <p className="text-xs text-purple-500 mt-1">Registros de cobrança</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <FileText className="w-4 h-4" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Preços
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="w-4 h-4" />
            Calculadora
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

        <TabsContent value="billing">
          <BillingManager 
            bills={bills}
            companies={companies}
            onRefresh={loadFinancialData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingConfiguration 
            pricing={pricing}
            onRefresh={loadFinancialData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="calculator">
          <UsageCalculator 
            companies={companies}
            departments={departments}
            pricing={pricing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}