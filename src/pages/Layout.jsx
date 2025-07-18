

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  Palette,
  FileSignature,
  Layout as LayoutIcon,
  Users,
  Target,
  Briefcase,
  Loader2,
  BookOpen,
  Globe,
  FileBox,
  FileCog,
  Map,
  Download,
  DollarSign,
  Truck,
  Crown,
  Stethoscope,
  Mail,
  MessageSquare,
  Pause,
  Smartphone,
  Database,
  FileCheck2,
  Calendar,
  Search, // Added Search icon
  CloudRain, // Added CloudRain icon for AWS Installation Guide
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/api/entities";
import { CompanyBranding } from "@/api/entities";
import ClientLayout from "@/components/client/ClientLayout";
import ClientPortal from "@/pages/ClientPortal";
import AntiAICopyProtection from "@/components/security/AntiAICopyProtection";
import LegalNotice from "@/components/security/LegalNotice";
import SystemVersion from "@/components/security/SystemVersion";
import UnauthorizedAccess from "@/components/security/UnauthorizedAccess";
import LandingPage from "@/pages/LandingPage";
import { cachedAPICall, apiCache } from "@/components/utils/apiCache";
import GlobalSearch from "@/components/search/GlobalSearch"; // Added GlobalSearch import

const allNavigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard, module: 'dashboard', requiredPermission: 'view' },
  { title: "Central de Publicação", url: createPageUrl("PublishingCenter"), icon: FileCheck2, module: 'ged', requiredPermission: 'manage' },
  { title: "Sistema de Agendamentos", url: createPageUrl("BookingSystem"), icon: Calendar, module: 'booking', requiredPermission: 'view' },
  { title: "GED", url: createPageUrl("Documents"), icon: FileText, module: 'ged', requiredPermission: 'view' },
  { title: "CDOC", url: createPageUrl("PhysicalDocuments"), icon: FileBox, module: 'cdoc', requiredPermission: 'view' },
  { title: "Ordens de Serviço", url: createPageUrl("ServiceOrders"), icon: Truck, module: 'cdoc', requiredPermission: 'manage' },
  { title: "Propostas", url: createPageUrl("Proposals"), icon: FileSignature, module: 'proposals', requiredPermission: 'view' },
  { title: "CRM", url: createPageUrl("CRM"), icon: Target, module: 'crm', requiredPermission: 'view' },
  { title: "Templates", url: createPageUrl("ProposalTemplates"), icon: LayoutIcon, module: 'proposals', requiredPermission: 'manage' },
  { title: "Tarefas e Aprovações", url: createPageUrl("TasksApprovals"), icon: CheckSquare, module: 'tasks', requiredPermission: 'view' },
  { title: "Assinaturas Digitais", url: createPageUrl("DigitalSignatures"), icon: FileSignature, module: 'signatures', requiredPermission: 'view' },
  { title: "Empresas", url: createPageUrl("Companies"), icon: Building2, permission: 'system_manager' }, // Legacy permission
  { title: "Departamentos", url: createPageUrl("Departments"), icon: FolderKanban, module: 'ged', requiredPermission: 'manage' },
  { title: "RHR", url: createPageUrl("HumanResources"), icon: Briefcase, module: 'hr', requiredPermission: 'view' },
  { title: "Contratação Online", url: createPageUrl("HumanResources?tab=online-hiring"), icon: Globe, module: 'hr', requiredPermission: 'manage_hiring' },
  { title: "Saúde Ocupacional", url: createPageUrl("MedicalExams"), icon: Stethoscope, module: 'hr', requiredPermission: 'view' },
  { title: "Tipos de Documento (RH)", url: createPageUrl("HrDocumentTypes"), icon: FileCog, module: 'hr', requiredPermission: 'manage_hiring' },
  { title: "Mapeamento CBO", url: createPageUrl("CboMapping"), icon: Map, module: 'hr', requiredPermission: 'manage_hiring' },
  { title: "Templates de Checklist", url: createPageUrl("ChecklistTemplates"), icon: CheckSquare, module: 'hr', requiredPermission: 'manage_hiring' },
  { title: "Relatórios", url: createPageUrl("Reports"), icon: BarChart3, module: 'reports', requiredPermission: 'view' },
  { title: "Suporte ao Cliente", url: createPageUrl("SupportChatDashboard"), icon: MessageSquare, permission: 'company_manager' }, // Legacy permission
  { title: "Configurações", url: createPageUrl("Settings"), icon: Settings, module: 'settings', requiredPermission: 'view' },
];

