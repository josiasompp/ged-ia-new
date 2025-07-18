import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart3,
  Plus,
  CalendarDays,
  UserCheck,
  Briefcase,
  Globe,
  Shield
} from "lucide-react";
import { Service } from "@/api/entities";
import { ServiceProvider } from "@/api/entities";
import { Appointment } from "@/api/entities";
import { BookingSettings } from "@/api/entities";
import { User } from "@/api/entities";

import BookingCalendar from "@/components/booking/BookingCalendar";
import ServiceManager from "@/components/booking/ServiceManager";
import ProviderManager from "@/components/booking/ProviderManager";
import AppointmentManager from "@/components/booking/AppointmentManager";
import BookingDashboard from "@/components/booking/BookingDashboard";
import BookingSettingsManager from "@/components/booking/BookingSettingsManager";
import ClientBookingPortal from "@/components/booking/ClientBookingPortal";
import MasterAppointmentManager from "@/components/booking/MasterAppointmentManager";

export default function BookingSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookingSettings, setBookingSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    loadData();
    document.title = "Sistema de Agendamentos - FIRSTDOCY";
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      const [servicesData, providersData, appointmentsData, settingsData] = await Promise.all([
        Service.list("-created_date", 100),
        ServiceProvider.list("-created_date", 100),
        Appointment.list("-appointment_date", 200),
        BookingSettings.filter({ company_id: user.company_id })
      ]);

      setServices(servicesData || []);
      setProviders(providersData || []);
      setAppointments(appointmentsData || []);
      setBookingSettings(settingsData?.[0] || null);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.appointment_date === today);
    const pendingAppointments = appointments.filter(apt => apt.status === 'agendado');
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmado');
    
    return {
      totalServices: services.length,
      activeProviders: providers.filter(p => p.is_active).length,
      todayAppointments: todayAppointments.length,
      pendingAppointments: pendingAppointments.length,
      confirmedAppointments: confirmedAppointments.length,
      totalAppointments: appointments.length
    };
  };

  const stats = getStats();

  // Verificar se o usuário é master/admin
  const isMasterUser = () => {
    return currentUser?.role === 'admin' || 
           currentUser?.permissions?.includes('master') ||
           currentUser?.permissions?.includes('booking_master');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">Carregando sistema de agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Sistema de Agendamentos
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-base lg:text-lg">
            Gerencie agendamentos online de forma profissional - BookMyDay Style
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📅 {stats.todayAppointments} agendamentos hoje</span>
            <span>👥 {stats.activeProviders} prestadores ativos</span>
            <span>🔧 {stats.totalServices} serviços</span>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {isMasterUser() && (
            <Button
              onClick={() => setActiveTab("master")}
              variant="outline"
              className="gap-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
            >
              <Shield className="w-4 h-4" />
              Painel Master
            </Button>
          )}
          <Button
            onClick={() => setActiveTab("portal")}
            variant="outline"
            className="gap-2 border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
          >
            <Globe className="w-4 h-4" />
            Portal Público
          </Button>
          <Button
            onClick={() => setActiveTab("calendar")}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            Ver Calendário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Hoje</p>
                <div className="text-2xl font-bold text-blue-700">{stats.todayAppointments}</div>
                <p className="text-xs text-blue-500">agendamentos</p>
              </div>
              <CalendarDays className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Confirmados</p>
                <div className="text-2xl font-bold text-green-700">{stats.confirmedAppointments}</div>
                <p className="text-xs text-green-500">este mês</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pendentes</p>
                <div className="text-2xl font-bold text-amber-700">{stats.pendingAppointments}</div>
                <p className="text-xs text-amber-500">confirmação</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Prestadores</p>
                <div className="text-2xl font-bold text-purple-700">{stats.activeProviders}</div>
                <p className="text-xs text-purple-500">ativos</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-medium">Serviços</p>
                <div className="text-2xl font-bold text-cyan-700">{stats.totalServices}</div>
                <p className="text-xs text-cyan-500">disponíveis</p>
              </div>
              <Briefcase className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm font-medium">Total</p>
                <div className="text-2xl font-bold text-rose-700">{stats.totalAppointments}</div>
                <p className="text-xs text-rose-500">agendamentos</p>
              </div>
              <BarChart3 className="w-8 h-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendário</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Agendamentos</span>
            </TabsTrigger>
            {isMasterUser() && (
              <TabsTrigger value="master" className="flex items-center gap-2 text-yellow-700">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Master</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Prestadores</span>
            </TabsTrigger>
            <TabsTrigger value="portal" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Portal Público</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <BookingDashboard
            appointments={appointments}
            services={services}
            providers={providers}
            stats={stats}
            currentUser={currentUser}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <BookingCalendar
            appointments={appointments}
            services={services}
            providers={providers}
            currentUser={currentUser}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentManager
            appointments={appointments}
            services={services}
            providers={providers}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        {isMasterUser() && (
          <TabsContent value="master" className="space-y-4">
            <MasterAppointmentManager
              appointments={appointments}
              services={services}
              providers={providers}
              currentUser={currentUser}
              onRefresh={loadData}
            />
          </TabsContent>
        )}

        <TabsContent value="services" className="space-y-4">
          <ServiceManager
            services={services}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <ProviderManager
            providers={providers}
            services={services}
            currentUser={currentUser}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <ClientBookingPortal
            services={services}
            providers={providers}
            bookingSettings={bookingSettings}
            onBookingMade={loadData}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <BookingSettingsManager
            settings={bookingSettings}
            currentUser={currentUser}
            onRefresh={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}