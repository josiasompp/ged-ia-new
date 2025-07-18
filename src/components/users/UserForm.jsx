
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Save, User, X, Mail, UserPlus, Shield, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionsManager from "./PermissionsManager";

export default function UserForm({ user, onSave, onClose, companyContext }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: "", // Kept from original, not explicitly removed by outline
    position: "",
    phone: "",
    role: "user",
    is_active: "ativo",
    permissions: [], // Outline indicates empty, superseded by module_permissions
    module_permissions: {}, // New field for granular permissions
    send_welcome_email: true,
    generate_temporary_password: true,
    temporary_password: '',
    password_expires_at: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id, // Keep ID for existing user
        full_name: user.full_name || "",
        email: user.email || "",
        department: user.department || "",
        position: user.position || "",
        phone: user.phone || "",
        role: user.role || "user",
        is_active: user.is_active || "ativo",
        permissions: user.permissions || [], // Keep for backward compatibility if needed, but module_permissions is primary
        module_permissions: user.module_permissions || {}, // Initialize module_permissions
        send_welcome_email: false, // For existing user, no invite settings
        generate_temporary_password: false, // For existing user, no invite settings
        temporary_password: '', // Clear for existing user
        password_expires_at: '' // Clear for existing user
      });
    } else { // New user initialization
      setFormData({
        full_name: "",
        email: "",
        department: "", // Kept from original
        position: "",
        phone: "",
        role: "user",
        is_active: 'ativo',
        permissions: [],
        module_permissions: {}, // Initialize for new user
        send_welcome_email: true,
        generate_temporary_password: true,
        temporary_password: '',
        password_expires_at: ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsInviting(true);
    try {
      let dataToSave = { ...formData }; // Use let to allow modifications

      if (!user && formData.generate_temporary_password) {
        const tempPassword = generateTemporaryPassword();
        dataToSave.temporary_password = tempPassword;
        dataToSave.password_expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

        // Update local state to display the generated password if needed, before closing
        setFormData(prev => ({
          ...prev,
          temporary_password: tempPassword,
          password_expires_at: dataToSave.password_expires_at
        }));
      }

      // The 'permissions' array from the original schema is superseded by 'module_permissions'.
      // If the backend still requires a flat 'permissions' array derived from 'module_permissions',
      // a conversion step would be needed here. As the outline doesn't specify,
      // we assume 'module_permissions' is sent as is for granular control.

      await onSave(dataToSave, !user);

    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {user ? (
              <>
                <User className="w-5 h-5 text-blue-600"/>
                Editar Usuário
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-green-600"/>
                Convidar Novo Usuário
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {user ? "Altere os dados e permissões do usuário." : "Preencha os dados para enviar um convite de acesso."}
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
          <Tabs defaultValue="personal" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="permissions">Permissões de Acesso</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="flex-grow overflow-y-auto p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dados Básicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Nome Completo *</Label>
                      <Input 
                        id="full_name" 
                        value={formData.full_name} 
                        onChange={e => handleChange("full_name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={e => handleChange("email", e.target.value)} 
                        disabled={!!user}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Departamento</Label>
                      <Input 
                        id="department" 
                        value={formData.department} 
                        onChange={e => handleChange("department", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Cargo</Label>
                      <Input 
                        id="position" 
                        value={formData.position} 
                        onChange={e => handleChange("position", e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={e => handleChange("phone", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Função</Label>
                      <Select value={formData.role} onValueChange={value => handleChange("role", value)}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="user">Usuário Padrão</SelectItem>
                          <SelectItem value="client">Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {user && (
                    <div>
                      <Label htmlFor="is_active">Status do Usuário</Label>
                      <Select value={formData.is_active} onValueChange={value => handleChange("is_active", value)}>
                        <SelectTrigger id="is_active">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="pausado">Pausado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {!user && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Configurações de Convite
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send_welcome_email" 
                        checked={formData.send_welcome_email}
                        onCheckedChange={checked => handleChange("send_welcome_email", checked)}
                      />
                      <Label htmlFor="send_welcome_email" className="text-sm">
                        Enviar email de boas-vindas com instruções de acesso
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="generate_temporary_password" 
                        checked={formData.generate_temporary_password}
                        onCheckedChange={checked => handleChange("generate_temporary_password", checked)}
                      />
                      <Label htmlFor="generate_temporary_password" className="text-sm">
                        Gerar senha temporária (válida por 7 dias)
                      </Label>
                    </div>
                    {formData.generate_temporary_password && (
                      <div>
                        <Label htmlFor="temporary_password">Senha Temporária Gerada:</Label>
                        <div className="relative">
                          <Input
                            id="temporary_password"
                            type={showPassword ? "text" : "password"}
                            value={formData.temporary_password || 'Será Gerada Automaticamente'}
                            readOnly
                            disabled
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-1"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          A senha temporária será gerada ao enviar o convite e terá validade de 7 dias.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="flex-grow overflow-y-auto p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Permissões do Usuário
                    </div>
                  </CardTitle>
                  <DialogDescription className="mt-2">
                    Defina o acesso do usuário a diferentes módulos e funcionalidades do sistema.
                  </DialogDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PermissionsManager 
                    permissions={formData.module_permissions}
                    onChange={(newPermissions) => setFormData(prev => ({...prev, module_permissions: newPermissions}))}
                    companyContext={companyContext} // Pass companyContext for plan-based permissions if PermissionsManager needs it
                    userRole={formData.role} // Pass user role if it affects permissions inside manager
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter className="mt-4 p-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" disabled={isInviting}>
              <X className="w-4 h-4 mr-2"/>
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="submit"
            form="user-form" // Connects button to the form by its ID
            disabled={isInviting || !formData.full_name || !formData.email}
            className={user ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isInviting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {user ? "Salvando..." : "Enviando Convite..."}
              </>
            ) : user ? (
              <>
                <Save className="w-4 h-4 mr-2"/>
                Salvar Alterações
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2"/>
                Enviar Convite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