export default function Layout({ children, currentPageName }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Durante a renderização inicial, mostra apenas um loader
  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#146FE0] mb-4" />
      </div>
    );
  }

  // Verificação de domínio público - SEMPRE PRIMEIRO
  const hostname = window.location.hostname.toLowerCase();
  const publicDomains = [
    'webarquivo.com.br',
    'www.webarquivo.com.br',
    'firstdocy.com.br',
    'www.firstdocy.com.br'
  ];

  const isPublicDomain = publicDomains.some(domain => hostname.includes(domain));

  if (isPublicDomain) {
    return <LandingPage />;
  }

  // Páginas que sempre devem ser públicas, independente do domínio
  const alwaysPublicPages = ["ProposalView", "LandingPage", "ExportSite", "Demo"];
  if (alwaysPublicPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  // Se nenhuma das condições acima for atendida, renderiza o layout principal do sistema
  return <MainLayout children={children} currentPageName={currentPageName} />;
}

// O layout principal para o sistema de gestão
function MainLayout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [branding, setBranding] = useState(null);
  const [notifications] = useState(3);
  const [accessStatus, setAccessStatus] = useState('loading');
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.company_id && accessStatus === 'authorized') {
        loadBranding();
      }
      // Filter navigation based on user permissions
      const hasModulePermission = (module, permission) => {
        // Admins and system managers implicitly have all module permissions
        if (user.role === 'admin' || user.permissions?.includes('system_manager')) {
          return true;
        }
        // Check for specific module permission
        return user.module_permissions?.[module]?.includes(permission);
      };

      const filteredNav = allNavigationItems.filter(item => {
        // Handle legacy direct permissions first
        if (item.permission) {
          if (item.permission === 'company_manager') {
            return user.role === 'admin' || user.permissions?.includes('company_manager') || user.permissions?.includes('system_manager');
          }
          if (item.permission === 'system_manager') {
            return user.role === 'admin' || user.permissions?.includes('system_manager');
          }
        }
        // Handle new module-based permissions
        if (item.module && item.requiredPermission) {
          return hasModulePermission(item.module, item.requiredPermission);
        }
        // If no specific permission or module is required, show the item
        return true;
      });
      setNavigationItems(filteredNav);
    }
  }, [user, accessStatus]);

  const loadUser = async () => {
    setAccessStatus('loading');
    try {
      const userData = await UserEntity.me();
      console.log("Dados do usuário carregados:", userData);

      setUser(userData);

      if (userData.role === 'client') {
          setAccessStatus('client');
      } else {
        setAccessStatus('authorized');
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      setAccessStatus('unauthorized');
    }
  };

  const loadBranding = async () => {
    try {
      // Usar cache para carregar branding
      const brandingData = await cachedAPICall(CompanyBranding, 'filter', {
        company_id: user.company_id
      });
      
      if (brandingData.length > 0 && brandingData[0].is_active) {
        setBranding(brandingData[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar branding:", error);
      
      if (error.message.includes('Rate limit')) {
        console.warn("Rate limit hit when loading branding - using defaults");
      }
    }
  };

  const applyBrandingToDocument = () => {
    if (!branding) return;

    const root = document.documentElement;

    root.style.setProperty('--brand-primary', branding.primary_color);
    root.style.setProperty('--brand-secondary', branding.secondary_color);
    root.style.setProperty('--brand-accent', branding.accent_color);
    root.style.setProperty('--brand-background', branding.background_color);
    root.style.setProperty('--brand-text', branding.text_color);

    if (branding.font_family) {
      root.style.setProperty('--brand-font', branding.font_family);
    }

    if (branding.custom_css) {
      let customStyleElement = document.getElementById('custom-branding-css');
      if (customStyleElement) {
        customStyleElement.remove();
      }

      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-branding-css';
      customStyleElement.textContent = branding.custom_css;
      document.head.appendChild(customStyleElement);
    }

    if (branding.favicon_url) {
      let faviconLink = document.querySelector("link[rel='shortcut icon']") ||
                       document.querySelector("link[rel='icon']");

      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.head.appendChild(faviconLink);
      }

      faviconLink.href = branding.favicon_url;
    }
  };

  const getBrandingColors = () => {
    if (branding && branding.is_active) {
      return {
        primary: branding.primary_color,
        secondary: branding.secondary_color,
        accent: branding.accent_color,
        background: branding.background_color,
        text: branding.text_color
      };
    }

    return {
      primary: '#212153',
      secondary: '#146FE0',
      accent: '#04BF7B',
      background: '#F8FAFC',
      text: '#1E293B'
    };
  };

  const colors = getBrandingColors();
  const brandFont = branding?.font_family || 'Sora';
  const companyName = branding?.company_name_display || 'FIRSTDOCY GED AI';
  const tagline = branding?.tagline || 'Gestão Eletrônica de Documentos com IA';

  const handleLogout = async () => {
    // Limpar cache ao fazer logout
    apiCache.clear();
    await UserEntity.logout();
    window.location.reload();
  };

  if (accessStatus === 'loading') {
      return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-12 h-12 animate-spin text-[#146FE0] mb-4" />
              <p className="text-gray-600">Carregando sistema...</p>
          </div>
      );
  }

  if (accessStatus === 'unauthorized') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h1>
          <p className="text-gray-600 mb-4">Não foi possível carregar seus dados de usuário.</p>
          <Button onClick={() => window.location.reload()} className="mb-4">
            Tentar Novamente
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Fazer Login Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (accessStatus === 'client') {
      return (
          <ClientLayout>
              <ClientPortal />
          </ClientLayout>
      );
  }

  const isSystemManager = () => {
    return user?.role === 'admin' || user?.permissions?.includes('system_manager') || user?.email?.includes('@firstdocy.com');
  };

  const isCompanyManager = () => {
    return user?.role === 'admin' || user?.permissions?.includes('company_manager') || isSystemManager();
  };

  const isSystemMaster = () => {
    return user?.email === 'admin@firstdocy.com' ||
           user?.permissions?.includes('super_user_master') ||
           user?.role === 'super_admin';
  };

  return (
    <SidebarProvider>
      <GlobalSearch /> {/* New GlobalSearch component */}
      <AntiAICopyProtection />
      <LegalNotice />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&family=Inter:wght@100;200;300;400;500;600;700;800&family=Roboto:wght@100;200;300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700;800&family=Montserrat:wght@100;200;300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap');

          :root {
            --firstdocy-brand-primary: ${colors.primary};
            --firstdocy-brand-secondary: ${colors.secondary};
            --firstdocy-brand-accent: ${colors.accent};
            --firstdocy-brand-background: ${colors.background};
            --firstdocy-brand-text: ${colors.text};
            --firstdocy-brand-font: ${brandFont};

            --firstdocy-primary: var(--firstdocy-brand-primary);
            --firstdocy-blue: var(--firstdocy-brand-secondary);
            --firstdocy-green: var(--firstdocy-brand-accent);
            --firstdocy-light-gray: var(--firstdocy-brand-background);
            --firstdocy-text: var(--firstdocy-brand-text);

            --firstdocy-gradient-primary: linear-gradient(135deg, var(--firstdocy-brand-primary) 0%, var(--firstdocy-brand-secondary) 100%);
            --firstdocy-gradient-secondary: linear-gradient(135deg, var(--firstdocy-brand-secondary) 0%, var(--firstdocy-brand-accent) 100%);
            --firstdocy-gradient-accent: linear-gradient(45deg, var(--firstdocy-brand-accent) 0%, var(--firstdocy-brand-primary) 100%);
          }

          * {
            font-family: var(--firstdocy-brand-font), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          }

          .firstdocy-gradient {
            background: var(--firstdocy-gradient-primary);
          }

          .firstdocy-logo {
            background: var(--firstdocy-gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            font-family: 'Sora', sans-serif;
          }
        `}
      </style>

      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 shadow-lg">
          <SidebarHeader className="border-b border-gray-200 p-6 bg-white">
            <div className="flex items-center gap-3">
              {branding?.logo_url ? (
                <img
                  src={branding.logo_url}
                  alt={companyName}
                  className="h-10 object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 firstdocy-gradient rounded-xl flex items-center justify-center shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16v16H4V4z" fill="white" fillOpacity="0.9"/>
                      <path d="M8 8h8v2H8V8zM8 12h6v2H8v-2zM8 16h4v2H8v-2z" fill={colors.primary}/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      <span className="firstdocy-logo">{companyName}</span>
                    </h2>
                    <p className="text-xs text-gray-500 tracking-wide">
                      {tagline}
                    </p>
                  </div>
                </>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3 bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Principal
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group transition-all duration-300 rounded-lg p-3 ${
                          isActive
                            ? 'firstdocy-gradient text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {isCompanyManager() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("FlutterFlowIntegration"))
                          ? 'firstdocy-gradient text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                      }`}
                    >
                      <Link to={createPageUrl("FlutterFlowIntegration")} className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5" />
                        <span className="font-medium">Integração FlutterFlow</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {isCompanyManager() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("FinancialDashboard"))
                          ? 'firstdocy-gradient text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                      }`}
                    >
                      <Link to={createPageUrl("FinancialDashboard")} className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-medium">Financeiro</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {isSystemMaster() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("SuperAdminManagement"))
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <Link to={createPageUrl("SuperAdminManagement")} className="flex items-center gap-3">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold">Super Admins</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Configurações
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("EmailConfiguration"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("EmailConfiguration")} className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Configuração de Email</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("UserManagement"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("UserManagement")} className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Usuários</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("DatabaseBackup"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("DatabaseBackup")} className="flex items-center gap-3">
                      <Database className="w-5 h-5" />
                      <span className="font-medium">Backup BD</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("LandingPage"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("LandingPage")} className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <span className="font-medium">Site Institucional</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("GupyIntegration"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("GupyIntegration")} className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Integração Gupy</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("CompanyGroups"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("CompanyGroups")} className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Grupos de Empresas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("ExportSite"))
                        ? 'firstdocy-gradient text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("ExportSite")} className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Exportar Site</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isSystemManager() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("FinancialManager"))
                          ? 'firstdocy-gradient text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                      }`}
                    >
                      <Link to={createPageUrl("FinancialManager")} className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-medium">Gestor Financeiro</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("BrandingSettings"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("BrandingSettings")} className="flex items-center gap-3">
                      <Palette className="w-5 h-5" />
                      <span className="font-medium">Branding</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("Settings"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("Settings")} className="flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("DeploymentGuide"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("DeploymentGuide")} className="flex items-center gap-3">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">Deploy AWS</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("AWSInstallationGuide"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("AWSInstallationGuide")} className="flex items-center gap-3">
                      <CloudRain className="w-5 h-5" />
                      <span className="font-medium">Instalação AWS Completa</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("SystemDocumentation"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("SystemDocumentation")} className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">Guias de Uso</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isSystemManager() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("TechnicalDocumentation"))
                          ? 'firstdocy-gradient text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                      }`}
                    >
                      <Link to={createPageUrl("TechnicalDocumentation")} className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Doc. Técnica</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isSystemMaster() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`group transition-all duration-300 rounded-lg p-3 ${
                        location.pathname.startsWith(createPageUrl("SuperAdminDocumentation"))
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <Link to={createPageUrl("SuperAdminDocumentation")} className="flex items-center gap-3">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold">Doc. Super Admins</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("GupyIntegrationDocs"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("GupyIntegrationDocs")} className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Documentação Gupy</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group transition-all duration-300 rounded-lg p-3 ${
                      location.pathname.startsWith(createPageUrl("SaaSAgreement"))
                        ? 'firstdocy-gradient text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-brand-primary'
                    }`}
                  >
                    <Link to={createPageUrl("SaaSAgreement")} className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Contrato SaaS</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4 bg-white">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${user.is_active === 'pausado' ? 'bg-amber-500' : 'bg-gradient-to-tr from-blue-500 to-green-400'}`}>
                        <span className="text-white font-bold">{user.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase() || 'U'}</span>
                        {user.is_active === 'pausado' && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                              <Pause className="w-3 h-3 text-amber-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = createPageUrl("UserManagement")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = createPageUrl("BrandingSettings")}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Personalização</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <SystemVersion />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-3 sticky top-0 z-10"> {/* Removed md:hidden */}
            <div className="flex items-center justify-between w-full"> {/* Added w-full */}
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg -ml-2 md:hidden" /> {/* Added md:hidden */}
              <div className="hidden md:flex items-center gap-2"> {/* New search button for desktop */}
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 text-gray-500">
                  <Search className="w-4 h-4" />
                  Buscar...
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
              
              <h1 className="text-lg font-bold firstdocy-logo md:hidden">{currentPageName}</h1> {/* Added md:hidden */}
              
              <div className="flex items-center gap-2 ml-auto"> {/* Added ml-auto to push items to the right */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center p-0">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <div className="hidden md:block"> {/* Moved user dropdown to header for desktop */}
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${user.is_active === 'pausado' ? 'bg-amber-500' : 'bg-gradient-to-tr from-blue-500 to-green-400'}`}>
                            <span className="text-white font-bold">{user.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase() || 'U'}</span>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.full_name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = createPageUrl("UserManagement")}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = createPageUrl("BrandingSettings")}>
                          <Palette className="mr-2 h-4 w-4" />
                          <span>Personalização</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

