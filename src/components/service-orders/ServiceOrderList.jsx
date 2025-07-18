import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Package, Edit, Trash2, MoreVertical, Calendar, User, Printer, FileSignature } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  solicitada: { label: 'Solicitada', color: 'bg-blue-100 text-blue-800' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-800' },
  em_transito: { label: 'Em Trânsito', color: 'bg-orange-100 text-orange-800' },
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
};

export default function ServiceOrderList({ serviceOrders, isLoading, onEdit, onDelete, onPrint }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const safeOrders = Array.isArray(serviceOrders) ? serviceOrders : [];

  if (safeOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Nenhuma Ordem de Serviço</h3>
          <p className="text-gray-500">Não há ordens de serviço neste status.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº O.S.</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.client_user_email}</TableCell>
                  <TableCell>{(order.service_type || '').replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400"/>
                      {order.request_date ? format(new Date(order.request_date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[order.status]?.color || ''} border`}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.assigned_to ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {order.assigned_to}
                      </div>
                    ) : (
                      <Badge variant="outline">Não atribuído</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(order)} className="gap-2">
                          <Edit className="w-4 h-4" /> Ver / Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPrint(order)} className="gap-2">
                          <Printer className="w-4 h-4" /> Imprimir O.S.
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(order.id)} className="gap-2 text-red-600 focus:text-red-500">
                          <Trash2 className="w-4 h-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}