import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Documents from "./Documents";

import Companies from "./Companies";

import Departments from "./Departments";

import Proposals from "./Proposals";

import ProposalView from "./ProposalView";

import ProposalTemplates from "./ProposalTemplates";

import BrandingSettings from "./BrandingSettings";

import Approvals from "./Approvals";

import UserManagement from "./UserManagement";

import Reports from "./Reports";

import TasksApprovals from "./TasksApprovals";

import Settings from "./Settings";

import CRM from "./CRM";

import DeploymentGuide from "./DeploymentGuide";

import DigitalSignatures from "./DigitalSignatures";

import HumanResources from "./HumanResources";

import ClientPortal from "./ClientPortal";

import SystemDocumentation from "./SystemDocumentation";

import SaaSAgreement from "./SaaSAgreement";

import LandingPage from "./LandingPage";

import PhysicalDocuments from "./PhysicalDocuments";

import CompanyGroups from "./CompanyGroups";

import HrDocumentTypes from "./HrDocumentTypes";

import ChecklistTemplates from "./ChecklistTemplates";

import GupyIntegration from "./GupyIntegration";

import CboMapping from "./CboMapping";

import GupyIntegrationDocs from "./GupyIntegrationDocs";

import ExportSite from "./ExportSite";

import FinancialManager from "./FinancialManager";

import FinancialDashboard from "./FinancialDashboard";

import GedUserGuide from "./GedUserGuide";

import CdocUserGuide from "./CdocUserGuide";

import SystemAnalysis from "./SystemAnalysis";

import TechnicalDocumentation from "./TechnicalDocumentation";

import ServiceOrders from "./ServiceOrders";

import ClientServiceOrders from "./ClientServiceOrders";

import SuperAdminManagement from "./SuperAdminManagement";

import SuperAdminDocumentation from "./SuperAdminDocumentation";

import MedicalExams from "./MedicalExams";

import EmailConfiguration from "./EmailConfiguration";

import SupportChatDashboard from "./SupportChatDashboard";

import ClientChat from "./ClientChat";

import FlutterFlowIntegration from "./FlutterFlowIntegration";

import SecureAccess from "./SecureAccess";

import DatabaseBackup from "./DatabaseBackup";

import Demo from "./Demo";

import PublishingCenter from "./PublishingCenter";

import EmployeeDocumentPortal from "./EmployeeDocumentPortal";

import PublicVerification from "./PublicVerification";

import BookingSystem from "./BookingSystem";

import BookingSystemGuide from "./BookingSystemGuide";

import AWSInstallationGuide from "./AWSInstallationGuide";

