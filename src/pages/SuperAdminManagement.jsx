import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  UserPlus, 
  Crown, 
  AlertTriangle,
  Server,
  Database,
  Lock,
  Settings,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { SuperAdmin } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/ui/use-toast';

const SUPER_ADMIN_PERMISSIONS = [
  { id: 'system_deployment', label: 'Deploy e Configuração do Sistema', category: 'deployment' },
  { id: 'database_management', label: 'Gerenciamento de Banco de Dados', category: 'deployment' },
  { id: 'server_configuration', label: 'Configuração de Servidores', category: 'deployment' },
  { id: 'security_configuration', label: 'Configuração de Segurança', category: 'deployment' },
  { id: 'backup_management', label: 'Gerenciamento de Backups', category: 'deployment' },
  { id: 'monitoring_setup', label: 'Configuração de Monitoramento', category: 'deployment' },
  { id: 'environment_variables', label: 'Gerenciar Variáveis de Ambiente', category: 'deployment' },
  { id: 'ssl_certificates', label: 'Gerenciar Certificados SSL', category: 'deployment' },
  { id: 'domain_configuration', label: 'Configuração de Domínios', category: 'deployment' },
  { id: 'cdn_setup', label: 'Configuração de CDN', category: 'deployment' },
  { id: 'all_companies_access', label: 'Acesso a Todas as Empresas', category: 'access' },
  { id: 'user_management_all', label: 'Gerenciar Todos os Usuários', category: 'access' },
  { id: 'financial_management_all', label: 'Gestão Financeira Completa', category: 'access' },
  { id: 'system_logs_access', label: 'Acesso aos Logs do Sistema', category: 'monitoring' },
  { id: 'performance_monitoring', label: 'Monitoramento de Performance', category: 'monitoring' }
];

export default function SuperAdminManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'deployment_admin',
    permissions: [],
    access_restrictions: {
      allowed_ip_ranges: [],
      require_mfa: true,
      session_timeout_hours: 2
    },
    deployment_info: {
      assigned_environments: [],
      deployment_notes: ''
    }
  });

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Verificar se é o super usuário principal (você)
      const isSuperUser = (
        userData?.email === 'seu.email@firstdocy.com' || // Substitua pelo seu email
        userData?.permissions?.includes('super_user_master') ||
        userData?.role === 'super_admin'
      );
      
      if (isSuperUser) {
        setHasAccess(true);
        loadSuperAdmins();
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  const loadSuperAdmins = async () => {
    try {
      const admins = await SuperAdmin.list('-created_date');
      setSuperAdmins(Array.isArray(admins) ? admins : []);
    } catch (error) {
      console.error("Erro ao carregar super admins:", error);
      setSuperAdmins([]);
    }
  };

  const handleCreateSuperAdmin = async () => {
    try {
      const adminData = {
        ...formData,
        created_by: currentUser.email
      };
      
      await SuperAdmin.create(adminData);
      
      toast({
        title: "Super Administrador Criado!",
        description: `${formData.full_name} foi adicionado como super administrador.`
      });
      
      setShowForm(false);
      setFormData({
        email: '',
        full_name: '',
        role: 'deployment_admin',
        permissions: [],
        access_restrictions: {
          allowed_ip_ranges: [],
          require_mfa: true,
          session_timeout_hours: 2
        },
        deployment_info: {
          assigned_environments: [],
          deployment_notes: ''
        }
      });
      loadSuperAdmins();
    } catch (error) {
      console.error("Erro ao criar super admin:", error);
      toast({
        title: "Erro ao Criar Super Admin",
        description: "Não foi possível criar o super administrador.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSuperAdmin = async (adminId, adminName) => {
    if (window.confirm(`Tem certeza que deseja remover ${adminName} como Super Administrador?`)) {
      try {
        await SuperAdmin.delete(adminId);
        toast({
          title: "Super Admin Removido",
          description: `${adminName} foi removido com sucesso.`
        });
        loadSuperAdmins();
      } catch (error) {
        console.error("Erro ao remover super admin:", error);
        toast({
          title: "Erro ao Remover",
          description: "Não foi possível remover o super administrador.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Lock className="w-6 h-6" />
              Acesso Ultra Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>ACESSO NEGADO - SUPER ADMINISTRADORES</strong>
                <br/><br/>
                Apenas o usuário master pode gerenciar super administradores.
                <br/>
                <strong>Usuário:</strong> {currentUser?.email || 'Não identificado'}
                <br/>
                <strong>Tentativa registrada em:</strong> {new Date().toLocaleString('pt-BR')}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedPermissions = SUPER_ADMIN_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-red-800">
                <Crown className="w-6 h-6" />
                Gerenciamento de Super Administradores
              </CardTitle>
              <p className="text-red-600 mt-2">
                Contas especiais para desenvolvedores e implantação em servidores
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Super Admin
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Warning */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>ATENÇÃO:</strong> Super administradores têm acesso privilegiado ao sistema.
          Conceda essas permissões apenas para desenvolvedores confiáveis responsáveis pela implantação.
        </AlertDescription>
      </Alert>

      {/* Lista de Super Admins */}
      <Card>
        <CardHeader>
          <CardTitle>Super Administradores Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {superAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.full_name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge className={admin.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Deploy Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {admin.permissions?.length || 0} permissões
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.last_login ? 
                      new Date(admin.last_login).toLocaleDateString('pt-BR') : 
                      'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSuperAdmin(admin.id, admin.full_name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {superAdmins.length === 0 && (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                    Nenhum super administrador configurado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-red-600" />
                Criar Novo Super Administrador
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Dados Básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Nome do desenvolvedor"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@desenvolvedor.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Tipo de Super Admin</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deployment_admin">Deploy Admin (Recomendado)</SelectItem>
                    <SelectItem value="super_admin">Super Admin (Acesso Total)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissões por Categoria */}
              <div>
                <Label className="text-base font-semibold">Permissões Específicas</Label>
                <div className="space-y-4 mt-3">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <Card key={category} className="p-4">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-600 mb-3">
                        {category === 'deployment' && 'Deployment e Infraestrutura'}
                        {category === 'access' && 'Acesso ao Sistema'}
                        {category === 'monitoring' && 'Monitoramento'}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                            />
                            <Label 
                              htmlFor={permission.id} 
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Notas de Deployment */}
              <div>
                <Label htmlFor="deployment_notes">Notas sobre Responsabilidades</Label>
                <Input
                  id="deployment_notes"
                  value={formData.deployment_info.deployment_notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    deployment_info: {
                      ...prev.deployment_info,
                      deployment_notes: e.target.value
                    }
                  }))}
                  placeholder="Ex: Responsável por deploy em AWS, configuração de SSL..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateSuperAdmin}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!formData.email || !formData.full_name}
              >
                <Crown className="w-4 h-4 mr-2" />
                Criar Super Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}