
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added this import
import { Map, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Simulação da entidade CboChecklistMapping
const CboChecklistMapping = {
    async list() { return this.data || []; },
    async create(record) { this.data = [...(this.data || []), { ...record, id: Date.now().toString() }]; return record; },
    async update(id, record) { this.data = (this.data || []).map(r => r.id === id ? { ...r, ...record } : r); return record; },
    async delete(id) { this.data = (this.data || []).filter(r => r.id !== id); },
    data: []
};

// Simulação da entidade DocumentChecklistTemplate
const DocumentChecklistTemplate = {
    async list() { 
        return [
            { id: 'template1', name: 'Checklist Admissão - Analista' },
            { id: 'template2', name: 'Checklist Admissão - Gerente' },
            { id: 'template3', name: 'Checklist Admissão - Operacional' }
        ]; 
    }
};

export default function CboMapping() {
  const [mappings, setMappings] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMapping, setCurrentMapping] = useState({ cbo_code: '', position_name: '', checklist_template_id: '' });
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [mappingsData, templatesData] = await Promise.all([
        CboChecklistMapping.list(),
        DocumentChecklistTemplate.list()
      ]);
      setMappings(mappingsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (field, value) => {
    setCurrentMapping(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentMapping.cbo_code || !currentMapping.checklist_template_id) {
      toast({ title: "Campos obrigatórios", description: "CBO e Template são obrigatórios.", variant: "destructive" });
      return;
    }
    
    try {
      if (isEditing) {
        await CboChecklistMapping.update(currentMapping.id, currentMapping);
        toast({ title: "Mapeamento atualizado com sucesso!" });
      } else {
        await CboChecklistMapping.create(currentMapping);
        toast({ title: "Mapeamento criado com sucesso!" });
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar mapeamento:", error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleEdit = (mapping) => {
    setIsEditing(true);
    setCurrentMapping(mapping);
  };

  const handleDelete = async (id) => {
    try {
      await CboChecklistMapping.delete(id);
      toast({ title: "Mapeamento removido com sucesso!" });
      loadData();
    } catch (error) {
      console.error("Erro ao remover mapeamento:", error);
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentMapping({ cbo_code: '', position_name: '', checklist_template_id: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Mapeamento CBO x Checklist
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Vincule os códigos CBO aos templates de checklist para automatizar admissões.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Mapeamento' : 'Novo Mapeamento'}</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar ou editar um vínculo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="cbo_code">Código CBO</Label>
            <Input 
              id="cbo_code" 
              placeholder="Ex: 2522-10" 
              value={currentMapping.cbo_code}
              onChange={(e) => handleInputChange('cbo_code', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position_name">Nome do Cargo (Opcional)</Label>
            <Input 
              id="position_name" 
              placeholder="Ex: Analista de RH"
              value={currentMapping.position_name}
              onChange={(e) => handleInputChange('position_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checklist_template_id">Template de Checklist</Label>
            <Select
              value={currentMapping.checklist_template_id}
              onValueChange={(value) => handleInputChange('checklist_template_id', value)}
            >
              <SelectTrigger id="checklist_template_id">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="w-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              {isEditing ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={resetForm} className="w-full">Cancelar</Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mapeamentos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código CBO</TableHead>
                <TableHead>Nome do Cargo</TableHead>
                <TableHead>Template de Checklist Vinculado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan="4">Carregando...</TableCell></TableRow>
              ) : mappings.length === 0 ? (
                <TableRow><TableCell colSpan="4" className="text-center">Nenhum mapeamento encontrado.</TableCell></TableRow>
              ) : (
                mappings.map(mapping => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono">{mapping.cbo_code}</TableCell>
                    <TableCell>{mapping.position_name}</TableCell>
                    <TableCell>{templates.find(t => t.id === mapping.checklist_template_id)?.name || 'Template não encontrado'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(mapping)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(mapping.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
