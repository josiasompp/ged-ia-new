import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateSignatureWorkflow({ documents, onSave, onClose, currentUser }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    document_id: "",
    workflow_type: "sequencial",
    custom_message: "",
    require_authentication: false,
    allow_decline: true,
  });

  const [signers, setSigners] = useState([
    {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      order: 1,
      is_required: true,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const addSigner = () => {
    const newSigner = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      order: signers.length + 1,
      is_required: true,
    };
    setSigners([...signers, newSigner]);
  };

  const removeSigner = (signerId) => {
    setSigners(
      signers
        .filter((s) => s.id !== signerId)
        .map((s, index) => ({ ...s, order: index + 1 }))
    );
  };

  const updateSigner = (signerId, field, value) => {
    setSigners(
      signers.map((s) => (s.id === signerId ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    if (!formData.name || !formData.document_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome do workflow e documento são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (signers.length === 0) {
      toast({
        title: "Nenhum signatário",
        description: "Adicione pelo menos um signatário.",
        variant: "destructive",
      });
      return;
    }

    for (const signer of signers) {
      if (!signer.name || !signer.email) {
        toast({
          title: "Dados do signatário incompletos",
          description: "Nome e email são obrigatórios para todos os signatários.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        created_by: currentUser?.email,
        total_signers: signers.length,
        signers,
      });
      
      toast({
        title: "Workflow criado!",
        description: "O workflow de assinatura foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar workflow:", error);
      toast({
        title: "Erro ao criar workflow",
        description: "Não foi possível criar o workflow. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Workflow de Assinatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Workflow *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Contrato de Prestação de Serviços"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Documento *</Label>
              <Select
                value={formData.document_id}
                onValueChange={(value) => setFormData({ ...formData, document_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o documento" />
                </SelectTrigger>
                <SelectContent>
                  {documents?.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o objetivo deste workflow..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Workflow</Label>
              <Select
                value={formData.workflow_type}
                onValueChange={(value) => setFormData({ ...formData, workflow_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequencial">Sequencial</SelectItem>
                  <SelectItem value="paralelo">Paralelo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Signatários</Label>
              <Button type="button" onClick={addSigner} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {signers.map((signer, index) => (
              <div key={signer.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Signatário {index + 1}</h4>
                  {signers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSigner(signer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Nome *</Label>
                    <Input
                      value={signer.name}
                      onChange={(e) => updateSigner(signer.id, "name", e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={signer.email}
                      onChange={(e) => updateSigner(signer.id, "email", e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Telefone</Label>
                    <Input
                      value={signer.phone}
                      onChange={(e) => updateSigner(signer.id, "phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id={`required-${signer.id}`}
                      checked={signer.is_required}
                      onCheckedChange={(checked) =>
                        updateSigner(signer.id, "is_required", checked)
                      }
                    />
                    <Label htmlFor={`required-${signer.id}`}>Assinatura obrigatória</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_message">Mensagem Personalizada</Label>
            <Textarea
              id="custom_message"
              value={formData.custom_message}
              onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
              placeholder="Mensagem que será enviada aos signatários..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="require_authentication"
                checked={formData.require_authentication}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, require_authentication: checked })
                }
              />
              <Label htmlFor="require_authentication">Requerer autenticação adicional</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow_decline"
                checked={formData.allow_decline}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allow_decline: checked })
                }
              />
              <Label htmlFor="allow_decline">Permitir recusa de assinatura</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Criando..." : "Criar Workflow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}