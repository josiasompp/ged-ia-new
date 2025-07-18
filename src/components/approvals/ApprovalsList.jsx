
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Calendar,
  PlayCircle,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ApprovalWorkflow } from "@/api/entities";

const statusColors = {
  rascunho: "bg-gray-100 text-gray-800",
  ativo: "bg-blue-100 text-blue-800",
  aguardando_aprovacao: "bg-amber-100 text-amber-800",
  aprovado: "bg-green-100 text-green-800",
  rejeitado: "bg-red-100 text-red-800",
  cancelado: "bg-gray-100 text-gray-800"
};

export default function ApprovalsList({ workflows, currentUser, onRefresh, isLoading }) {
  const [processingWorkflow, setProcessingWorkflow] = useState(null);

  const myApprovals = workflows.filter(workflow => {
    if (workflow.status !== 'aguardando_aprovacao') return false;
    
    const currentStep = workflow.steps?.[workflow.current_step];
    return currentStep?.approvers?.includes(currentUser?.email);
  });

  const handleApproval = async (workflow, action, comment = "") => {
    setProcessingWorkflow(workflow.id);
    
    try {
      const currentStep = workflow.steps[workflow.current_step];
      const newApproval = {
        step_id: currentStep.id,
        approver: currentUser.email,
        action: action,
        comment: comment,
        date: new Date().toISOString()
      };

      const updatedApprovals = [...(workflow.approvals || []), newApproval];
      let newStatus = workflow.status;
      let newCurrentStep = workflow.current_step;

      if (action === 'aprovado') {
        // Verificar se todos os aprovadores necessários aprovaram
        const stepApprovals = updatedApprovals.filter(a => a.step_id === currentStep.id && a.action === 'aprovado');
        
        // If approval_type is 'qualquer_um' (any one), then one approval is enough to pass the step.
        // Otherwise, all approvers in the step must approve.
        const allRequiredApproved = currentStep.approval_type === 'qualquer_um' 
          ? stepApprovals.length > 0 
          : stepApprovals.length === currentStep.approvers.length;

        if (allRequiredApproved) {
          // Advance to the next step or finalize
          if (newCurrentStep + 1 < workflow.steps.length) {
            newCurrentStep += 1;
          } else {
            newStatus = 'aprovado';
          }
        }
      } else if (action === 'rejeitado') {
        newStatus = 'rejeitado';
      }

      await ApprovalWorkflow.update(workflow.id, {
        approvals: updatedApprovals,
        status: newStatus,
        current_step: newCurrentStep,
        ...(newStatus === 'aprovado' || newStatus === 'rejeitado' ? { completed_at: new Date().toISOString() } : {})
      });

      onRefresh();
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
    }
    
    setProcessingWorkflow(null);
  };

  return (
    <div className="space-y-6">
      {/* Minhas Aprovações Pendentes */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#F59E0B] bg-clip-text text-transparent font-bold">
              Aguardando Minha Aprovação
            </span>
            <Badge variant="destructive" className="ml-2">
              {myApprovals.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Iniciado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myApprovals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma aprovação pendente
                    </h3>
                    <p className="text-gray-500">
                      Não há workflows aguardando sua aprovação no momento.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                myApprovals.map((workflow) => {
                  const currentStep = workflow.steps?.[workflow.current_step];
                  const isProcessing = processingWorkflow === workflow.id;
                  
                  return (
                    <TableRow key={workflow.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{workflow.name}</div>
                          <div className="text-sm text-gray-500">{workflow.description}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">
                          {workflow.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{workflow.initiated_by}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(workflow.initiated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{currentStep?.name}</div>
                          <div className="text-gray-500">
                            Etapa {workflow.current_step + 1} de {workflow.steps?.length}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(workflow, 'aprovado')}
                            disabled={isProcessing}
                            className="gap-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                          >
                            {isProcessing ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(workflow, 'rejeitado')}
                            disabled={isProcessing}
                            className="gap-1 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                          >
                            {isProcessing ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Todos os Workflows */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#212153] to-[#146FE0] rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
              Todos os Workflows
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Iniciado por</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : workflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-8">
                    <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum workflow encontrado
                    </h3>
                    <p className="text-gray-500">
                      Crie seu primeiro workflow de aprovação.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                workflows.map((workflow) => (
                  <TableRow key={workflow.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{workflow.name}</div>
                        <div className="text-sm text-gray-500">{workflow.description}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColors[workflow.status]}>
                        {workflow.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{workflow.initiated_by}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(workflow.initiated_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${workflow.steps?.length > 0 ? ((workflow.current_step + 1) / workflow.steps.length) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {workflow.current_step + 1}/{workflow.steps?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
