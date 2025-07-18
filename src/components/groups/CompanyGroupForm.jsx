import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CompanyGroupForm({ group, allCompanies, allUsers, onSave, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [masterUserId, setMasterUserId] = useState('none');

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description || '');
      const companyIdsInGroup = allCompanies
        .filter(c => c.group_id === group.id)
        .map(c => c.id);
      setSelectedCompanyIds(companyIdsInGroup);
      const masterUser = allUsers.find(u => u.email === group.master_user_email);
      if (masterUser) {
        setMasterUserId(masterUser.id);
      } else {
        setMasterUserId('none');
      }
    }
  }, [group, allCompanies, allUsers]);

  const handleCompanyToggle = (companyId) => {
    setSelectedCompanyIds(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSubmit = () => {
    const masterUser = masterUserId !== 'none' ? allUsers.find(u => u.id === masterUserId) : null;
    onSave(
      { name, description, master_user_email: masterUser?.email || null },
      selectedCompanyIds,
      masterUser
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{group ? 'Editar Grupo' : 'Novo Grupo de Empresas'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Usuário Master do Grupo (Opcional)</Label>
            <Select value={masterUserId} onValueChange={setMasterUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {allUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.full_name} ({user.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Empresas</Label>
            <ScrollArea className="h-48 rounded-md border p-4">
              <div className="space-y-2">
                {allCompanies.map(company => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company.id}`}
                      checked={selectedCompanyIds.includes(company.id)}
                      onCheckedChange={() => handleCompanyToggle(company.id)}
                      disabled={company.group_id && company.group_id !== group?.id}
                    />
                    <label
                      htmlFor={`company-${company.id}`}
                      className={`text-sm ${company.group_id && company.group_id !== group?.id ? 'text-gray-400' : ''}`}
                    >
                      {company.name} {company.group_id && company.group_id !== group?.id ? '(em outro grupo)' : ''}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}