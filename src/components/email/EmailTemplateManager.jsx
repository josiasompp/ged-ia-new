
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  Copy,
  Zap
} from 'lucide-react';
import { EmailTemplate } from '@/api/entities';

const DEFAULT_TEMPLATES = [
  {
    name: 'Proposta Aceita',
    template_key: 'proposal_accepted',
    subject_template: 'Proposta #{{proposal_number}} - Aceita pelo Cliente',
    category: 'proposals',
    trigger_events: ['proposal_accepted'],
    variables: [
      { key: 'client_name', description: 'Nome do cliente', required: true },
      { key: 'proposal_number', description: 'Número da proposta', required: true },
      { key: 'proposal_title', description: 'Título da proposta', required: true },
      { key: 'proposal_value', description: 'Valor da proposta', required: false },
    ],
    body_html_template: `
      <h2>🎉 Proposta Aceita!</h2>
      <p>Olá!</p>
      <p>Temos uma ótima notícia! A proposta <strong>{{proposal_title}}</strong> foi aceita pelo cliente <strong>{{client_name}}</strong>.</p>
      <p><strong>Detalhes:</strong></p>
      <ul>
        <li>Número: #{{proposal_number}}</li>
        <li>Cliente: {{client_name}}</li>
        <li>Valor: {{proposal_value}}</li>
      </ul>
      <p>Próximos passos: Entre em contato com o cliente para dar andamento ao projeto.</p>
      <hr>
      <p><em>FIRSTDOCY GED AI - Sistema de Gestão</em></p>
    `
  },
  {
    name: 'Documento Aprovado',
    template_key: 'document_approved',
    subject_template: 'Documento "{{document_title}}" foi aprovado',
    category: 'documents',
    trigger_events: ['document_approved'],
    variables: [
      { key: 'document_title', description: 'Título do documento', required: true },
      { key: 'approved_by', description: 'Usuário que aprovou', required: true },
      { key: 'department_name', description: 'Nome do departamento', required: false },
    ],
    body_html_template: `
      <h2>✅ Documento Aprovado</h2>
      <p>O documento <strong>{{document_title}}</strong> foi aprovado com sucesso.</p>
      <p><strong>Aprovado por:</strong> {{approved_by}}</p>
      <p><strong>Departamento:</strong> {{department_name}}</p>
      <p>O documento está agora disponível para consulta no sistema.</p>
      <hr>
      <p><em>FIRSTDOCY GED AI - Sistema de Gestão</em></p>
    `
  },
  {
    name: 'Lembrete de Tarefa',
    template_key: 'task_reminder',
    subject_template: 'Lembrete: Tarefa "{{task_title}}" vence em breve',
    category: 'notifications',
    trigger_events: ['task_deadline_approaching'],
    variables: [
      { key: 'task_title', description: 'Título da tarefa', required: true },
      { key: 'due_date', description: 'Data de vencimento', required: true },
      { key: 'assigned_to', description: 'Responsável pela tarefa', required: true },
    ],
    body_html_template: `
      <h2>⏰ Lembrete de Tarefa</h2>
      <p>Olá {{assigned_to}},</p>
      <p>A tarefa <strong>{{task_title}}</strong> vence em breve.</p>
      <p><strong>Data de vencimento:</strong> {{due_date}}</p>
      <p>Acesse o sistema para visualizar detalhes e marcar como concluída.</p>
      <hr>
      <p><em>FIRSTDOCY GED AI - Sistema de Gestão</em></p>
    `
  }
];

export default function EmailTemplateManager({ templates, onRefresh, currentUser }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    template_key: '',
    subject_template: '',
    body_html_template: '',
    body_text_template: '',
    category: 'notifications',
    auto_send: false,
    is_active: true,
    variables: []
  });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!currentUser?.company_id) {
      toast({
        title: "Ação não permitida",
        description: "Apenas usuários de empresas podem criar templates.",
        variant: "destructive",
      });
      return;
    }
    setEditingTemplate(null);
    setFormData({
      name: '',
      template_key: '',
      subject_template: '',
      body_html_template: '',
      body_text_template: '',
      category: 'notifications',
      auto_send: false,
      is_active: true,
      variables: []
    });
    setShowDialog(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData(template);
    setShowDialog(true);
  };

  const handleUseDefault = (defaultTemplate) => {
    if (!currentUser?.company_id) {
      toast({
        title: "Ação não permitida",
        description: "Você precisa pertencer a uma empresa para usar templates.",
        variant: "destructive",
      });
      return;
    }
    setEditingTemplate(null);
    setFormData({
      ...defaultTemplate,
      company_id: currentUser.company_id,
      is_active: true,
      auto_send: false
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.template_key || !formData.subject_template) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, chave e assunto do template.",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser?.company_id) {
      toast({
        title: "Empresa não encontrada",
        description: "Não é possível salvar. O seu usuário não está associado a uma empresa.",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        company_id: currentUser.company_id
      };

      if (editingTemplate) {
        await EmailTemplate.update(editingTemplate.id, dataToSave);
        toast({
          title: "Template atualizado!",
          description: "O template de email foi atualizado com sucesso."
        });
      } else {
        await EmailTemplate.create(dataToSave);
        toast({
          title: "Template criado!",
          description: "O template de email foi criado com sucesso."
        });
      }

      setShowDialog(false);
      onRefresh();

    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (template) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      await EmailTemplate.delete(template.id);
      toast({
        title: "Template excluído",
        description: "O template foi excluído com sucesso."
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header e Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Templates de Email</h3>
          <p className="text-gray-600">Configure templates para notificações automáticas</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      {/* Templates Padrão */}
      {templates.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Templates Prontos para Usar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Comece rapidamente com nossos templates pré-configurados:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {DEFAULT_TEMPLATES.map((template, index) => (
                <Card key={index} className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900">{template.name}</h4>
                    <p className="text-sm text-blue-700 mb-3">{template.subject_template}</p>
                    <Badge className="bg-blue-100 text-blue-800 mb-3">
                      {template.category}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleUseDefault(template)}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Templates */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{template.name}</h4>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    {template.auto_send && (
                      <Badge className="bg-green-100 text-green-800">
                        <Zap className="w-3 h-3 mr-1" />
                        Auto-envio
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Assunto:</strong> {template.subject_template}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Chave:</strong> {template.template_key}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(template)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Proposta Aceita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template_key">Chave Única *</Label>
                <Input
                  id="template_key"
                  value={formData.template_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_key: e.target.value }))}
                  placeholder="Ex: proposal_accepted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                value={formData.subject_template}
                onChange={(e) => setFormData(prev => ({ ...prev, subject_template: e.target.value }))}
                placeholder="Use variáveis: {{variable_name}}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_html">Corpo do Email (HTML)</Label>
              <Textarea
                id="body_html"
                value={formData.body_html_template}
                onChange={(e) => setFormData(prev => ({ ...prev, body_html_template: e.target.value }))}
                placeholder="Corpo do email em HTML com variáveis {{variable_name}}"
                rows={10}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notifications">Notificações</SelectItem>
                    <SelectItem value="proposals">Propostas</SelectItem>
                    <SelectItem value="documents">Documentos</SelectItem>
                    <SelectItem value="hr">Recursos Humanos</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto_send"
                    checked={formData.auto_send}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_send: checked }))}
                  />
                  <Label htmlFor="auto_send">Auto-envio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? 'Atualizar' : 'Criar'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
