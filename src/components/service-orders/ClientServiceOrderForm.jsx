
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Trash2, Package, X, CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { PhysicalDocument } from '@/api/entities';
import { ServiceOrder } from '@/api/entities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function ClientServiceOrderForm({ currentUser, onClose, onSave }) {
  const [serviceType, setServiceType] = useState('retirada_entrega');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPerson, setContactPerson] = useState(currentUser?.full_name || '');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [availableDocs, setAvailableDocs] = useState([]);
  
  const [isDocSelectorOpen, setIsDocSelectorOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.company_id) {
      loadDocuments(currentUser.company_id);
    }
  }, [currentUser]);

  const loadDocuments = async (companyId) => {
    try {
      const docs = await PhysicalDocument.filter({ company_id: companyId });
      setAvailableDocs(Array.isArray(docs) ? docs : []);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
      setAvailableDocs([]);
    }
  };
  
  const handleSelectDoc = (doc) => {
    const currentSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
    if (!currentSelectedItems.find(item => item.physical_document_id === doc.id)) {
      setSelectedItems([...currentSelectedItems, {
        physical_document_id: doc.id,
        description: doc.box_description,
        address: doc.full_address
      }]);
    }
    setIsDocSelectorOpen(false);
  };

  const handleRemoveItem = (docId) => {
    const currentSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
    setSelectedItems(currentSelectedItems.filter(item => item.physical_document_id !== docId));
  };
  
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `OS-${timestamp}-${random}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const orderNumber = generateOrderNumber();
      
      const orderData = {
        company_id: currentUser.company_id,
        client_user_email: currentUser.email,
        order_number: orderNumber,
        service_type: serviceType,
        status: 'solicitada',
        requested_items: Array.isArray(selectedItems) ? selectedItems : [],
        delivery_address: deliveryAddress,
        contact_person: contactPerson,
        contact_phone: contactPhone,
        request_date: new Date().toISOString(),
        due_date: dueDate ? dueDate.toISOString() : null,
        notes_client: notes,
        history: [{
          status: 'solicitada',
          changed_by: currentUser?.email,
          timestamp: new Date().toISOString(),
          notes: 'Criação da Ordem de Serviço pelo cliente'
        }]
      };
      
      await ServiceOrder.create(orderData);
      onSave();
    } catch (error) {
      console.error("Erro ao criar O.S.:", error);
    }
    setIsLoading(false);
  };

  const isFormValid = () => {
    const currentSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
    return currentSelectedItems.length > 0 && deliveryAddress && contactPerson && contactPhone;
  };

  const currentSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const currentAvailableDocs = Array.isArray(availableDocs) ? availableDocs : [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Nova Ordem de Serviço
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="serviceType" className="text-sm font-medium">Tipo de Serviço</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retirada_entrega">Solicitar Entrega de Documentos</SelectItem>
                <SelectItem value="recolhimento">Solicitar Recolhimento de Documentos</SelectItem>
                <SelectItem value="descarte_seguro">Solicitar Descarte Seguro</SelectItem>
                <SelectItem value="digitalizacao">Solicitar Digitalização</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Itens Solicitados</Label>
            <div className="p-4 border rounded-md space-y-3 bg-gray-50">
              {currentSelectedItems.length > 0 ? (
                currentSelectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start bg-white p-3 rounded border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-1">📍 {item.address}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveItem(item.physical_document_id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum item adicionado. Clique no botão abaixo para adicionar documentos.
                </p>
              )}
              
              <Button 
                variant="outline" 
                className="w-full gap-2 mt-3" 
                onClick={() => setIsDocSelectorOpen(true)}
              >
                <PlusCircle className="w-4 h-4" /> 
                Adicionar Documento/Caixa
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson" className="text-sm font-medium">Pessoa de Contato</Label>
              <Input 
                id="contactPerson" 
                value={contactPerson} 
                onChange={(e) => setContactPerson(e.target.value)} 
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium">Telefone de Contato</Label>
              <Input 
                id="contactPhone" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="deliveryAddress" className="text-sm font-medium">Endereço de Entrega/Recolhimento</Label>
            <Textarea 
              id="deliveryAddress" 
              value={deliveryAddress} 
              onChange={(e) => setDeliveryAddress(e.target.value)} 
              placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"
              className="h-20"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Data Desejada (Opcional)</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'dd/MM/yyyy', { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setIsDatePickerOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Observações Adicionais</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Instruções especiais, horários preferenciais, informações importantes..."
              className="h-24"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Criando...' : 'Criar Ordem de Serviço'}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Modal de Seleção de Documentos */}
      {isDocSelectorOpen && (
        <Dialog open={isDocSelectorOpen} onOpenChange={setIsDocSelectorOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Selecionar Documentos/Caixas
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <Command>
                <CommandInput placeholder="Buscar por descrição ou endereço..." />
                <CommandList>
                  <CommandEmpty>Nenhum documento encontrado.</CommandEmpty>
                  <CommandGroup>
                    {currentAvailableDocs.map(doc => (
                      <CommandItem 
                        key={doc.id}
                        value={`${doc.box_description} ${doc.full_address}`}
                        onSelect={() => handleSelectDoc(doc)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium">{doc.box_description}</p>
                            <p className="text-sm text-gray-500">📍 {doc.full_address}</p>
                            {doc.client_name && (
                              <p className="text-xs text-gray-400">Cliente: {doc.client_name}</p>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
