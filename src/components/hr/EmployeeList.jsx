
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  MoreVertical,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  Filter,
  Download,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EmployeeList({ 
  employees,
  departments, // Added departments prop
  currentUser, 
  onEdit, 
  onRefresh, 
  isLoading 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const isAdmin = currentUser?.role === 'admin';

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesContract = contractFilter === "all" || employee.contract_type === contractFilter;
    
    // Adjusted department filtering logic to use department name
    const departmentName = departments?.find(d => d.id === employee.department_id)?.name || '';
    const matchesDepartment = departmentFilter === "all" || departmentName.toLowerCase().includes(departmentFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesContract && matchesDepartment; // Included matchesDepartment
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'ferias': return 'bg-blue-100 text-blue-800';
      case 'licenca': return 'bg-yellow-100 text-yellow-800';
      case 'demitido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeLabel = (type) => {
    const types = {
      'clt': 'CLT',
      'pj': 'PJ',
      'estagio': 'Estágio',
      'terceirizado': 'Terceirizado',
      'temporario': 'Temporário',
      'autonomo': 'Autônomo'
    };
    return types[type] || type;
  };

  // Adjusted uniqueDepartments to get names instead of IDs
  const uniqueDepartments = [...new Set(employees.map(emp => {
      return departments?.find(d => d.id === emp.department_id)?.name;
  }).filter(Boolean))];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
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
      {/* Filtros */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email, código ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="licenca">Licença</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={contractFilter} onValueChange={setContractFilter}> {/* Corrected onValueChange capitalization */}
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="clt">CLT</SelectItem>
                  <SelectItem value="pj">PJ</SelectItem>
                  <SelectItem value="estagio">Estágio</SelectItem>
                  <SelectItem value="terceirizado">Terceirizado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueDepartments.map((deptName) => (
                    <SelectItem key={deptName} value={deptName}>
                      {deptName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Funcionários ({filteredEmployees.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admissão</TableHead>
                {isAdmin && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum funcionário encontrado</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou adicionar um novo funcionário.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          {employee.profile_photo ? (
                            <img 
                              src={employee.profile_photo} 
                              alt={employee.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-blue-600">
                              {employee.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'FU'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{employee.full_name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{employee.employee_code}</span>
                            {employee.email && (
                              <>
                                <span>•</span>
                                <Mail className="w-3 h-3" />
                                <span>{employee.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{employee.position || 'Não definido'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {/* Display department name from the departments prop */}
                        <span>{departments?.find(d => d.id === employee.department_id)?.name || 'Não definido'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getContractTypeLabel(employee.contract_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1) || 'Indefinido'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {employee.hire_date ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {format(new Date(employee.hire_date), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {}}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(employee)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              <Upload className="w-4 h-4 mr-2" />
                              Documentos
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
