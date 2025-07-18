
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Crown,
  Lock,
  Plus,
  Search
} from "lucide-react";
import { UserPermission } from "@/api/entities";
import { User } from "@/api/entities";

const permissionLevels = [
  { 
    value: "visualizar", 
    label: "Visualizar", 
    description: "Pode ver documentos",
    color: "bg-blue-100 text-blue-800",
    icon: Eye
  },
  { 
    value: "editar", 
    label: "Editar", 
    description: "Pode editar documentos",
    color: "bg-amber-100 text-amber-800",
    icon: Edit
  },
  { 
    value: "administrar", 
    label: "Administrar", 
    description: "Controle total",
    color: "bg-purple-100 text-purple-800",
    icon: Shield
  },
  { 
    value: "proprietario", 
    label: "Proprietário", 
    description: "Acesso irrestrito",
    color: "bg-red-100 text-red-800",
    icon: Crown
  }
];

const PermissionForm = ({ department, directory, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    user_email: "",
    permission_level: "visualizar",
    expires_at: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.user_email || !formData.permission_level) return;

    setIsSaving(true);
    try {
      const permissionData = {
        ...formData,
        company_id: department?.company_id || "default_company",
        resource_type: directory ? "directory" : "department",
        resource_id: directory?.id || department?.id,
        granted_by: "admin@empresa.com", // Deveria vir do usuário atual
        granted_at: new Date().toISOString(),
        is_inherited: false
      };

      await UserPermission.create(permissionData);
      onSave();
    } catch (error) {
      console.error("Erro ao salvar permissão:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Adicionar Permissão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_email">Email do Usuário *</Label>
            <Input
              id="user_email"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              placeholder="usuario@empresa.com"
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission_level">Nível de Permissão *</Label>
            <Select 
              value={formData.permission_level} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, permission_level: value }))}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {permissionLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <level.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-gray-500">{level.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Data de Expiração</Label>
            <Input
              id="expires_at"
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">Deixe vazio para permissão permanente</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !formData.user_email || !formData.permission_level}
              className="gap-2 bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar Permissão
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PermissionManager({ department, directory, onRefresh, currentUser }) {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (department || directory) {
      loadPermissions();
    }
  }, [department, directory]);

  const loadPermissions = async () => {
    setIsLoading(true);
    try {
      const resourceId = directory?.id || department?.id;
      const resourceType = directory ? "directory" : "department";
      
      const perms = await UserPermission.filter({
        resource_id: resourceId,
        resource_type: resourceType
      });
      
      // Adicionar permissões de exemplo
      const examplePermissions = [
        {
          id: "perm-1",
          user_email: "admin@empresa.com",
          permission_level: "proprietario",
          granted_by: "system@empresa.com",
          granted_at: new Date().toISOString(),
          is_inherited: false
        },
        {
          id: "perm-2", 
          user_email: "vendas@empresa.com",
          permission_level: "administrar",
          granted_by: "admin@empresa.com",
          granted_at: new Date().toISOString(),
          is_inherited: false
        },
        {
          id: "perm-3",
          user_email: "funcionario@empresa.com", 
          permission_level: "visualizar",
          granted_by: "admin@empresa.com",
          granted_at: new Date().toISOString(),
          is_inherited: true
        }
      ];
      
      setPermissions([...perms, ...examplePermissions]);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
    setIsLoading(false);
  };

  const handleDeletePermission = async (permission) => {
    if (window.confirm(`Remover permissão de ${permission.user_email}?`)) {
      try {
        await UserPermission.delete(permission.id);
        loadPermissions();
      } catch (error) {
        console.error("Erro ao remover permissão:", error);
      }
    }
  };

  const filteredPermissions = permissions.filter(perm =>
    perm.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resourceName = directory?.name || department?.name || "Recurso";
  const resourceType = directory ? "Diretório" : "Departamento";

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-[#212153] to-[#8B5CF6] bg-clip-text text-transparent font-bold">
                  Controle de Acesso
                </span>
                <p className="text-sm text-gray-600 font-normal">
                  {resourceType}: {resourceName}
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {filteredPermissions.length} usuários
              </Badge>
            </CardTitle>
            <Button 
              onClick={() => setShowForm(true)}
              className="gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]"
            >
              <UserPlus className="w-4 h-4" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Concedido por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead width="50">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    Carregando permissões...
                  </TableCell>
                </TableRow>
              ) : filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? "Nenhum usuário encontrado." : "Nenhuma permissão configurada."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => {
                  const level = permissionLevels.find(l => l.value === permission.permission_level);
                  const LevelIcon = level?.icon || Shield;

                  return (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-medium">{permission.user_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${level?.color} flex items-center gap-1 w-fit`}>
                          <LevelIcon className="w-3 h-3" />
                          {level?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {permission.granted_by}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(permission.granted_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Ativo</span>
                          {permission.is_inherited && (
                            <Badge variant="outline" className="text-xs">
                              Herdado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePermission(permission)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <PermissionForm
          department={department}
          directory={directory}
          onSave={() => {
            setShowForm(false);
            loadPermissions();
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
