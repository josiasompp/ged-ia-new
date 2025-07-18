
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  PlayCircle, 
  Plus, 
  Trash2, 
  Users, 
  Settings,
  CheckSquare,
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";
import { ApprovalWorkflow } from "@/api/entities";

const workflowTypes = [
  { value: "documento", label: "Aprovação de Documentos" },
  { value: "despesa", label: "Aprovação de Despesas" },
  { value: "compra", label: "Aprovação de Compras" },
  { value: "contrato", label: "Aprovação de Contratos" },
  { value: "ferias", label: "Solicitação de Férias" },
  { value: "personalizado", label: "Workflow Personalizado" }
];

const stepTypes = [
  { value: "aprovacao", label: "Aprovação", icon: CheckSquare },
  { value: "revisao", label: "Revisão", icon: FileText },
  { value: "notificacao", label: "Notificação", icon: AlertTriangle },
  { value: "assinatura", label: "Assinatura", icon: FileText }
];

const approvalTypes = [
  { value: "qualquer_um", label: "Qualquer aprovador" },
  { value: "todos", label: "Todos os aprovadores" },
  { value: "maioria", label: "Maioria dos aprovadores" }
];

export default function WorkflowDesigner({ 
  workflows, 
  users, 
  departments, 
  currentUser, 
  onRefresh, 
  isModal = false, 
  onClose = null 
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "documento",
    steps: []
  });

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setFormData({
      name: "",
      description: "",
      type: "documento",
      steps: []
    });
    setShowForm(true);
  };

  const handleEditWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setFormData(workflow);
    setShowForm(true);
  };

  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: "",
      type: "aprovacao",
      approvers: [],
      approval_type: "qualquer_um",
      timeout_hours: 24,
      escalation_to: "",
      order: formData.steps.length + 1
    };
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (stepIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeStep = (stepIndex) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }));
  };

  const handleSave = async () => {
    try {
      const workflowData = {
        ...formData,
        company_id: currentUser?.company_id,
        status: "ativo",
        current_step: 0,
        initiated_by: currentUser?.email,
        initiated_at: new Date().toISOString(),
        is_active: true
      };

      if (selectedWorkflow) {
        await ApprovalWorkflow.update(selectedWorkflow.id, workflowData);
      } else {
        await ApprovalWorkflow.create(workflowData);
      }

      setShowForm(false);
      onRefresh();
    } catch (error) {
      console.error("Erro ao salvar workflow:", error);
    }
  };

  const WorkflowForm = () => (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedWorkflow ? "Editar Workflow" : "Criar Novo Workflow"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Workflow</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Aprovação de Documentos Importantes"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Workflow</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workflowTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito e funcionamento deste workflow..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Etapas do Workflow</h3>
              <Button onClick={addStep} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Etapa
              </Button>
            </div>

            {formData.steps.map((step, index) => (
              <Card key={step.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Etapa {index + 1}
                    </CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Etapa</Label>
                      <Input
                        value={step.name}
                        onChange={(e) => updateStep(index, 'name', e.target.value)}
                        placeholder="Ex: Aprovação do Gerente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Etapa</Label>
                      <Select
                        value={step.type}
                        onValueChange={(value) => updateStep(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stepTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {step.type === 'aprovacao' && (
                    <>
                      <div className="space-y-2">
                        <Label>Aprovadores</Label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (!step.approvers.includes(value)) {
                              updateStep(index, 'approvers', [...step.approvers, value]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Adicionar aprovador" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.email}>
                                {user.full_name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {step.approvers.map(approver => (
                            <Badge key={approver} variant="secondary" className="gap-1">
                              {approver}
                              <button
                                onClick={() => updateStep(index, 'approvers', step.approvers.filter(a => a !== approver))}
                                className="ml-1 hover:text-red-600"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Aprovação</Label>
                          <Select
                            value={step.approval_type}
                            onValueChange={(value) => updateStep(index, 'approval_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {approvalTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Timeout (horas)</Label>
                          <Input
                            type="number"
                            value={step.timeout_hours}
                            onChange={(e) => updateStep(index, 'timeout_hours', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {formData.steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma etapa adicionada ainda.</p>
                <p className="text-sm">Clique em "Adicionar Etapa" para começar.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || formData.steps.length === 0}>
              {selectedWorkflow ? "Atualizar" : "Criar"} Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const WorkflowList = () => (
    <div className="space-y-4">
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum workflow encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Crie seu primeiro workflow de aprovação para automatizar processos.
            </p>
            <Button onClick={handleCreateWorkflow} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        workflows.map(workflow => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workflow.name}
                    </h3>
                    <Badge variant={workflow.is_active ? "default" : "secondary"}>
                      {workflow.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge variant="outline">
                      {workflowTypes.find(t => t.value === workflow.type)?.label}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{workflow.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {workflow.steps?.length || 0} etapas
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Criado em {new Date(workflow.created_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditWorkflow(workflow)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Designer de Workflows
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Configure workflows automatizados para aprovações e processos.
              </p>
              <Button onClick={handleCreateWorkflow} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Workflow
              </Button>
            </div>
            <WorkflowList />
          </div>
          <WorkflowForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Designer de Workflows</h2>
          <p className="text-gray-600">
            Configure workflows automatizados para aprovações e processos.
          </p>
        </div>
        <Button onClick={handleCreateWorkflow} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Workflow
        </Button>
      </div>
      
      <WorkflowList />
      <WorkflowForm />
    </div>
  );
}
