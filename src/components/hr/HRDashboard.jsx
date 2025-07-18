import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  MapPin,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Timer,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HRDashboard({ 
  employees, 
  timeEntries, 
  hiringProcesses, 
  vacationRequests, 
  payrolls, 
  stats, 
  isLoading 
}) {
  // Dados aprimorados para análise de eficiência de ponto
  const getTimeEfficiencyData = () => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = timeEntries.filter(te => te.entry_date === dateStr);
      const uniqueEmployees = new Set(dayEntries.map(te => te.employee_id)).size;
      const totalExpected = employees.filter(emp => emp.status === 'ativo').length;
      
      // Calcular batidas inconsistentes
      const inconsistentEntries = dayEntries.filter(te => 
        te.status === 'inconsistente' || te.approval_status === 'rejeitada'
      ).length;
      
      // Calcular eficiência
      const efficiency = totalExpected > 0 ? Math.round((uniqueEmployees / totalExpected) * 100) : 0;
      const qualityScore = dayEntries.length > 0 ? 
        Math.round(((dayEntries.length - inconsistentEntries) / dayEntries.length) * 100) : 100;
      
      last30Days.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        presenca: uniqueEmployees,
        eficiencia: efficiency,
        qualidade: qualityScore,
        total_batidas: dayEntries.length,
        inconsistentes: inconsistentEntries
      });
    }
    return last30Days;
  };

  // Análise de horários de pico
  const getHourlyDistribution = () => {
    const hourlyData = {};
    
    timeEntries.forEach(entry => {
      const hour = parseInt(entry.entry_time.split(':')[0]);
      const type = entry.entry_type;
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = { hour: `${hour.toString().padStart(2, '0')}:00`, entrada: 0, saida: 0, intervalo: 0 };
      }
      
      if (type === 'entrada') hourlyData[hour].entrada++;
      else if (type === 'saida') hourlyData[hour].saida++;
      else hourlyData[hour].intervalo++;
    });
    
    return Object.values(hourlyData).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  // Análise de conformidade com a Portaria 671
  const getComplianceData = () => {
    const compliantEntries = timeEntries.filter(te => te.portaria_671_compliant !== false).length;
    const totalEntries = timeEntries.length;
    const complianceRate = totalEntries > 0 ? Math.round((compliantEntries / totalEntries) * 100) : 100;
    
    const methodDistribution = timeEntries.reduce((acc, entry) => {
      const method = entry.entry_method || 'unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
    
    return {
      complianceRate,
      totalEntries,
      compliantEntries,
      methodDistribution: Object.entries(methodDistribution).map(([method, count]) => ({
        method: method === 'rep_afd' ? 'REP (AFD)' :
                method === 'portaria_671' ? 'Portaria 671' :
                method === 'mobile_app' ? 'App Móvel' :
                method === 'web' ? 'Web' : 'Manual',
        count
      }))
    };
  };

  // Dados de departamento com análise de produtividade
  const departmentData = employees.reduce((acc, emp) => {
    const dept = emp.department_name || emp.department_id || 'Não definido';
    if (!acc[dept]) {
      acc[dept] = { 
        name: dept, 
        employees: 0, 
        activeToday: 0, 
        avgEfficiency: 0,
        totalEntries: 0 
      };
    }
    
    acc[dept].employees++;
    
    // Calcular funcionários ativos hoje
    const today = new Date().toISOString().split('T')[0];
    const empEntriesToday = timeEntries.filter(te => 
      te.employee_id === emp.id && te.entry_date === today
    );
    
    if (empEntriesToday.length > 0) {
      acc[dept].activeToday++;
    }
    
    acc[dept].totalEntries += empEntriesToday.length;
    
    return acc;
  }, {});

  // Calcular eficiência por departamento
  Object.values(departmentData).forEach(dept => {
    dept.avgEfficiency = dept.employees > 0 ? 
      Math.round((dept.activeToday / dept.employees) * 100) : 0;
  });

  const departmentChartData = Object.values(departmentData)
    .sort((a, b) => b.employees - a.employees)
    .slice(0, 8);

  const timeEfficiencyData = getTimeEfficiencyData();
  const hourlyDistribution = getHourlyDistribution();
  const complianceData = getComplianceData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Conformidade e Qualidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Conformidade Portaria 671</p>
                <div className="text-3xl font-bold text-green-600">{complianceData.complianceRate}%</div>
                <p className="text-xs text-gray-500 mt-1">
                  {complianceData.compliantEntries} de {complianceData.totalEntries} batidas
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Eficiência Média</p>
                <div className="text-3xl font-bold text-blue-600">{stats.avgAttendance}%</div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Aprovações Pendentes</p>
                <div className="text-3xl font-bold text-amber-600">{stats.pendingApprovals}</div>
                <p className="text-xs text-gray-500 mt-1">Requer atenção</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Batidas Hoje</p>
                <div className="text-3xl font-bold text-purple-600">
                  {timeEntries.filter(te => te.entry_date === new Date().toISOString().split('T')[0]).length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Registros automáticos</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Timer className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Eficiência e Qualidade dos Últimos 30 Dias */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Eficiência e Qualidade (30 dias)
              <Badge variant="outline" className="ml-auto">
                Análise Avançada
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name.includes('eficiencia') || name.includes('qualidade') ? '%' : ''}`,
                    name === 'eficiencia' ? 'Eficiência' :
                    name === 'qualidade' ? 'Qualidade' :
                    name === 'presenca' ? 'Presença' : name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#10B981" 
                  fill="#D1FAE5"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="qualidade" 
                  stroke="#3B82F6" 
                  fill="#DBEAFE"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Batidas por Horário */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Distribuição por Horário
              <Badge variant="outline" className="ml-auto">
                Análise de Pico
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={11} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entrada" fill="#10B981" stackId="a" />
                <Bar dataKey="saida" fill="#EF4444" stackId="a" />
                <Bar dataKey="intervalo" fill="#F59E0B" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Eficiência por Departamento */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Eficiência por Departamento
              <Badge variant="outline" className="ml-auto">
                Hoje
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  fontSize={11}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgEfficiency' ? `${value}%` : value,
                    name === 'avgEfficiency' ? 'Eficiência' :
                    name === 'employees' ? 'Funcionários' :
                    name === 'activeToday' ? 'Ativos Hoje' : name
                  ]}
                />
                <Bar 
                  dataKey="avgEfficiency" 
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métodos de Registro (Conformidade) */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Métodos de Registro
              <Badge variant="outline" className="ml-auto">
                Portaria 671
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData.methodDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ method, count, percent }) => 
                    count > 0 ? `${method}: ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {complianceData.methodDistribution.map((entry, index) => {
                    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
                    return <Cell key={index} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes Aprimoradas */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Atividades Recentes de Ponto
            <Badge variant="outline" className="ml-auto">
              Tempo real
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.slice(0, 10).map((entry, index) => {
              const employee = employees.find(emp => emp.id === entry.employee_id);
              const entryDateTime = new Date(`${entry.entry_date}T${entry.entry_time}`);
              const now = new Date();
              const diffMinutes = Math.round((now - entryDateTime) / (1000 * 60));
              
              let timeAgoString;
              if (diffMinutes < 1) {
                timeAgoString = 'Agora';
              } else if (diffMinutes < 60) {
                timeAgoString = `${diffMinutes}m atrás`;
              } else if (diffMinutes < 24 * 60) {
                const hours = Math.floor(diffMinutes / 60);
                timeAgoString = `${hours}h atrás`;
              } else {
                const days = Math.floor(diffMinutes / (24 * 60));
                timeAgoString = `${days}d atrás`;
              }

              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{employee?.full_name || 'Funcionário'}</div>
                      <div className="text-sm text-gray-500">
                        {entry.entry_type === 'entrada' ? '🟢 Entrada' : 
                         entry.entry_type === 'saida' ? '🔴 Saída' :
                         entry.entry_type === 'inicio_intervalo' ? '🟡 Início Intervalo' : '🟡 Fim Intervalo'} às {entry.entry_time.substring(0, 5)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {timeAgoString}
                    <Badge 
                      variant={
                        entry.entry_method === 'rep_afd' || entry.entry_method === 'portaria_671' ? 'default' : 
                        entry.entry_method === 'mobile_app' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {entry.entry_method === 'rep_afd' ? '📊 REP' :
                       entry.entry_method === 'portaria_671' ? '📋 P671' :
                       entry.entry_method === 'mobile_app' ? '📱 App' : 
                       entry.entry_method === 'web' ? '💻 Web' : '✏️ Manual'}
                    </Badge>
                    {entry.location && (
                      <MapPin className="w-4 h-4 text-gray-400" />
                    )}
                    {entry.approval_status === 'pendente' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}