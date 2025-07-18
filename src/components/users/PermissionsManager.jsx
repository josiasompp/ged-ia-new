import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  FileSignature,
  Target,
  Briefcase,
  Calendar,
  FileBox
} from 'lucide-react';

const modulesConfig = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }] },
  { id: 'ged', name: 'GED', icon: <FileText className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Excluir' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'cdoc', name: 'CDOC', icon: <FileBox className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Excluir' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'proposals', name: 'Propostas', icon: <FileSignature className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Excluir' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'crm', name: 'CRM', icon: <Target className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Excluir' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'hr', name: 'RHR', icon: <Briefcase className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'manage_employees', name: 'Gerenciar Pessoal' }, { id: 'manage_payroll', name: 'Gerenciar Folha' }, { id: 'manage_hiring', name: 'Gerenciar Contratação' }] },
  { id: 'booking', name: 'Agendamentos', icon: <Calendar className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'manage_appointments', name: 'Gerenciar Agenda' }, { id: 'manage_settings', name: 'Gerenciar Configurações' }] },
  { id: 'tasks', name: 'Tarefas e Aprovações', icon: <CheckSquare className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Excluir' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'signatures', name: 'Assinaturas Digitais', icon: <FileSignature className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'create', name: 'Criar' }, { id: 'manage', name: 'Gerenciar' }] },
  { id: 'reports', name: 'Relatórios', icon: <BarChart3 className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }] },
  { id: 'settings', name: 'Configurações', icon: <Settings className="w-5 h-5 text-gray-500" />, permissions: [{ id: 'view', name: 'Visualizar' }, { id: 'manage_users', name: 'Gerenciar Usuários' }, { id: 'manage_company', name: 'Gerenciar Empresa' }, { id: 'manage_billing', name: 'Gerenciar Faturamento' }] },
];

export default function PermissionsManager({ permissions, onChange }) {

  const handlePermissionChange = (moduleId, permissionId, checked) => {
    const newPermissions = { ...permissions };
    const modulePermissions = newPermissions[moduleId] || [];

    if (checked) {
      if (!modulePermissions.includes(permissionId)) {
        newPermissions[moduleId] = [...modulePermissions, permissionId];
      }
    } else {
      newPermissions[moduleId] = modulePermissions.filter(p => p !== permissionId);
    }
    onChange(newPermissions);
  };

  return (
    <div className="space-y-6">
      {modulesConfig.map(module => (
        <Card key={module.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 p-4 border-b">
            <CardTitle className="text-base font-medium flex items-center gap-3">
              {module.icon}
              {module.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {module.permissions.map(permission => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${module.id}-${permission.id}`}
                  checked={(permissions[module.id] || []).includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(module.id, permission.id, checked)}
                />
                <Label htmlFor={`${module.id}-${permission.id}`} className="text-sm font-normal cursor-pointer">
                  {permission.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}