
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  Palette,
  Check,
  X
} from "lucide-react";

const colorOptions = [
  { value: "#146FE0", label: "Azul FirstDocy", color: "#146FE0" },
  { value: "#04BF7B", label: "Verde FirstDocy", color: "#04BF7B" },
  { value: "#212153", label: "Roxo FirstDocy", color: "#212153" },
  { value: "#F59E0B", label: "Âmbar", color: "#F59E0B" },
  { value: "#EF4444", label: "Vermelho", color: "#EF4444" },
  { value: "#10B981", label: "Esmeralda", color: "#10B981" },
  { value: "#8B5CF6", label: "Violeta", color: "#8B5CF6" },
  { value: "#F97316", label: "Laranja", color: "#F97316" },
  { value: "#6366F1", label: "Índigo", color: "#6366F1" },
  { value: "#EC4899", label: "Rosa", color: "#EC4899" }
];

export default function DepartmentForm({ department, departments, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    name: department?.name || "",
    description: department?.description || "",
    color: department?.color || "#146FE0",
    icon: department?.icon || "folder",
    manager_email: department?.manager_email || "",
    sort_order: department?.sort_order || 0,
    is_active: department?.is_active !== false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState(""); // State to hold email validation error message
  const [nameError, setNameError] = useState(""); // State to hold name validation error message

  // Helper function for email validation
  const validateEmail = (email) => {
    if (!email) return ""; // Email is optional, no error if empty
    // Basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um e-mail válido.";
    }
    return "";
  };

  // Handler for email input change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, manager_email: email }));
    setEmailError(validateEmail(email)); // Validate and set error message
  };

  // Handler for name input change
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name: name }));
    // Clear name error proactively if user starts typing, but final validation happens on save
    if (nameError && name.trim()) {
      setNameError("");
    }
  };

  const handleSave = async () => {
    let hasError = false;

    // Validate name for emptiness
    if (!formData.name.trim()) {
      setNameError("O nome do departamento é obrigatório.");
      hasError = true;
    } else {
      // Validate name for uniqueness
      const isDuplicate = departments.some(
        d => d.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && d.id !== department?.id
      );
      if (isDuplicate) {
        setNameError("Já existe um departamento com este nome.");
        hasError = true;
      } else {
        setNameError("");
      }
    }

    // Validate email
    const emailValidationMessage = validateEmail(formData.manager_email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) {
      return; // Prevent saving if there are validation errors
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      // Optionally display a user-friendly error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {department ? 'Editar Departamento' : 'Novo Departamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Departamento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange} // Use new handler
              placeholder="Ex: Vendas, RH, Financeiro..."
              disabled={isSaving}
              required
              className={nameError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            />
            {nameError && (
              <p className="text-red-500 text-sm">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva as responsabilidades deste departamento..."
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor Identificadora</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
              disabled={isSaving}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  />
                  <span>Cor do departamento</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager_email">Email do Gestor</Label>
            <Input
              id="manager_email"
              type="email"
              value={formData.manager_email}
              onChange={handleEmailChange} // Use new handler
              placeholder="gestor@empresa.com"
              disabled={isSaving}
              className={emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            />
            {emailError && (
              <p className="text-red-500 text-sm">{emailError}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              disabled={isSaving}
            />
            <Label htmlFor="is_active" className="text-sm">
              Departamento ativo
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim() || !!emailError || !!nameError} // Disable if name is empty or email/name is invalid
              className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {department ? 'Atualizar' : 'Criar Departamento'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
