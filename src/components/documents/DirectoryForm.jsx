
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderPlus, 
  Check, 
  X 
} from "lucide-react";
import { Directory } from "@/api/entities";

const accessLevels = [
  { value: "publico", label: "Público", description: "Todos podem ver" },
  { value: "departamento", label: "Departamento", description: "Apenas o departamento" },
  { value: "restrito", label: "Restrito", description: "Usuários específicos" },
  { value: "confidencial", label: "Confidencial", description: "Acesso muito limitado" }
];

export default function DirectoryForm({ department, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    access_level: "departamento",
    inherit_permissions: true,
    sort_order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Por favor, digite o nome do diretório.");
      return;
    }

    setIsSaving(true);
    try {
      const directoryData = {
        ...formData,
        company_id: currentUser?.company_id || "default_company",
        department_id: department?.id,
        path: `/${department?.name}/${formData.name}`,
        is_active: true
      };

      await Directory.create(directoryData);
      onSave();
    } catch (error) {
      console.error("Erro ao criar diretório:", error);
      alert("Erro ao criar diretório. Tente novamente.");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            Novo Diretório em {department?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Diretório *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Contratos, Relatórios, Documentos Internos..."
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
              Herdar permissões do departamento "{department?.name}"
            </Label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-1">Localização:</h4>
            <p className="text-sm text-blue-700">
              {department?.name} → {formData.name || "Nome do Diretório"}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim()}
              className="gap-2 bg-gradient-to-r from-[#04BF7B] to-[#146FE0]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Criar Diretório
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
