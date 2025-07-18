import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Truck } from 'lucide-react';
import { ServiceOrder } from '@/api/entities';
import { User } from '@/api/entities';
import ClientServiceOrderForm from '../components/service-orders/ClientServiceOrderForm';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  solicitada: { label: 'Solicitada', color: 'bg-blue-100 text-blue-800' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-800' },
  em_transito: { label: 'Em Trânsito', color: 'bg-orange-100 text-orange-800' },
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
};

export default function ClientServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      const ordersData = await ServiceOrder.filter({ client_user_email: user.email }, '-request_date', 100);
      setOrders(ordersData || []); // Garantir array
    } catch (error) {
      console.error("Erro ao carregar dados do cliente:", error);
      setOrders([]); // Garantir array vazio
    }
    setIsLoading(false);
  };
  
  const handleSaveOrder = () => {
    setIsFormOpen(false);
    loadData();
    toast({
      title: "Solicitação Enviada!",
      description: "Sua ordem de serviço foi criada com sucesso e será processada em breve.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Minhas Ordens de Serviço
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Solicitar Serviço
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº O.S.</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan="4">Carregando...</TableCell></TableRow>
              ) : (orders || []).map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.service_type?.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</TableCell>
                  <TableCell>{format(new Date(order.request_date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[order.status]?.color || ''}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && (!orders || orders.length === 0) && (
            <p className="text-center py-8 text-gray-500">Nenhuma ordem de serviço encontrada.</p>
          )}
        </CardContent>
      </Card>
      
      {isFormOpen && currentUser && (
        <ClientServiceOrderForm
          user={currentUser}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
}