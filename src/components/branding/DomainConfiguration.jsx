
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, AlertTriangle, Info, Copy, ExternalLink, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DomainConfiguration({ branding, onSave }) {
  const [domainData, setDomainData] = useState({
    custom_domain: '',
    domain_verified: false,
    ssl_enabled: false
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (branding) {
      setDomainData({
        custom_domain: branding.custom_domain || '',
        domain_verified: branding.domain_verified || false,
        ssl_enabled: branding.ssl_enabled || false
      });
    }
  }, [branding]);

  const handleSaveDomain = async () => {
    try {
      await onSave({
        ...branding,
        custom_domain: domainData.custom_domain,
        domain_verified: domainData.domain_verified,
        ssl_enabled: domainData.ssl_enabled
      });
      toast({
        title: "Domínio configurado!",
        description: "As configurações de domínio foram salvas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações de domínio.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    try {
      // Simular verificação de domínio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDomainData(prev => ({
        ...prev,
        domain_verified: true,
        ssl_enabled: true
      }));
      
      toast({
        title: "Domínio verificado!",
        description: "O domínio foi verificado e está pronto para uso."
      });
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o domínio. Verifique as configurações DNS.",
        variant: "destructive"
      });
    }
    setIsVerifying(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Registro DNS copiado para a área de transferência."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Configuração de Domínio Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom_domain">Domínio Personalizado</Label>
            <Input
              id="custom_domain"
              placeholder="sistema.suaempresa.com.br"
              value={domainData.custom_domain}
              onChange={(e) => setDomainData(prev => ({
                ...prev,
                custom_domain: e.target.value
              }))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Digite o domínio que você deseja usar para acessar o sistema
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={domainData.domain_verified ? "default" : "secondary"}>
              {domainData.domain_verified ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Verificado
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Não Verificado
                </>
              )}
            </Badge>
            
            {domainData.ssl_enabled && (
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                SSL Ativo
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveDomain} className="flex-1">
              Salvar Configuração
            </Button>
            <Button 
              onClick={handleVerifyDomain} 
              disabled={!domainData.custom_domain || isVerifying}
              variant="outline"
            >
              {isVerifying ? "Verificando..." : "Verificar Domínio"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {domainData.custom_domain && !domainData.domain_verified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Configuração DNS Necessária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Para usar seu domínio personalizado, você precisa configurar os seguintes registros DNS:
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Registro CNAME</Label>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(`${domainData.custom_domain} CNAME app--firstdocy-ged-ai-119be352.base44.app`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  <div><strong>Nome:</strong> {domainData.custom_domain}</div>
                  <div><strong>Tipo:</strong> CNAME</div>
                  <div><strong>Valor:</strong> app--firstdocy-ged-ai-119be352.base44.app</div>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Após configurar o DNS, aguarde até 24 horas para a propagação e clique em "Verificar Domínio".
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configuração Avançada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Opções para ocultar a URL base:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Configure um domínio personalizado (recomendado)</li>
                <li>Use um serviço de redirecionamento como Cloudflare</li>
                <li>Configure um proxy reverso no seu servidor</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <Label className="text-blue-800 font-medium">Suporte Técnico</Label>
            </div>
            <p className="text-sm text-blue-700">
              Precisa de ajuda com a configuração? Entre em contato com nossa equipe técnica 
              através do chat de suporte ou email: suporte@firstdocy.com.br
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
