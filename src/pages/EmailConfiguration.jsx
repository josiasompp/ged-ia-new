import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';
import { EmailConfiguration } from '@/api/entities';
import { EmailLog } from '@/api/entities';
import { EmailTemplate } from '@/api/entities';
import { User } from '@/api/entities';

import EmailConfigForm from '../components/email/EmailConfigForm';
import EmailTemplateManager from '../components/email/EmailTemplateManager';
import EmailLogs from '../components/email/EmailLogs';
import EmailStats from '../components/email/EmailStats';

export default function EmailConfigurationPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfig, setEmailConfig] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('config');
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
    document.title = "FIRSTDOCY GED AI - Configuração de Email";
  }, []);

  useEffect(() => {
    if (hasAccess) {
      loadData();
    }
  }, [hasAccess]);

  const checkAccess = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Verificar se é gestor (admin da empresa ou super admin)
      const isManager = (
        userData?.role === 'admin' ||
        userData?.permissions?.includes('email_configuration') ||
        userData?.permissions?.includes('company_manager') ||
        userData?.email?.includes('@firstdocy.com')
      );
      
      setHasAccess(isManager);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  const loadData = async () => {
    try {
      const [configData, templatesData, logsData] = await Promise.all([
        EmailConfiguration.filter({ company_id: currentUser.company_id }),
        EmailTemplate.filter({ company_id: currentUser.company_id }),
        EmailLog.filter({ company_id: currentUser.company_id }, '-created_date', 50)
      ]);

      setEmailConfig(configData[0] || null);
      setTemplates(templatesData || []);
      setEmailLogs(logsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações de email.",
        variant: "destructive"
      });
    }
  };

  const handleSaveConfig = async (configData) => {
    try {
      let savedConfig;
      if (emailConfig) {
        savedConfig = await EmailConfiguration.update(emailConfig.id, configData);
      } else {
        savedConfig = await EmailConfiguration.create({
          ...configData,
          company_id: currentUser.company_id
        });
      }
      
      setEmailConfig(savedConfig);
      toast({
        title: "Configuração salva!",
        description: "As configurações de email foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="w-6 h-6" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sem Permissão</AlertTitle>
              <AlertDescription>
                Você não possui autorização para acessar as configurações de email.
                Apenas gestores da empresa podem configurar o sistema de envio de emails.
                <br/><br/>
                <strong>Usuário:</strong> {currentUser?.email || 'Não identificado'}
                <br/>
                <strong>Empresa:</strong> {currentUser?.company_id || 'N/A'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Configuração de Email
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Configure o sistema de envio de emails para notificações automáticas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {emailConfig?.is_verified ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-4 h-4 mr-1" />
              Configurado
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Pendente
            </Badge>
          )}
        </div>
      </div>

      {/* Alert de Informação */}
      <Alert className="border-blue-200 bg-blue-50">
        <Mail className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Sistema de Envio Apenas</AlertTitle>
        <AlertDescription className="text-blue-700">
          Este módulo é configurado apenas para <strong>envio de emails</strong>. 
          Não há funcionalidade de recebimento ou caixa de entrada. 
          Use-o para notificações automáticas do sistema, como aprovações de documentos, 
          propostas aceitas, lembretes, etc.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuração SMTP
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <EmailConfigForm
            config={emailConfig}
            onSave={handleSaveConfig}
            currentUser={currentUser}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <EmailTemplateManager
            templates={templates}
            onRefresh={loadData}
            currentUser={currentUser}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <EmailLogs
            logs={emailLogs}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <EmailStats
            logs={emailLogs}
            config={emailConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}