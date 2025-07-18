import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Eye,
  CheckCircle,
  XCircle,
  User,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VacationManager({ 
  vacationRequests, 
  employees, 
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'solicitada': return 'bg-yellow-100 text-yellow-800';
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'cancelada': return 'bg-gray-100 text-gray-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'solicitada': 'Solicitada',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada',
      'cancelada': 'Cancelada',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída'
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Solicitações de Férias ({vacationRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacationRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação de férias</h3>
                    <p className="text-gray-500">As solicitações aparecerão aqui.</p>
                  </TableCell>
                </TableRow>
              ) : (
                vacationRequests.map((request) => {
                  const employee = employees.find(emp => emp.id === request.employee_id);
                  return (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{employee?.full_name || 'Funcionário'}</div>
                            <div className="text-sm text-gray-500">{employee?.employee_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {format(new Date(request.start_date), "dd/MM/yyyy", { locale: ptBR })} - 
                            {format(new Date(request.end_date), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{request.days_requested} dias</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.type === 'completas' ? 'Completas' : 
                           request.type === 'parciais' ? 'Parciais' : 'Coletivas'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status === 'solicitada' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}