import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileSignature, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  Send,
  MoreVertical,
  Calendar,
  Mail,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  rascunho: { color: "bg-gray-100 text-gray-800", icon: Clock },
  enviado: { color: "bg-blue-100 text-blue-800", icon: Send },
  em_andamento: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
  concluido: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelado: { color: "bg-red-100 text-red-800", icon: XCircle },
  expirado: { color: "bg-orange-100 text-orange-800", icon: Clock }
};

export default function SignatureWorkflowList({ 
  workflows, 
  currentUser, 
  onRefresh, 
  isLoading,
  showOnlyCompleted = false 
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <FileSignature className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showOnlyCompleted ? "Nenhum workflow concluído" : "Nenhum workflow encontrado"}
          </h3>
          <p className="text-gray-500">
            {showOnlyCompleted 
              ? "Workflows concluídos aparecerão aqui após a finalização."
              : "Crie seu primeiro workflow de assinatura para começar."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => {
        const statusInfo = statusConfig[workflow.status] || statusConfig.rascunho;
        const StatusIcon = statusInfo.icon;
        const progress = workflow.total_signers > 0 
          ? Math.round((workflow.completed_signatures / workflow.total_signers) * 100)
          : 0;
        
        return (
          <Card key={workflow.id} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileSignature className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {workflow.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Criado em {format(new Date(workflow.created_date), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Lembrete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Documento
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {workflow.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {workflow.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {workflow.status.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-gray-500">
                  {workflow.workflow_type}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">
                    {workflow.completed_signatures}/{workflow.total_signers}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{workflow.total_signers} signatários</span>
                </div>
                {workflow.expiry_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Expira {format(new Date(workflow.expiry_date), "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>

              {workflow.status === 'em_andamento' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Aguardando assinaturas
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    {workflow.total_signers - workflow.completed_signatures} assinatura(s) pendente(s)
                  </p>
                </div>
              )}

              {workflow.status === 'concluido' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Workflow concluído
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Todas as assinaturas foram coletadas com sucesso
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}