
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building2, Briefcase, Calendar, Edit, Shield, UserCheck, UserCog, Users, Play, Pause, PowerOff } from 'lucide-react';

const roleMapping = {
  admin: { label: "Administrador", icon: UserCog },
  user: { label: "Usuário", icon: Users },
  client: { label: "Cliente", icon: UserCheck },
};

const statusConfig = {
  ativo: { label: "Ativo", icon: Play, color: "bg-green-100 text-green-800" },
  inativo: { label: "Inativo", icon: PowerOff, color: "bg-red-100 text-red-800" },
  pausado: { label: "Pausado", icon: Pause, color: "bg-amber-100 text-amber-800" },
};

export default function UserDetails({ user, onEdit }) {
    if (!user) return null;

    const roleInfo = roleMapping[user.role] || { label: user.role, icon: Users };
    const RoleIcon = roleInfo.icon;

    // Assuming user.is_active will now be a string ('ativo', 'inativo', 'pausado')
    const statusInfo = statusConfig[user.is_active] || { label: 'Desconhecido', icon: Shield, color: 'bg-gray-200 text-gray-800' };
    const StatusIcon = statusInfo.icon;

    return (
        <Card className="h-full flex flex-col border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                <img src={user.profile_photo || `https://avatar.vercel.sh/${user.email}.png`} alt={user.full_name} className="w-20 h-20 rounded-full border-4 border-white shadow-md"/>
                <div>
                    <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="outline" className="mt-2 text-sm flex items-center gap-2 w-fit">
                        <RoleIcon className="w-4 h-4" />
                        {roleInfo.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Informações de Contato</h4>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500"/>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500"/>
                            <span>{user.phone || "Não informado"}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Informações Organizacionais</h4>
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-gray-500"/>
                            <span>{user.department || "Não informado"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-gray-500"/>
                            <span>{user.position || "Não informado"}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Status</h4>
                         <Badge variant="outline" className={`${statusInfo.color} text-sm flex items-center gap-2 w-fit`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                        </Badge>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold">Segurança</h4>
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-gray-500"/>
                            <span>MFA: {user.mfa_enabled ? 'Ativado' : 'Desativado'}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 border-t">
                <Button onClick={onEdit} className="gap-2">
                    <Edit className="w-4 h-4"/>
                    Editar Usuário
                </Button>
            </CardFooter>
        </Card>
    );
}
