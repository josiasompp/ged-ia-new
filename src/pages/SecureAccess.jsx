import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Settings, Database, FileText, BarChart3, AlertTriangle } from 'lucide-react';
import { User } from '@/api/entities';
import SecureUrlManager from '../components/security/SecureUrlManager';

export default function SecureAccess() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
    document.title = "FIRSTDOCY GED AI - Acesso Seguro";
  }, []);

  const checkAccess = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Verificar se o usuário tem permissões para acessar URLs seguras
      const hasPermission = (
        userData?.role === 'admin' ||
        userData?.role === 'super_admin' ||
        userData?.permissions?.includes('secure_access') ||
        userData?.permissions?.includes('admin') ||
        userData?.email?.includes('@firstdocy.com')
      );
      
      setHasAccess(hasPermission);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p>Verificando permissões...</p>
        </div>
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
                Você não possui autorização para acessar as URLs seguras do sistema.
                Apenas administradores e usuários com permissões especiais podem acessar esta funcionalidade.
                <br/><br/>
                <strong>Usuário:</strong> {currentUser?.email || 'Não identificado'}
                <br/>
                <strong>Papel:</strong> {currentUser?.role || 'N/A'}
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
              Acesso Seguro
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gerencie URLs seguras para funcionalidades críticas do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="w-4 h-4 mr-1" />
            Área Restrita
          </Badge>
        </div>
      </div>

      {/* Alert de Segurança */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Área de Alta Segurança</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Esta é uma área de alta segurança. Todos os acessos são monitorados e registrados.
          As URLs geradas possuem tokens únicos e podem expirar após o uso ou tempo determinado.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="urls" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="urls" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            URLs Seguras
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urls" className="space-y-4">
          <SecureUrlManager currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Funcionalidade de auditoria em desenvolvimento.
                  Todos os acessos a URLs seguras são registrados automaticamente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Configurações de segurança personalizáveis em desenvolvimento.
                  Por enquanto, utilizamos as configurações padrão de alta segurança.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}