import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Link, 
  Shield, 
  Copy, 
  Eye, 
  Settings, 
  Users, 
  Database, 
  FileText,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AccessConfirmation from './AccessConfirmation';

const SECURE_FEATURES = [
  {
    id: 'user_management',
    title: 'Gestão de Usuários',
    description: 'Criar, editar e gerenciar usuários do sistema',
    url: '/user-management',
    permissions: ['admin', 'user_manager'],
    securityLevel: 'high',
    requirePassword: true,
    requiresConfirmationCode: false
  },
  {
    id: 'company_settings',
    title: 'Configurações da Empresa',
    description: 'Alterar configurações críticas da empresa',
    url: '/company-settings', 
    permissions: ['admin'],
    securityLevel: 'critical',
    requirePassword: true,
    requiresConfirmationCode: true
  },
  {
    id: 'database_backup',
    title: 'Backup do Banco de Dados',
    description: 'Gerar e baixar backup dos dados',
    url: '/database-backup',
    permissions: ['admin', 'super_admin'],
    securityLevel: 'critical',
    requirePassword: true,
    requiresConfirmationCode: true
  },
  {
    id: 'financial_reports',
    title: 'Relatórios Financeiros',
    description: 'Acessar relatórios financeiros detalhados',
    url: '/financial-reports',
    permissions: ['admin', 'financial_manager'],
    securityLevel: 'high',
    requirePassword: false,
    requiresConfirmationCode: false
  },
  {
    id: 'system_logs',
    title: 'Logs do Sistema',
    description: 'Visualizar logs de auditoria e sistema',
    url: '/system-logs',
    permissions: ['admin', 'support'],
    securityLevel: 'medium',
    requirePassword: false,
    requiresConfirmationCode: false
  },
  {
    id: 'document_deletion',
    title: 'Exclusão de Documentos',
    description: 'Excluir permanentemente documentos do sistema',
    url: '/document-deletion',
    permissions: ['admin'],
    securityLevel: 'critical',
    requirePassword: true,
    requiresConfirmationCode: true
  }
];

export default function SecureUrlManager({ currentUser }) {
  const [secureUrls, setSecureUrls] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [generatedUrls, setGeneratedUrls] = useState([]);

  useEffect(() => {
    loadSecureUrls();
  }, []);

  const loadSecureUrls = () => {
    // Filtrar funcionalidades baseado nas permissões do usuário
    const allowedFeatures = SECURE_FEATURES.filter(feature => {
      return feature.permissions.some(permission => 
        currentUser?.permissions?.includes(permission) || 
        currentUser?.role === 'admin' ||
        currentUser?.role === 'super_admin'
      );
    });
    setSecureUrls(allowedFeatures);
  };

  const generateSecureUrl = (feature) => {
    const timestamp = Date.now();
    const token = btoa(`${feature.id}_${currentUser.id}_${timestamp}`);
    const secureUrl = `${window.location.origin}/secure/${feature.id}?token=${token}&user=${currentUser.id}`;
    
    const urlData = {
      ...feature,
      token,
      secureUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      usedCount: 0,
      maxUses: feature.securityLevel === 'critical' ? 1 : 5
    };

    setGeneratedUrls(prev => [...prev, urlData]);
    
    toast({
      title: "URL Segura Gerada!",
      description: `URL criada para: ${feature.title}`,
    });

    return urlData;
  };

  const handleFeatureAccess = (feature) => {
    setSelectedFeature(feature);
    setShowConfirmation(true);
  };

  const handleAccessConfirmed = (password, confirmationCode) => {
    if (selectedFeature) {
      const urlData = generateSecureUrl(selectedFeature);
      
      // Simular navegação segura
      toast({
        title: "Acesso Autorizado",
        description: `Redirecionando para ${selectedFeature.title}...`,
      });

      // Aqui você implementaria a navegação real
      // window.location.href = urlData.secureUrl;
    }
    setShowConfirmation(false);
    setSelectedFeature(null);
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copiada!",
      description: "URL segura copiada para a área de transferência.",
    });
  };

  const getSecurityBadge = (level) => {
    const configs = {
      critical: { label: 'CRÍTICO', className: 'bg-red-100 text-red-800' },
      high: { label: 'ALTO', className: 'bg-orange-100 text-orange-800' },
      medium: { label: 'MÉDIO', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = configs[level] || configs.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            URLs Seguras de Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              As URLs seguras garantem acesso controlado às funcionalidades críticas do sistema.
              Cada acesso é registrado e pode exigir confirmação adicional.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {secureUrls.map((feature) => (
              <Card key={feature.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{feature.title}</h4>
                        {getSecurityBadge(feature.securityLevel)}
                        {feature.requirePassword && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Senha
                          </Badge>
                        )}
                        {feature.requiresConfirmationCode && (
                          <Badge className="bg-red-100 text-red-800">
                            <FileText className="w-3 h-3 mr-1" />
                            Código
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Permissões: {feature.permissions.join(', ')}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFeatureAccess(feature)}
                      className="ml-4"
                      size="sm"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Gerar URL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* URLs Geradas */}
      {generatedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>URLs Geradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedUrls.map((urlData, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium">{urlData.title}</h5>
                      <p className="text-sm text-gray-600 font-mono bg-white p-2 rounded mt-1 break-all">
                        {urlData.secureUrl}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span>Criada: {new Date(urlData.createdAt).toLocaleString()}</span>
                        <span>Expira: {new Date(urlData.expiresAt).toLocaleString()}</span>
                        <span>Usos: {urlData.usedCount}/{urlData.maxUses}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyUrl(urlData.secureUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Confirmação */}
      {showConfirmation && selectedFeature && (
        <AccessConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleAccessConfirmed}
          feature={selectedFeature}
          user={currentUser}
          requirePassword={selectedFeature.requirePassword}
        />
      )}
    </div>
  );
}