
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Eye, FileText, UserCheck, Share2, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const actionIcons = {
  visualizar: Eye,
  criar: FileText,
  editar: FileText,
  aprovar: UserCheck,
  compartilhar: Share2,
  download: Download
};

const actionColors = {
  visualizar: "text-blue-600",
  criar: "text-green-600",
  editar: "text-amber-600",
  aprovar: "text-purple-600",
  compartilhar: "text-indigo-600",
  download: "text-gray-600"
};

export default function ActivityFeed({ auditLogs, isLoading }) {
  useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Sistema Completo de Gestão Documental";
  }, []);

  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardHeader className="border-b border-gray-100 pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-[#212153] to-[#146FE0] rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
            Atividade Recente
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-6">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma atividade registrada</p>
            </div>
          ) : (
            auditLogs.slice(0, 10).map((log) => {
              const ActionIcon = actionIcons[log.action] || FileText;
              const actionColor = actionColors[log.action] || "text-gray-600";
              
              return (
                <div key={log.id} className="flex items-start space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                    <ActionIcon className={`w-4 h-4 ${actionColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{log.user_email}</span>
                      <span className="text-gray-600 ml-1">
                        {log.action === 'visualizar' && 'visualizou um documento'}
                        {log.action === 'criar' && 'criou um documento'}
                        {log.action === 'editar' && 'editou um documento'}
                        {log.action === 'aprovar' && 'aprovou um documento'}
                        {log.action === 'compartilhar' && 'compartilhou um documento'}
                        {log.action === 'download' && 'fez download de um documento'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.created_date), "dd/MM HH:mm", { locale: ptBR })}
                      </p>
                      {log.details && (
                        <p className="text-xs text-gray-400 truncate">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
