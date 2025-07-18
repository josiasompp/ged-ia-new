
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Building, Truck, MessageSquare } from 'lucide-react';
import { User as UserEntity } from '@/api/entities';
import { CompanyBranding } from '@/api/entities';
import { ServiceOrder } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { createPageUrl } from '@/utils';

export default function ClientLayout({ children }) {
    const [user, setUser] = useState(null);
    const [branding, setBranding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState(0);
    const [completed, setCompleted] = useState(0);
    const location = useLocation();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const userData = await UserEntity.me();
            setUser(userData);

            // Preserve branding loading logic
            if (userData?.company_id) {
                const brandingData = await CompanyBranding.filter({ company_id: userData.company_id });
                if (brandingData.length > 0 && brandingData[0].is_active) {
                    setBranding(brandingData[0]);
                }
            }

            if (userData) {
                await loadStats(userData);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do cliente/Usuário não autenticado:", error);
            // Clear states on error to reflect a non-authenticated or failed state
            setUser(null);
            setBranding(null);
            setOrders(0);
            setCompleted(0);
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async (user) => {
        try {
            const data = (await ServiceOrder.filter({ client_user_email: user.email })) || [];
            setOrders(data.length);
            setCompleted(data.filter(o => o.status === 'concluida').length);
        } catch(e) {
            console.error("Erro ao carregar estatísticas de O.S.", e);
            // Reset stats on error
            setOrders(0);
            setCompleted(0);
        }
    }

    const handleLogout = async () => {
        await UserEntity.logout();
        window.location.reload();
    };
    
    const companyName = branding?.company_name_display || 'FIRSTDOCY GED AI';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {isLoading ? <Skeleton className="h-10 w-32" /> : (
                            branding?.logo_url ? (
                                <Link to={createPageUrl('ClientPortal')}>
                                    <img src={branding.logo_url} alt={companyName} className="h-10 object-contain" />
                                </Link>
                            ) : (
                                <Link to={createPageUrl('ClientPortal')}>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">{companyName}</h1>
                                </Link>
                            )
                        )}
                        <span className="text-sm text-gray-500 border-l pl-4 hidden md:block">Portal do Cliente</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" className="hidden md:flex gap-2">
                           <Link to={createPageUrl('ClientServiceOrders')}>
                             <Truck className="w-4 h-4"/>
                             <span>Ordens de Serviço</span>
                           </Link>
                        </Button>
                        
                        <Button asChild variant="ghost" className="hidden md:flex gap-2">
                           <Link to={createPageUrl('ClientChat')}>
                             <MessageSquare className="w-4 h-4"/>
                             <span>Chat</span>
                           </Link>
                        </Button>

                        {isLoading ? <Skeleton className="h-10 w-10 rounded-full" /> : user && (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="font-semibold text-sm">{user.full_name}</p>
                                    <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                        <Building className="w-3 h-3"/>
                                        {user.client_company_name || 'Cliente'}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-600 hover:bg-red-50 hover:text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto p-6">
                {isLoading ? <Skeleton className="h-96 w-full"/> : children}
            </main>
            <footer className="bg-white py-4 border-t">
                <div className="container mx-auto text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {companyName}. Todos os direitos reservados.
                    {branding?.show_powered_by !== false && <span> | Powered by <a href="#" className="font-semibold text-blue-600">FirstDocy</a></span>}
                </div>
            </footer>
        </div>
    );
}
