import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList } from 'recharts';
import { TrendingUp, Users, FileText, CheckSquare, Target, DollarSign, Clock, Award, Phone, Mail, Calendar, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export default function CrmDashboard({ leads, activities, proposals, tasks, deals, contacts, pipelines }) {
  // Métricas gerais
  const totalLeads = leads?.length || 0;
  const totalDeals = deals?.length || 0;
  const totalContacts = contacts?.length || 0;
  const totalActivities = activities?.length || 0;

  // Métricas de conversão
  const qualifiedLeads = leads?.filter(l => l.is_qualified).length || 0;
  const wonDeals = deals?.filter(d => d.status === 'ganho').length || 0;
  const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : 0;

  // Valor total do pipeline
  const pipelineValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  const wonValue = deals?.filter(d => d.status === 'ganho').reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

  // Dados do funil de vendas
  const funnelData = [
    { name: 'Leads', value: totalLeads, color: '#8884d8' },
    { name: 'Qualificados', value: qualifiedLeads, color: '#82ca9d' },
    { name: 'Propostas', value: proposals?.length || 0, color: '#ffc658' },
    { name: 'Negociação', value: deals?.filter(d => d.stage === 'negociacao').length || 0, color: '#ff7300' },
    { name: 'Fechados', value: wonDeals, color: '#00ff00' }
  ];

  // Atividades por tipo
  const activitiesByType = activities?.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const activityChartData = Object.keys(activitiesByType).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: activitiesByType[type]
  }));

  // Leads por fonte
  const leadsBySource = leads?.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {}) || {};

  const sourceChartData = Object.keys(leadsBySource).map(source => ({
    name: source.replace('_', ' '),
    leads: leadsBySource[source]
  }));

  // Performance da equipe
  const teamPerformance = {};
  leads?.forEach(lead => {
    if (lead.assigned_to) {
      if (!teamPerformance[lead.assigned_to]) {
        teamPerformance[lead.assigned_to] = { leads: 0, deals: 0, activities: 0, value: 0 };
      }
      teamPerformance[lead.assigned_to].leads++;
    }
  });

  deals?.forEach(deal => {
    if (deal.assigned_to) {
      if (!teamPerformance[deal.assigned_to]) {
        teamPerformance[deal.assigned_to] = { leads: 0, deals: 0, activities: 0, value: 0 };
      }
      teamPerformance[deal.assigned_to].deals++;
      teamPerformance[deal.assigned_to].value += deal.value || 0;
    }
  });

  activities?.forEach(activity => {
    if (activity.user_email) {
      if (!teamPerformance[activity.user_email]) {
        teamPerformance[activity.user_email] = { leads: 0, deals: 0, activities: 0, value: 0 };
      }
      teamPerformance[activity.user_email].activities++;
    }
  });

  const teamChartData = Object.keys(teamPerformance).map(email => ({
    name: email.split('@')[0],
    leads: teamPerformance[email].leads,
    deals: teamPerformance[email].deals,
    activities: teamPerformance[email].activities,
    value: teamPerformance[email].value
  }));

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total de Leads</p>
                <div className="text-2xl font-bold text-blue-700">{totalLeads}</div>
                <p className="text-xs text-blue-500 mt-1">
                  {qualifiedLeads} qualificados
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Negócios Ativos</p>
                <div className="text-2xl font-bold text-green-700">{totalDeals}</div>
                <p className="text-xs text-green-500 mt-1">
                  {wonDeals} fechados
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Taxa de Conversão</p>
                <div className="text-2xl font-bold text-purple-700">{conversionRate}%</div>
                <Progress value={parseFloat(conversionRate)} className="mt-2" />
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Valor Pipeline</p>
                <div className="text-xl font-bold text-emerald-700">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(pipelineValue)}
                </div>
                <p className="text-xs text-emerald-500 mt-1">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(wonValue)} fechados
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Funil de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Atividades por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Atividades por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance da Equipe e Leads por Fonte */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Performance da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                <Bar dataKey="deals" fill="#82ca9d" name="Negócios" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Leads por Fonte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities?.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === 'ligacao' && <Phone className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'email' && <Mail className="w-4 h-4 text-green-600" />}
                    {activity.type === 'reuniao' && <Calendar className="w-4 h-4 text-purple-600" />}
                    <div>
                      <p className="font-medium text-sm">{activity.subject}</p>
                      <p className="text-xs text-gray-500">{activity.user_email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.outcome || 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads?.filter(l => l.next_followup).slice(0, 5).map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.company_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Follow-up</p>
                    <p className="text-xs font-medium">{new Date(lead.next_followup).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metas vs Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Leads (Meta: 100)</span>
                  <span className="text-sm font-medium">{totalLeads}/100</span>
                </div>
                <Progress value={(totalLeads / 100) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Negócios (Meta: 50)</span>
                  <span className="text-sm font-medium">{totalDeals}/50</span>
                </div>
                <Progress value={(totalDeals / 50) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Receita (Meta: R$ 500k)</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0
                    }).format(wonValue)}/R$ 500k
                  </span>
                </div>
                <Progress value={(wonValue / 500000) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}