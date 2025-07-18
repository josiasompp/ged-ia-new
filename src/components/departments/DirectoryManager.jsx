
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Folder, 
  FolderOpen, 
  FolderPlus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Users,
  Plus,
  X,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Directory } from "@/api/entities";

const accessLevelColors = {
  publico: "bg-green-100 text-green-800",
  departamento: "bg-blue-100 text-blue-800",
  restrito: "bg-amber-100 text-amber-800",
  confidencial: "bg-red-100 text-red-800"
};

const accessLevels = [
  { value: "publico", label: "Público", description: "Todos podem ver" },
  { value: "departamento", label: "Departamento", description: "Apenas o departamento" },
  { value: "restrito", label: "Restrito", description: "Usuários específicos" },
  { value: "confidencial", label: "Confidencial", description: "Acesso muito limitado" }
];

const DirectoryForm = ({ directory, department, onSave, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    name: directory?.name || "",
    description: directory?.description || "",
    access_level: directory?.access_level || "departamento",
    inherit_permissions: directory?.inherit_permissions !== false,
    sort_order: directory?.sort_order || 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setIsSaving(true);
    try {
      const directoryData = {
        ...formData,
        company_id: currentUser?.company_id,
        department_id: department?.id,
        path: `/${department?.name}/${formData.name}`
      };

      if (directory) {
        await Directory.update(directory.id, directoryData);
      } else {
        await Directory.create(directoryData);
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar diretório:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            {directory ? 'Editar Diretório' : 'Novo Diretório'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Diretório *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Contratos, Relatórios..."
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste diretório..."
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access_level">Nível de Acesso</Label>
            <Select 
              value={formData.access_level} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, access_level: value }))}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                {accessLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inherit_permissions"
              checked={formData.inherit_permissions}
              onChange={(e) => setFormData(prev => ({ ...prev, inherit_permissions: e.target.checked }))}
              disabled={isSaving}
            />
            <Label htmlFor="inherit_permissions" className="text-sm">
              Herdar permissões do departamento
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim()}
              className="gap-2 bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {directory ? 'Atualizar' : 'Criar Diretório'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function DirectoryManager({ department, directories, onRefresh, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState(null);

  const filteredDirectories = directories.filter(dir =>
    dir.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDirectory = () => {
    setSelectedDirectory(null);
    setShowForm(true);
  };

  const handleEditDirectory = (directory) => {
    setSelectedDirectory(directory);
    setShowForm(true);
  };

  const handleDeleteDirectory = async (directory) => {
    if (window.confirm(`Tem certeza que deseja excluir o diretório "${directory.name}"?`)) {
      try {
        await Directory.delete(directory.id);
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir diretório:", error);
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedDirectory(null);
    onRefresh();
  };

  if (!department) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Selecione um Departamento
          </h3>
          <p className="text-gray-500">
            Escolha um departamento na árvore para gerenciar seus diretórios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: department.color }}
              >
                <Folder className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#212153] to-[#04BF7B] bg-clip-text text-transparent font-bold">
                {department.name}
              </span>
              <Badge variant="secondary" className="ml-2">
                {filteredDirectories.length} diretórios
              </Badge>
            </CardTitle>
            <Button 
              onClick={handleCreateDirectory}
              className="gap-2 bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
            >
              <FolderPlus className="w-4 h-4" />
              Novo Diretório
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar diretórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDirectories.map((directory) => (
          <Card key={directory.id} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {directory.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {directory.path}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditDirectory(directory)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Permissões
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteDirectory(directory)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {directory.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {directory.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Badge 
                  className={`${accessLevelColors[directory.access_level]} text-xs flex items-center gap-1`}
                >
                  <Lock className="w-3 h-3" />
                  {directory.access_level}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>0 docs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDirectories.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum diretório encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Tente ajustar sua busca ou criar um novo diretório."
                : "Crie o primeiro diretório para organizar os documentos deste departamento."
              }
            </p>
            <Button 
              onClick={handleCreateDirectory}
              className="gap-2 bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
            >
              <FolderPlus className="w-4 h-4" />
              Criar Primeiro Diretório
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      {showForm && (
        <DirectoryForm
          directory={selectedDirectory}
          department={department}
          onSave={handleFormSave}
          onClose={() => setShowForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
