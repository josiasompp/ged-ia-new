
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  FileText, 
  Users, 
  Building2, 
  BarChart3,
  Settings,
  CheckCircle,
  Info,
  Truck, // Novo ícone
  FileBox, // Novo ícone
  Briefcase // Novo ícone
} from "lucide-react";

const permissionCategories = {
  documentos: {
    title: "Documentos",
    icon: FileText,
    color: "bg-blue-100 text-blue-800",
    permissions: [
      { id: "documentos.visualizar", label: "Visualizar Documentos", description: "Permite ver documentos da empresa" },
      { id: "documentos.criar", label: "Criar Documentos", description: "Permite adicionar novos documentos" },
      { id: "documentos.editar", label: "Editar Documentos", description: "Permite modificar documentos existentes" },
      { id: "documentos.excluir", label: "Excluir Documentos", description: "Permite remover documentos" },
      { id: "documentos.aprovar", label: "Aprovar Documentos", description: "Permite aprovar/rejeitar documentos" }
    ]
  },
  propostas: {
    title: "Propostas Comerciais",
    icon: FileText,
    color: "bg-green-100 text-green-800",
    permissions: [
      { id: "propostas.visualizar", label: "Visualizar Propostas", description: "Permite ver propostas da empresa" },
      { id: "propostas.criar", label: "Criar Propostas", description: "Permite criar novas propostas" },
      { id: "propostas.editar", label: "Editar Propostas", description: "Permite modificar propostas existentes" },
      { id: "propostas.gerenciar", label: "Gerenciar Propostas", description: "Controle total sobre propostas" },
      { id: "propostas.analytics", label: "Analytics de Propostas", description: "Ver métricas e relatórios" }
    ]
  },
  cdoc: {
    title: "Documentos Físicos (CDOC)",
    icon: FileBox,
    color: "bg-cyan-100 text-cyan-800",
    permissions: [
      { id: "cdoc.visualizar", label: "Visualizar Documentos Físicos", description: "Permite ver registros de documentos e caixas" },
      { id: "cdoc.criar", label: "Criar Registros", description: "Permite adicionar novos registros de caixas" },
      { id: "cdoc.gerenciar_locais", label: "Gerenciar Endereços", description: "Permite criar e editar ruas, prateleiras, etc." },
      { id: "cdoc.gerenciar_documentos", label: "Gerenciar Documentos", description: "Permite editar e mover documentos físicos" },
      { id: "cdoc.relatorios", label: "Relatórios CDOC", description: "Permite gerar e exportar relatórios" },
    ]
  },
  ordens_servico: {
    title: "Ordens de Serviço (O.S.)",
    icon: Truck,
    color: "bg-orange-100 text-orange-800",
    permissions: [
      { id: "ordens_servico.visualizar", label: "Visualizar Todas O.S.", description: "Permite ver todas as ordens de serviço da empresa" },
      { id: "ordens_servico.solicitar", label: "Solicitar O.S.", description: "Permite que usuários criem novas solicitações" },
      { id: "ordens_servico.gerenciar", label: "Gerenciar O.S.", description: "Permite alterar status, atribuir e finalizar O.S." },
      { id: "ordens_servico.criar_gestor", label: "Criar O.S. (Gestor)", description: "Permite criar O.S. em nome de outros usuários" }
    ]
  },
  rh: {
    title: "Recursos Humanos (RH)",
    icon: Briefcase,
    color: "bg-teal-100 text-teal-800",
    permissions: [
      { id: "rh.visualizar_colaboradores", label: "Visualizar Colaboradores", description: "Acesso de leitura aos perfis dos funcionários" },
      { id: "rh.gerenciar_colaboradores", label: "Gerenciar Colaboradores", description: "Permite criar, editar e desligar colaboradores" },
      { id: "rh.gerenciar_contratacoes", label: "Gerenciar Contratações", description: "Acesso ao módulo de processos de contratação" },
      { id: "rh.gerenciar_documentos_rh", label: "Gerenciar Documentos de RH", description: "Permite gerenciar tipos e checklists de documentos" },
      { id: "rh.ver_relatorios_rh", label: "Relatórios de RH", description: "Acesso aos relatórios e dashboards de RH" },
    ]
  },
  usuarios: {
    title: "Gestão de Usuários",
    icon: Users,
    color: "bg-purple-100 text-purple-800",
    permissions: [
      { id: "usuarios.visualizar", label: "Visualizar Usuários", description: "Permite ver lista de usuários" },
      { id: "usuarios.criar", label: "Criar Usuários", description: "Permite adicionar novos usuários" },
      { id: "usuarios.editar", label: "Editar Usuários", description: "Permite modificar dados dos usuários" },
      { id: "usuarios.gerenciar", label: "Gerenciar Permissões", description: "Controle total de permissões" }
    ]
  },
  empresas: {
    title: "Gestão de Empresas",
    icon: Building2,
    color: "bg-amber-100 text-amber-800",
    permissions: [
      { id: "empresas.visualizar", label: "Visualizar Empresas", description: "Permite ver dados das empresas" },
      { id: "empresas.gerenciar", label: "Gerenciar Empresas", description: "Controle total sobre empresas" },
      { id: "empresas.configurar", label: "Configurar Empresa", description: "Alterar configurações da empresa" }
    ]
  },
  relatorios: {
    title: "Relatórios e Analytics",
    icon: BarChart3,
    color: "bg-indigo-100 text-indigo-800",
    permissions: [
      { id: "relatorios.visualizar", label: "Visualizar Relatórios", description: "Acesso aos relatórios básicos" },
      { id: "relatorios.avancados", label: "Relatórios Avançados", description: "Acesso a relatórios detalhados" },
      { id: "relatorios.exportar", label: "Exportar Relatórios", description: "Permite exportar dados" }
    ]
  },
  sistema: {
    title: "Configurações do Sistema",
    icon: Settings,
    color: "bg-red-100 text-red-800",
    permissions: [
      { id: "sistema.configurar", label: "Configurar Sistema", description: "Acesso às configurações gerais" },
      { id: "sistema.branding", label: "Personalização Visual", description: "Alterar cores, logos e temas" },
      { id: "sistema.auditoria", label: "Logs de Auditoria", description: "Visualizar logs do sistema" }
    ]
  }
};

