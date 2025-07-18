import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/api/entities';

const CheckboxField = ({ id, label, description, checked, onCheckedChange }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border">
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} className="mt-1" />
    <div className="grid gap-1.5 leading-none">
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function HrDocumentTypeForm({ docType, onSave, onClose }) {
  const [formData, setFormData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await User.me();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (docType) {
      setFormData(docType);
    } else {
      setFormData({
        name: '',
        abbreviated_name: '',
        visibility: 'normal',
        responsible_group: 'colaboradores',
        is_active: true,
        is_user_attributed: false,
        user_has_access: false,
        requires_signature: false,
        has_validity: false,
        has_expedition_date: false,
        has_first_expedition_date: false,
        has_number: false,
        has_series: false,
        has_issuer: false,
        has_category: false,
        has_zone: false,
        has_section: false,
        has_city: false,
        has_state: false,
        has_bank: false,
        has_agency: false,
        has_account_number: false,
        has_account_type: false,
        allow_editing: false,
        requires_image_upload: false,
        details: ''
      });
    }
  }, [docType]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...formData, company_id: currentUser.company_id });
  };

  if (!formData) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{docType ? 'Editar' : 'Criar'} Tipo de Documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abbreviated_name">Nome Abreviado</Label>
              <Input id="abbreviated_name" value={formData.abbreviated_name} onChange={(e) => handleChange('abbreviated_name', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visibility">Visível</Label>
              <Select value={formData.visibility} onValueChange={(v) => handleChange('visibility', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="restrito">Restrito</SelectItem>
                  <SelectItem value="confidencial">Confidencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible_group">Responsável</Label>
              <Select value={formData.responsible_group} onValueChange={(v) => handleChange('responsible_group', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="colaboradores">Colaboradores</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="gestores">Gestores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Ativo</Label>
              <Select value={formData.is_active.toString()} onValueChange={(v) => handleChange('is_active', v === 'true')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <h3 className="col-span-full font-semibold text-lg mt-4 border-b pb-2">Permissões e Vigência</h3>
            <CheckboxField id="is_user_attributed" label="Atribuído ao usuário" description="O tipo de documento é atribuído a um usuário?" checked={formData.is_user_attributed} onCheckedChange={(c) => handleChange('is_user_attributed', c)} />
            <CheckboxField id="user_has_access" label="Usuário tem acesso" description="O usuário tem acesso a este tipo de documento?" checked={formData.user_has_access} onCheckedChange={(c) => handleChange('user_has_access', c)} />
            <CheckboxField id="requires_signature" label="Requer assinatura" description="O tipo de documento requer assinatura?" checked={formData.requires_signature} onCheckedChange={(c) => handleChange('requires_signature', c)} />
            <CheckboxField id="has_validity" label="Tem vigência" description="O tipo de documento tem vigência?" checked={formData.has_validity} onCheckedChange={(c) => handleChange('has_validity', c)} />
            <CheckboxField id="allow_editing" label="Tem edição" description="A conta do tipo NORMAL pode editar o documento?" checked={formData.allow_editing} onCheckedChange={(c) => handleChange('allow_editing', c)} />
            <CheckboxField id="requires_image_upload" label="Tem imagem" description="Requer upload de uma imagem do tipo (pdf,jpg,png,xls...)?" checked={formData.requires_image_upload} onCheckedChange={(c) => handleChange('requires_image_upload', c)} />
            
            <h3 className="col-span-full font-semibold text-lg mt-4 border-b pb-2">Campos do Documento</h3>
            <CheckboxField id="has_expedition_date" label="Tem data expedição" description="O tipo de documento tem data de expedição ou emissão?" checked={formData.has_expedition_date} onCheckedChange={(c) => handleChange('has_expedition_date', c)} />
            <CheckboxField id="has_first_expedition_date" label="Tem data primeira expedição" description="O tipo de documento tem data de primeira expedição ou emissão?" checked={formData.has_first_expedition_date} onCheckedChange={(c) => handleChange('has_first_expedition_date', c)} />
            <CheckboxField id="has_number" label="Tem número" description="O tipo de documento tem algum número de identificação?" checked={formData.has_number} onCheckedChange={(c) => handleChange('has_number', c)} />
            <CheckboxField id="has_series" label="Tem série" description="O tipo de documento tem uma identificação de série?" checked={formData.has_series} onCheckedChange={(c) => handleChange('has_series', c)} />
            <CheckboxField id="has_issuer" label="Tem orgão" description="O tipo de documento tem orgão emissor ou expedidor?" checked={formData.has_issuer} onCheckedChange={(c) => handleChange('has_issuer', c)} />
            <CheckboxField id="has_category" label="Tem categoria" description="O tipo de documento tem categoria?" checked={formData.has_category} onCheckedChange={(c) => handleChange('has_category', c)} />
            <CheckboxField id="has_zone" label="Tem zona" description="O tipo de documento tem alguma identificação de zona?" checked={formData.has_zone} onCheckedChange={(c) => handleChange('has_zone', c)} />
            <CheckboxField id="has_section" label="Tem setor/seção" description="O tipo do documento tem uma identificação de setor/seção?" checked={formData.has_section} onCheckedChange={(c) => handleChange('has_section', c)} />
            <CheckboxField id="has_city" label="Tem cidade" description="O tipo de documento tem identificação de cidade?" checked={formData.has_city} onCheckedChange={(c) => handleChange('has_city', c)} />
            <CheckboxField id="has_state" label="Tem estado" description="O tipo de documento tem identificação de estado?" checked={formData.has_state} onCheckedChange={(c) => handleChange('has_state', c)} />
            
            <h3 className="col-span-full font-semibold text-lg mt-4 border-b pb-2">Campos Bancários</h3>
            <CheckboxField id="has_bank" label="Tem banco" description="Tem nome do banco no documento?" checked={formData.has_bank} onCheckedChange={(c) => handleChange('has_bank', c)} />
            <CheckboxField id="has_agency" label="Tem agência" description="Tem número da agência bancária no documento?" checked={formData.has_agency} onCheckedChange={(c) => handleChange('has_agency', c)} />
            <CheckboxField id="has_account_number" label="Tem conta" description="Tem o número da conta bancária no documento?" checked={formData.has_account_number} onCheckedChange={(c) => handleChange('has_account_number', c)} />
            <CheckboxField id="has_account_type" label="Tem tipo conta" description="Tem o tipo conta no documento? (Corrente, Poupança ou Digital)" checked={formData.has_account_type} onCheckedChange={(c) => handleChange('has_account_type', c)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Detalhe</Label>
            <Textarea id="details" value={formData.details} onChange={(e) => handleChange('details', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}