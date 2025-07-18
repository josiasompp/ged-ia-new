
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BookingSettings } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingSettingsManager({ settings: initialSettings, currentUser, onRefresh, isLoading }) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    logo_url: '',
    primary_color: '#146FE0',
    cancellation_deadline_hours: 24, // Flattened from cancellation_policy
    payment_integration: {
      enabled: false,
      provider: 'stripe',
      require_payment: false
    }
  });

  useEffect(() => {
    if (initialSettings) {
      setFormData({
        business_name: initialSettings.business_name || '',
        business_description: initialSettings.business_description || '',
        logo_url: initialSettings.logo_url || '',
        primary_color: initialSettings.primary_color || '#146FE0',
        cancellation_deadline_hours: initialSettings.cancellation_policy?.cancellation_deadline_hours || 24,
        payment_integration: initialSettings.payment_integration || {
          enabled: false,
          provider: 'stripe',
          require_payment: false
        }
      });
    }
  }, [initialSettings]);

  const handleSave = async () => {
    try {
      // Re-assemble data for the API based on desired structure
      const settingsData = {
        company_id: currentUser?.company_id || "default_company",
        business_name: formData.business_name,
        business_description: formData.business_description,
        logo_url: formData.logo_url,
        primary_color: formData.primary_color,
        cancellation_policy: {
          allow_client_cancellation: true, // Hardcoded as per outline, assuming this is default behavior
          cancellation_deadline_hours: formData.cancellation_deadline_hours
        },
        payment_integration: formData.payment_integration
      };
      
      if (initialSettings?.id) {
        await BookingSettings.update(initialSettings.id, settingsData);
      } else {
        await BookingSettings.create(settingsData);
      }
      toast({ title: "Configurações salvas com sucesso!" });
      onRefresh();
    } catch(err) {
      console.error("Erro ao salvar configurações", err);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Configurações do Portal de Agendamento</CardTitle>
          <CardDescription>Ajuste as configurações principais do seu sistema de agendamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Nome do Negócio</Label>
              <Input id="business_name" value={formData.business_name} onChange={(e) => setFormData({...formData, business_name: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="primary_color">Cor Primária</Label>
              <Input id="primary_color" type="color" value={formData.primary_color} onChange={(e) => setFormData({...formData, primary_color: e.target.value})} className="w-24 h-12"/>
            </div>
          </div>
          <div>
            <Label htmlFor="business_description">Descrição Curta</Label>
            <Textarea id="business_description" value={formData.business_description} onChange={(e) => setFormData({...formData, business_description: e.target.value})} />
          </div>
          <div>
            <Label htmlFor="logo_url">URL do Logo</Label>
            <Input id="logo_url" value={formData.logo_url} onChange={(e) => setFormData({...formData, logo_url: e.target.value})} />
          </div>
          <div>
            <Label htmlFor="cancellation_deadline">Prazo para Cancelamento (horas)</Label>
            <Input id="cancellation_deadline" type="number" value={formData.cancellation_deadline_hours} onChange={(e) => setFormData({...formData, cancellation_deadline_hours: parseInt(e.target.value)})} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integração de Pagamentos</CardTitle>
          <CardDescription>Configure as opções de pagamento para seus agendamentos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="payment-enabled"
              checked={formData.payment_integration.enabled}
              onCheckedChange={(checked) => setFormData({...formData, payment_integration: {...formData.payment_integration, enabled: checked}})}
            />
            <Label htmlFor="payment-enabled">Habilitar Pagamentos</Label>
          </div>
          
          {formData.payment_integration.enabled && (
            <div className="space-y-4 pl-8">
              <div>
                <Label>Provedor de Pagamento</Label>
                 <Select
                  value={formData.payment_integration.provider}
                  onValueChange={(value) => setFormData({...formData, payment_integration: {...formData.payment_integration, provider: value}})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">A integração real será feita no backend.</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="require-payment"
                  checked={formData.payment_integration.require_payment}
                  onCheckedChange={(checked) => setFormData({...formData, payment_integration: {...formData.payment_integration, require_payment: checked}})}
                />
                <Label htmlFor="require-payment">Exigir pagamento no momento do agendamento</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          <Save className="w-4 h-4"/> Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
