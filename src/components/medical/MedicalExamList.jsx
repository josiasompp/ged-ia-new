
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  User, 
  Stethoscope, 
  FileText, 
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EXAM_TYPES = {
  'admissional': { label: 'Admissional', color: 'bg-blue-100 text-blue-800' },
  'periodico': { label: 'Periódico', color: 'bg-green-100 text-green-800' },
  'mudanca_funcao': { label: 'Mudança de Função', color: 'bg-yellow-100 text-yellow-800' },
  'retorno_afastamento': { label: 'Retorno de Afastamento', color: 'bg-purple-100 text-purple-800' },
  'demissional': { label: 'Demissional', color: 'bg-red-100 text-red-800' }
};

const EXAM_STATUS = {
  'agendado': { label: 'Agendado', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  'realizado': { label: 'Realizado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'cancelado': { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
  'reagendado': { label: 'Reagendado', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'pendente_aso': { label: 'Pendente ASO', color: 'bg-orange-100 text-orange-800', icon: FileText },
  'concluido': { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircle }
};

export default function MedicalExamList({ 
  exams, 
  employees, 
  currentUser, 
  onEdit, 
  onRefresh, 
  isLoading, 
  viewMode = 'all' 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-scheduled_date');

  const filteredExams = exams.filter(exam => {
    const employee = employees.find(emp => emp.id === exam.employee_id);
    const matchesSearch = exam.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesType = typeFilter === 'all' || exam.exam_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por funcionário, clínica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {Object.entries(EXAM_STATUS).map(([key, status]) => (
                    <SelectItem key={key} value={key}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {Object.entries(EXAM_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={onRefresh}>
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Exames de Saúde Ocupacional ({filteredExams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Carregando exames...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum exame encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo de Exame</TableHead>
                    <TableHead>Data Agendada</TableHead>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Status</TableHead>
                    {viewMode !== 'schedule' && <TableHead>ASO</TableHead>}
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => {
                    const employee = getEmployee(exam.employee_id);
                    const examType = EXAM_TYPES[exam.exam_type];
                    const examStatus = EXAM_STATUS[exam.status];
                    const StatusIcon = examStatus?.icon || Clock;

                    return (
                      <TableRow key={exam.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                              {employee?.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'FU'}
                            </div>
                            <div>
                              <p className="font-medium">{employee?.full_name || 'Funcionário não encontrado'}</p>
                              <p className="text-sm text-gray-500">{employee?.position}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={examType?.color}>
                            {examType?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDateTime(exam.scheduled_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exam.clinic_name || '-'}</p>
                            <p className="text-sm text-gray-500">{exam.clinic_provider}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={examStatus?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {examStatus?.label}
                          </Badge>
                        </TableCell>
                        {viewMode !== 'schedule' && (
                          <TableCell>
                            {exam.aso_document ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <Button variant="outline" size="sm">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Não disponível</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => onEdit(exam)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onEdit(exam)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
