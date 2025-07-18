
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  History,
  DollarSign // Add DollarSign icon
} from "lucide-react";
import { format, addMinutes, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/api/entities";
import { AppointmentAudit } from "@/api/entities";
import { AppointmentNotification } from "@/api/entities";
import { useToast } from "@/components/ui/use-toast";

export default function MasterAppointmentManager({ 
  appointments, 
  services, 
  providers, 
  currentUser, 
  onRefresh 
}) {
  const [showForm, setShowForm] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    service_id: "",
    provider_id: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: "",
    end_time: "",
    status: "confirmado",
    client_notes: "",
    internal_notes: "",
    booking_type: "admin",
    reason_for_change: ""
  });

  const resetForm = () => {
    setFormData({
      service_id: "",
      provider_id: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      appointment_date: format(new Date(), 'yyyy-MM-dd'),
      start_time: "",
      end_time: "",
      status: "confirmado",
      client_notes: "",
      internal_notes: "",
      booking_type: "admin",
      reason_for_change: ""
    });
    setSelectedAppointment(null);
  };

  // Calcular horários disponíveis
  useEffect(() => {
    if (formData.service_id && formData.provider_id && formData.appointment_date) {
      calculateAvailableSlots();
    }
  }, [formData.service_id, formData.provider_id, formData.appointment_date]);

  const calculateAvailableSlots = () => {
    const service = services.find(s => s.id === formData.service_id);
    const provider = providers.find(p => p.id === formData.provider_id);
    
    if (!service || !provider) return;

    const appointmentDate = new Date(formData.appointment_date);
    // Ensure dayOfWeek is correctly extracted, assuming appointmentDate is YYYY-MM-DD
    const dayOfWeek = format(appointmentDate, 'EEEE', { locale: ptBR }).toLowerCase(); // Ex: "segunda-feira"
    const workingHours = provider.working_hours?.[dayOfWeek];
    
    if (!workingHours) {
      setAvailableSlots([]);
      return;
    }

    // Gerar slots de 30 em 30 minutos
    const slots = [];
    const startTime = new Date(`${formData.appointment_date}T${workingHours.start}:00`);
    const endTime = new Date(`${formData.appointment_date}T${workingHours.end}:00`);
    
    let currentTime = startTime;
    while (currentTime < endTime) {
      const timeSlot = format(currentTime, 'HH:mm');
      
      // Verificar se o horário está livre
      const isBooked = appointments.some(apt => 
        apt.provider_id === formData.provider_id &&
        apt.appointment_date === formData.appointment_date &&
        apt.start_time === timeSlot &&
        apt.status !== 'cancelado' &&
        (!selectedAppointment || apt.id !== selectedAppointment.id)
      );
      
      if (!isBooked) {
        slots.push(timeSlot);
      }
      
      currentTime = addMinutes(currentTime, 30);
    }
    
    setAvailableSlots(slots);
  };

  const handleTimeChange = (time) => {
    const service = services.find(s => s.id === formData.service_id);
    if (service) {
      const startTime = new Date(`${formData.appointment_date}T${time}:00`);
      const endTime = addMinutes(startTime, service.duration_minutes);
      
      setFormData({
        ...formData,
        start_time: time,
        end_time: format(endTime, 'HH:mm')
      });
    }
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setFormData({
      service_id: appointment.service_id,
      provider_id: appointment.provider_id,
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone || "",
      appointment_date: appointment.appointment_date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
      client_notes: appointment.client_notes || "",
      internal_notes: appointment.internal_notes || "",
      booking_type: appointment.booking_type || "admin",
      reason_for_change: ""
    });
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const createAuditLog = async (appointment, action, oldValues = null, newValues = null) => {
    try {
      await AppointmentAudit.create({
        appointment_id: appointment.id || appointment.appointment_id,
        company_id: currentUser.company_id,
        action_type: action,
        performed_by: currentUser.email,
        performed_by_role: currentUser.role === 'admin' ? 'master' : 'admin',
        old_values: oldValues,
        new_values: newValues,
        reason: formData.reason_for_change || `Ação realizada pelo administrador: ${action}`,
        ip_address: window.location.hostname,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error("Erro ao criar log de auditoria:", error);
    }
  };

  const scheduleNotifications = async (appointment, notificationType) => {
    try {
      const service = services.find(s => s.id === appointment.service_id);
      const provider = providers.find(p => p.id === appointment.provider_id);
      
      // Notificação para o cliente
      await AppointmentNotification.create({
        appointment_id: appointment.id,
        company_id: currentUser.company_id,
        notification_type: notificationType,
        recipient_type: 'client',
        recipient_email: appointment.client_email,
        recipient_phone: appointment.client_phone,
        delivery_method: appointment.client_phone ? 'both' : 'email',
        subject: `${notificationType === 'confirmation' ? 'Confirmação' : 'Alteração'} de Agendamento`,
        message: `Seu agendamento de ${service?.name} com ${provider?.name} está ${notificationType === 'confirmation' ? 'confirmado' : 'alterado'} para ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })} às ${appointment.start_time}.`,
        scheduled_for: new Date().toISOString(),
        triggered_by: currentUser.email
      });

      // Notificação para o prestador
      if (provider?.email) {
        await AppointmentNotification.create({
          appointment_id: appointment.id,
          company_id: currentUser.company_id,
          notification_type: notificationType,
          recipient_type: 'provider',
          recipient_email: provider.email,
          delivery_method: 'email',
          subject: `${notificationType === 'confirmation' ? 'Novo' : 'Alteração de'} Agendamento`,
          message: `Você tem um agendamento ${notificationType === 'confirmation' ? 'confirmado' : 'alterado'} com ${appointment.client_name} para ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })} às ${appointment.start_time}.`,
          scheduled_for: new Date().toISOString(),
          triggered_by: currentUser.email
        });
      }
    } catch (error) {
      console.error("Erro ao agendar notificações:", error);
    }
  };

  const handleSave = async () => {
    try {
      const service = services.find(s => s.id === formData.service_id);
      if (!service) {
        toast({ title: "Erro", description: "Serviço não encontrado", variant: "destructive" });
        return;
      }

      const appointmentData = {
        ...formData,
        company_id: currentUser.company_id,
        duration_minutes: service.duration_minutes,
        appointment_number: selectedAppointment?.appointment_number || `APT-${Date.now()}`,
        booking_type: "admin"
      };

      if (selectedAppointment) {
        // Criar log de auditoria para alteração
        await createAuditLog(
          selectedAppointment,
          'updated',
          selectedAppointment,
          appointmentData
        );

        await Appointment.update(selectedAppointment.id, appointmentData);
        await scheduleNotifications({ ...appointmentData, id: selectedAppointment.id }, 'reschedule');
        
        toast({ 
          title: "Agendamento Atualizado!", 
          description: "O cliente e prestador foram notificados sobre a alteração."
        });
      } else {
        const newAppointment = await Appointment.create(appointmentData);
        
        // Criar log de auditoria para criação
        await createAuditLog(
          newAppointment,
          'created',
          null,
          appointmentData
        );

        await scheduleNotifications(newAppointment, 'confirmation');
        
        toast({ 
          title: "Agendamento Criado!", 
          description: "Confirmação enviada para o cliente e prestador."
        });
      }

      setShowForm(false);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      toast({ 
        title: "Erro ao salvar", 
        description: "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = async (appointment, reason) => {
    if (window.confirm(`Tem certeza que deseja cancelar o agendamento de ${appointment.client_name}?`)) {
      try {
        await createAuditLog(
          appointment,
          'cancelled',
          appointment,
          { ...appointment, status: 'cancelado', cancellation_reason: reason }
        );

        await Appointment.update(appointment.id, {
          status: 'cancelado',
          cancellation_reason: reason,
          cancelled_by: 'admin'
        });

        // Notificar cancelamento
        await scheduleNotifications({ ...appointment, status: 'cancelado' }, 'cancellation');

        toast({ 
          title: "Agendamento Cancelado", 
          description: "Cliente e prestador foram notificados sobre o cancelamento."
        });
        onRefresh();
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        toast({ title: "Erro ao cancelar", variant: "destructive" });
      }
    }
  };

  const loadAuditLog = async (appointmentId) => {
    try {
      const logs = await AppointmentAudit.filter({ appointment_id: appointmentId }, '-created_date');
      setAuditLogs(logs);
      setShowAuditLog(true);
    } catch (error) {
      console.error("Erro ao carregar logs de auditoria:", error);
    }
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

  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'isento':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      {/* Header com informações especiais para Master */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Shield className="w-5 h-5" />
            Painel Master - Controle Total da Agenda
          </CardTitle>
          <p className="text-amber-700 text-sm">
            Como usuário master, você tem controle total sobre todos os agendamentos. 
            Todas as suas ações são registradas em log de auditoria e geram notificações automáticas.
          </p>
        </CardHeader>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleNew}>
          <CardContent className="p-4 text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Novo Agendamento</h3>
            <p className="text-sm text-gray-600">Criar agendamento para cliente</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-green-900">Hoje: {todayAppointments.length}</h3>
            <p className="text-sm text-gray-600">Agendamentos de hoje</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <History className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Log de Auditoria</h3>
            <p className="text-sm text-gray-600">Rastrear todas as alterações</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos com Ações Master */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos - Controle Master</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.slice(0, 10).map((appointment) => {
              const service = services.find(s => s.id === appointment.service_id);
              const provider = providers.find(p => p.id === appointment.provider_id);

              return (
                <div key={appointment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {/* Add Payment Status Badge */}
                        {appointment.payment_status && (
                          <Badge variant="outline" className={getPaymentStatusVariant(appointment.payment_status)}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            {appointment.payment_status}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })} às {appointment.start_time}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.client_name}</h4>
                        <p className="text-sm text-gray-600">{service?.name} • {provider?.name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {appointment.client_email}
                          </span>
                          {appointment.client_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {appointment.client_phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAuditLog(appointment.id)}
                        className="gap-1"
                      >
                        <History className="w-3 h-3" />
                        Log
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(appointment, "Cancelado pelo administrador")}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Agendamento Master */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {selectedAppointment ? "Editar Agendamento (Master)" : "Novo Agendamento (Master)"}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment 
                ? "Alterações serão registradas no log de auditoria e notificações serão enviadas automaticamente."
                : "Novo agendamento criado pelo administrador com confirmação automática."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="appointment" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointment">Agendamento</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>

            <TabsContent value="appointment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Serviço *</Label>
                  <Select value={formData.service_id} onValueChange={(v) => setFormData({...formData, service_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.filter(s => s.is_active).map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.duration_minutes}min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prestador *</Label>
                  <Select value={formData.provider_id} onValueChange={(v) => setFormData({...formData, provider_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prestador" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.filter(p => p.is_active).map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Cliente *</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Horário de Início *</Label>
                  <Select value={formData.start_time} onValueChange={handleTimeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Observações do Cliente</Label>
                <Textarea
                  value={formData.client_notes}
                  onChange={(e) => setFormData({...formData, client_notes: e.target.value})}
                  placeholder="Observações ou solicitações especiais..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Observações Internas</Label>
                <Textarea
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
                  placeholder="Observações internas (não visíveis ao cliente)..."
                  rows={2}
                />
              </div>

              {selectedAppointment && (
                <div>
                  <Label>Motivo da Alteração *</Label>
                  <Textarea
                    value={formData.reason_for_change}
                    onChange={(e) => setFormData({...formData, reason_for_change: e.target.value})}
                    placeholder="Descreva o motivo da alteração para o log de auditoria..."
                    rows={2}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Notificações Automáticas:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Cliente receberá confirmação por email{formData.client_phone && " e SMS"}</li>
                    <li>• Prestador será notificado sobre o agendamento</li>
                    <li>• Lembretes automáticos serão enviados 24h antes</li>
                    <li>• Todas as alterações geram notificações automáticas</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Resumo das Notificações:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Email para: {formData.client_email}</span>
                  </div>
                  {formData.client_phone && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>SMS para: {formData.client_phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Prestador: {providers.find(p => p.id === formData.provider_id)?.name}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              {selectedAppointment ? "Atualizar" : "Criar"} Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Log de Auditoria */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Log de Auditoria do Agendamento
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {auditLogs.map((log, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">
                      {log.action_type.toUpperCase()} - {log.performed_by_role.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - {log.performed_by}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {log.action_type}
                  </Badge>
                </div>
                
                {log.reason && (
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>Motivo:</strong> {log.reason}
                  </div>
                )}
                
                {log.old_values && log.new_values && (
                  <div className="mt-2 text-xs">
                    <details className="cursor-pointer">
                      <summary className="font-medium text-gray-600">Ver alterações</summary>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <strong>Valores Anteriores:</strong>
                          <pre className="bg-red-50 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <strong>Novos Valores:</strong>
                          <pre className="bg-green-50 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
