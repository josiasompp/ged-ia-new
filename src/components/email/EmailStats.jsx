import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function EmailStats({ logs, config }) {
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  // Estatísticas gerais
  const totalEmails = logs.length;
  const sentEmails = logs.filter(log => log.status === 'sent').length;
  const failedEmails = logs.filter(log => log.status === 'failed').length;
  const pendingEmails = logs.filter(log => log.status === 'pending').length;

  // Estatísticas de hoje
  const todayEmails = logs.filter(log => new Date(log.created_date).toDateString() === today);
  const todayCount = todayEmails.length;
  const todaySent = todayEmails.filter(log => log.status === 'sent').length;

  // Estatísticas do mês
  const thisMonthEmails = logs.filter(log => {
    const logDate = new Date(log.created_date);
    return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
  });
  const monthlyCount = thisMonthEmails.length;

  // Taxa de sucesso
  const successRate = totalEmails > 0 ? Math.round((sentEmails / totalEmails) * 100) : 0;

  // Uso do limite diário
  const dailyLimit = config?.daily_limit || 1000;
  const dailyUsagePercent = Math.round((todayCount / dailyLimit) * 100);

  // Estatísticas por categoria
  const categoryStats = logs.reduce((acc, log) => {
    const category = log.triggered_by || 'manual';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const StatCard = ({ title, value, icon: Icon, color = "blue", trend, subtitle }) => (
    <Card className={`border-${color}-200 bg-${color}-50`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-${color}-600 text-sm font-medium`}>{title}</p>
            <div className={`text-3xl font-bold text-${color}-700 mt-1`}>{value}</div>
            {subtitle && (
              <p className={`text-${color}-600 text-sm mt-1`}>{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className={`w-4 h-4 mr-1 text-${color}-500`} />
            <span className={`text-${color}-600 font-medium`}>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Estatísticas de Email</h3>
        <p className="text-gray-600">Acompanhe o desempenho do seu sistema de email</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Emails"
          value={totalEmails}
          icon={Mail}
          color="blue"
        />
        
        <StatCard
          title="Enviados com Sucesso"
          value={sentEmails}
          icon={CheckCircle}
          color="green"
          subtitle={`${successRate}% de sucesso`}
        />
        
        <StatCard
          title="Falharam"
          value={failedEmails}
          icon={XCircle}
          color="red"
          subtitle={totalEmails > 0 ? `${Math.round((failedEmails / totalEmails) * 100)}% de falha` : '0% de falha'}
        />
        
        <StatCard
          title="Pendentes"
          value={pendingEmails}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Estatísticas de Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Uso Diário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Emails enviados hoje</span>
              <span className="text-2xl font-bold">{todayCount}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Limite diário</span>
                <span>{todayCount} / {dailyLimit}</span>
              </div>
              <Progress value={dailyUsagePercent} className="h-2" />
              <p className="text-xs text-gray-500">
                {dailyUsagePercent < 80 ? (
                  `Você usou ${dailyUsagePercent}% do limite diário`
                ) : dailyUsagePercent < 95 ? (
                  `⚠️ Atenção: ${dailyUsagePercent}% do limite usado`
                ) : (
                  `🚨 Limite quase atingido: ${dailyUsagePercent}%`
                )}
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span>Enviados hoje com sucesso</span>
                <Badge className="bg-green-100 text-green-800">
                  {todaySent} / {todayCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Emails por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">
                    {category === 'manual' ? 'Envio Manual' : 
                     category === 'proposal_accepted' ? 'Proposta Aceita' :
                     category === 'document_approved' ? 'Documento Aprovado' :
                     category === 'task_reminder' ? 'Lembrete de Tarefa' :
                     category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(count / totalEmails) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">{count}</span>
                  </div>
                </div>
              ))}
              
              {Object.keys(categoryStats).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Ainda não há dados de categorias
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Resumo Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{monthlyCount}</div>
              <p className="text-sm text-gray-600">Emails este mês</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {monthlyCount > 0 ? Math.round(monthlyCount / new Date().getDate()) : 0}
              </div>
              <p className="text-sm text-gray-600">Média diária</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{successRate}%</div>
              <p className="text-sm text-gray-600">Taxa de sucesso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Configuração */}
      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Status da Configuração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Servidor SMTP</p>
                <p className="text-sm text-gray-600">{config.smtp_host}:{config.smtp_port}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email Remetente</p>
                <p className="text-sm text-gray-600">{config.from_name} &lt;{config.from_email}&gt;</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge className={config.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {config.is_verified ? 'Verificado' : 'Pendente Verificação'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Último Teste</p>
                <p className="text-sm text-gray-600">
                  {config.last_test_date 
                    ? new Date(config.last_test_date).toLocaleDateString('pt-BR')
                    : 'Nunca testado'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}