import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  Eye,
  Download,
  User,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PayrollManager({ 
  payrolls, 
  employees, 
  timeEntries, 
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'calculando': return 'bg-yellow-100 text-yellow-800';
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'paga': return 'bg-emerald-100 text-emerald-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'calculando': 'Calculando',
      'aprovada': 'Aprovada',
      'paga': 'Paga',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
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
            <DollarSign className="w-5 h-5" />
            Folha de Pagamento ({payrolls.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Mês Referência</TableHead>
                <TableHead>Salário Base</TableHead>
                <TableHead>Valor Líquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma folha calculada</h3>
                    <p className="text-gray-500">As folhas de pagamento aparecerão aqui.</p>
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((payroll) => {
                  const employee = employees.find(emp => emp.id === payroll.employee_id);
                  return (
                    <TableRow key={payroll.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{employee?.full_name || 'Funcionário'}</div>
                            <div className="text-sm text-gray-500">{employee?.employee_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{payroll.reference_month}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(payroll.base_salary)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">{formatCurrency(payroll.net_amount)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payroll.status)}>
                          {getStatusLabel(payroll.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
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