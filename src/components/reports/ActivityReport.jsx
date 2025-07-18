
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Eye, Download, FileText, UserCheck } from "lucide-react";

const actionIcons = {
  visualizar: Eye,
  download: Download,
  criar: FileText,
  aprovar: UserCheck,
  editar: FileText
};

export default function ActivityReport({ auditLogs, isLoading }) {
  const getActivityStats = () => {
    const stats = {
      total: auditLogs.length,
      views: auditLogs.filter(log => log.action === 'visualizar').length,
      downloads: auditLogs.filter(log => log.action === 'download').length,
      creates: auditLogs.filter(log => log.action === 'criar').length,
      approvals: auditLogs.filter(log => log.action === 'aprovar').length
    };
    return stats;
  };

  const getTopUsers = () => {
    const userActivity = {};
    auditLogs.forEach(log => {
      const user = log.user_email || 'Usuário desconhecido';
      userActivity[user] = (userActivity[user] || 0) + 1;
    });
    return Object.entries(userActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getTopActions = () => {
    const actions = {};
    auditLogs.forEach(log => {
      actions[log.action] = (actions[log.action] || 0) + 1;
    });
    return Object.entries(actions)
      .sort(([,a], [,b]) => b - a);
  };

  const stats = getActivityStats();
  const topUsers = getTopUsers();
  const topActions = getTopActions();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-bold">
            Relatório de Atividades
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Activity Overview */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Resumo de Atividades</h4>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">{stats.views}</div>
                <div className="text-xs text-blue-600">Visualizações</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-center">
                <Download className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-600">{stats.downloads}</div>
                <div className="text-xs text-green-600">Downloads</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-center">
                <FileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-600">{stats.creates}</div>
                <div className="text-xs text-purple-600">Criações</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-center">
                <UserCheck className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-amber-600">{stats.approvals}</div>
                <div className="text-xs text-amber-600">Aprovações</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Users */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Usuários Mais Ativos</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {topUsers.map(([user, count]) => (
                <div key={user} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {user.split('@')[0]}
                  </span>
                  <Badge variant="outline">{count} ações</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Distribuição de Ações</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {topActions.map(([action, count]) => {
                const Icon = actionIcons[action] || Activity;
                return (
                  <div key={action} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {action}
                      </span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Total de Atividades</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
