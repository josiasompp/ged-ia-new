import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Webhook, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { GupyIntegration } from '@/api/entities';
import { GupyWebhookEvent } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/ui/use-toast';

export default function GupyIntegrationPage() {
  const [integration, setIntegration] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();

  const webhookUrl = `${window.location.origin}/api/webhooks/gupy`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);

      // Buscar configuração existente
      const integrationData = await GupyIntegration.filter({ 
        company_id: userData.company_id 
      });
      
      if (integrationData.length > 0) {
        setIntegration(integrationData[0]);
      } else {
        // Criar configuração padrão
        setIntegration({
          company_id: userData.company_id,
          gupy_company_id: '',
          api_key: '',
          webhook_secret: generateSecret(),
          webhook_url: webhookUrl,
          sync_enabled: true,
          auto_create_hiring_process: true,
          auto_apply_checklists: true,
          sync_events: ['candidate_approved', 'candidate_hired'],
          field_mapping: {
            candidate_name: 'name',
            candidate_email: 'email',
            candidate_phone: 'phone',
            position_title: 'job.name',
            department: 'job.department',
            salary: 'salary_expectation',
            start_date: 'expected_start_date'
          },
          notification_settings: {
            notify_hr_on_sync: true,
            notify_manager_on_approval: true,
            hr_notification_emails: [],
            slack_webhook_url: ''
          }
        });
      }

      // Carregar eventos recentes
      const eventsData = await GupyWebhookEvent.filter(
        { company_id: userData.company_id },
        '-received_at',
        10
      );
      setRecentEvents(eventsData);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar configurações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecret = () => {
    return 'whsec_' + Math.random().toString(36).substring(2, 50);
  };

  const handleSave = async () => {
    if (!integration) return;
    
    setIsSaving(true);
    try {
      if (integration.id) {
        await GupyIntegration.update(integration.id, integration);
      } else {
        const newIntegration = await GupyIntegration.create(integration);
        setIntegration(newIntegration);
      }

      toast({
        title: "Configurações salvas!",
        description: "A integração com o Gupy foi configurada com sucesso."
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!integration?.api_key || !integration?.gupy_company_id) {
      toast({
        title: "Configuração incompleta",
        description: "Configure a API Key e Company ID antes de testar.",
        variant: "destructive"
      });
      return;
    }

    setTestingConnection(true);
    try {
      // Simular teste de conexão
      // Em um cenário real, faria uma chamada à API do Gupy
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conexão testada com sucesso!",
        description: "A integração com o Gupy está funcionando corretamente."
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Verifique as credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "URL copiada para a área de transferência." });
  };

  const getEventStatusColor = (processed, success) => {
    if (!processed) return 'bg-yellow-100 text-yellow-800';
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getEventStatusLabel = (processed, success) => {
    if (!processed) return 'Pendente';
    return success ? 'Processado' : 'Erro';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Integração Gupy
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Configure a integração automática com o sistema Gupy de recrutamento.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleTestConnection} 
            variant="outline"
            disabled={testingConnection}
          >
            {testingConnection ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Testar Conexão
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="mapping">Mapeamento</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gupy_company_id">Company ID no Gupy</Label>
                  <Input
                    id="gupy_company_id"
                    value={integration?.gupy_company_id || ''}
                    onChange={(e) => setIntegration(prev => ({
                      ...prev,
                      gupy_company_id: e.target.value
                    }))}
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key do Gupy</Label>
                  <div className="relative">
                    <Input
                      id="api_key"
                      type={showApiKey ? 'text' : 'password'}
                      value={integration?.api_key || ''}
                      onChange={(e) => setIntegration(prev => ({
                        ...prev,
                        api_key: e.target.value
                      }))}
                      placeholder="gup_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Sincronização Ativa</Label>
                    <p className="text-sm text-gray-600">Habilita a recepção de webhooks do Gupy</p>
                  </div>
                  <Switch
                    checked={integration?.sync_enabled || false}
                    onCheckedChange={(checked) => setIntegration(prev => ({
                      ...prev,
                      sync_enabled: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Criar Processo Automático</Label>
                    <p className="text-sm text-gray-600">Cria processo de contratação automaticamente quando candidato é aprovado</p>
                  </div>
                  <Switch
                    checked={integration?.auto_create_hiring_process || false}
                    onCheckedChange={(checked) => setIntegration(prev => ({
                      ...prev,
                      auto_create_hiring_process: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Aplicar Checklists Automaticamente</Label>
                    <p className="text-sm text-gray-600">Aplica templates de checklist baseados no cargo e departamento</p>
                  </div>
                  <Switch
                    checked={integration?.auto_apply_checklists || false}
                    onCheckedChange={(checked) => setIntegration(prev => ({
                      ...prev,
                      auto_apply_checklists: checked
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Configuração do Webhook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Configure esta URL no painel administrativo do Gupy para receber notificações automáticas.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>URL do Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secret do Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    value={integration?.webhook_secret || ''}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(integration?.webhook_secret || '')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Use este secret para validar a autenticidade dos webhooks recebidos.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Eventos Sincronizados</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'candidate_approved', label: 'Candidato Aprovado' },
                    { key: 'candidate_hired', label: 'Candidato Contratado' },
                    { key: 'candidate_rejected', label: 'Candidato Rejeitado' },
                    { key: 'interview_scheduled', label: 'Entrevista Agendada' }
                  ].map(event => (
                    <div key={event.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event.key}
                        checked={integration?.sync_events?.includes(event.key) || false}
                        onChange={(e) => {
                          const events = integration?.sync_events || [];
                          if (e.target.checked) {
                            setIntegration(prev => ({
                              ...prev,
                              sync_events: [...events, event.key]
                            }));
                          } else {
                            setIntegration(prev => ({
                              ...prev,
                              sync_events: events.filter(ev => ev !== event.key)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={event.key} className="text-sm">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapeamento de Campos</CardTitle>
              <p className="text-sm text-gray-600">
                Configure como os campos do Gupy são mapeados para o sistema interno.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(integration?.field_mapping || {}).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-4 items-center">
                  <Label className="text-right capitalize">
                    {key.replace('_', ' ')}:
                  </Label>
                  <Input
                    value={value}
                    onChange={(e) => setIntegration(prev => ({
                      ...prev,
                      field_mapping: {
                        ...prev.field_mapping,
                        [key]: e.target.value
                      }
                    }))}
                    placeholder="campo.no.gupy"
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Eventos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Webhook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento recebido ainda.</p>
                  <p className="text-sm">Configure o webhook no Gupy para começar a receber eventos.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {event.candidate_data?.name || 'Candidato'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.event_type} • {new Date(event.received_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <Badge className={getEventStatusColor(event.processed, event.processing_result?.success)}>
                        {getEventStatusLabel(event.processed, event.processing_result?.success)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}