
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit,
  Calendar,
  User,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileText,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TimeEntry } from "@/api/entities";
import { useToast } from "@/components/ui/use-toast";

const TimeCorrectionDialog = ({ entry, employees, onSave, onCancel }) => {
    const [correctedTime, setCorrectedTime] = useState(entry?.entry_time || '');
    const [reason, setReason] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (entry) {
            setCorrectedTime(entry.entry_time.substring(0, 5)); // Ensure time is in HH:mm format
            setReason(''); // Clear reason when dialog opens for a new entry
        }
    }, [entry]);

    if (!entry) return null;

    const employee = employees.find(e => e.id === entry.employee_id);

    const handleSave = async () => {
        if (!reason.trim()) {
            toast({ variant: "destructive", title: "Erro", description: "A justificativa é obrigatória para a correção." });
            return;
        }
        
        try {
            const updatedEntry = {
                ...entry,
                entry_time: correctedTime,
                is_edited: true,
                edit_reason: reason,
                original_time: entry.entry_time, // Store original time
                status: 'valida', // Correction usually validates the time entry
                approval_status: 'aprovada' // Correction also implies approval
            };
            await TimeEntry.update(entry.id, updatedEntry);
            toast({ title: "Sucesso!", description: "Batida corrigida com sucesso." });
            onSave();
        } catch (error) {
            console.error("Erro ao corrigir batida:", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível corrigir a batida." });
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Corrigir Batida de Ponto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <p><strong>Funcionário:</strong> {employee?.full_name || 'N/A'}</p>
                <p><strong>Data:</strong> {format(new Date(entry.entry_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                <p><strong>Horário Original:</strong> {entry.entry_time.substring(0, 5)}</p>
                <div>
                    <Label htmlFor="correctedTime">Novo Horário</Label>
                    <Input id="correctedTime" type="time" value={correctedTime} onChange={(e) => setCorrectedTime(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="reason">Justificativa da Correção (Obrigatório)</Label>
                    <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: Esquecimento do funcionário, erro do sistema..." />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar Correção</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default function TimeEntryManager({
  timeEntries,
  employees,
  workSchedules,
  currentUser,
  onRefresh,
  isLoading
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  
  const { toast } = useToast();

  const filteredEntries = timeEntries.filter(entry => {
    const employee = employees.find(emp => emp.id === entry.employee_id);
    const matchesSearch = employee?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;

    // Filtro de data
    const today = new Date().toISOString().split('T')[0];
    const entryDate = entry.entry_date;
    const matchesDate = dateFilter === "all" ||
                      (dateFilter === "today" && entryDate === today) ||
                      (dateFilter === "week" && isThisWeek(entryDate)) ||
                      (dateFilter === "pending" && entry.approval_status === "pendente");

    return matchesSearch && matchesStatus && matchesDate;
  });

  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    return date >= weekStart;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valida': return 'bg-green-100 text-green-800';
      case 'pendente_aprovacao': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'inconsistente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'nao_requer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntryTypeLabel = (type) => {
    const types = {
      'entrada': 'Entrada',
      'saida': 'Saída',
      'inicio_intervalo': 'Início Intervalo',
      'fim_intervalo': 'Fim Intervalo'
    };
    return types[type] || type;
  };

  const handleApprovalAction = (entry, action) => {
    setSelectedEntry(entry);
    setApprovalAction(action);
    setApprovalNotes("");
    setShowApprovalDialog(true);
  };

  const handleCorrectionAction = (entry) => {
    setSelectedEntry(entry);
    setShowCorrectionDialog(true);
  };
  
  const processApproval = async () => {
    if (!selectedEntry || !approvalAction) return;
    
    setIsProcessing(true);
    try {
      const updatedEntry = {
        ...selectedEntry,
        approval_status: approvalAction === 'approve' ? 'aprovada' : 'rejeitada',
        status: approvalAction === 'approve' ? 'valida' : 'rejeitada',
        approved_by: currentUser?.email,
        approval_date: new Date().toISOString(),
        approval_notes: approvalNotes
      };

      await TimeEntry.update(selectedEntry.id, updatedEntry);
      
      toast({
        title: approvalAction === 'approve' ? "Batida Aprovada" : "Batida Rejeitada",
        description: `A batida foi ${approvalAction === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });

      setShowApprovalDialog(false);
      onRefresh();
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a aprovação. Tente novamente.",
        variant: "destructive"
      });
    }
    setIsProcessing(false);
  };

  const getPendingApprovalsCount = () => {
    return timeEntries.filter(entry => entry.approval_status === 'pendente').length;
  };

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
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pendentes Aprovação</p>
                <div className="text-2xl font-bold text-yellow-700">{getPendingApprovalsCount()}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Batidas Hoje</p>
                <div className="text-2xl font-bold text-blue-700">
                  {timeEntries.filter(te => te.entry_date === new Date().toISOString().split('T')[0]).length}
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Aprovadas</p>
                <div className="text-2xl font-bold text-green-700">
                  {timeEntries.filter(te => te.approval_status === 'aprovada').length}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Rejeitadas</p>
                <div className="text-2xl font-bold text-red-700">
                  {timeEntries.filter(te => te.approval_status === 'rejeitada').length}
                </div>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por funcionário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="pending">Pendentes Aprovação</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="valida">Válida</SelectItem>
                  <SelectItem value="pendente_aprovacao">Pendente</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Batidas */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Controle de Ponto ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aprovação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="8" className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma batida encontrada</h3>
                    <p className="text-gray-500">Ajuste os filtros para ver os registros de ponto.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => {
                  const employee = employees.find(emp => emp.id === entry.employee_id);
                  return (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{employee?.full_name || 'Funcionário'}</div>
                            <div className="text-sm text-gray-500">{employee?.employee_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {format(new Date(entry.entry_date), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{entry.entry_time.substring(0, 5)}</span>
                        {entry.is_edited && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Editada
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{getEntryTypeLabel(entry.entry_type)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.entry_method === 'mobile_app' ? 'App' :
                           entry.entry_method === 'web' ? 'Web' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status === 'valida' ? 'Válida' :
                           entry.status === 'pendente_aprovacao' ? 'Pendente' :
                           entry.status === 'rejeitada' ? 'Rejeitada' : 'Inconsistente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getApprovalStatusColor(entry.approval_status)}>
                          {entry.approval_status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleApprovalAction(entry, 'approve')}>
                              <ThumbsUp className="w-4 h-4 mr-2" /> Aprovar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApprovalAction(entry, 'reject')}>
                              <ThumbsDown className="w-4 h-4 mr-2" /> Rejeitar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCorrectionAction(entry)}>
                              <Edit className="w-4 h-4 mr-2" /> Corrigir Ponto
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" /> Ver Detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Aprovação */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Aprovar Batida' : 'Rejeitar Batida'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEntry && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Funcionário:</strong> {employees.find(emp => emp.id === selectedEntry.employee_id)?.full_name}<br/>
                  <strong>Data/Horário:</strong> {format(new Date(selectedEntry.entry_date), "dd/MM/yyyy", { locale: ptBR })} às {selectedEntry.entry_time.substring(0, 5)}<br/>
                  <strong>Tipo:</strong> {getEntryTypeLabel(selectedEntry.entry_type)}
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label className="text-sm font-medium">Observações</Label>
              <Textarea
                placeholder="Adicione observações sobre esta aprovação/rejeição..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={processApproval}
                disabled={isProcessing}
                className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isProcessing ? 'Processando...' : (approvalAction === 'approve' ? 'Aprovar' : 'Rejeitar')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Correção */}
      <Dialog open={showCorrectionDialog} onOpenChange={setShowCorrectionDialog}>
          <TimeCorrectionDialog 
            entry={selectedEntry} 
            employees={employees}
            onSave={() => {
                setShowCorrectionDialog(false);
                onRefresh();
            }} 
            onCancel={() => setShowCorrectionDialog(false)}
          />
      </Dialog>
    </div>
  );
}
