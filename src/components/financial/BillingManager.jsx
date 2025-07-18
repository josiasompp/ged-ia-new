import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  FileText, 
  Calendar, 
  DollarSign, 
  Building2, 
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';

export default function BillingManager({ bills, companies, onRefresh, isLoading }) {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(bill => {
    const company = companies.find(c => c.id === bill.company_id);
    const companyName = company?.name?.toLowerCase() || '';
    
    const matchesSearch = searchTerm === '' || 
      companyName.includes(searchTerm.toLowerCase()) ||
      bill.bill_number?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCompany = selectedCompany === 'all' || bill.company_id === selectedCompany;
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      issued: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: <FileText className="w-4 h-4" />,
      issued: <Clock className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      overdue: <AlertTriangle className="w-4 h-4" />,
      cancelled: <X className="w-4 h-4" />
    };
    return icons[status] || <FileText className="w-4 h-4" />;
  };

  const totalBilled = filteredBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
  const paidBills = filteredBills.filter(bill => bill.status === 'paid');
  const totalPaid = paidBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
  const overdueBills = filteredBills.filter(bill => bill.status === 'overdue').length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Faturamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Faturado</p>
                <div className="text-2xl font-bold text-blue-700">
                  R$ {totalBilled.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Recebido</p>
                <div className="text-2xl font-bold text-green-700">
                  R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Faturas em Atraso</p>
                <div className="text-2xl font-bold text-amber-700">{overdueBills}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total de Faturas</p>
                <div className="text-2xl font-bold text-purple-700">{filteredBills.length}</div>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gerenciamento de Faturas</span>
            <Button className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]">
              <Plus className="w-4 h-4" />
              Nova Fatura
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Buscar por empresa ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="issued">Emitida</SelectItem>
                <SelectItem value="paid">Paga</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          {/* Tabela de Faturas */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => {
                  const company = companies.find(c => c.id === bill.company_id);
                  
                  return (
                    <TableRow key={bill.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{bill.bill_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {company?.name || 'Empresa Desconhecida'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{bill.billing_period_start}</div>
                          <div className="text-gray-500">até {bill.billing_period_end}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        R$ {(bill.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(bill.status)}
                            {bill.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {bill.due_date || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredBills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma fatura encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}