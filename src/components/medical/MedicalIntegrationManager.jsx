import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Activity
} from 'lucide-react';

const INTEGRATION_PROVIDERS = {
  'stak_care': {
    name: 'Stak Care',
    description: 'API REST DataSnap, JSON/XML/CSV',
    authType: 'api_key',
    features: ['agendamento', 'aso', 'resultados', 'esocial']
  },
  'sggnet': {
    name: 'SGGNet',
    description: 'API REST para ERP, eSocial',
    authType: 'oauth2',
    features: ['agendamento', 'aso', 'esocial']
  },
  'peoplenet_sst': {
    name: 'Peoplenet SST',
    description: 'API REST, eventos eSocial/XML',
    authType: 'basic_auth',
    features: ['agendamento', 'aso', 'esocial']
  },
  'b31_soc': {
    name: 'B31/SOC',
    description: 'Web Service SOAP/REST, JSON/XML',
    authType: 'certificate',
    features: ['agendamento', 'aso', 'resultados', 'esocial']
  },
  'salu': {
    name: 'Salú',
    description: 'API Key, JSON',
    authType: 'api_key',
    features: ['agendamento', 'aso', 'resultados']
  },
  'integra_saude': {
    name: 'Integra Saúde',
    description: 'API laboratórios, JSON',
    authType: 'api_key',
    features: ['resultados', 'laudos']
  },
  'sigoweb': {
    name: 'SIGOWEB',
    description: 'API REST para ERPs como TOTVS',
    authType: 'oauth2',
    features: ['agendamento', 'aso', 'esocial']
  }
};

export default function MedicalIntegrationManager({ configs, currentUser, onRefresh, isLoading }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [testingConnection, setTestingConnection] = useState(null);

  const handleTestConnection = async (config) => {
    setTestingConnection(config.id);
    try {
      // Simulação de teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Aqui seria feita a chamada real para testar a conexão
      console.log('Testando conexão com:', config.provider);
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
    } finally {
      setTestingConnection(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'healthy': { color: 'bg-green-100 text-green-800', label: 'Saudável' },
      'degraded': { color: 'bg-yellow-100 text-yellow-800', label: 'Degradado' },
      'down': { color: 'bg-red-100 text-red-800', label: 'Inativo' }
    };
    
    const config = statusConfig[status] || statusConfig.down;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Integrações</h2>
          <p className="text-gray-600">Configure e monitore conexões com sistemas de saúde ocupacional</p>
        </div>
        <Button 
          onClick={() => setShowConfigForm(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Integração
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Integrações Ativas</TabsTrigger>
          <TabsTrigger value="available">Sistemas Disponíveis</TabsTrigger>
          <TabsTrigger value="health">Status de Saúde</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {configs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma integração configurada</h3>
                <p className="text-gray-500 mb-4">Configure sua primeira integração para começar a usar o sistema.</p>
                <Button onClick={() => setShowConfigForm(true)}>
                  Configurar Primeira Integração
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {configs.map((config) => {
                const provider = INTEGRATION_PROVIDERS[config.provider];
                return (
                  <Card key={config.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{provider?.name || config.provider_name}</h3>
                            <p className="text-gray-600">{provider?.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {getStatusBadge(config.health_status)}
                              <Badge variant="outline" className="text-xs">
                                {config.config?.auth_type || provider?.authType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTestConnection(config)}
                            disabled={testingConnection === config.id}
                          >
                            {testingConnection === config.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Activity className="w-4 h-4" />
                            )}
                            Testar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {provider?.features && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Funcionalidades disponíveis:</p>
                          <div className="flex flex-wrap gap-1">
                            {provider.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(INTEGRATION_PROVIDERS).map(([key, provider]) => {
              const isConfigured = configs.some(c => c.provider === key);
              return (
                <Card key={key} className={`hover:shadow-md transition-shadow ${isConfigured ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-gray-600" />
                      </div>
                      {isConfigured && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{provider.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{provider.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {provider.authType}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      variant={isConfigured ? "outline" : "default"}
                      onClick={() => {
                        setSelectedProvider(key);
                        setShowConfigForm(true);
                      }}
                    >
                      {isConfigured ? 'Reconfigurar' : 'Configurar'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Monitoramento em tempo real das integrações configuradas. Verificações automáticas a cada 5 minutos.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {configs.map((config) => {
              const provider = INTEGRATION_PROVIDERS[config.provider];
              return (
                <Card key={config.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{provider?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Última verificação: {config.last_health_check ? 
                              new Date(config.last_health_check).toLocaleString() : 
                              'Nunca'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {getStatusBadge(config.health_status)}
                        <div className="text-xs text-gray-500 mt-1">
                          Timeout: {config.config?.timeout || 30}s
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}