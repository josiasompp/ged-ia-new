import React from 'react';
import ServiceOrderPDF from './ServiceOrderPDF';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Calendar, MapPin, Truck, Package, Edit, Save, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  solicitada: { label: 'Solicitada', color: 'bg-blue-100 text-blue-800' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-800' },
  em_transito: { label: 'Em Trânsito', color: 'bg-orange-100 text-orange-800' },
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
};

export default function ServiceOrderDetail({ order, onClose, onUpdate, currentUser }) {
  const [newStatus, setNewStatus] = React.useState(order?.status || 'solicitada');
  const [internalNotes, setInternalNotes] = React.useState(order?.notes_internal || '');
  const [isEditing, setIsEditing] = React.useState(false);

  const pdfRef = React.useRef();
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && pdfRef.current) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>OS_${order?.order_number || 'N/A'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              @media print { 
                body { margin: 0; } 
                .no-print { display: none; }
              }
              .bg-blue-100 { background-color: #dbeafe; }
              .text-blue-800 { color: #1e40af; }
              .bg-yellow-100 { background-color: #fef3c7; }
              .text-yellow-800 { color: #92400e; }
              .bg-orange-100 { background-color: #fed7aa; }
              .text-orange-800 { color: #9a3412; }
              .bg-green-100 { background-color: #dcfce7; }
              .text-green-800 { color: #166534; }
              .bg-gray-100 { background-color: #f3f4f6; }
              .text-gray-800 { color: #1f2937; }
              .font-bold { font-weight: bold; }
              .text-sm { font-size: 0.875rem; }
              .text-xs { font-size: 0.75rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .p-2 { padding: 0.5rem; }
              .border { border: 1px solid #d1d5db; }
              .rounded { border-radius: 0.25rem; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              .grid-cols-4 { display: grid; grid-template-columns: repeat(4, 1fr); }
              .grid-cols-6 { display: grid; grid-template-columns: repeat(6, 1fr); }
              .grid-cols-3 { display: grid; grid-template-columns: repeat(3, 1fr); }
              .gap-4 { gap: 1rem; }
              .text-center { text-align: center; }
              .border-t { border-top: 1px solid #9ca3af; }
              .pt-2 { padding-top: 0.5rem; }
              .pt-20 { padding-top: 5rem; }
            </style>
          </head>
          <body>
            ${pdfRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSave = () => {
    if (!order || !currentUser) return;
    
    const safeHistory = Array.isArray(order.history) ? order.history : [];
    const updates = {
        status: newStatus,
        notes_internal: internalNotes,
        history: [
            ...safeHistory,
            {
                status: newStatus,
                changed_by: currentUser.email,
                timestamp: new Date().toISOString(),
                notes: `Status alterado para ${statusConfig[newStatus]?.label}`
            }
        ]
    };
    onUpdate(order.id, updates);
    setIsEditing(false);
  };

  // Garantir que os dados sejam arrays válidos
  const requestedItems = Array.isArray(order?.requested_items) ? order.requested_items : [];
  const orderHistory = Array.isArray(order?.history) ? order.history : [];

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Ordem de serviço não encontrada.</p>
          <Button onClick={onClose} className="mt-4">
            Voltar para a Lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div style={{ display: 'none' }}>
        <ServiceOrderPDF ref={pdfRef} order={order} />
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Lista
        </Button>
        <Button onClick={handlePrint} className="gap-2 bg-gray-700 hover:bg-gray-800 text-white">
          <Printer className="w-4 h-4" />
          Imprimir / Gerar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>
                O.S. #{order.order_number} - <span className="font-normal">{(order.service_type || '').replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</span>
              </CardTitle>
              <Badge className={statusConfig[order.status]?.color || ''}>{statusConfig[order.status]?.label || order.status}</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Cliente</h4>
                <p>{order.client_user_email}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" />Data da Solicitação</h4>
                <p>{order.request_date ? format(new Date(order.request_date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" />Endereço de Entrega</h4>
                <p>{order.delivery_address}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Contato</h4>
                <p>{order.contact_person} ({order.contact_phone})</p>
              </div>
               <div className="md:col-span-2 space-y-1">
                <h4 className="font-semibold">Observações do Cliente</h4>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{order.notes_client || "Nenhuma observação."}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-gray-600" />Itens Solicitados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {requestedItems.map((item, index) => (
                  <li key={item?.physical_document_id || index} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item?.description || 'Sem descrição'}</p>
                      <p className="text-sm text-gray-500">Endereço: {item?.address || 'N/A'}</p>
                    </div>
                  </li>
                ))}
                {requestedItems.length === 0 && (
                  <li className="p-3 text-center text-gray-500">Nenhum item solicitado</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5 text-gray-600" />Gerenciar O.S.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Alterar Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <label className="text-sm font-medium">Notas Internas</label>
                <Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} placeholder="Adicione observações internas aqui..."/>
               </div>
               <Button onClick={handleSave} className="w-full gap-2">
                 <Save className="w-4 h-4" /> Salvar Alterações
               </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-gray-600" />Histórico</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orderHistory.slice().reverse().map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="font-medium">{statusConfig[entry?.status]?.label || entry?.status}</div>
                                <div className="text-sm text-gray-500">
                                  {entry?.timestamp ? format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'} por {entry?.changed_by || 'N/A'}
                                </div>
                                {entry?.notes && <div className="text-xs text-gray-600 mt-1">{entry.notes}</div>}
                            </div>
                        </div>
                    ))}
                     <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                            <div className="font-medium">Solicitada</div>
                            <div className="text-sm text-gray-500">
                              {order.request_date ? format(new Date(order.request_date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'} por {order.client_user_email}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}