import LocalDevelopmentSetup from "./LocalDevelopmentSetup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Documents: Documents,
    
    Companies: Companies,
    
    Departments: Departments,
    
    Proposals: Proposals,
    
    ProposalView: ProposalView,
    
    ProposalTemplates: ProposalTemplates,
    
    BrandingSettings: BrandingSettings,
    
    Approvals: Approvals,
    
    UserManagement: UserManagement,
    
    Reports: Reports,
    
    TasksApprovals: TasksApprovals,
    
    Settings: Settings,
    
    CRM: CRM,
    
    DeploymentGuide: DeploymentGuide,
    
    DigitalSignatures: DigitalSignatures,
    
    HumanResources: HumanResources,
    
    ClientPortal: ClientPortal,
    
    SystemDocumentation: SystemDocumentation,
    
    SaaSAgreement: SaaSAgreement,
    
    LandingPage: LandingPage,
    
    PhysicalDocuments: PhysicalDocuments,
    
    CompanyGroups: CompanyGroups,
    
    HrDocumentTypes: HrDocumentTypes,
    
    ChecklistTemplates: ChecklistTemplates,
    
    GupyIntegration: GupyIntegration,
    
    CboMapping: CboMapping,
    
    GupyIntegrationDocs: GupyIntegrationDocs,
    
    ExportSite: ExportSite,
    
    FinancialManager: FinancialManager,
    
    FinancialDashboard: FinancialDashboard,
    
    GedUserGuide: GedUserGuide,
    
    CdocUserGuide: CdocUserGuide,
    
    SystemAnalysis: SystemAnalysis,
    
    TechnicalDocumentation: TechnicalDocumentation,
    
    ServiceOrders: ServiceOrders,
    
    ClientServiceOrders: ClientServiceOrders,
    
    SuperAdminManagement: SuperAdminManagement,
    
    SuperAdminDocumentation: SuperAdminDocumentation,
    
    MedicalExams: MedicalExams,
    
    EmailConfiguration: EmailConfiguration,
    
    SupportChatDashboard: SupportChatDashboard,
    
    ClientChat: ClientChat,
    
    FlutterFlowIntegration: FlutterFlowIntegration,
    
    SecureAccess: SecureAccess,
    
    DatabaseBackup: DatabaseBackup,
    
    Demo: Demo,
    
    PublishingCenter: PublishingCenter,
    
    EmployeeDocumentPortal: EmployeeDocumentPortal,
    
    PublicVerification: PublicVerification,
    
    BookingSystem: BookingSystem,
    
    BookingSystemGuide: BookingSystemGuide,
    
    AWSInstallationGuide: AWSInstallationGuide,
    
    LocalDevelopmentSetup: LocalDevelopmentSetup,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Documents" element={<Documents />} />
                
                <Route path="/Companies" element={<Companies />} />
                
                <Route path="/Departments" element={<Departments />} />
                
                <Route path="/Proposals" element={<Proposals />} />
                
                <Route path="/ProposalView" element={<ProposalView />} />
                
                <Route path="/ProposalTemplates" element={<ProposalTemplates />} />
                
                <Route path="/BrandingSettings" element={<BrandingSettings />} />
                
                <Route path="/Approvals" element={<Approvals />} />
                
                <Route path="/UserManagement" element={<UserManagement />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/TasksApprovals" element={<TasksApprovals />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/CRM" element={<CRM />} />
                
                <Route path="/DeploymentGuide" element={<DeploymentGuide />} />
                
                <Route path="/DigitalSignatures" element={<DigitalSignatures />} />
                
                <Route path="/HumanResources" element={<HumanResources />} />
                
                <Route path="/ClientPortal" element={<ClientPortal />} />
                
                <Route path="/SystemDocumentation" element={<SystemDocumentation />} />
                
                <Route path="/SaaSAgreement" element={<SaaSAgreement />} />
                
                <Route path="/LandingPage" element={<LandingPage />} />
                
                <Route path="/PhysicalDocuments" element={<PhysicalDocuments />} />
                
                <Route path="/CompanyGroups" element={<CompanyGroups />} />
                
                <Route path="/HrDocumentTypes" element={<HrDocumentTypes />} />
                
                <Route path="/ChecklistTemplates" element={<ChecklistTemplates />} />
                
                <Route path="/GupyIntegration" element={<GupyIntegration />} />
                
                <Route path="/CboMapping" element={<CboMapping />} />
                
                <Route path="/GupyIntegrationDocs" element={<GupyIntegrationDocs />} />
                
                <Route path="/ExportSite" element={<ExportSite />} />
                
                <Route path="/FinancialManager" element={<FinancialManager />} />
                
                <Route path="/FinancialDashboard" element={<FinancialDashboard />} />
                
                <Route path="/GedUserGuide" element={<GedUserGuide />} />
                
                <Route path="/CdocUserGuide" element={<CdocUserGuide />} />
                
                <Route path="/SystemAnalysis" element={<SystemAnalysis />} />
                
                <Route path="/TechnicalDocumentation" element={<TechnicalDocumentation />} />
                
                <Route path="/ServiceOrders" element={<ServiceOrders />} />
                
                <Route path="/ClientServiceOrders" element={<ClientServiceOrders />} />
                
                <Route path="/SuperAdminManagement" element={<SuperAdminManagement />} />
                
                <Route path="/SuperAdminDocumentation" element={<SuperAdminDocumentation />} />
                
                <Route path="/MedicalExams" element={<MedicalExams />} />
                
                <Route path="/EmailConfiguration" element={<EmailConfiguration />} />
                
                <Route path="/SupportChatDashboard" element={<SupportChatDashboard />} />
                
                <Route path="/ClientChat" element={<ClientChat />} />
                
                <Route path="/FlutterFlowIntegration" element={<FlutterFlowIntegration />} />
                
                <Route path="/SecureAccess" element={<SecureAccess />} />
                
                <Route path="/DatabaseBackup" element={<DatabaseBackup />} />
                
                <Route path="/Demo" element={<Demo />} />
                
                <Route path="/PublishingCenter" element={<PublishingCenter />} />
                
                <Route path="/EmployeeDocumentPortal" element={<EmployeeDocumentPortal />} />
                
                <Route path="/PublicVerification" element={<PublicVerification />} />
                
                <Route path="/BookingSystem" element={<BookingSystem />} />
                
                <Route path="/BookingSystemGuide" element={<BookingSystemGuide />} />
                
                <Route path="/AWSInstallationGuide" element={<AWSInstallationGuide />} />
                
                <Route path="/LocalDevelopmentSetup" element={<LocalDevelopmentSetup />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}