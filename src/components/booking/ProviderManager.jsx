import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Users, Search, UserCheck } from "lucide-react";
import { ServiceProvider } from "@/api/entities";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming this component exists for multi-selection

export default function ProviderManager({ providers, services, currentUser, onRefresh, isLoading }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    services: [],
    is_active: true,
    working_hours: {}
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      email: "",
      phone: "",
      services: [],
      is_active: true,
      working_hours: {}
    });
    setSelectedProvider(null);
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (provider) => {
    setFormData({
      name: provider.name || "",
      title: provider.title || "",
      email: provider.email || "",
      phone: provider.phone || "",
      services: provider.services || [],
      is_active: provider.is_active !== false,
      working_hours: provider.working_hours || {}
    });
    setSelectedProvider(provider);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const providerData = {
        ...formData,
        company_id: currentUser?.company_id || "default_company"
      };

      if (selectedProvider) {
        await ServiceProvider.update(selectedProvider.id, providerData);
        toast({ title: "Prestador atualizado com sucesso!" });
      } else {
        await ServiceProvider.create(providerData);
        toast({ title: "Prestador criado com sucesso!" });
      }

      setShowForm(false);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Erro ao salvar prestador:", error);
      toast({ title: "Erro ao salvar prestador", variant: "destructive" });
    }
  };

  const handleDelete = async (provider) => {
    if (window.confirm(`Tem certeza que deseja excluir o prestador "${provider.name}"?`)) {
      try {
        await ServiceProvider.delete(provider.id);
        toast({ title: "Prestador excluído com sucesso!" });
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir prestador:", error);
        toast({ title: "Erro ao excluir prestador", variant: "destructive" });
      }
    }
  };

  const serviceOptions = services.map(s => ({ value: s.id, label: s.name }));

  const filteredProviders = providers.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gerenciar Prestadores ({providers.length})
          </CardTitle>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Prestador
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar prestadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prestador</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan="5" className="text-center">Carregando...</TableCell></TableRow>
              ) : filteredProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhum prestador encontrado</h3>
                    <p className="text-gray-500">Adicione um prestador para começar.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-500">{provider.title}</div>
                    </TableCell>
                    <TableCell>
                      <div>{provider.email}</div>
                      <div className="text-sm text-gray-500">{provider.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {provider.services?.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          return service ? <Badge key={serviceId} variant="secondary">{service.name}</Badge> : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={provider.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {provider.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(provider)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(provider)} className="ml-2 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProvider ? "Editar Prestador" : "Novo Prestador"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome Completo</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Título (Ex: Dr., Terapeuta)</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <Label>Serviços Prestados</Label>
              <MultiSelect
                options={serviceOptions}
                selected={formData.services}
                onChange={selected => setFormData({...formData, services: selected})}
                className="w-full"
              />
            </div>
             <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active_provider"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active_provider">Prestador Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}