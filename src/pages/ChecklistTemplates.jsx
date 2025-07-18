import React, { useState, useEffect, useCallback } from 'react';
import { DocumentChecklistTemplate } from '@/api/entities';
import { HrDocumentType } from '@/api/entities';
import { Department } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, CheckSquare, Users, Building2, FileCheck } from 'lucide-react';
import ChecklistTemplateForm from '@/components/hr/ChecklistTemplateForm';

export default function ChecklistTemplates() {
  const [templates, setTemplates] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [templatesData, docTypesData, deptsData] = await Promise.all([
        DocumentChecklistTemplate.list('-created_date'),
        HrDocumentType.list(),
        Department.list()
      ]);
      setTemplates(templatesData);
      setDocumentTypes(docTypesData);
      setDepartments(deptsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddNew = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
    loadData();
  };

  const getTemplateTypeColor = (type) => {
    const colors = {
      admissao: 'bg-green-100 text-green-800',
      promocao: 'bg-blue-100 text-blue-800',
      transferencia: 'bg-purple-100 text-purple-800',
      desligamento: 'bg-red-100 text-red-800',
      periodico: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTemplateTypeLabel = (type) => {
    const labels = {
      admissao: 'Admissão',
      promocao: 'Promoção',
      transferencia: 'Transferência',
      desligamento: 'Desligamento',
      periodico: 'Periódico'
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Templates de Checklist
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Configure checklists automáticos para processos de RH baseados nos tipos de documento.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg">
          <PlusCircle className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge className={getTemplateTypeColor(template.template_type)}>
                    {getTemplateTypeLabel(template.template_type)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileCheck className="w-4 h-4 text-gray-500" />
                    <span>{template.required_document_types?.length || 0} tipos de documento</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{template.applies_to_positions?.length || 0} cargos aplicáveis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>{template.applies_to_departments?.length || 0} departamentos</span>
                  </div>
                </div>
                
                {template.auto_apply_on_hiring && (
                  <Badge variant="outline" className="text-xs">
                    Auto-aplicar na contratação
                  </Badge>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <Button variant="outline" onClick={() => handleEdit(template)} className="w-full gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ChecklistTemplateForm
          template={selectedTemplate}
          documentTypes={documentTypes}
          departments={departments}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}