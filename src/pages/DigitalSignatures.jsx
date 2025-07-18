
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PenTool,
  FileSignature,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Settings,
  Shield,
  Zap,
  Calendar,
  Mail
} from "lucide-react";
import { DigitalSignature } from "@/api/entities";
import { SignatureWorkflow } from "@/api/entities";
import { SignatureTemplate } from "@/api/entities";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
import { SignerContact } from "@/api/entities";

import SignatureWorkflowList from "../components/signatures/SignatureWorkflowList";
import CreateSignatureWorkflow from "../components/signatures/CreateSignatureWorkflow";
import SignatureTemplateManager from "../components/signatures/SignatureTemplateManager";
import SignatureStats from "../components/signatures/SignatureStats";
import PendingSignatures from "../components/signatures/PendingSignatures";

export default function DigitalSignatures() {
  const [workflows, setWorkflows] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Assinaturas Digitais | Sistema Seguro";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [workflowData, signatureData, templateData, documentData] = await Promise.all([
        SignatureWorkflow.list("-created_date"),
        DigitalSignature.list("-created_date"),
        SignatureTemplate.list("-created_date"),
        Document.list("-created_date", 100)
      ]);

      setWorkflows(workflowData);
      setSignatures(signatureData);
      setTemplates(templateData);
      setDocuments(documentData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleCreateWorkflow = async (workflowData, signers) => {
    try {
      const createdWorkflow = await SignatureWorkflow.create({
        ...workflowData,
        company_id: currentUser?.company_id || "default_company",
        created_by: currentUser?.email || "system"
      });

      // Salvar/Atualizar contatos e criar assinaturas digitais
      for (const signer of signers) {
        // Salvar contato
        const existingContact = await SignerContact.filter({ cpf_cnpj: signer.cpf });
        if (existingContact.length > 0) {
          await SignerContact.update(existingContact[0].id, {
            name: signer.name,
            email: signer.email,
            phone: signer.phone,
            last_used: new Date().toISOString()
          });
        } else {
          await SignerContact.create({
            company_id: currentUser?.company_id || "default_company",
            name: signer.name,
            cpf_cnpj: signer.cpf,
            email: signer.email,
            phone: signer.phone,
            last_used: new Date().toISOString()
          });
        }

        // Criar DigitalSignature
        await DigitalSignature.create({
          document_id: createdWorkflow.document_id,
          company_id: currentUser?.company_id || "default_company",
          workflow_id: createdWorkflow.id,
          signer_name: signer.name,
          signer_email: signer.email,
          signer_cpf: signer.cpf,
          signer_phone: signer.phone,
          signature_type: signer.signature_type || 'simples', // ou buscar de um campo
          signature_position: signer.position,
          order: signer.order,
          is_required: signer.is_required,
          expiry_date: createdWorkflow.expiry_date
        });
      }

      setShowCreateWorkflow(false);
      loadData();
    } catch (error) {
      console.error("Erro ao criar workflow:", error);
    }
  };

  const getSignatureStats = () => {
    const pendingSignatures = signatures.filter(s => s.status === 'pendente');
    const completedSignatures = signatures.filter(s => s.status === 'assinado');
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.status === 'em_andamento').length;
    const completedWorkflows = workflows.filter(w => w.status === 'concluido').length;
    const myPendingSignatures = signatures.filter(s =>
      s.signer_email === currentUser?.email && s.status === 'pendente'
    );

    return {
      pendingSignatures: pendingSignatures.length,
      completedSignatures: completedSignatures.length,
      totalWorkflows,
      activeWorkflows,
      completedWorkflows,
      myPendingSignatures: myPendingSignatures.length,
      completionRate: totalWorkflows > 0 ? Math.round((completedWorkflows / totalWorkflows) * 100) : 0
    };
  };

  const stats = getSignatureStats();

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Assinaturas Digitais
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Sistema seguro de assinatura eletrônica com certificação digital
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateWorkflow(true)}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <FileSignature className="w-4 h-4" />
            Novo Workflow
          </Button>
          <Button
            variant="outline"
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Templates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Aguardando Assinatura</p>
                <div className="text-3xl font-bold text-red-700 mt-1">{stats.myPendingSignatures}</div>
                <p className="text-xs text-red-500 mt-1">Requer sua ação</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Workflows Ativos</p>
                <div className="text-3xl font-bold text-blue-700 mt-1">{stats.activeWorkflows}</div>
                <p className="text-xs text-blue-500 mt-1">Em andamento</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Concluídos</p>
                <div className="text-3xl font-bold text-green-700 mt-1">{stats.completedWorkflows}</div>
                <p className="text-xs text-green-500 mt-1">Taxa: {stats.completionRate}%</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total de Assinaturas</p>
                <div className="text-3xl font-bold text-purple-700 mt-1">{stats.completedSignatures}</div>
                <p className="text-xs text-purple-500 mt-1">Certificadas</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "Todos", icon: FileSignature },
                { key: "rascunho", label: "Rascunho", icon: Clock },
                { key: "em_andamento", label: "Em Andamento", icon: Zap },
                { key: "concluido", label: "Concluído", icon: CheckCircle },
                { key: "cancelado", label: "Cancelado", icon: XCircle }
              ].map((filterOption) => {
                const Icon = filterOption.icon;
                return (
                  <Button
                    key={filterOption.key}
                    variant={statusFilter === filterOption.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filterOption.key)}
                    className={`gap-2 ${
                      statusFilter === filterOption.key
                        ? "bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
                        : "border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filterOption.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pendentes
            {stats.myPendingSignatures > 0 && (
              <Badge variant="destructive" className="ml-1">{stats.myPendingSignatures}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <FileSignature className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Concluídos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <PendingSignatures
            signatures={signatures.filter(s => s.signer_email === currentUser?.email && s.status === 'pendente')}
            documents={documents}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <SignatureWorkflowList
            workflows={filteredWorkflows}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <SignatureTemplateManager
            templates={templates}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <SignatureWorkflowList
            workflows={workflows.filter(w => w.status === 'concluido')}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
            showOnlyCompleted={true}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SignatureStats
            workflows={workflows}
            signatures={signatures}
            currentUser={currentUser}
          />
        </TabsContent>
      </Tabs>

      {/* Create Workflow Modal */}
      {showCreateWorkflow && (
        <CreateSignatureWorkflow
          documents={documents}
          templates={templates}
          onSave={handleCreateWorkflow}
          onClose={() => setShowCreateWorkflow(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
