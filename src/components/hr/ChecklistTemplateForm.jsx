import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, FileCheck, Users, Building2 } from 'lucide-react';
import { DocumentChecklistTemplate } from '@/api/entities';
import { User } from '@/api/entities';

// Lista de cargos mais comuns no Brasil
const commonPositions = [
  'Analista', 'Assistente', 'Auxiliar', 'Coordenador', 'Supervisor', 'Gerente', 'Diretor',
  'Estagiário', 'Trainee', 'Consultor', 'Especialista', 'Técnico', 'Operador', 'Vendedor',
  'Atendente', 'Recepcionista', 'Secretária', 'Contador', 'Advogado', 'Engenheiro'
];

const contractTypes = [
  { value: 'clt', label: 'CLT' },
  { value: 'pj', label: 'PJ' },
  { value: 'estagio', label: 'Estágio' },
  { value: 'terceirizado', label: 'Terceirizado' },
  { value: 'temporario', label: 'Temporário' },
  { value: 'autonomo', label: 'Autônomo' }
];

export default function ChecklistTemplateForm({ template, documentTypes, departments, onSave, onClose }) {
  const [formData, setFormData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newPosition, setNewPosition] = useState('');
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await User.me();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (template) {
      setFormData({
        ...template,
        applies_to_positions: template.applies_to_positions || [],
        applies_to_contract_types: template.applies_to_contract_types || [],
        applies_to_departments: template.applies_to_departments || [],
        required_document_types: template.required_document_types || []
      });
      setSelectedDocumentTypes(template.required_document_types || []);
    } else {
      setFormData({
        name: '',
        description: '',
        template_type: 'admissao',
        applies_to_positions: [],
        applies_to_contract_types: [],
        applies_to_departments: [],
        required_document_types: [],
        checklist_items: [],
        auto_apply_on_hiring: false,
        completion_triggers_workflow: false,
        is_active: true,
        priority: 0
      });
      setSelectedDocumentTypes([]);
    }
  }, [template]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPosition = (position) => {
    if (position && !formData.applies_to_positions.includes(position)) {
      handleChange('applies_to_positions', [...formData.applies_to_positions, position]);
      setNewPosition('');
    }
  };

  const removePosition = (position) => {
    handleChange('applies_to_positions', formData.applies_to_positions.filter(p => p !== position));
  };

  const toggleContractType = (contractType) => {
    const current = formData.applies_to_contract_types;
    if (current.includes(contractType)) {
      handleChange('applies_to_contract_types', current.filter(t => t !== contractType));
    } else {
      handleChange('applies_to_contract_types', [...current, contractType]);
    }
  };

  const toggleDepartment = (departmentId) => {
    const current = formData.applies_to_departments;
    if (current.includes(departmentId)) {
      handleChange('applies_to_departments', current.filter(d => d !== departmentId));
    } else {
      handleChange('applies_to_departments', [...current, departmentId]);
    }
  };

  const toggleDocumentType = (docType) => {
    const exists = selectedDocumentTypes.find(dt => dt.hr_document_type_id === docType.id);
    if (exists) {
      const updated = selectedDocumentTypes.filter(dt => dt.hr_document_type_id !== docType.id);
      setSelectedDocumentTypes(updated);
      handleChange('required_document_types', updated);
    } else {
      const newDocType = {
        hr_document_type_id: docType.id,
        is_mandatory: true,
        deadline_days: 7,
        can_be_submitted_later: false
      };
      const updated = [...selectedDocumentTypes, newDocType];
      setSelectedDocumentTypes(updated);
      handleChange('required_document_types', updated);
    }
  };

  const updateDocumentTypeConfig = (docTypeId, field, value) => {
    const updated = selectedDocumentTypes.map(dt => 
      dt.hr_document_type_id === docTypeId 
        ? { ...dt, [field]: value }
        : dt
    );
    setSelectedDocumentTypes(updated);
    handleChange('required_document_types', updated);
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData, company_id: currentUser.company_id };
      
      if (template) {
        await DocumentChecklistTemplate.update(template.id, dataToSave);
      } else {
        await DocumentChecklistTemplate.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Erro ao salvar template:", error);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar' : 'Criar'} Template de Checklist</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="positions">Cargos</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Checklist Admissão Analista"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template_type">Tipo do Template</Label>
                <Select value={formData.template_type} onValueChange={(v) => handleChange('template_type', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admissao">Admissão</SelectItem>
                    <SelectItem value="promocao">Promoção</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="desligamento">Desligamento</SelectItem>
                    <SelectItem value="periodico">Periódico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva o propósito deste template..."
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Cargos Aplicáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="Digite um cargo..."
                    onKeyPress={(e) => e.key === 'Enter' && addPosition(newPosition)}
                  />
                  <Button onClick={() => addPosition(newPosition)} disabled={!newPosition}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Cargos comuns:</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonPositions.map(position => (
                      <Button
                        key={position}
                        variant="outline"
                        size="sm"
                        onClick={() => addPosition(position)}
                        disabled={formData.applies_to_positions.includes(position)}
                      >
                        {position}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Cargos selecionados:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.applies_to_positions.map(position => (
                      <Badge key={position} variant="secondary" className="flex items-center gap-1">
                        {position}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removePosition(position)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipos de Contrato:</Label>
                  <div className="flex flex-wrap gap-2">
                    {contractTypes.map(contractType => (
                      <div key={contractType.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={contractType.value}
                          checked={formData.applies_to_contract_types.includes(contractType.value)}
                          onCheckedChange={() => toggleContractType(contractType.value)}
                        />
                        <label htmlFor={contractType.value} className="text-sm">
                          {contractType.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Departamentos:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.map(department => (
                      <div key={department.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={department.id}
                          checked={formData.applies_to_departments.includes(department.id)}
                          onCheckedChange={() => toggleDepartment(department.id)}
                        />
                        <label htmlFor={department.id} className="text-sm">
                          {department.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Tipos de Documento Obrigatórios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentTypes.map(docType => {
                    const isSelected = selectedDocumentTypes.find(dt => dt.hr_document_type_id === docType.id);
                    return (
                      <Card key={docType.id} className={`border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={!!isSelected}
                                onCheckedChange={() => toggleDocumentType(docType)}
                              />
                              <div>
                                <h4 className="font-medium">{docType.name}</h4>
                                <p className="text-xs text-gray-500">{docType.abbreviated_name}</p>
                              </div>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="mt-3 space-y-2 border-t pt-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isSelected.is_mandatory}
                                  onCheckedChange={(checked) => updateDocumentTypeConfig(docType.id, 'is_mandatory', checked)}
                                />
                                <label className="text-sm">Obrigatório</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isSelected.can_be_submitted_later}
                                  onCheckedChange={(checked) => updateDocumentTypeConfig(docType.id, 'can_be_submitted_later', checked)}
                                />
                                <label className="text-sm">Pode ser enviado depois</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="text-sm">Prazo (dias):</label>
                                <Input
                                  type="number"
                                  value={isSelected.deadline_days}
                                  onChange={(e) => updateDocumentTypeConfig(docType.id, 'deadline_days', parseInt(e.target.value))}
                                  className="w-20"
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.auto_apply_on_hiring}
                  onCheckedChange={(checked) => handleChange('auto_apply_on_hiring', checked)}
                />
                <label className="text-sm font-medium">Aplicar automaticamente em processos de contratação</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.completion_triggers_workflow}
                  onCheckedChange={(checked) => handleChange('completion_triggers_workflow', checked)}
                />
                <label className="text-sm font-medium">Conclusão dispara workflow de aprovação</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <label className="text-sm font-medium">Template ativo</label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade (0-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
                <p className="text-xs text-gray-500">Maior número = maior prioridade. Usado quando múltiplos templates se aplicam.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}