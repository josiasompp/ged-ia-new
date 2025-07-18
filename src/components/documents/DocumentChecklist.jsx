import React, { useState, useEffect, useCallback } from 'react';
import { DocumentChecklist as ChecklistEntity } from '@/api/entities';
import { DocumentChecklistTemplate } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCheck, Info, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DocumentChecklist({ document, onRefresh }) {
  const [checklist, setChecklist] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [user, checklistData] = await Promise.all([
        User.me(),
        ChecklistEntity.filter({ document_id: document.id })
      ]);
      setCurrentUser(user);

      if (checklistData.length > 0) {
        setChecklist(checklistData[0]);
      } else {
        const availableTemplates = await DocumentChecklistTemplate.filter({ 
          document_category: document.category,
          is_active: true 
        });
        setTemplates(availableTemplates);
        setChecklist(null);
      }
    } catch (error) {
      console.error("Erro ao carregar checklist:", error);
      toast({ title: "Erro ao carregar dados do checklist", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [document.id, document.category, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) {
      toast({ title: "Selecione um template", variant: "destructive" });
      return;
    }
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const newChecklistData = {
      document_id: document.id,
      template_id: template.id,
      company_id: document.company_id,
      checklist_items: template.checklist_items.map(item => ({
        item_id: item.id,
        title: item.title,
        is_checked: false,
        checked_by: null,
        checked_at: null,
        notes: ''
      })),
      completion_percentage: 0
    };

    try {
      const newChecklist = await ChecklistEntity.create(newChecklistData);
      setChecklist(newChecklist);
      toast({ title: "Checklist aplicado com sucesso!" });
      if(onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao aplicar template:", error);
      toast({ title: "Erro ao aplicar o template.", variant: "destructive" });
    }
  };

  const handleCheckItem = async (itemId, isChecked) => {
    const updatedItems = checklist.checklist_items.map(item => 
      item.item_id === itemId 
        ? { ...item, is_checked: isChecked, checked_by: currentUser.email, checked_at: new Date().toISOString() } 
        : item
    );

    const completedCount = updatedItems.filter(item => item.is_checked).length;
    const totalCount = updatedItems.length;
    const completion_percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const updatedChecklistData = {
      ...checklist,
      checklist_items: updatedItems,
      completion_percentage: completion_percentage,
      last_checked_by: currentUser.email,
      last_checked_at: new Date().toISOString()
    };
    
    setChecklist(updatedChecklistData); // Optimistic update

    try {
      await ChecklistEntity.update(checklist.id, updatedChecklistData);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      toast({ title: "Erro ao salvar alteração.", variant: "destructive" });
      loadData(); // Revert on error
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-4"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!checklist) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Aplicar Checklist</h3>
        <p className="text-sm text-gray-600">Nenhum checklist associado. Selecione um template para começar.</p>
        
        {templates.length > 0 ? (
          <div className="space-y-3">
            <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleApplyTemplate} disabled={!selectedTemplate} className="w-full">Aplicar Template</Button>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Nenhum template de checklist encontrado para a categoria "{document.category}".</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex justify-between items-center">
            <span>Progresso do Checklist</span>
            <span className="font-bold text-blue-600">{Math.round(checklist.completion_percentage)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={checklist.completion_percentage} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {checklist.checklist_items.map((item) => (
          <div key={item.item_id} className="flex items-start p-3 bg-white rounded-lg border">
            <Checkbox
              id={`item-${item.item_id}`}
              checked={item.is_checked}
              onCheckedChange={(checked) => handleCheckItem(item.item_id, checked)}
              className="mt-1"
            />
            <div className="ml-3 flex-1">
              <Label htmlFor={`item-${item.item_id}`} className="font-medium text-sm">{item.title}</Label>
              {item.is_checked && (
                <p className="text-xs text-gray-500 mt-1">
                  Verificado por {item.checked_by?.split('@')[0]} em {format(new Date(item.checked_at), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}