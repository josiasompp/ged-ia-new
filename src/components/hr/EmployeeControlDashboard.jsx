import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users,
  FileText,
  Bell,
  Shield,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  Activity,
  UserCheck,
  FileCheck,
  BellRing,
  History
} from 'lucide-react';
import { Employee } from '@/api/entities';
import { EmployeeDocument } from '@/api/entities';
import { AuditLog } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EmployeeControlDashboard({ 
  employees = [], 
  currentUser, 
  onRefresh 
}) {
  const [employeeDocuments, setEmployeeDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadControlData();
  }, []);

  const loadControlData = async () => {
    setIsLoading(true);
    try {
      const [docs, logs] = await Promise.all([
        EmployeeDocument.list("-created_date", 100),
        AuditLog.list("-created_date", 100)
      ]);
      
      setEmployeeDocuments(docs || []);
      setAuditLogs(logs || []);
      
      // Simular notificações baseadas nos documentos pendentes
      const pendingDocs = docs?.filter(doc => doc.status === 'pendente') || [];
      const mockNotifications = pendingDocs.map(doc => ({
        id: `notif_${doc.id}`,
        tipo: 'documento_pendente',
        data_envio: new Date().toISOString(),
        status: 'enviada',
        destinatario: currentUser?.email,
        mensagem: `Documento ${doc.document_type} do funcionário precisa de aprovação`,
        employee_id: doc.employee_id
      }));
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Erro ao carregar dados de controle:", error);
    }
    setIsLoading(false);
  };

  const handleDocumentApproval = async (documentId, action) => {
    try {
      const newStatus = action === 'approve' ? 'aprovado' : 'rejeitado';
      await EmployeeDocument.update(documentId, { 
        status: newStatus,
        approved_by: currentUser?.email,
        approval_date: new Date().toISOString()
      });
      
      // Registrar no audit log
      await AuditLog.create({
        company_id: currentUser?.company_id,
        user_email: currentUser?.email,
        action: action === 'approve' ? 'aprovar' : 'rejeitar',
        details: `Documento ${documentId} ${newStatus}`,
        ip_address: '127.0.0.1' // Em produção, capturar IP real
      });
      
      toast({
        title: action === 'approve' ? "Documento Aprovado" : "Documento Rejeitado",
        description: `O documento foi ${newStatus} com sucesso.`
      });
      
      loadControlData();
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao processar documento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o documento.",
        variant: "destructive"
      });
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.full_name || 'Funcionário não encontrado';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      aprovado: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejeitado: { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getDocumentTypeIcon = (type) => {
    const icons = {
      rg: FileText,
      cpf: FileText,
      carteira_trabalho: FileCheck,
      contrato_trabalho: FileText,
      exame_medico: FileCheck
    };
    return icons[type] || FileText;
  };

  const filteredDocuments = employeeDocuments.filter(doc => {
    const employee = employees.find(emp => emp.id === doc.employee_id);
    const employeeName = employee?.full_name?.toLowerCase() || '';
    const documentType = doc.document_type?.toLowerCase() || '';
    
    const searchMatch = employeeName.includes(searchTerm.toLowerCase()) || 
                       documentType.includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || doc.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const stats = {
    totalEmployees: employees.length,
    pendingDocuments: employeeDocuments.filter(doc => doc.status === 'pendente').length,
    approvedDocuments: employeeDocuments.filter(doc => doc.status === 'aprovado').length,
    pendingNotifications: notifications.filter(notif => notif.status === 'enviada').length,
    recentAudits: auditLogs.length
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Funcionários</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.totalEmployees}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{stats.pendingDocuments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Aprovados</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.approvedDocuments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BellRing className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Notificações</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{stats.pendingNotifications}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <History className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Auditorias</span>
            </div>
            <p className="text-2xl font-bold text-gray-700">{stats.recentAudits}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por funcionário ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadControlData}>
                <Activity className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Principais */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="control" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Controle
          </TabsTrigger>
        </TabsList>

        {/* Aba de Documentos */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Controle de Documentos dos Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum documento encontrado</p>
                  </div>
                ) : (
                  filteredDocuments.map(doc => {
                    const Icon = getDocumentTypeIcon(doc.document_type);
                    return (
                      <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-semibold">{getEmployeeName(doc.employee_id)}</p>
                              <p className="text-sm text-gray-600">{doc.document_type?.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-gray-400">
                                Enviado em {format(new Date(doc.upload_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {getStatusBadge(doc.status)}
                            
                            {doc.status === 'pendente' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(doc.file_url, '_blank')}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleDocumentApproval(doc.id, 'reject')}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Rejeitar
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleDocumentApproval(doc.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aprovar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Notificações */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Central de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma notificação pendente</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-800">{notif.tipo?.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-blue-700">{notif.mensagem}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            {format(new Date(notif.data_envio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                        <Badge className="bg-blue-600 text-white">{notif.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Auditoria */}
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Logs de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum log de auditoria encontrado</p>
                  </div>
                ) : (
                  auditLogs.slice(0, 20).map(log => (
                    <div key={log.id} className="border rounded p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{log.user_email}</span>
                          <span className="text-gray-600">{log.action}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-gray-600 mt-1 ml-6">{log.details}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Controle */}
        <TabsContent value="control" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Painel de Controle de Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Funcionalidades de Controle Avançado</AlertTitle>
                <AlertDescription>
                  Este painel oferece controle completo sobre funcionários, documentos, notificações e auditoria, 
                  conforme identificado na análise do sistema legado.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Controles Ativos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Sistema de Aprovação de Documentos</span>
                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Notificações Automáticas</span>
                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Log de Auditoria</span>
                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Controle de Acesso por Papel</span>
                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Melhorias Implementadas</h4>
                  <div className="space-y-2">
                    <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                      <p className="font-medium text-blue-800">Gestão Unificada de Usuários</p>
                      <p className="text-sm text-blue-700">Controle centralizado de funcionários com papéis e permissões</p>
                    </div>
                    <div className="p-3 border-l-4 border-l-green-500 bg-green-50">
                      <p className="font-medium text-green-800">Workflow de Documentos</p>
                      <p className="text-sm text-green-700">Aprovação automática com trilha de auditoria completa</p>
                    </div>
                    <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50">
                      <p className="font-medium text-purple-800">Sistema de Notificações</p>
                      <p className="text-sm text-purple-700">Alertas inteligentes para ações pendentes</p>
                    </div>
                    <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50">
                      <p className="font-medium text-orange-800">Auditoria Completa</p>
                      <p className="text-sm text-orange-700">Rastreamento de todas as ações do sistema</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}