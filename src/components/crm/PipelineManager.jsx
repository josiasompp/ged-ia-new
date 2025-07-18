import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2, Save, Edit3 } from 'lucide-react';
import { CrmPipeline } from '@/api/entities';
import { useToast } from '@/components/ui/use-toast';

export default function PipelineManager({ pipelines = [], onRefresh, currentUser, isLoading }) {
  // Garantir que pipelines seja sempre um array
  const safePipelines = Array.isArray(pipelines) ? pipelines : [];
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isCreatingDefault, setIsCreatingDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingStages, setEditingStages] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Selecionar o pipeline padrão quando os pipelines carregarem
    if (safePipelines.length > 0 && !selectedPipeline) {
      const defaultPipeline = safePipelines.find(p => p.is_default) || safePipelines[0];
      setSelectedPipeline(defaultPipeline);
      setEditingStages([...(defaultPipeline?.stages || [])]);
    }
  }, [safePipelines, selectedPipeline]);

  useEffect(() => {
    // Atualizar estágios em edição quando o pipeline selecionado mudar
    if (selectedPipeline) {
      setEditingStages([...(selectedPipeline.stages || [])]);
      setHasUnsavedChanges(false);
    }
  }, [selectedPipeline]);

  const createDefaultPipeline = async () => {
    if (!currentUser?.company_id) {
      toast({
        title: "Erro",
        description: "Usuário não possui empresa associada.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingDefault(true);
    try {
      const defaultPipeline = {
        company_id: currentUser.company_id,
        name: "Pipeline Padrão",
        description: "Pipeline padrão de vendas",
        type: "vendas",
        is_default: true,
        stages: [
          { id: "1", name: "Qualificação", probability: 10, color: "#f59e0b", order: 1 },
          { id: "2", name: "Necessidades", probability: 25, color: "#3b82f6", order: 2 },
          { id: "3", name: "Proposta", probability: 50, color: "#8b5cf6", order: 3 },
          { id: "4", name: "Negociação", probability: 75, color: "#f97316", order: 4 },
          { id: "5", name: "Fechamento", probability: 90, color: "#10b981", order: 5 }
        ]
      };
      
      await CrmPipeline.create(defaultPipeline);
      toast({
        title: "Sucesso!",
        description: "Pipeline padrão criado com sucesso.",
      });
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao criar pipeline padrão:", error);
      toast({
        title: "Erro ao criar pipeline",
        description: "Não foi possível criar o pipeline padrão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingDefault(false);
    }
  };

  const handleAddStage = () => {
    const newStage = {
      id: Date.now().toString(),
      name: "Novo Estágio",
      color: "#6B7280",
      order: editingStages.length + 1,
      probability: 0
    };
    
    setEditingStages([...editingStages, newStage]);
    setHasUnsavedChanges(true);
  };

  const handleUpdateStage = (stageId, field, value) => {
    setEditingStages(prev => 
      prev.map(stage => 
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleRemoveStage = (stageId) => {
    if (editingStages.length <= 1) {
      toast({
        title: "Erro",
        description: "Um pipeline deve ter pelo menos um estágio.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingStages(prev => prev.filter(stage => stage.id !== stageId));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedPipeline || !selectedPipeline.id) {
      toast({
        title: "Erro",
        description: "Nenhum pipeline selecionado.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Reordenar estágios
      const sortedStages = editingStages.map((stage, index) => ({
        ...stage,
        order: index + 1
      }));

      await CrmPipeline.update(selectedPipeline.id, { 
        stages: sortedStages 
      });
      
      toast({
        title: "Sucesso!",
        description: "Pipeline atualizado com sucesso.",
      });
      
      setHasUnsavedChanges(false);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao salvar pipeline:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (selectedPipeline) {
      setEditingStages([...(selectedPipeline.stages || [])]);
      setHasUnsavedChanges(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Carregando pipelines...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (safePipelines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum pipeline encontrado</p>
            <Button 
              onClick={createDefaultPipeline}
              disabled={isCreatingDefault}
            >
              {isCreatingDefault ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Pipeline Padrão
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Pipeline de Vendas</CardTitle>
        {safePipelines.length > 1 && (
          <div className="flex gap-2 mt-2">
            {safePipelines.map(pipeline => (
              <Button
                key={pipeline.id}
                variant={selectedPipeline?.id === pipeline.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPipeline(pipeline)}
              >
                {pipeline.name}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedPipeline && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{selectedPipeline.name}</h3>
                <p className="text-sm text-gray-500">{selectedPipeline.description}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddStage} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Estágio
                </Button>
                {hasUnsavedChanges && (
                  <>
                    <Button 
                      onClick={handleDiscardChanges} 
                      size="sm" 
                      variant="ghost"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveChanges} 
                      size="sm"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Você tem alterações não salvas. Clique em "Salvar" para confirmar as mudanças.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {editingStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">{index + 1}.</span>
                    <input
                      type="color"
                      value={stage.color || "#6B7280"}
                      onChange={(e) => handleUpdateStage(stage.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                      title="Cor do estágio"
                    />
                  </div>
                  
                  <Input
                    placeholder="Nome do Estágio"
                    value={stage.name || ""}
                    onChange={(e) => handleUpdateStage(stage.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Probabilidade"
                      value={stage.probability || 0}
                      onChange={(e) => handleUpdateStage(stage.id, 'probability', parseInt(e.target.value) || 0)}
                      className="w-24"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStage(stage.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Remover estágio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {editingStages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum estágio definido para este pipeline</p>
                <p className="text-sm">Clique em "Adicionar Estágio" para começar</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}