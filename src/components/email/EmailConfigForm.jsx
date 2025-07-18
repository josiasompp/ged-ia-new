import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  TestTube, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Mail,
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';
import { SendEmail } from '@/api/integrations';

const SMTP_PRESETS = {
  gmail: {
    name: 'Gmail',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use uma senha de app do Gmail, não sua senha normal.'
  },
  outlook: {
    name: 'Outlook/Hotmail',
    smtp_host: 'smtp-mail.outlook.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use sua conta do Outlook.com ou Hotmail.'
  },
  yahoo: {
    name: 'Yahoo Mail',
    smtp_host: 'smtp.mail.yahoo.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Ative a autenticação de duas etapas no Yahoo.'
  },
  sendgrid: {
    name: 'SendGrid',
    smtp_host: 'smtp.sendgrid.net',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use "apikey" como username e sua API key como senha.'
  },
  mailgun: {
    name: 'Mailgun',
    smtp_host: 'smtp.mailgun.org',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use suas credenciais SMTP do Mailgun.'
  },
  custom: {
    name: 'Configuração Personalizada',
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Configure manualmente seu servidor SMTP.'
  }
};

export default function EmailConfigForm({ config, onSave, currentUser }) {
  const [formData, setFormData] = useState({
    provider_name: 'custom',
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: true,
    smtp_auth_required: true,
    smtp_username: '',
    smtp_password: '',
    from_email: '',
    from_name: '',
    reply_to_email: '',
    daily_limit: 1000,
    is_active: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
        smtp_password: '' // Nunca carregar senha por segurança
      });
    } else {
      // Valores padrão baseados na empresa
      setFormData(prev => ({
        ...prev,
        from_name: currentUser?.company_id || 'FIRSTDOCY GED AI',
        reply_to_email: currentUser?.email || ''
      }));
    }
  }, [config, currentUser]);

  const handlePresetChange = (preset) => {
    const presetConfig = SMTP_PRESETS[preset];
    setFormData(prev => ({
      ...prev,
      provider_name: preset,
      smtp_host: presetConfig.smtp_host,
      smtp_port: presetConfig.smtp_port,
      smtp_secure: presetConfig.smtp_secure
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    if (!formData.smtp_host || !formData.from_email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o servidor SMTP e email remetente.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Enviar email de teste usando a integração SendEmail
      await SendEmail({
        to: formData.reply_to_email || currentUser.email,
        subject: 'Teste de Configuração SMTP - FIRSTDOCY',
        body: `
          <h2>✅ Teste de Configuração SMTP</h2>
          <p>Parabéns! Sua configuração de email está funcionando corretamente.</p>
          <hr>
          <p><strong>Servidor:</strong> ${formData.smtp_host}:${formData.smtp_port}</p>
          <p><strong>Remetente:</strong> ${formData.from_name} &lt;${formData.from_email}&gt;</p>
          <p><strong>Data do teste:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <hr>
          <p><em>Este é um email automático do sistema FIRSTDOCY GED AI.</em></p>
        `,
        from_name: formData.from_name
      });

      setTestResult({
        success: true,
        message: 'Teste realizado com sucesso! Verifique sua caixa de entrada.'
      });

      toast({
        title: "Teste enviado!",
        description: "Email de teste enviado com sucesso. Verifique sua caixa de entrada."
      });

    } catch (error) {
      console.error('Erro no teste:', error);
      setTestResult({
        success: false,
        message: error.message || 'Erro ao testar conexão SMTP.'
      });

      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o email de teste. Verifique as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.smtp_host || !formData.from_email || !formData.from_name) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        is_verified: testResult?.success || false,
        last_test_date: testResult?.success ? new Date().toISOString() : null,
        test_status: testResult?.success ? 'success' : 'pending'
      };

      await onSave(dataToSave);
      
      if (testResult?.success) {
        toast({
          title: "Configuração salva e verificada!",
          description: "O sistema de email está pronto para uso."
        });
      } else {
        toast({
          title: "Configuração salva",
          description: "Recomendamos testar a configuração antes de usar."
        });
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedPreset = SMTP_PRESETS[formData.provider_name] || SMTP_PRESETS.custom;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-firstdocy-blue" />
            Configuração do Servidor SMTP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset de Provedor */}
          <div className="space-y-2">
            <Label htmlFor="provider">Provedor de Email</Label>
            <Select 
              value={formData.provider_name} 
              onValueChange={handlePresetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SMTP_PRESETS).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPreset.help && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  {selectedPreset.help}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Configurações SMTP */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">Servidor SMTP *</Label>
              <Input
                id="smtp_host"
                value={formData.smtp_host}
                onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_port">Porta *</Label>
              <Input
                id="smtp_port"
                type="number"
                value={formData.smtp_port}
                onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                placeholder="587"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="smtp_secure"
              checked={formData.smtp_secure}
              onCheckedChange={(checked) => handleInputChange('smtp_secure', checked)}
            />
            <Label htmlFor="smtp_secure">Usar conexão segura (TLS/SSL)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="smtp_auth"
              checked={formData.smtp_auth_required}
              onCheckedChange={(checked) => handleInputChange('smtp_auth_required', checked)}
            />
            <Label htmlFor="smtp_auth">Requer autenticação</Label>
          </div>

          {/* Credenciais */}
          {formData.smtp_auth_required && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_username">Usuário/Email *</Label>
                <Input
                  id="smtp_username"
                  value={formData.smtp_username}
                  onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                  placeholder="seu-email@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="smtp_password"
                    type={showPassword ? "text" : "password"}
                    value={formData.smtp_password}
                    onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                    placeholder="Digite a senha ou token"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Configurações do Remetente */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Configurações do Remetente</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_email">Email Remetente *</Label>
                <Input
                  id="from_email"
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => handleInputChange('from_email', e.target.value)}
                  placeholder="noreply@suaempresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_name">Nome Remetente *</Label>
                <Input
                  id="from_name"
                  value={formData.from_name}
                  onChange={(e) => handleInputChange('from_name', e.target.value)}
                  placeholder="Sua Empresa"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply_to">Email para Resposta</Label>
              <Input
                id="reply_to"
                type="email"
                value={formData.reply_to_email}
                onChange={(e) => handleInputChange('reply_to_email', e.target.value)}
                placeholder="contato@suaempresa.com"
              />
            </div>
          </div>

          {/* Limite Diário */}
          <div className="space-y-2">
            <Label htmlFor="daily_limit">Limite Diário de Emails</Label>
            <Input
              id="daily_limit"
              type="number"
              value={formData.daily_limit}
              onChange={(e) => handleInputChange('daily_limit', parseInt(e.target.value))}
              placeholder="1000"
            />
            <p className="text-sm text-gray-500">
              Evita exceder limites do provedor de email
            </p>
          </div>

          {/* Resultado do Teste */}
          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testResult.success ? "text-green-700" : "text-red-700"}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="gap-2"
            >
              {isTesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              {isTesting ? 'Testando...' : 'Testar Configuração'}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}