
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck, Package, CheckCircle, AlertTriangle, Route } from 'lucide-react';
import { ServiceOrder } from '@/api/entities';
import { Company } from '@/api/entities';
import { User } from '@/api/entities';
import ServiceOrderList from '../components/service-orders/ServiceOrderList';
import ServiceOrderForm from '../components/service-orders/ServiceOrderForm';
import ServiceOrderPrintView from '../components/service-orders/ServiceOrderPrintView';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("solicitada");
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [user, orders] = await Promise.all([
        User.me(),
        ServiceOrder.list('-created_date', 500)
      ]);
      setCurrentUser(user);
      
      const sanitizedOrders = (Array.isArray(orders) ? orders : []).map(order => ({
        ...order,
        requested_items: Array.isArray(order.requested_items) ? order.requested_items : [],
        history: Array.isArray(order.history) ? order.history : [],
      }));

      setServiceOrders(sanitizedOrders);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({ variant: "destructive", title: "Erro ao carregar dados", description: "Não foi possível buscar as ordens de serviço." });
      setServiceOrders([]);
    }
    setIsLoading(false);
  };

  const handleOpenForm = (order = null) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedOrder(null);
    setShowForm(false);
  };

  const handleSaveOrder = async (formData) => {
    try {
      const dataToSave = { ...formData };
      if (!selectedOrder && !formData.order_number) {
        dataToSave.order_number = `OS-${Date.now()}`;
      }

      if (selectedOrder && selectedOrder.status !== formData.status) {
        const newHistoryEntry = {
          status: formData.status,
          changed_by: currentUser.email,
          timestamp: new Date().toISOString(),
          notes: `Status alterado para ${formData.status.replace(/_/g, ' ')}.`
        };
        dataToSave.history = [...(selectedOrder.history || []), newHistoryEntry];
      }

      if (selectedOrder) {
        await ServiceOrder.update(selectedOrder.id, dataToSave);
        toast({ title: "Ordem de Serviço atualizada!", description: `O.S. #${dataToSave.order_number} foi atualizada.` });
      } else {
        const newHistoryEntry = {
          status: 'solicitada',
          changed_by: currentUser.email,
          timestamp: new Date().toISOString(),
          notes: 'Ordem de serviço criada.'
        };
        dataToSave.history = [newHistoryEntry];
        await ServiceOrder.create(dataToSave);
        toast({ title: "Ordem de Serviço criada!", description: `Nova O.S. #${dataToSave.order_number} criada com sucesso.` });
      }
      await loadInitialData();
      handleCloseForm();
    } catch (error) {
        console.error("Erro ao salvar ordem de serviço:", error);
        toast({ variant: "destructive", title: "Erro ao salvar", description: "Não foi possível salvar a Ordem de Serviço." });
    }
  };
  
  const handleDeleteOrder = async (orderId) => {
    if(!window.confirm("Tem certeza que deseja excluir esta Ordem de Serviço?")) return;

    try {
        await ServiceOrder.delete(orderId);
        toast({ title: "Ordem de Serviço excluída com sucesso!" });
        await loadInitialData();
    } catch (error) {
        console.error("Erro ao excluir ordem de serviço:", error);
        toast({ variant: "destructive", title: "Erro ao excluir", description: "Não foi possível excluir a Ordem de Serviço." });
    }
  };

  const handlePrintOrder = async (order) => {
    try {
      let company = null;
      if (order.company_id && isValidObjectId(order.company_id)) {
        try {
          const companies = await Company.filter({ id: order.company_id });
          if (companies && companies.length > 0) {
              company = companies[0];
          }
        } catch (error) {
          console.warn("Erro ao carregar empresa da O.S.:", error);
        }
      }

      // QR Code Data
      const qrDataText = `OS: ${order.order_number}\nCliente: ${company?.name || order.client_user_email}\nStatus: ${order.status}`;
      const encodedQrData = encodeURIComponent(qrDataText);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodedQrData}`;

      // Google Maps Link
      const encodedAddress = encodeURIComponent(order.delivery_address || '');
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ordem de Serviço #${order.order_number}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
              margin: 0; 
              padding: 15px; 
              font-size: 12px; 
              line-height: 1.4;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 20px; 
            }
            .header .info { text-align: right; }
            .title { text-align: center; margin-bottom: 25px; }
            .title h1 { font-size: 20px; margin: 0 0 5px 0; font-weight: bold; }
            .title .subtitle { font-size: 11px; color: #555; }
            .section { margin-bottom: 15px; }
            .section h2 { 
              background: #f2f2f2; 
              padding: 6px 8px; 
              margin: 0 0 8px 0; 
              font-size: 13px; 
              border-radius: 4px; 
              font-weight: bold;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 6px; 
              text-align: left; 
              font-size: 11px; 
              vertical-align: top;
            }
            th { 
              background: #f9f9f9; 
              font-weight: 600; 
              width: 25%;
            }
            .signatures { 
              margin-top: 30px; 
              padding-top: 15px; 
              border-top: 1px solid #ccc; 
            }
            .sig-grid { 
              display: flex; 
              justify-content: space-around; 
            }
            .sig-item { 
              text-align: center; 
              flex: 1; 
              margin: 0 10px; 
            }
            .sig-line { 
              border-bottom: 1px solid #333; 
              margin: 40px 0 5px 0; 
            }
            .qr-code { 
              width: 80px; 
              height: 80px; 
            }
            a { 
              color: #0066cc; 
              text-decoration: none; 
            }
            .no-print { 
              margin: 20px 0; 
              text-align: center; 
            }
            @media print { 
              body { 
                margin: 0; 
                padding: 10mm; 
                font-size: 10pt; 
              } 
              .no-print { 
                display: none; 
              }
              a { 
                color: inherit; 
                text-decoration: none; 
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button onclick="window.print()" style="padding: 10px 20px; background: #146FE0; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">🖨️ Imprimir</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">❌ Fechar</button>
          </div>
          
          <div class="header">
            <img src="${qrCodeUrl}" alt="QR Code da O.S." class="qr-code" onerror="this.style.display='none'" />
            <div class="info">
              <div><strong>Data de Impressão:</strong></div>
              <div>${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</div>
            </div>
          </div>
          
          <div class="title">
            <h1>Ordem de Serviço # ${order.order_number}</h1>
            <div class="subtitle">
              Data: ${order.request_date ? new Date(order.request_date).toLocaleString('pt-BR') : 'N/A'} | 
              Status: <strong>${order.status.toUpperCase().replace(/_/g, ' ')}</strong>
            </div>
          </div>

          <div class="section">
            <h2>👤 Cliente e Endereço de Entrega</h2>
            <table>
              <tbody>
                <tr>
                  <th>Cliente</th>
                  <td>${company?.name || order.client_user_email}</td>
                  <th>CNPJ/CPF</th>
                  <td>${company?.cnpj || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Contato</th>
                  <td>${order.contact_person || 'N/A'}</td>
                  <th>Telefone</th>
                  <td>${order.contact_phone || 'N/A'}</td>
                </tr>
                <tr>
                  <th colspan="1">Endereço Completo</th>
                  <td colspan="3">
                    <a href="${mapsUrl}" target="_blank" title="Clique para abrir no Google Maps">
                      📍 ${order.delivery_address || 'N/A'}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>📋 Serviços Solicitados</h2>
            <table>
              <tbody>
                <tr>
                  <th>Tipo de Serviço</th>
                  <td>${(order.service_type || '').replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</td>
                </tr>
              </tbody>
            </table>
            
            <h3 style="font-size: 12px; margin: 10px 0 5px 0;">Itens Solicitados:</h3>
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Endereço Físico</th>
                </tr>
              </thead>
              <tbody>
                ${order.requested_items && order.requested_items.length > 0 
                  ? order.requested_items.map(item => `
                    <tr>
                      <td>${item.description || 'N/A'}</td>
                      <td>${item.address || 'N/A'}</td>
                    </tr>
                  `).join('')
                  : '<tr><td colspan="2">Nenhum item específico informado</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>📝 Observações</h2>
            <table>
              <tbody>
                <tr>
                  <th>Observações do Cliente</th>
                  <td>${order.notes_client || 'Nenhuma observação.'}</td>
                </tr>
                <tr>
                  <th>Observações Internas</th>
                  <td>${order.notes_internal || 'Nenhuma observação interna.'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="signatures">
            <div class="sig-grid">
              <div class="sig-item">
                <div class="sig-line"></div>
                <small>Data: ___/___/_____ Hora: ___:___</small><br>
                <small><strong>Assinatura do Conferente</strong></small>
              </div>
              <div class="sig-item">
                <div class="sig-line"></div>
                <small>Data: ___/___/_____ Hora: ___:___</small><br>
                <small><strong>Assinatura do Transportador</strong></small>
              </div>
              <div class="sig-item">
                <div class="sig-line"></div>
                <small>Data: ___/___/_____ Hora: ___:___</small><br>
                <small><strong>Assinatura do Recebedor</strong></small>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Tentar abrir em nova aba
      try {
        const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          
          // Aguardar o carregamento antes de focar
          setTimeout(() => {
            printWindow.focus();
          }, 100);
        } else {
          throw new Error('Pop-up bloqueado');
        }
      } catch (error) {
        // Fallback: criar um blob e abrir como download
        console.log('Pop-up bloqueado, usando fallback...');
        const blob = new Blob([printContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `OS-${order.order_number}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({ 
          title: "Preview baixado", 
          description: "O arquivo HTML foi baixado. Abra-o no navegador para visualizar e imprimir."
        });
      }

    } catch (error) {
      console.error("Erro ao imprimir ordem de serviço:", error);
      toast({
        title: "Erro na impressão",
        description: "Não foi possível gerar a impressão da ordem de serviço.",
        variant: "destructive"
      });
    }
  };

  // Helper function to validate ID format
  const isValidObjectId = (id) => {
    return id && /^[a-f\d]{24}$/i.test(id);
  };

  const getOrdersByStatus = (status) => {
    return serviceOrders.filter(order => order.status === status);
  };
  
  const statusConfig = {
    solicitada: { icon: AlertTriangle, color: "text-blue-500", label: "Solicitadas" },
    em_atendimento: { icon: Truck, color: "text-yellow-500", label: "Em Atendimento" },
    em_transito: { icon: Route, color: "text-orange-500", label: "Em Trânsito" },
    concluida: { icon: CheckCircle, color: "text-green-500", label: "Concluídas" },
    cancelada: { icon: Package, color: "text-gray-500", label: "Canceladas" },
  };

  return (
    <div className="p-6 space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de O.S.</h1>
          <p className="text-gray-500 mt-1">Gerencie retiradas, entregas e outras solicitações de clientes.</p>
        </div>
        <div className="flex gap-2">
           <Button 
            onClick={() => handleOpenForm()}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
           >
            <Plus className="w-4 h-4" />
            Nova O.S. (Gestor)
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries(statusConfig).map(([status, config]) => (
            <TabsTrigger key={status} value={status} className="gap-2">
              <config.icon className={`w-4 h-4 ${config.color}`} />
              {config.label}
              <Badge variant="secondary" className="ml-1">{getOrdersByStatus(status).length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(statusConfig).map(status => (
          <TabsContent key={status} value={status} className="mt-4">
            <ServiceOrderList 
              serviceOrders={getOrdersByStatus(status)}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onDelete={handleDeleteOrder}
              onPrint={handlePrintOrder}
              currentUser={currentUser}
            />
          </TabsContent>
        ))}
      </Tabs>

      {showForm && (
        <ServiceOrderForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSave={handleSaveOrder}
          order={selectedOrder}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
