import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Shield, 
  Server, 
  Database, 
  Lock,
  AlertTriangle,
  FileText,
  Download,
  Copy,
  CheckCircle,
  Users,
  Settings,
  Eye,
  Trash2
} from 'lucide-react';

export default function SuperAdminDocumentation() {
  const [copiedSection, setCopiedSection] = React.useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const configurationExample = `// Configuração no arquivo de ambiente (.env)
SUPER_USER_MASTER_EMAIL=seu.email@firstdocy.com
SUPER_ADMIN_MFA_REQUIRED=true
SUPER_ADMIN_SESSION_TIMEOUT=2
SUPER_ADMIN_LOG_ALL_ACTIONS=true

// Configuração no código (Layout.jsx)
const isSystemMaster = () => {
  return user?.email === 'seu.email@firstdocy.com' || 
         user?.permissions?.includes('super_user_master') ||
         user?.role === 'super_admin';
};`;

  const deploymentSteps = `# Passos para Deploy com Super Admin

1. **Criar Super Admin para Desenvolvedor**
   - Acesse: Sistema → Super Admins
   - Clique em "Novo Super Admin"
   - Preencha dados do desenvolvedor
   - Selecione tipo: "Deploy Admin"
   - Marque permissões necessárias:
     ✓ system_deployment
     ✓ database_management
     ✓ server_configuration
     ✓ backup_management

2. **Configurar Acesso Restrito**
   - Configure IPs permitidos (opcional)
   - Ative MFA obrigatório
   - Defina timeout de sessão (2 horas)

3. **Entregar Credenciais ao Desenvolvedor**
   - Email de acesso
   - Instruções de primeiro login
   - Lista de permissões concedidas
   - Contato para suporte

4. **Monitorar Atividades**
   - Verificar logs de acesso
   - Acompanhar ações realizadas
   - Revogar acesso quando necessário`;

  const securityGuidelines = `# Diretrizes de Segurança para Super Admins

## CRÍTICO - Segurança Máxima
⚠️  Apenas o usuário master pode criar/remover super admins
⚠️  MFA obrigatório para todos os super admins
⚠️  Sessões expiram automaticamente em 2 horas
⚠️  Todas as ações são registradas em logs

## Tipos de Super Admin

### Deploy Admin (Recomendado)
- Foco em deployment e infraestrutura
- Permissões limitadas às necessidades técnicas
- Ideal para desenvolvedores terceirizados

### Super Admin (Uso Restrito)
- Acesso total ao sistema
- Apenas para situações críticas
- Requer aprovação especial

## Permissões Disponíveis

### Deployment e Infraestrutura
- system_deployment: Deploy do sistema
- database_management: Gerenciar banco de dados
- server_configuration: Configurar servidores
- security_configuration: Configurar segurança
- backup_management: Gerenciar backups
- monitoring_setup: Configurar monitoramento
- environment_variables: Gerenciar variáveis
- ssl_certificates: Gerenciar SSL
- domain_configuration: Configurar domínios
- cdn_setup: Configurar CDN

### Acesso ao Sistema
- all_companies_access: Acesso a todas empresas
- user_management_all: Gerenciar todos usuários
- financial_management_all: Gestão financeira

### Monitoramento
- system_logs_access: Acesso aos logs
- performance_monitoring: Monitorar performance`;

  const troubleshooting = `# Resolução de Problemas

## Problema: Desenvolvedor não consegue acessar
✅ Verificar se email está correto
✅ Confirmar que conta está ativa
✅ Verificar se MFA foi configurado
✅ Checar se IP está na lista permitida

## Problema: Permissões insuficientes
✅ Revisar permissões concedidas
✅ Verificar se tipo de admin está correto
✅ Confirmar que usuário master fez as alterações

## Problema: Sessão expira muito rápido
✅ Ajustar timeout nas configurações
✅ Verificar configurações de MFA
✅ Confirmar configurações do servidor

## Emergência: Revogar acesso imediatamente
1. Acesse Super Admins como usuário master
2. Localize a conta do desenvolvedor
3. Clique no ícone de lixeira
4. Confirme a remoção
5. Verifique logs para ações recentes`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-red-800">
                <Crown className="w-6 h-6" />
                Documentação - Sistema de Super Administradores
              </CardTitle>
              <p className="text-red-600 mt-2">
                Guia completo para gerenciamento de contas especiais para deployment
              </p>
            </div>
            <Button
              onClick={() => window.print()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Imprimir/PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Warning Crítico */}
      <Alert className="border-red-300 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>DOCUMENTO CONFIDENCIAL - ACESSO ULTRA RESTRITO</strong>
          <br />
          Este documento contém informações críticas sobre o sistema de super administradores.
          Apenas o usuário master deve ter acesso a estas informações.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="configuration">Configuração</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="troubleshooting">Problemas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-red-600" />
                  O que são Super Administradores?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Super Administradores são contas especiais criadas para facilitar o deployment e manutenção 
                  do sistema FIRSTDOCY GED AI por desenvolvedores terceirizados, mantendo controle total 
                  sobre essas contas privilegiadas.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Benefícios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-green-700">
                        <li>• Deploy facilitado por desenvolvedores</li>
                        <li>• Controle granular de permissões</li>
                        <li>• Acesso temporário e revogável</li>
                        <li>• Logs detalhados de todas as ações</li>
                        <li>• Segurança com MFA obrigatório</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Características de Segurança
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-amber-700">
                        <li>• Apenas usuário master pode gerenciar</li>
                        <li>• MFA obrigatório para acesso</li>
                        <li>• Sessões com timeout automático</li>
                        <li>• Controle opcional por IP</li>
                        <li>• Auditoria completa de ações</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Super Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-orange-100 text-orange-800">Deploy Admin</Badge>
                      <span className="text-sm text-green-600 font-medium">(Recomendado)</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Ideal para desenvolvedores terceirizados responsáveis pelo deployment.
                    </p>
                    <div className="text-xs text-gray-600">
                      <strong>Permissões típicas:</strong>
                      <br />• Deployment do sistema
                      <br />• Configuração de servidores
                      <br />• Gerenciamento de banco
                      <br />• Configuração de SSL/domínios
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
                      <span className="text-sm text-red-600 font-medium">(Uso Crítico)</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Acesso total ao sistema. Usar apenas em situações críticas.
                    </p>
                    <div className="text-xs text-gray-600">
                      <strong>Acesso incluído:</strong>
                      <br />• Todas as permissões de deploy
                      <br />• Acesso a todas as empresas
                      <br />• Gerenciamento de usuários
                      <br />• Gestão financeira completa
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Configuração do Sistema</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(configurationExample, 'config')}
              >
                {copiedSection === 'config' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4" />
                }
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto">
                <code>{configurationExample}</code>
              </pre>
              
              <Alert className="mt-4">
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Substitua 'seu.email@firstdocy.com' pelo seu email real 
                  no código antes do deployment em produção.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Processo de Deployment</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(deploymentSteps, 'deploy')}
              >
                {copiedSection === 'deploy' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4" />
                }
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                <code>{deploymentSteps}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Diretrizes de Segurança</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(securityGuidelines, 'security')}
              >
                {copiedSection === 'security' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4" />
                }
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                <code>{securityGuidelines}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Resolução de Problemas</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(troubleshooting, 'trouble')}
              >
                {copiedSection === 'trouble' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4" />
                }
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                <code>{troubleshooting}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fluxo Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Trabalho Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm">1. Identificar Desenvolvedor</h4>
              <p className="text-xs text-gray-600 mt-1">
                Desenvolvedor solicita acesso para deployment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm">2. Criar Super Admin</h4>
              <p className="text-xs text-gray-600 mt-1">
                Usuário master cria conta com permissões específicas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-sm">3. Deployment</h4>
              <p className="text-xs text-gray-600 mt-1">
                Desenvolvedor realiza deployment com acesso controlado
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-sm">4. Revogar Acesso</h4>
              <p className="text-xs text-gray-600 mt-1">
                Após deployment, acesso é revogado imediatamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer de Segurança */}
      <Alert className="border-red-300 bg-red-50">
        <Lock className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>LEMBRETE DE SEGURANÇA:</strong> 
          <br />• Sempre revogue o acesso após o deployment
          <br />• Monitore logs regularmente
          <br />• Mantenha apenas super admins necessários
          <br />• Use "Deploy Admin" sempre que possível
        </AlertDescription>
      </Alert>
    </div>
  );
}