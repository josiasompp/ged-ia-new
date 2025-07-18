
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Truck, // Used in new layout
    FileText, // Used in new layout
    AlertTriangle, // Used in new layout
    Loader2 // Keep for potential loading spinners if needed
} from 'lucide-react';
import { User } from '@/api/entities';
import { Proposal } from '@/api/entities'; // Needed for stats
import { DocumentAccess } from '@/api/entities'; // Needed for stats
import { Task } from '@/api/entities'; // Needed for stats
import { ServiceOrder } from '@/api/entities'; // Keep for service orders data and stats
import ClientServiceOrders from "../components/client/ClientServiceOrders";
import ClientServiceOrderForm from "../components/service-orders/ClientServiceOrderForm";

export default function ClientPortal() {
    const [currentUser, setCurrentUser] = useState(null);
    const [serviceOrders, setServiceOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [stats, setStats] = useState({ activeOrders: 0, totalDocuments: 0, notifications: 0 });

    // Function to load current user on mount
    // This effect runs once to get the user; subsequent data loading depends on currentUser state.
    useEffect(() => {
        const loadUser = async () => {
            // setIsLoading(true); // isLoading is true by default and will be managed by the data fetching effect
            try {
                const user = await User.me();
                setCurrentUser(user);
                // If user is loaded but no email (e.g., not properly logged in), stop loading immediately.
                if (!user?.email) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
                setCurrentUser(null);
                setIsLoading(false); // If user load fails, stop loading
            }
        };
        loadUser();
    }, []);

    // Function to load service orders (from outline)
    const loadServiceOrders = useCallback(async () => {
        if (!currentUser?.email) {
            setServiceOrders([]); // Clear orders if no user email
            return;
        }
        try {
            const data = await ServiceOrder.filter({ client_user_email: currentUser.email });
            setServiceOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Erro ao carregar OS:", e);
            setServiceOrders([]);
        }
    }, [currentUser]); // Depend on currentUser to re-fetch if user changes

    // Function to load stats
    const loadStats = useCallback(async () => {
        if (!currentUser?.email) {
            setStats({ activeOrders: 0, totalDocuments: 0, notifications: 0 }); // Clear stats if no user email
            return;
        }
        try {
            const [proposalsData, accessList, taskData, serviceOrderData] = await Promise.all([
                Proposal.filter({ client_email: currentUser.email }),
                DocumentAccess.filter({ user_email: currentUser.email }),
                Task.filter({ assigned_to: currentUser.email }),
                ServiceOrder.filter({ client_user_email: currentUser.email }) // Still needed for activeOrders count
            ]);

            setStats({
                activeOrders: (serviceOrderData || []).filter(so => so.status !== 'concluida' && so.status !== 'cancelada').length,
                totalDocuments: (accessList || []).length,
                notifications: (taskData || []).filter(t => t.status !== 'concluida').length,
            });
        } catch (error) {
            console.error("Erro ao carregar stats do portal:", error);
            setStats({ activeOrders: 0, totalDocuments: 0, notifications: 0 });
        }
    }, [currentUser]); // Depend on currentUser to re-fetch if user changes

    // Effect to load client-specific data once currentUser is available
    useEffect(() => {
        if (currentUser?.email) {
            setIsLoading(true); // Indicate data loading
            Promise.all([
                loadStats(),
                loadServiceOrders()
            ]).finally(() => {
                setIsLoading(false); // All data fetched, stop loading
            });
        } else if (currentUser === null) {
            // If currentUser is explicitly null (e.g., login failed), ensure loading is off.
            // This handles cases where User.me() fails.
            setIsLoading(false);
        }
    }, [currentUser, loadStats, loadServiceOrders]); // Re-run when currentUser or memoized functions change

    // These functions are called after an action (like saving a new order)
    const handleOrderSave = () => {
        setShowOrderForm(false);
        loadStats(); // Reload stats after save
        loadServiceOrders(); // Reload service orders after save
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Portal do Cliente
                    </h1>
                    <p className="text-gray-600 mt-1">Bem-vindo, {currentUser?.full_name || 'Cliente'}.</p>
                </div>
                <Button onClick={() => setShowOrderForm(true)} className="bg-firstdocy-blue hover:bg-firstdocy-blue/90">
                    <Truck className="mr-2 h-4 w-4" />
                    Solicitar Serviço
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">O.S. Ativas</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeOrders}</div>
                        <p className="text-xs text-muted-foreground">Ordens de serviço em andamento</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documentos</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                        <p className="text-xs text-muted-foreground">Documentos sob nossa guarda</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avisos</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.notifications}</div>
                        <p className="text-xs text-muted-foreground">Avisos ou pendências</p>
                    </CardContent>
                </Card>
            </div>

            <ClientServiceOrders
                orders={(serviceOrders || []).slice(0, 5)}
                onNewOrder={() => setShowOrderForm(true)}
            />

            {showOrderForm && (
                <ClientServiceOrderForm
                    currentUser={currentUser}
                    onClose={() => setShowOrderForm(false)}
                    onSave={handleOrderSave}
                />
            )}
        </div>
    );
}
