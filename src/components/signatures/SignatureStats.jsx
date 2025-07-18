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
  Line
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar
} from "lucide-react";

export default function SignatureStats({ workflows, signatures, currentUser }) {
  // Dados para gráfico de workflow por status
  const statusData = [
    { name: 'Concluído', value: workflows.filter(w => w.status === 'concluido').length, color: '#10B981' },
    { name: 'Em Andamento', value: workflows.filter(w => w.status === 'em_andamento').length, color: '#F59E0B' },
    { name: 'Rascunho', value: workflows.filter(w => w.status === 'rascunho').length, color: '#6B7280' },
    { name: 'Cancelado', value: workflows.filter(w => w.status === 'cancelado').length, color: '#EF4444' }
  ];

  // Dados para gráfico de assinaturas por mês
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const completed = signatures.filter(s => 
      s.status === 'assinado' && 
      s.signed_at && 
      s.signed_at.startsWith(monthYear)
    ).length;

    monthlyData.push({
      month: monthName,
      assinaturas: completed
    });
  }

  // Dados para gráfico de tipos de assinatura
  const signatureTypeData = [
    { name: 'Simples', value: signatures.filter(s => s.signature_type === 'simples').length, color: '#3B82F6' },
    { name: 'Avançada', value: signatures.filter(s => s.signature_type === 'avancada').length, color: '#8B5CF6' },
    { name: 'Qualificada', value: signatures.filter(s => s.signature_type === 'qualificada').length, color: '#06B6D4' }
  ];

  // Métricas principais
  const totalWorkflows = workflows.length;
  const completedWorkflows = workflows.filter(w => w.status === 'concluido').length;
  const completionRate = totalWorkflows > 0 ? Math.round((completedWorkflows / totalWorkflows) * 100) : 0;
  
  const totalSignatures = signatures.length;
  const completedSignatures = signatures.filter(s => s.status === 'assinado').length;
  const pendingSignatures = signatures.filter(s => s.status === 'pendente').length;

  // Tempo médio para assinatura (simulado)
  const avgSignatureTime = "2.3 dias";

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Taxa de Conclusão</p>
                <div className="text-3xl font-bold text-blue-700 mt-1">{completionRate}%</div>
                <p className="text-xs text-blue-500 mt-1">{completedWorkflows}/{totalWorkflows} workflows</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Assinaturas Coletadas</p>
                <div className="text-3xl font-bold text-green-700 mt-1">{completedSignatures}</div>
                <p className="text-xs text-green-500 mt-1">Este mês</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Tempo Médio</p>
                <div className="text-3xl font-bold text-amber-700 mt-1">{avgSignatureTime}</div>
                <p className="text-xs text-amber-500 mt-1">Para assinatura</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Pendentes</p>
                <div className="text-3xl font-bold text-red-700 mt-1">{pendingSignatures}</div>
                <p className="text-xs text-red-500 mt-1">Aguardando ação</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status dos Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Status dos Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Assinaturas por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Assinaturas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="assinaturas" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Tipos de Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Tipos de Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={signatureTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Signatários */}
        <Card>
          <CardHeader>
            <CardTitle>Top Signatários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "João Silva", signatures: 12, email: "joao@empresa.com" },
                { name: "Maria Santos", signatures: 8, email: "maria@empresa.com" },
                { name: "Pedro Costa", signatures: 6, email: "pedro@empresa.com" },
                { name: "Ana Oliveira", signatures: 4, email: "ana@empresa.com" }
              ].map((signer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{signer.name}</div>
                      <div className="text-xs text-gray-500">{signer.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{signer.signatures}</div>
                    <div className="text-xs text-gray-500">assinaturas</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}