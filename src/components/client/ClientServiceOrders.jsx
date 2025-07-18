import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Truck, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  solicitada: { label: 'Solicitada', color: 'bg-blue-100 text-blue-800' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-800' },
  em_transito: { label: 'Em Trânsito', color: 'bg-orange-100 text-orange-800' },
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
};

export default function ClientServiceOrders({ orders, onNewOrder }) {
  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Ordens de Serviço Recentes
          </CardTitle>
          <Button onClick={onNewOrder} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nova O.S.
          </Button>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma Ordem de Serviço</h3>
              <p className="text-gray-500 mt-1">Você ainda não possui ordens de serviço. Clique no botão acima para criar sua primeira solicitação.</p>
            </div>
            <Button onClick={onNewOrder} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeira O.S.
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Ordens de Serviço Recentes
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={onNewOrder} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Nova O.S.
          </Button>
          <Button size="sm" variant="ghost" className="gap-2">
            Ver Todas
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">#{order.order_number}</span>
                    <Badge size="sm" className={statusConfig[order.status]?.color || ''}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span className="capitalize">
                    {order.service_type?.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
                  </span>
                  {order.request_date && (
                    <span className="ml-2">
                      • {format(new Date(order.request_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  )}
                </div>
                {order.requested_items && order.requested_items.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {order.requested_items.length} item{order.requested_items.length > 1 ? 's' : ''} solicitado{order.requested_items.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}