export default function CompanyPermissionsTab({ company, onSave }) {
  const [companyPermissions, setCompanyPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Carregar permissões da empresa
    loadCompanyPermissions();
  }, [company.id, company.subscription_plan, company.allowed_permissions]);

  const loadCompanyPermissions = () => {
    // Permissões padrão baseadas no plano
    const defaultPermissions = getDefaultPermissionsByPlan(company.subscription_plan);
    
    if (company.allowed_permissions && company.allowed_permissions.length > 0) {
        setCompanyPermissions(company.allowed_permissions);
    } else {
        setCompanyPermissions(defaultPermissions);
    }
  };

  const getDefaultPermissionsByPlan = (plan) => {
    let permissions = [];

    switch (plan) {
      case "starter":
        permissions = [
          "documentos.visualizar",
          "documentos.criar",
          "propostas.visualizar",
          "usuarios.visualizar",
          "relatorios.visualizar",
          "ordens_servico.solicitar"
        ];
        break;
      case "professional":
        permissions = [
          "documentos.visualizar",
          "documentos.criar",
          "documentos.editar",
          "documentos.aprovar",
          "propostas.visualizar",
          "propostas.criar",
          "propostas.editar",
          "usuarios.visualizar",
          "usuarios.criar",
          "usuarios.editar",
          "relatorios.visualizar",
          "relatorios.avancados",
          "sistema.branding",
          "cdoc.visualizar",
          "cdoc.criar",
          "ordens_servico.visualizar",
          "rh.visualizar_colaboradores"
        ];
        break;
      case "enterprise":
        // Enterprise tem todas as permissões
        permissions = Object.values(permissionCategories)
          .flatMap(category => category.permissions.map(p => p.id));
        break;
      default:
        permissions = [];
    }
    return permissions;
  };

  const handlePermissionToggle = (permissionId, checked) => {
    setCompanyPermissions(prev => 
      checked 
        ? [...prev, permissionId]
        : prev.filter(p => p !== permissionId)
    );
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...company,
        allowed_permissions: companyPermissions
      });
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    }
    setIsSaving(false);
  };

  const getPlanRecommendations = () => {
    const currentCount = companyPermissions.length;
    const starterCount = getDefaultPermissionsByPlan("starter").length;
    const professionalCount = getDefaultPermissionsByPlan("professional").length;

    if (company.subscription_plan === "starter" && currentCount > starterCount) {
      return {
        type: "warning",
        message: "Você selecionou mais permissões do que o plano Starter permite. Considere fazer upgrade para Professional."
      };
    }
    if (company.subscription_plan === "professional" && currentCount > professionalCount) {
      return {
        type: "warning", 
        message: "Você selecionou mais permissões do que o plano Professional permite. Considere fazer upgrade para Enterprise."
      };
    }
    return null;
  };

  const recommendation = getPlanRecommendations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Permissões da Empresa: {company.name}
          </h3>
          <p className="text-sm text-gray-500">
            Plano atual: <Badge className="ml-1 capitalize">{company.subscription_plan}</Badge>
          </p>
        </div>
        <Button 
          onClick={handleSavePermissions}
          disabled={isSaving}
          className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]"
        >
          <CheckCircle className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Permissões"}
        </Button>
      </div>

      {/* Recomendação de Plano */}
      {recommendation && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{recommendation.message}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{companyPermissions.length}</div>
              <div className="text-sm text-gray-500">Permissões Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(permissionCategories).filter(category => 
                  permissionCategories[category].permissions.some(p => 
                    companyPermissions.includes(p.id)
                  )
                ).length}
              </div>
              <div className="text-sm text-gray-500">Módulos Habilitados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{company.subscription_plan}</div>
              <div className="text-sm text-gray-500 capitalize">Plano Atual</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorias de Permissões */}
      <div className="grid gap-6">
        {Object.entries(permissionCategories).map(([categoryKey, category]) => {
          const Icon = category.icon;
          const activePermissions = category.permissions.filter(p => 
            companyPermissions.includes(p.id)
          ).length;

          return (
            <Card key={categoryKey} className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-900">{category.title}</span>
                      <div className="text-sm text-gray-500">
                        {activePermissions} de {category.permissions.length} permissões ativas
                      </div>
                    </div>
                  </div>
                  <Badge className={category.color}>
                    {activePermissions}/{category.permissions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={permission.id}
                        checked={companyPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={permission.id} 
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
