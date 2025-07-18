import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BookingCalendar({ appointments, services, providers, currentUser, onRefresh }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("month"); // month, week, day
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(apt => {
    const providerMatch = selectedProvider === "all" || apt.provider_id === selectedProvider;
    const serviceMatch = selectedService === "all" || apt.service_id === selectedService;
    return providerMatch && serviceMatch;
  });

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => apt.appointment_date === dateStr);
  };

  const getServiceInfo = (serviceId) => {
    return services.find(s => s.id === serviceId);
  };

  const getProviderInfo = (providerId) => {
    return providers.find(p => p.id === providerId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'agendado': 'bg-blue-100 text-blue-800',
      'confirmado': 'bg-green-100 text-green-800',
      'em_andamento': 'bg-yellow-100 text-yellow-800',
      'concluido': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800',
      'nao_compareceu': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const AppointmentCard = ({ appointment }) => {
    const service = getServiceInfo(appointment.service_id);
    const provider = getProviderInfo(appointment.provider_id);

    return (
      <div className="p-2 mb-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-medium">{appointment.start_time.substring(0, 5)}</span>
              <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {appointment.client_name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {service?.name || 'Serviço'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {provider?.name || 'Prestador'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendário de Agendamentos
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prestador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Prestadores</SelectItem>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Serviços</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewType === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("month")}
              >
                Mês
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {monthDays.map(date => {
              const dayAppointments = getAppointmentsForDate(date);
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = isSameMonth(date, currentDate);

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[120px] p-1 border border-gray-100 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : 
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(date, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const todayAppointments = getAppointmentsForDate(new Date());
            if (todayAppointments.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum agendamento para hoje</p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {todayAppointments.map(appointment => {
                  const service = getServiceInfo(appointment.service_id);
                  const provider = getProviderInfo(appointment.provider_id);

                  return (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{appointment.start_time.substring(0, 5)}</span>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{appointment.client_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{appointment.client_email}</span>
                            </div>
                            {appointment.client_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{appointment.client_phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Serviço:</strong> {service?.name || 'N/A'} • 
                            <strong> Prestador:</strong> {provider?.name || 'N/A'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}