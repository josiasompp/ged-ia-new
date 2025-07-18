
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ClipboardList, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  MoreHorizontal,
  Play,
  Pause, // Import Pause icon
  Check,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Task } from "@/api/entities";

const priorityColors = {
  baixa: "bg-gray-100 text-gray-800",
  media: "bg-blue-100 text-blue-800",
  alta: "bg-amber-100 text-amber-800",
  urgente: "bg-red-100 text-red-800"
};

const statusColors = {
  pendente: "bg-gray-100 text-gray-800",
  em_andamento: "bg-blue-100 text-blue-800",
  aguardando_aprovacao: "bg-amber-100 text-amber-800",
  pausada: "bg-orange-100 text-orange-800", // New status color
  concluida: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
  rejeitada: "bg-red-100 text-red-800"
};

const statusIcons = {
  pendente: Clock,
  em_andamento: Play,
  aguardando_aprovacao: AlertTriangle,
  pausada: Pause, // New status icon
  concluida: CheckCircle,
  cancelada: X,
  rejeitada: X
};

export default function TasksList({ tasks, currentUser, onEdit, onRefresh, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updateData = { status: newStatus };
      
      if (newStatus === 'em_andamento') {
        if (!task.started_at) {
          updateData.started_at = new Date().toISOString();
        }
        // If resuming from paused, clear paused_at
        if (task.status === 'pausada') {
          updateData.paused_at = null; 
        }
      }
      
      if (newStatus === 'concluida') {
        if (!task.completed_at) {
          updateData.completed_at = new Date().toISOString();
          updateData.completion_percentage = 100;
        }
        // If task was paused and is now concluded, clear paused_at
        if (task.status === 'pausada') {
          updateData.paused_at = null;
        }
      }

      if (newStatus === 'pausada' && task.status === 'em_andamento') {
        updateData.paused_at = new Date().toISOString();
      }

      // For cancelada/rejeitada, no specific timestamp updates needed beyond status change
      // as they are typically terminal states.

      await Task.update(task.id, updateData);
      onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssigned = assignedFilter === "all" || 
                           (assignedFilter === "mine" && task.assigned_to === currentUser?.email) ||
                           (assignedFilter === "created" && task.created_by === currentUser?.email);

    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'concluida' || task.status === 'cancelada' || task.status === 'rejeitada') return false;
    return new Date(task.due_date) < new Date();
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#212153] to-[#146FE0] rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
            Lista de Tarefas
          </span>
          <Badge variant="secondary" className="ml-2">
            {filteredTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem> {/* New filter option */}
              <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem> {/* New filter option */}
              <SelectItem value="rejeitada">Rejeitada</SelectItem> {/* New filter option */}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assignedFilter} onValueChange={setAssignedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Atribuição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="mine">Minhas Tarefas</SelectItem>
              <SelectItem value="created">Criadas por Mim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela de Tarefas */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="7" className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan="7" className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova tarefa.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                const overdue = isOverdue(task);
                
                return (
                  <TableRow key={task.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {task.title}
                          {overdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{task.assigned_to}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={`${statusColors[task.status]} flex items-center gap-1 w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {task.due_date ? (
                        <div className={`flex items-center gap-1 text-sm ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                          <Calendar className="w-3 h-3" />
                          {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sem prazo</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{width: `${task.completion_percentage || 0}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.completion_percentage || 0}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(task)}>
                            Editar
                          </DropdownMenuItem>
                          
                          {/* Primary Actions */}
                          {task.status === 'pendente' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'em_andamento')}>
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar
                            </DropdownMenuItem>
                          )}
                          {task.status === 'em_andamento' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'pausada')}>
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </DropdownMenuItem>
                          )}
                          {task.status === 'pausada' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'em_andamento')}>
                              <Play className="w-4 h-4 mr-2" />
                              Retomar
                            </DropdownMenuItem>
                          )}
                          {task.status === 'em_andamento' && ( // Conclude from in progress
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'concluida')}>
                              <Check className="w-4 h-4 mr-2" />
                              Concluir
                            </DropdownMenuItem>
                          )}

                          {/* Approval Workflow Actions */}
                          {task.status === 'aguardando_aprovacao' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'concluida')}>
                                <Check className="w-4 h-4 mr-2" />
                                Aprovar (Tornar Concluída)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'rejeitada')}>
                                <X className="w-4 h-4 mr-2" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Terminal Action: Cancel */}
                          {(task.status === 'pendente' || 
                            task.status === 'em_andamento' || 
                            task.status === 'pausada' || 
                            task.status === 'aguardando_aprovacao') && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'cancelada')}>
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          )}
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
  );
}
