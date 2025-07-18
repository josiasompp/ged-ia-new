import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ApprovalStats({ workflows }) {
  if (!workflows || workflows.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Estatísticas de Aprovações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum workflow encontrado para análise</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = workflows.reduce((acc, workflow) => {
    acc[workflow.status] = (acc[workflow.status] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = workflows.reduce((acc, workflow) => {
    acc[workflow.type] = (acc[workflow.type] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' '),
    value: count,
    percentage: ((count / workflows.length) * 100).toFixed(1)
  }));

  const approvalRate = ((statusCounts.aprovado || 0) / workflows.length * 100).toFixed(1);
  const pendingApprovals = statusCounts.aguardando_aprovacao || 0;
  const activeWorkflows = workflows.filter(w => w.is_active).length;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-purple-600" />
          Estatísticas de Aprovações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{workflows.length}</div>
            <div className="text-sm text-purple-600">Total Workflows</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
            <div className="text-sm text-green-600">Taxa de Aprovação</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingApprovals}</div>
            <div className="text-sm text-yellow-600">Pendentes</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeWorkflows}</div>
            <div className="text-sm text-blue-600">Ativos</div>
          </div>
        </div>

        {/* Gráfico de Status */}
        <div>
          <h4 className="font-medium mb-4">Distribuição por Status</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tipos de Workflow */}
        <div>
          <h4 className="font-medium mb-4">Tipos de Workflow</h4>
          <div className="space-y-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}