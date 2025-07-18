
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Company } from '@/api/entities';
import { User } from '@/api/entities';
import { PhysicalLocation } from '@/api/entities'; // Added import
import { PhysicalDocument } from '@/api/entities'; // Added import
import { Loader2, Search, Building, User as UserIcon, X, PlusCircle, Trash2 } from 'lucide-react';

export default function ServiceOrderForm({ isOpen, order, onSave, onClose, currentUser }) { // Changed props: isOpen -> order, serviceOrder -> order, added currentUser
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState([]); // Added state
  const [availableAddresses, setAvailableAddresses] = useState([]); // Added state
  const { toast } = useToast();

  useEffect(() => {
    // If an order object is passed, it means we are editing/viewing
    if (order) {
      setFormData({ ...order });
      if (order.company_id) {
        fetchClientUsers(order.company_id);
      }
    } else { // If no order object, initialize for a new order
      setFormData({
        company_id: '',
        client_user_email: '',
        service_type: 'retirada_entrega',
        status: 'solicitada',
        requested_items: [{ description: '', address: '' }],
        delivery_address: '',
        contact_person: '',
        contact_phone: '',
        notes_client: '',
        due_date: ''
      });
    }

    // Load available items and locations when the component is active (i.e., order is present or we're creating a new one)
    // and currentUser is available for filtering
    if (currentUser) {
        loadAvailableItems();
    }
  }, [order, currentUser]); // Dependencies updated

  const loadAvailableItems = async () => {
    try {
      // Carregar endereços disponíveis baseado na empresa do usuário
      let availableLocations = [];
      
      if (currentUser?.company_id) {
        // Para clientes: apenas endereços master + endereços da própria empresa
        const masterLocs = await PhysicalLocation.filter({ company_id: 'master' });
        const companyLocs = await PhysicalLocation.filter({ company_id: currentUser.company_id });
        availableLocations = [...masterLocs, ...companyLocs];
      }
      
      // Carregar documentos físicos vinculados à empresa do cliente
      const clientDocuments = await PhysicalDocument.filter({ 
        company_id: currentUser?.company_id 
      });
      
      setAvailableDocuments(clientDocuments);
      setAvailableAddresses(availableLocations);
    } catch (error) {
      console.error("Erro ao carregar itens disponíveis:", error);
      toast({ variant: 'destructive', title: 'Erro ao carregar dados', description: 'Não foi possível carregar os dados de locais e documentos.' });
    }
  };

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const companiesData = await Company.list();
      setAllCompanies(companiesData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar empresas', description: 'Não foi possível carregar a lista de empresas.' });
    }
    setIsLoadingCompanies(false);
  };
  
  const fetchClientUsers = async (companyId) => {
    setIsLoadingUsers(true);
    setClientUsers([]);
    try {
      const usersData = await User.filter({ company_id: companyId });
      setClientUsers(usersData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar usuários', description: 'Não foi possível carregar os contatos da empresa.' });
    }
    setIsLoadingUsers(false);
  };

  const handleOpenCompanyModal = () => {
    fetchCompanies();
    setIsCompanyModalOpen(true);
  };

  const handleSelectCompany = (company) => {
    setFormData(prev => ({ ...prev, company_id: company.id, delivery_address: company.address || '', client_user_email: '' }));
    fetchClientUsers(company.id);
    setIsCompanyModalOpen(false);
    setCompanySearchTerm('');
  };
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.requested_items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, requested_items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, requested_items: [...prev.requested_items, { description: '', address: '' }] }));
  };

  const removeItem = (index) => {
    const newItems = formData.requested_items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requested_items: newItems }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast({ title: 'Ordem de Serviço salva com sucesso!' });
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: 'Não foi possível salvar a Ordem de Serviço.' });
    }
    setIsSaving(false);
  };
  
  if (!formData) return null;

  // Ensure selectedCompany always has a name, even if not found in allCompanies
  const selectedCompany = allCompanies.find(c => c.id === formData.company_id) || (order && { id: order.company_id, name: 'Empresa Carregada' });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}> {/* Updated open prop */}
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{order ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço (Gestor)'}</DialogTitle> {/* Updated title */}
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Empresa do Cliente</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-grow p-2 border rounded-md bg-gray-50 min-h-[40px]">
                      {selectedCompany?.name || <span className="text-gray-400">Nenhuma empresa selecionada</span>}
                    </div>
                    <Button type="button" variant="outline" onClick={handleOpenCompanyModal}>Selecionar</Button>
                  </div>
                </div>
                <div>
                  <Label>Solicitante (Usuário do Cliente)</Label>
                  <Select
                    value={formData.client_user_email}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client_user_email: value }))}
                    disabled={!formData.company_id || isLoadingUsers}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingUsers ? "Carregando..." : "Selecione um solicitante"} />
                    </SelectTrigger>
                    <SelectContent>
                      {clientUsers.map(user => (
                        <SelectItem key={user.id} value={user.email}>{user.full_name} ({user.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label>Tipo de Serviço</Label>
                    <Select value={formData.service_type} onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="retirada_entrega">Retirada/Entrega</SelectItem>
                            <SelectItem value="recolhimento">Recolhimento</SelectItem>
                            <SelectItem value="descarte_seguro">Descarte Seguro</SelectItem>
                            <SelectItem value="digitalizacao">Digitalização</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                  <Label>Data de Vencimento Solicitada</Label>
                  <Input 
                    type="date" 
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                   />
                </div>
              </div>
              
              <div>
                <Label>Endereço de Entrega/Recolhimento</Label>
                <Textarea 
                  value={formData.delivery_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_address: e.target.value }))}
                  placeholder="Endereço completo para a operação"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Itens Solicitados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.requested_items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 border p-3 rounded-md">
                      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input 
                          placeholder={`Descrição do Item ${index + 1} (ex: Caixa de Contratos 2022)`}
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                        <Input 
                          placeholder="Endereço físico (Opcional, ex: JA1P1AEE01)"
                          value={item.address}
                          onChange={(e) => handleItemChange(index, 'address', e.target.value)}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={formData.requested_items.length <= 1}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Item
                  </Button>
                </CardContent>
              </Card>

              <div>
                <Label>Observações Internas (Visível apenas para a equipe)</Label>
                <Textarea 
                    value={formData.notes_internal || ''}
                    onChange={(e) => setFormData(prev => ({...prev, notes_internal: e.target.value}))}
                    placeholder="Instruções para a equipe, detalhes da operação..."
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {order ? 'Salvar Alterações' : 'Criar Ordem de Serviço'} {/* Updated button text */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Company Selection Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Selecionar Empresa Cliente</DialogTitle>
          </DialogHeader>
          <div className="p-1">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Buscar empresa por nome..." 
                className="pl-10"
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[50vh]">
              {isLoadingCompanies ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-2">
                  {allCompanies.filter(c => c.name.toLowerCase().includes(companySearchTerm.toLowerCase())).map(company => (
                    <div 
                      key={company.id}
                      onClick={() => handleSelectCompany(company)}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      <Building className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.cnpj}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
