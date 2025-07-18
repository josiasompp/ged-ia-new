import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    Database,
    Heart,
    PenSquare,
    Briefcase,
    Settings,
    Users,
    Palette,
    Network,
    ChevronRight
} from 'lucide-react';

const mainNav = [
    { name: 'Dashboard', icon: LayoutDashboard, href: 'Dashboard' },
    { name: 'Assinaturas', icon: PenSquare, href: 'DigitalSignatures' },
];

const accordionNav = [
    {
        title: 'GED & CDOC',
        icon: FileText,
        links: [
            { name: 'Documentos', href: 'Documents' },
            { name: 'Arquivo Físico', href: 'PhysicalDocuments' },
        ]
    },
    {
        title: 'Comercial',
        icon: Heart,
        links: [
            { name: 'CRM', href: 'CRM' },
            { name: 'Propostas', href: 'Proposals' },
        ]
    },
    {
        title: 'RH',
        icon: Briefcase,
        links: [
            { name: 'Gestão de Pessoal', href: 'HumanResources' },
            { name: 'Controle de Ponto', href: 'HumanResources?tab=control' },
        ]
    },
    {
        title: 'Configurações',
        icon: Settings,
        links: [
            { name: 'Empresas', href: 'Companies' },
            { name: 'Grupos', href: 'CompanyGroups' },
            { name: 'Usuários', href: 'UserManagement' },
            { name: 'Departamentos', href: 'Departments' },
            { name: 'Branding', href: 'BrandingSettings' },
        ]
    }
];

export default function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const NavLink = ({ href, icon: Icon, children, isSub = false }) => {
        const pageUrl = createPageUrl(href);
        const pageRoot = pageUrl.split('?')[0];
        const currentRoot = currentPath.split('?')[0];
        const isActive = href.includes('?') ? currentPath === pageUrl : currentRoot === pageRoot;
        
        return (
            <Link to={pageUrl} className="block">
                <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                >
                    {isSub ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <Icon className="w-5 h-5" />}
                    {children}
                </Button>
            </Link>
        );
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col p-4 shadow-sm">
            <div className="mb-8 pl-2">
                 <h1 className="text-2xl font-bold bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
                    FIRSTDOCY
                </h1>
            </div>

            <nav className="flex-1 space-y-1">
                {mainNav.map(item => (
                    <NavLink key={item.name} href={item.href} icon={item.icon}>
                        {item.name}
                    </NavLink>
                ))}
                
                <Accordion type="multiple" className="w-full">
                    {accordionNav.map(item => (
                        <AccordionItem key={item.title} value={item.title} className="border-b-0">
                            <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>button>svg:last-child]:rotate-90">
                                <Button variant="ghost" className="w-full justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <item.icon className="w-5 h-5" />
                                      {item.title}
                                    </div>
                                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                                </Button>
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 space-y-1">
                                {item.links.map(link => (
                                    <NavLink key={link.name} href={link.href} icon={ChevronRight} isSub={true}>
                                        {link.name}
                                    </NavLink>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </nav>
        </aside>
    );
}