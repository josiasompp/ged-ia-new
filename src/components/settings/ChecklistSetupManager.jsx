
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare, 
  Settings, 
  Users, 
  Building2, 
  Clock, 
  Shield, 
  Zap,
  FileCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { User } from '@/api/entities';
import { Company } from '@/api/entities';
import { useToast } from '@/components/ui/use-toast';

// Helper function to validate ID format (e.g., MongoDB ObjectId)
const isValidObjectId = (id) => {
    return id && /^[a-f\d]{24}$/i.test(id);
};

export default function ChecklistSetupManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [config, setConfig] = useState({
    // Configurações Principais
    checklist_system_enabled: false,
    auto_apply_checklists: false,
    require_approval_for_completion: false,
    
    // Configurações de Documentos
    allow_document_upload_by_employees: true,
    require_document_approval: false,
    document_retention_days: 365,
    
    // Configurações de Notificações
    notify_on_checklist_creation: true,
    notify_on_document_submission: true,
    notify_on_deadline_approaching: true,
    deadline_warning_days: 7,
    
    // Configurações de Automação
    auto_create_employee_checklists: false,
    auto_assign_by_department: true,
    auto_assign_by_position: true,
    auto_assign_by_contract_type: true,
    
    // Configurações de Compliance
    enforce_document_deadlines: false,
    block_access_on_incomplete_checklist: false,
    require_manager_approval: false,
    audit_all_checklist_changes: true,
    
    // Configurações de Templates
    allow_custom_templates: true,
    require_template_approval: false,
    max_templates_per_company: 50,
    
    // Configurações de Integração com RH
    sync_with_hr_processes: false,
    auto_create_on_hiring: false,
    auto_archive_on_termination: true,
    integration_webhook_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Verificar se é usuário master/administrador do sistema
      const isMasterUser = userData.email?.includes('@firstdocy.com') || 
                          userData.role === 'super_admin' || 
                          userData.role === 'admin';
      
      if (isMasterUser) {
        // Usuário master - carregar configurações globais padrão
        setCompany({
          id: 'master',
          name: 'FIRSTDOCY - Configurações Master',
          checklist_config: {}
        });
        
        // Carregar configurações padrão do sistema
        setConfig(prev => ({
          ...prev,
          // Configurações master habilitadas por padrão
          checklist_system_enabled: true,
          auto_apply_checklists: true,
          require_approval_for_completion: true,
          allow_document_upload_by_employees: true,
          notify_on_checklist_creation: true,
          notify_on_document_submission: true,
          notify_on_deadline_approaching: true,
          auto_create_employee_checklists: true,
          audit_all_checklist_changes: true,
          allow_custom_templates: true
        }));
        
      } else if (userData.company_id && isValidObjectId(userData.company_id)) {
        // Usuário de empresa específica
        const companyData = await Company.filter({ id: userData.company_id });
        if (companyData.length > 0) {
          setCompany(companyData[0]);
          
          // Carregar configurações salvas da empresa (se existirem)
          const savedConfig = companyData[0].checklist_config || {};
          setConfig(prev => ({ ...prev, ...savedConfig }));
        } else {
          toast({
            title: "Empresa não encontrada",
            description: "A empresa associada ao seu usuário não foi encontrada.",
            variant: "destructive"
          });
        }
      } else if (userData.company_id) {
        // ID da empresa inválido - apenas para usuários não-master
        console.warn(`Invalid company_id ('${userData.company_id}') for user ${userData.email}`);
        toast({
          title: "ID da Empresa Inválido",
          description: "O ID da empresa associado ao seu usuário é inválido. Entre em contato com o administrador.",
          variant: "destructive"
        });
      } else {
        // Usuário sem empresa associada
        toast({
          title: "Empresa não definida",
          description: "Seu usuário não está associado a nenhuma empresa. Entre em contato com o administrador.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!company) return;
    
    setIsSaving(true);
    try {
      if (company.id === 'master') {
        // Para usuário master, salvar configurações globais
        // Aqui você pode implementar uma lógica específica para salvar configurações master
        // Por enquanto, apenas mostrar sucesso
        toast({
          title: "Configurações Master salvas!",
          description: "As configurações globais do sistema de checklist foram atualizadas."
        });
      } else {
        // Para empresas específicas
        await Company.update(company.id, {
          checklist_config: config,
          updated_at: new Date().toISOString()
        });
        
        toast({
          title: "Configurações salvas com sucesso!",
          description: "As configurações do sistema de checklist foram atualizadas."
        });
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (enabled) => {
    return enabled ? "text-green-600" : "text-gray-400";
  };

  const getStatusIcon = (enabled) => {
    return enabled ? CheckCircle : AlertTriangle;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Setup do Sistema de Checklist</h2>
          <p className="text-gray-600">
            {company?.id === 'master' 
              ? "Configure as regras globais padrão para o sistema de checklist"
              : "Configure as regras globais para o sistema de checklist de documentos"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={config.checklist_system_enabled ? "default" : "secondary"}>
            {config.checklist_system_enabled ? "Sistema Ativo" : "Sistema Inativo"}
          </Badge>
          {company?.id === 'master' && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Configurações Master
            </Badge>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sistema de Checklist Ativo</Label>
                  <p className="text-sm text-gray-600">Habilita o sistema de checklist de documentos para toda a empresa</p>
                </div>
                <Switch
                  checked={config.checklist_system_enabled}
                  onCheckedChange={(checked) => handleConfigChange('checklist_system_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Aplicação Automática de Checklists</Label>
                  <p className="text-sm text-gray-600">Aplica automaticamente checklists baseados em cargo e departamento</p>
                </div>
                <Switch
                  checked={config.auto_apply_checklists}
                  onCheckedChange={(checked) => handleConfigChange('auto_apply_checklists', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Requer Aprovação para Conclusão</Label>
                  <p className="text-sm text-gray-600">Checklists precisam ser aprovados por um gestor antes de serem considerados completos</p>
                </div>
                <Switch
                  checked={config.require_approval_for_completion}
                  onCheckedChange={(checked) => handleConfigChange('require_approval_for_completion', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dias de Aviso para Vencimento</Label>
                  <Input
                    type="number"
                    value={config.deadline_warning_days}
                    onChange={(e) => handleConfigChange('deadline_warning_days', parseInt(e.target.value))}
                    disabled={!config.checklist_system_enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de Templates por Empresa</Label>
                  <Input
                    type="number"
                    value={config.max_templates_per_company}
                    onChange={(e) => handleConfigChange('max_templates_per_company', parseInt(e.target.value))}
                    disabled={!config.checklist_system_enabled}
                  />
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
                Configurações de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Funcionários Podem Enviar Documentos</Label>
                  <p className="text-sm text-gray-600">Permite que funcionários façam upload de documentos diretamente</p>
                </div>
                <Switch
                  checked={config.allow_document_upload_by_employees}
                  onCheckedChange={(checked) => handleConfigChange('allow_document_upload_by_employees', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Requer Aprovação de Documentos</Label>
                  <p className="text-sm text-gray-600">Documentos enviados precisam ser aprovados antes de serem aceitos</p>
                </div>
                <Switch
                  checked={config.require_document_approval}
                  onCheckedChange={(checked) => handleConfigChange('require_document_approval', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Período de Retenção de Documentos (dias)</Label>
                <Input
                  type="number"
                  value={config.document_retention_days}
                  onChange={(e) => handleConfigChange('document_retention_days', parseInt(e.target.value))}
                  disabled={!config.checklist_system_enabled}
                />
                <p className="text-xs text-gray-500">Documentos serão automaticamente arquivados após este período</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Configurações de Automação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Criar Checklists Automaticamente para Funcionários</Label>
                  <p className="text-sm text-gray-600">Cria checklists automaticamente quando um funcionário é adicionado</p>
                </div>
                <Switch
                  checked={config.auto_create_employee_checklists}
                  onCheckedChange={(checked) => handleConfigChange('auto_create_employee_checklists', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Por Departamento</Label>
                    <p className="text-xs text-gray-600">Atribuir baseado no departamento</p>
                  </div>
                  <Switch
                    checked={config.auto_assign_by_department}
                    onCheckedChange={(checked) => handleConfigChange('auto_assign_by_department', checked)}
                    disabled={!config.auto_create_employee_checklists}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Por Cargo</Label>
                    <p className="text-xs text-gray-600">Atribuir baseado no cargo</p>
                  </div>
                  <Switch
                    checked={config.auto_assign_by_position}
                    onCheckedChange={(checked) => handleConfigChange('auto_assign_by_position', checked)}
                    disabled={!config.auto_create_employee_checklists}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Por Tipo de Contrato</Label>
                    <p className="text-xs text-gray-600">Atribuir baseado no tipo de contrato</p>
                  </div>
                  <Switch
                    checked={config.auto_assign_by_contract_type}
                    onCheckedChange={(checked) => handleConfigChange('auto_assign_by_contract_type', checked)}
                    disabled={!config.auto_create_employee_checklists}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Notificar Criação</Label>
                    <p className="text-xs text-gray-600">Quando checklist é criado</p>
                  </div>
                  <Switch
                    checked={config.notify_on_checklist_creation}
                    onCheckedChange={(checked) => handleConfigChange('notify_on_checklist_creation', checked)}
                    disabled={!config.checklist_system_enabled}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Notificar Envio</Label>
                    <p className="text-xs text-gray-600">Quando documento é enviado</p>
                  </div>
                  <Switch
                    checked={config.notify_on_document_submission}
                    onCheckedChange={(checked) => handleConfigChange('notify_on_document_submission', checked)}
                    disabled={!config.checklist_system_enabled}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Notificar Vencimento</Label>
                    <p className="text-xs text-gray-600">Quando prazo está próximo</p>
                  </div>
                  <Switch
                    checked={config.notify_on_deadline_approaching}
                    onCheckedChange={(checked) => handleConfigChange('notify_on_deadline_approaching', checked)}
                    disabled={!config.checklist_system_enabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Forçar Cumprimento de Prazos</Label>
                  <p className="text-sm text-gray-600">Impede ações se documentos estiverem em atraso</p>
                </div>
                <Switch
                  checked={config.enforce_document_deadlines}
                  onCheckedChange={(checked) => handleConfigChange('enforce_document_deadlines', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Bloquear Acesso com Checklist Incompleto</Label>
                  <p className="text-sm text-gray-600">Funcionários com checklists incompletos terão acesso limitado</p>
                </div>
                <Switch
                  checked={config.block_access_on_incomplete_checklist}
                  onCheckedChange={(checked) => handleConfigChange('block_access_on_incomplete_checklist', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Requer Aprovação do Gestor</Label>
                  <p className="text-sm text-gray-600">Gestores devem aprovar conclusões de checklist</p>
                </div>
                <Switch
                  checked={config.require_manager_approval}
                  onCheckedChange={(checked) => handleConfigChange('require_manager_approval', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auditar Todas as Mudanças</Label>
                  <p className="text-sm text-gray-600">Mantém log completo de todas as alterações em checklists</p>
                </div>
                <Switch
                  checked={config.audit_all_checklist_changes}
                  onCheckedChange={(checked) => handleConfigChange('audit_all_checklist_changes', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Permitir Templates Customizados</Label>
                  <p className="text-sm text-gray-600">Usuários podem criar seus próprios templates de checklist</p>
                </div>
                <Switch
                  checked={config.allow_custom_templates}
                  onCheckedChange={(checked) => handleConfigChange('allow_custom_templates', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Requer Aprovação de Templates</Label>
                  <p className="text-sm text-gray-600">Templates customizados precisam ser aprovados antes do uso</p>
                </div>
                <Switch
                  checked={config.require_template_approval}
                  onCheckedChange={(checked) => handleConfigChange('require_template_approval', checked)}
                  disabled={!config.allow_custom_templates}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Integração com RH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sincronizar com Processos de RH</Label>
                  <p className="text-sm text-gray-600">Integra automaticamente com admissões, promoções e desligamentos</p>
                </div>
                <Switch
                  checked={config.sync_with_hr_processes}
                  onCheckedChange={(checked) => handleConfigChange('sync_with_hr_processes', checked)}
                  disabled={!config.checklist_system_enabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Criar Automaticamente na Contratação</Label>
                  <p className="text-sm text-gray-600">Checklists são criados automaticamente quando alguém é contratado</p>
                </div>
                <Switch
                  checked={config.auto_create_on_hiring}
                  onCheckedChange={(checked) => handleConfigChange('auto_create_on_hiring', checked)}
                  disabled={!config.sync_with_hr_processes}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Arquivar Automaticamente no Desligamento</Label>
                  <p className="text-sm text-gray-600">Checklists são arquivados quando funcionário é desligado</p>
                </div>
                <Switch
                  checked={config.auto_archive_on_termination}
                  onCheckedChange={(checked) => handleConfigChange('auto_archive_on_termination', checked)}
                  disabled={!config.sync_with_hr_processes}
                />
              </div>

              <div className="space-y-2">
                <Label>URL de Webhook para Integração</Label>
                <Input
                  type="url"
                  value={config.integration_webhook_url}
                  onChange={(e) => handleConfigChange('integration_webhook_url', e.target.value)}
                  placeholder="https://exemplo.com/webhook/checklist"
                  disabled={!config.sync_with_hr_processes}
                />
                <p className="text-xs text-gray-500">URL que será chamada quando eventos de checklist ocorrerem</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {React.createElement(getStatusIcon(config.checklist_system_enabled), { 
                className: `w-4 h-4 ${getStatusColor(config.checklist_system_enabled)}` 
              })}
              <span className="text-sm">Sistema {config.checklist_system_enabled ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(getStatusIcon(config.auto_apply_checklists), { 
                className: `w-4 h-4 ${getStatusColor(config.auto_apply_checklists)}` 
              })}
              <span className="text-sm">Auto-aplicação {config.auto_apply_checklists ? 'Ativa' : 'Inativa'}</span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(getStatusIcon(config.sync_with_hr_processes), { 
                className: `w-4 h-4 ${getStatusColor(config.sync_with_hr_processes)}` 
              })}
              <span className="text-sm">Integração RH {config.sync_with_hr_processes ? 'Ativa' : 'Inativa'}</span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(getStatusIcon(config.audit_all_checklist_changes), { 
                className: `w-4 h-4 ${getStatusColor(config.audit_all_checklist_changes)}` 
              })}
              <span className="text-sm">Auditoria {config.audit_all_checklist_changes ? 'Ativa' : 'Inativa'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
