import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Save, X, UserPlus } from "lucide-react";

const leadSources = ["website", "email", "telefone", "indicacao", "evento", "redes_sociais", "google_ads", "facebook_ads", "outros"];
const leadStatuses = ["novo", "contatado", "qualificado", "interessado", "proposta_enviada", "negociacao", "ganho", "perdido"];
const leadStages = ["prospeccao", "qualificacao", "proposta", "negociacao", "fechamento"];

export default function LeadForm({ lead, users, currentUser, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    position: "",
    source: "outros",
    status: "novo",
    stage: "prospeccao",
    estimated_value: 0,
    assigned_to: currentUser?.email || "",
    next_followup: null,
    notes: ""
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company_name: lead.company_name || "",
        position: lead.position || "",
        source: lead.source || "outros",
        status: lead.status || "novo",
        stage: lead.stage || "prospeccao",
        estimated_value: lead.estimated_value || 0,
        assigned_to: lead.assigned_to || currentUser?.email || "",
        next_followup: lead.next_followup ? new Date(lead.next_followup) : null,
        notes: lead.notes || ""
      });
    }
  }, [lead, currentUser]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      next_followup: formData.next_followup ? format(formData.next_followup, "yyyy-MM-dd") : null,
      estimated_value: parseFloat(formData.estimated_value) || 0
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            {lead ? "Editar Lead" : "Novo Lead"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input id="company_name" value={formData.company_name} onChange={(e) => handleChange("company_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Estágio</Label>
              <Select value={formData.stage} onValueChange={(v) => handleChange("stage", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadStages.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_value">Valor Estimado (R$)</Label>
              <Input id="estimated_value" type="number" value={formData.estimated_value} onChange={(e) => handleChange("estimated_value", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Select value={formData.source} onValueChange={(v) => handleChange("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadSources.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Responsável</Label>
              <Select value={formData.assigned_to} onValueChange={(v) => handleChange("assigned_to", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {users.map(u => <SelectItem key={u.id} value={u.email}>{u.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Próximo Follow-up</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.next_followup ? format(formData.next_followup, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.next_followup} onSelect={(d) => handleChange("next_followup", d)} locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={4} />
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={onClose}><X className="w-4 h-4 mr-2" />Cancelar</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700"><Save className="w-4 h-4 mr-2" />Salvar Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}