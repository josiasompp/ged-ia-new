
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Building2, 
  Folder, 
  Eye, 
  DollarSign,
  FileText,
  MapPin,
  Database,
  Users,
  FileSignature,
  PenTool,
  AlertTriangle
} from 'lucide-react';

export default function CostBreakdown({ usageData, companies, departments, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [sortField, setSortField] = useState('total_cost');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSortedData = usageData
    .filter(usage => {
      const company = companies.find(c => c.id === usage.company_id);
      const department = departments.find(d => d.id === usage.department_id);
      const companyName = company?.name?.toLowerCase() || '';
      const departmentName = department?.name?.toLowerCase() || '';
      
      const matchesSearch = searchTerm === '' || 
        companyName.includes(searchTerm.toLowerCase()) ||
        departmentName.includes(searchTerm.toLowerCase()) ||
        usage.resource_type?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCompany = selectedCompany === 'all' || usage.company_id === selectedCompany;
      const matchesResource = selectedResource === 'all' || usage.resource_type === selectedResource;
      
      return matchesSearch && matchesCompany && matchesResource;
    })
    .sort((a, b) => {
      let aValue = a[sortField] || 0;
      let bValue = b[sortField] || 0;
      
      if (sortField === 'company_name') {
        const aCompany = companies.find(c => c.id === a.company_id);
        const bCompany = companies.find(c => c.id === b.company_id);
        aValue = aCompany?.name || '';
        bValue = bCompany?.name || '';
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const getResourceTypeLabel = (type) => {
    const labels = {
      documents: 'Documentos',
      directories: 'Diretórios',
      cdoc_addresses: 'Endereços CDOC',
      storage: 'Armazenamento',
      users: 'Usuários',
      proposals: 'Propostas',
      signatures: 'Assinaturas'
    };
    return labels[type] || type;
  };

  const getResourceIcon = (type) => {
    const icons = {
      documents: <FileText className="w-4 h-4" />,
      directories: <Folder className="w-4 h-4" />,
      cdoc_addresses: <MapPin className="w-4 h-4" />,
      storage: <Database className="w-4 h-4" />,
      users: <Users className="w-4 h-4" />,
      proposals: <FileSignature className="w-4 h-4" />,
      signatures: <PenTool className="w-4 h-4" />
    };
    return icons[type] || <Eye className="w-4 h-4" />;
  };

  const getTierColor = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const totalCost = filteredAndSortedData.reduce((sum, usage) => sum + (usage.total_cost || 0), 0);
  const totalOverage = filteredAndSortedData.reduce((sum, usage) => sum + (usage.overage_cost || 0), 0);

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
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por empresa, departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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
            
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os recursos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os recursos</SelectItem>
                <SelectItem value="documents">Documentos</SelectItem>
                <SelectItem value="directories">Diretórios</SelectItem>
                <SelectItem value="cdoc_addresses">Endereços CDOC</SelectItem>
                <SelectItem value="storage">Armazenamento</SelectItem>
                <SelectItem value="users">Usuários</SelectItem>
                <SelectItem value="proposals">Propostas</SelectItem>
                <SelectItem value="signatures">Assinaturas</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompany('all');
                  setSelectedResource('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Custos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Custo Total</p>
                <div className="text-2xl font-bold text-green-700">
                  R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Excesso de Uso</p>
                <div className="text-2xl font-bold text-amber-700">
                  R$ {totalOverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Registros</p>
                <div className="text-2xl font-bold text-blue-700">{filteredAndSortedData.length}</div>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Custos por Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField('company_name');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Empresa
                  </TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField('quantity_used');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Quantidade
                  </TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField('total_cost');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Custo Total
                  </TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Período</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((usage, index) => {
                  const company = companies.find(c => c.id === usage.company_id);
                  const department = departments.find(d => d.id === usage.department_id);
                  
                  return (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {company?.name || 'Empresa Desconhecida'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-gray-400" />
                          {department?.name || 'Departamento Desconhecido'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getResourceIcon(usage.resource_type)}
                          {getResourceTypeLabel(usage.resource_type)}
                        </div>
                      </TableCell>
                      <TableCell>{usage.quantity_used?.toLocaleString('pt-BR') || 0}</TableCell>
                      <TableCell>R$ {(usage.unit_cost || 0).toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        R$ {(usage.total_cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {usage.overage_cost > 0 && (
                          <div className="text-xs text-amber-600">
                            + R$ {usage.overage_cost.toFixed(2)} (excesso)
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(usage.billing_tier)}>
                          {usage.billing_tier || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {usage.usage_period || 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
