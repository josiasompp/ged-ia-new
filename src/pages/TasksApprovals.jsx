
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  ClipboardList, 
  Users, 
  Calendar,
  Plus,
  Filter,
  Search,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  FileText,
  User
} from "lucide-react";
import { Task } from "@/api/entities";
import { ApprovalWorkflow } from "@/api/entities";
import { Document } from "@/api/entities";
import { User as UserEntity } from "@/api/entities";
import { Department } from "@/api/entities";
import { Directory } from "@/api/entities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import TasksList from "../components/tasks/TasksList";
import TaskForm from "../components/tasks/TaskForm";
import ApprovalsList from "../components/approvals/ApprovalsList";
import WorkflowDesigner from "../components/workflows/WorkflowDesigner";
import TasksStats from "../components/tasks/TasksStats";
import ApprovalStats from "../components/approvals/ApprovalStats";

export default function TasksApprovals() {
  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showWorkflowDesigner, setShowWorkflowDesigner] = useState(false);
  const [processingDoc, setProcessingDoc] = useState(null);

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Tarefas e Aprovações | Workflow Inteligente";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await UserEntity.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, workflowsData, usersData, departmentsData, docsData, dirsData] = await Promise.all([
        Task.list("-created_date", 100),
        ApprovalWorkflow.list("-created_date"),
        UserEntity.list(),
        Department.list(),
        Document.list("-created_date", 100),
        Directory.list()
      ]);

      setTasks(tasksData || []);
      setWorkflows(workflowsData || []);
      setUsers(usersData || []);
      setDepartments(departmentsData || []);
      setDocuments(docsData || []);
      setDirectories(dirsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await Task.update(selectedTask.id, taskData);
      } else {
        await Task.create({
          ...taskData,
          company_id: currentUser?.company_id || "default_company",
          created_by: currentUser?.email || "system"
        });
      }
      setShowTaskForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const handleDocumentDecision = async (document, decision) => {
    setProcessingDoc(document.id);
    const updateData = { status: decision === 'approve' ? 'aprovado' : 'rejeitado' };
    
    if (decision === 'approve') {
      updateData.approved_by = currentUser.email;
      updateData.approved_at = new Date().toISOString();
      updateData.rejected_by = null;
      updateData.rejected_at = null;
    } else {
      updateData.rejected_by = currentUser.email;
      updateData.rejected_at = new Date().toISOString();
      updateData.approved_by = null;
      updateData.approved_at = null;
    }
    
    try {
      await Document.update(document.id, updateData);
      loadData();
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
    }
    setProcessingDoc(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'Departamento não encontrado';
  };

  const getDirectoryName = (dirId) => {
    const dir = directories.find(d => d.id === dirId);
    return dir?.name || 'Diretório não encontrado';
  };

  const getTasksStats = () => {
    const myTasks = tasks.filter(t => t.assigned_to === currentUser?.email);
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'pendente').length;
    const inProgressTasks = tasks.filter(t => t.status === 'em_andamento').length;
    const completedTasks = tasks.filter(t => t.status === 'concluida').length;
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'concluida') return false;
      return new Date(t.due_date) < new Date();
    }).length;

    return {
      myTasks: myTasks.length,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks
    };
  };

  const getApprovalStats = () => {
    const pendingDocs = documents.filter(doc => doc.status === 'pendente_aprovacao');
    const myDocApprovals = pendingDocs.length;
    
    const myWorkflowApprovals = workflows.filter(w => 
      w.approvers?.includes(currentUser?.email) && w.status === 'aguardando_aprovacao'
    ).length;
    
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.is_active).length;
    const completedWorkflows = workflows.filter(w => w.status === 'aprovado').length;

    return {
      myDocApprovals,
      myWorkflowApprovals,
      totalApprovals: myDocApprovals + myWorkflowApprovals,
      totalWorkflows,
      activeWorkflows,
      completedWorkflows
    };
  };

  const stats = getTasksStats();
  const approvalStats = getApprovalStats();

  const renderDocumentApprovals = () => {
    const pendingDocs = documents.filter(doc => doc.status === 'pendente_aprovacao');

    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#F59E0B] bg-clip-text text-transparent font-bold">
              Documentos Aguardando Aprovação
            </span>
            <Badge variant="destructive" className="ml-2">
              {pendingDocs.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {pendingDocs.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum documento pendente
              </h3>
              <p className="text-gray-500">
                Todos os documentos foram aprovados ou não há documentos aguardando aprovação.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {pendingDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">
                        {getDepartmentName(doc.department_id)} → {getDirectoryName(doc.directory_id)}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{doc.created_by}</span>
                        <Calendar className="w-3 h-3 ml-2" />
                        <span>{format(new Date(doc.created_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const url = doc.document_type === 'google_drive' ? doc.google_drive_link : doc.file_url;
                        window.open(url, '_blank');
                      }} 
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" /> Ver
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => handleDocumentDecision(doc, 'approve')} 
                      disabled={processingDoc === doc.id}
                      className="gap-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      {processingDoc === doc.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => handleDocumentDecision(doc, 'reject')}
                      disabled={processingDoc === doc.id}
                      className="gap-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      {processingDoc === doc.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Tarefas e Aprovações
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Gerencie tarefas e fluxos de aprovação de forma eficiente</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleCreateTask}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowWorkflowDesigner(true)}
            className="gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Criar Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Minhas Tarefas</p>
              <div className="text-2xl font-bold text-blue-700">{stats.myTasks}</div>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Pendentes</p>
              <div className="text-2xl font-bold text-amber-700">{stats.pendingTasks}</div>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Aprovações</p>
              <div className="text-2xl font-bold text-red-700">{approvalStats.totalApprovals}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Concluídas</p>
              <div className="text-2xl font-bold text-green-700">{stats.completedTasks}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Tarefas
            {stats.myTasks > 0 && (
              <Badge variant="secondary" className="ml-1">{stats.myTasks}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="document-approvals" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Aprovações
            {approvalStats.myDocApprovals > 0 && (
              <Badge variant="destructive" className="ml-1">{approvalStats.myDocApprovals}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflow-approvals" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Workflows
            {approvalStats.myWorkflowApprovals > 0 && (
              <Badge variant="destructive" className="ml-1">{approvalStats.myWorkflowApprovals}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Configurar
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <TasksList
            tasks={tasks}
            currentUser={currentUser}
            onEdit={handleEditTask}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="document-approvals" className="space-y-4">
          {renderDocumentApprovals()}
        </TabsContent>

        <TabsContent value="workflow-approvals" className="space-y-4">
          <ApprovalsList
            workflows={workflows}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowDesigner
            workflows={workflows}
            users={users}
            departments={departments}
            currentUser={currentUser}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TasksStats tasks={tasks} />
            <ApprovalStats workflows={workflows} />
          </div>
        </TabsContent>
      </Tabs>

      {showTaskForm && (
        <TaskForm
          task={selectedTask}
          users={users}
          departments={departments}
          currentUser={currentUser}
          onSave={handleSaveTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {showWorkflowDesigner && (
        <WorkflowDesigner
          isModal={true}
          workflows={workflows}
          users={users}
          departments={departments}
          currentUser={currentUser}
          onRefresh={loadData}
          onClose={() => setShowWorkflowDesigner(false)}
        />
      )}
    </div>
  );
}
