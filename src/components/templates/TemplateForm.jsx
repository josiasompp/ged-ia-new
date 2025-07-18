
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";
import {
  FileText,
  Video,
  Image,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  GripVertical,
  Save
} from "lucide-react";

const categories = [
  { value: "servicos", label: "Serviços" },
  { value: "produtos", label: "Produtos" },
  { value: "consultoria", label: "Consultoria" },
  { value: "manutencao", label: "Manutenção" },
  { value: "outros", label: "Outros" }
];

const sectionTypes = [
  { value: "text", label: "Texto", icon: FileText },
  { value: "video", label: "Vídeo", icon: Video },
  { value: "image", label: "Imagem", icon: Image },
  { value: "pricing", label: "Preços", icon: DollarSign },
  { value: "timeline", label: "Cronograma", icon: Calendar }
];

const SectionEditor = ({ section, onUpdate, onDelete }) => {
  const sectionType = sectionTypes.find(t => t.value === section.type);
  const Icon = sectionType?.icon || FileText;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <Icon className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm">{section.title || "Nova Seção"}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(section.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Título da Seção</Label>
            <Input
              value={section.title}
              onChange={(e) => onUpdate(section.id, { title: e.target.value })}
              placeholder="Nome da seção"
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select
              value={section.type}
              onValueChange={(value) => onUpdate(section.id, { type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {section.type === 'video' && (
          <div>
            <Label>URL do Vídeo (YouTube/Vimeo)</Label>
            <Input
              value={section.video_url || ''}
              onChange={(e) => onUpdate(section.id, { video_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        )}

        <div>
          <Label>Conteúdo</Label>
          <Textarea
            value={section.content}
            onChange={(e) => onUpdate(section.id, { content: e.target.value })}
            placeholder="Conteúdo da seção..."
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${section.id}`}
            checked={section.is_required}
            onChange={(e) => onUpdate(section.id, { is_required: e.target.checked })}
          />
          <Label htmlFor={`required-${section.id}`}>Seção obrigatória</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default function TemplateForm({ template, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sections: [],
    is_default: false,
    is_active: true
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData(template);
    }
  }, [template]);

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "",
      type: "text",
      content: "",
      order: formData.sections.length + 1,
      is_required: false
    };

    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, updates) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sections = Array.from(formData.sections);
    const [reorderedItem] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedItem);

    // Atualizar a ordem
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index + 1
    }));

    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Erro ao salvar template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {template ? "Editar Template" : "Novo Template de Proposta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Template *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do template"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do template..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                  />
                  <Label htmlFor="is_default">Template padrão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seções do Template */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Seções do Template</CardTitle>
                <Button type="button" onClick={addSection} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Seção
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {formData.sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SectionEditor
                                section={section}
                                onUpdate={updateSection}
                                onDelete={deleteSection}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {formData.sections.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Adicione seções ao seu template</p>
                  <Button type="button" onClick={addSection} variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Primeira Seção
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !formData.name || !formData.category}
              className="bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {template ? "Atualizar Template" : "Criar Template"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
