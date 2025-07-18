
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FileText, Folder, MapPin, DollarSign, TrendingUp, Building2 } from 'lucide-react';

const COLORS = ['#212153', '#146FE0', '#04BF7B', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function UsageAnalytics({ usageData, companies, departments, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Processar dados para gráficos
  const processUsageByResource = () => {
    const resourceTotals = {};
    usageData.forEach(usage => {
      if (!resourceTotals[usage.resource_type]) {
        resourceTotals[usage.resource_type] = {
          name: usage.resource_type,
          quantity: 0,
          cost: 0
        };
      }
      resourceTotals[usage.resource_type].quantity += usage.quantity_used || 0;
      resourceTotals[usage.resource_type].cost += usage.total_cost || 0;
    });
    return Object.values(resourceTotals);
  };

  const processUsageByCompany = () => {
    const companyTotals = {};
    usageData.forEach(usage => {
      if (!companyTotals[usage.company_id]) {
        const company = companies.find(c => c.id === usage.company_id);
        companyTotals[usage.company_id] = {
          name: company?.name || 'Empresa Desconhecida',
          cost: 0,
          documents: 0,
          directories: 0,
          cdoc_addresses: 0
        };
      }
      companyTotals[usage.company_id].cost += usage.total_cost || 0;
      
      if (usage.resource_type === 'documents') {
        companyTotals[usage.company_id].documents += usage.quantity_used || 0;
      } else if (usage.resource_type === 'directories') {
        companyTotals[usage.company_id].directories += usage.quantity_used || 0;
      } else if (usage.resource_type === 'cdoc_addresses') {
        companyTotals[usage.company_id].cdoc_addresses += usage.quantity_used || 0;
      }
    });
    return Object.values(companyTotals);
  };

  const processUsageByDepartment = () => {
    const departmentTotals = {};
    usageData.forEach(usage => {
      if (!departmentTotals[usage.department_id]) {
        const department = departments.find(d => d.id === usage.department_id);
        departmentTotals[usage.department_id] = {
          name: department?.name || 'Departamento Desconhecido',
          cost: usage.total_cost || 0
        };
      } else {
        departmentTotals[usage.department_id].cost += usage.total_cost || 0;
      }
    });
    return Object.values(departmentTotals).sort((a, b) => b.cost - a.cost).slice(0, 10);
  };

  const processMonthlyTrend = () => {
    const monthlyData = {};
    usageData.forEach(usage => {
      const month = usage.usage_period?.slice(0, 7) || new Date().toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          totalCost: 0,
          documents: 0,
          directories: 0,
          cdocAddresses: 0
        };
      }
      monthlyData[month].totalCost += usage.total_cost || 0;
      
      if (usage.resource_type === 'documents') {
        monthlyData[month].documents += usage.quantity_used || 0;
      } else if (usage.resource_type === 'directories') {
        monthlyData[month].directories += usage.quantity_used || 0;
      } else if (usage.resource_type === 'cdoc_addresses') {
        monthlyData[month].cdocAddresses += usage.quantity_used || 0;
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const resourceData = processUsageByResource();
  const companyData = processUsageByCompany();
  const departmentData = processUsageByDepartment();
  const monthlyTrend = processMonthlyTrend();

  return (
    <div className="space-y-6">
      {/* Resumo de Uso por Recurso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Uso por Tipo de Recurso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'cost' ? `R$ ${value.toFixed(2)}` : value,
                  name === 'cost' ? 'Custo Total' : 'Quantidade'
                ]} />
                <Bar dataKey="quantity" fill="#146FE0" name="Quantidade" />
                <Bar dataKey="cost" fill="#04BF7B" name="Custo (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-600" />
              Distribuição de Custos por Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Custo Total']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Tendência de Uso Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'totalCost' ? `R$ ${value.toFixed(2)}` : value,
                  name === 'totalCost' ? 'Custo Total' : 
                  name === 'documents' ? 'Documentos' :
                  name === 'directories' ? 'Diretórios' : 'Endereços CDOC'
                ]} 
              />
              <Legend />
              <Line yAxisId="right" type="monotone" dataKey="totalCost" stroke="#212153" strokeWidth={3} name="Custo Total (R$)" />
              <Line yAxisId="left" type="monotone" dataKey="documents" stroke="#146FE0" name="Documentos" />
              <Line yAxisId="left" type="monotone" dataKey="directories" stroke="#04BF7B" name="Diretórios" />
              <Line yAxisId="left" type="monotone" dataKey="cdocAddresses" stroke="#F59E0B" name="Endereços CDOC" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Departamentos por Custo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Top 10 Departamentos por Custo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Custo Total']} />
              <Bar dataKey="cost" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
