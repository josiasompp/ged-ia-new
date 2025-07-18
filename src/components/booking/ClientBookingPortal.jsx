
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Appointment } from '@/api/entities';
import { format, addMinutes, eachMinuteOfInterval, startOfHour, endOfDay, isBefore, addDays, set } from 'date-fns';
import { Loader2, CreditCard } from "lucide-react";

export default function ClientBookingPortal({ settings, services, providers, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null); // This will store the service ID
  const [selectedProvider, setSelectedProvider] = useState(null); // This will store the full provider object
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '', notes: '' });
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointments, setAppointments] = useState([]); // Placeholder for existing appointments data

  const { toast } = useToast();

  const service = services.find(s => s.id === selectedService);

  // This useMemo replaces the useEffect for availableSlots
  const availableTimeSlots = useMemo(() => {
    if (!service || !selectedProvider || !selectedDate) {
      return [];
    }

    const serviceDuration = service.duration_minutes;
    const businessStartTime = settings?.business_hours?.start_time || '09:00'; // Default to 9 AM
    const businessEndTime = settings?.business_hours?.end_time || '17:00';   // Default to 5 PM

    // Parse business hours for the selected date
    const startHour = parseInt(businessStartTime.split(':')[0], 10);
    const startMinute = parseInt(businessStartTime.split(':')[1], 10);
    const endHour = parseInt(businessEndTime.split(':')[0], 10);
    const endMinute = parseInt(businessEndTime.split(':')[1], 10);

    let startInterval = set(selectedDate, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 });
    let endInterval = set(selectedDate, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 });

    // Ensure startInterval is not in the past
    const now = new Date();
    if (isBefore(startInterval, now)) {
      startInterval = now;
      // Round up to the next interval step if needed
      const currentMinutes = startInterval.getMinutes();
      const remainder = currentMinutes % serviceDuration;
      if (remainder !== 0) {
        startInterval = addMinutes(startInterval, serviceDuration - remainder);
      }
    }

    // Adjust endInterval to ensure it's within the same day and after startInterval
    if (isBefore(endInterval, startInterval)) {
      // If end time is before start time (e.g., 9-5 vs 5-9 next day), adjust for next day if needed or cap at end of day
      endInterval = endOfDay(selectedDate); // Cap at end of selected day for simplicity
    }


    const potentialSlots = eachMinuteOfInterval(
      { start: startInterval, end: endInterval },
      { step: serviceDuration }
    ).map(date => format(date, 'HH:mm'));

    // Filter out slots that conflict with existing appointments or are too close to business end time
    const filteredSlots = potentialSlots.filter(slotTime => {
      const slotStartDateTime = set(selectedDate, {
        hours: parseInt(slotTime.split(':')[0], 10),
        minutes: parseInt(slotTime.split(':')[1], 10),
        seconds: 0,
        milliseconds: 0
      });
      const slotEndDateTime = addMinutes(slotStartDateTime, serviceDuration);

      // Check against business end time
      if (isBefore(endInterval, slotEndDateTime)) {
        return false;
      }

      // TODO: Filter based on existing appointments for selected provider and date
      // This would require fetching actual appointments for the selected provider and date
      // For now, this is a placeholder. Assuming `appointments` state would contain relevant appointments.
      const conflicts = appointments.some(appt => {
        const apptStartTime = new Date(`${format(appt.appointment_date, 'yyyy-MM-dd')}T${appt.start_time}:00`);
        const apptEndTime = new Date(`${format(appt.appointment_date, 'yyyy-MM-dd')}T${appt.end_time}:00`);

        // Check for overlap: [start1, end1) overlaps with [start2, end2) if start1 < end2 AND start2 < end1
        return (isBefore(slotStartDateTime, apptEndTime) && isBefore(apptStartTime, slotEndDateTime));
      });

      return !conflicts;
    });

    return filteredSlots;
  }, [selectedService, selectedProvider, selectedDate, services, appointments, settings]);


  const handleCreateAppointment = async () => {
    setIsProcessing(true);
    try {
      if (!service) {
        throw new Error("Serviço não encontrado");
      }

      const newAppointment = {
        company_id: settings.company_id,
        service_id: selectedService,
        provider_id: selectedProvider.id, // selectedProvider is an object
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_notes: clientInfo.notes,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        end_time: format(addMinutes(new Date(`1970-01-01T${selectedTime}:00`), service.duration_minutes), "HH:mm"),
        duration_minutes: service.duration_minutes,
        payment_status: service.price > 0 ? 'pendente' : 'isento',
        payment_amount: service.price,
        status: 'agendado'
      };

      const created = await Appointment.create(newAppointment);
      setAppointmentDetails(created);

      if (settings.payment_integration?.enabled && settings.payment_integration?.require_payment && service.price > 0) {
        setStep(4); // Go to payment step
      } else {
        toast({ title: "Agendamento realizado com sucesso!", description: "Seu agendamento foi registrado." });
        onBookingSuccess(created); // Inform parent component
        setStep(5); // Go to success step
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast({ title: "Erro ao realizar agendamento", description: error.message || "Por favor, tente novamente.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const updatedAppointment = await Appointment.update(appointmentDetails.id, {
        payment_status: 'pago',
        status: 'confirmado'
      });
      toast({ title: "Pagamento realizado com sucesso!", description: "Seu agendamento está confirmado." });
      onBookingSuccess(updatedAppointment); // Inform parent component
      setStep(5);
    } catch (error) {
      console.error("Erro ao atualizar agendamento após pagamento:", error);
      toast({ title: "Erro no pagamento", description: error.message || "Por favor, tente novamente.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Select Service & Provider
        return (
          <div className="space-y-4">
            <Select onValueChange={setSelectedService}>
              <SelectTrigger><SelectValue placeholder="Escolha um serviço" /></SelectTrigger>
              <SelectContent>{services.filter(s => s.is_active).map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.duration_minutes}min) {s.price > 0 ? ` - R$ ${s.price.toFixed(2)}` : ''}</SelectItem>)}</SelectContent>
            </Select>
            <Select onValueChange={providerId => setSelectedProvider(providers.find(p => p.id === providerId))} disabled={!selectedService}>
              <SelectTrigger><SelectValue placeholder="Escolha um profissional" /></SelectTrigger>
              <SelectContent>{providers.filter(p => p.is_active && p.services?.includes(selectedService)).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={() => setStep(2)} disabled={!selectedService || !selectedProvider}>Próximo</Button>
          </div>
        );
      case 2: // Select Date & Time
        return (
          <div className="flex flex-col md:flex-row gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => isBefore(date, addDays(new Date(), -1))} // Disable past dates
            />
            <div className="flex-1 space-y-2">
              <h4 className="font-medium">Horários disponíveis:</h4>
              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>{time}</Button>
                  ))
                ) : (
                  <p className="col-span-3 text-gray-500">Nenhum horário disponível para a data/profissional selecionado.</p>
                )}
              </div>
            </div>
          </div>
        );
      case 3: // Client Details
        return (
          <div className="space-y-4">
            <p>Você está agendando: <strong>{service?.name}</strong> com <strong>{selectedProvider?.name}</strong> em <strong>{format(selectedDate, 'dd/MM/yyyy')}</strong> às <strong>{selectedTime}</strong>.</p>
            {service?.price > 0 && <p className="text-lg font-bold">Valor: R$ {service.price.toFixed(2)}</p>}
            <div className="space-y-2">
              <Label htmlFor="clientName">Seu Nome</Label>
              <Input id="clientName" value={clientInfo.name} onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Seu Email</Label>
              <Input id="clientEmail" type="email" value={clientInfo.email} onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Seu Telefone</Label>
              <Input id="clientPhone" value={clientInfo.phone} onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientNotes">Observações (opcional)</Label>
              <Input id="clientNotes" value={clientInfo.notes} onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })} />
            </div>
          </div>
        );
      case 4: // Payment Step
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Pagamento</h2>
            <p className="mb-6">Para confirmar seu agendamento, por favor, realize o pagamento.</p>
            <Card className="mb-6 text-left">
              <CardContent className="p-4">
                <p><strong>Serviço:</strong> {service?.name}</p>
                <p><strong>Prestador:</strong> {selectedProvider?.name}</p>
                <p><strong>Data:</strong> {format(selectedDate, "PPP")}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p className="text-lg font-bold mt-4">Total: R$ {service?.price.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
              ) : (
                <><CreditCard className="mr-2 h-4 w-4" /> Pagar Agora (Simulado)</>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">Esta é uma simulação. Nenhum valor será cobrado.</p>
          </div>
        );
      case 5: // Success Step
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Agendamento Confirmado!</h2>
            <p className="text-lg">Seu agendamento para <strong>{service?.name}</strong> com <strong>{selectedProvider?.name}</strong> em <strong>{format(selectedDate, 'dd/MM/yyyy')}</strong> às <strong>{selectedTime}</strong> foi {(appointmentDetails?.payment_status === 'pago' || service?.price === 0) ? 'confirmado' : 'registrado'}.</p>
            {appointmentDetails?.payment_status === 'pendente' && (
              <p className="text-md text-yellow-600">O pagamento ainda está pendente. Por favor, finalize o pagamento ou entre em contato com o estabelecimento.</p>
            )}
            <Button onClick={() => { setStep(1); setSelectedTime(''); setSelectedService(null); setSelectedProvider(null); setClientInfo({ name: '', email: '', phone: '', notes: '' }); setAppointmentDetails(null); }} className="mt-4">
              Fazer Novo Agendamento
            </Button>
          </div>
        );
      default: return null;
    }
  }

  const businessName = settings?.business_name || "Nosso Espaço";
  const businessDescription = settings?.business_description || "Agende seu horário conosco.";

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl" style={{ color: settings?.primary_color }}>{businessName}</CardTitle>
        <p className="text-gray-600">{businessDescription}</p>
      </CardHeader>
      <CardContent>
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 1 && step < 5 && <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={isProcessing}>Voltar</Button>}
          {step === 2 && <Button onClick={() => setStep(3)} disabled={!selectedTime || isProcessing}>Próximo</Button>}
          {step === 3 && (
            <Button onClick={handleCreateAppointment} disabled={!clientInfo.name || !clientInfo.email || !clientInfo.phone || isProcessing}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Agendando...</>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>
          )}
          {step === 1 && <Button onClick={() => setStep(2)} disabled={!selectedService || !selectedProvider || isProcessing}>Próximo</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
