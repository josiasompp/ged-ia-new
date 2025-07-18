
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Search, Edit, Eye, Trash2, PlusCircle, Repeat } from 'lucide-react'; // Added PlusCircle, Repeat
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Label } from '@/components/ui/label'; // Added Label

// Import the RecurrenceSettings component and entity
import RecurrenceSettings from './RecurrenceSettings'; // Assuming this path is correct
// Mock classes for demonstration. In a real application, these would be imported from your backend/ORM layer.
// This is done to ensure the provided code is syntactically valid and runnable within this single file context.
// In a real project, these would typically be in separate files like '@/api/entities' and '@/api/entities'
class Appointment {
  static async create(data) {
    console.log('Mock Appointment.create:', data);
    // Simulate API call delay and return a mock object
    return new Promise(resolve => setTimeout(() => resolve({ id: `apt-${Date.now()}`, ...data }), 500));
  }
  static async bulkCreate(dataArray) {
    console.log('Mock Appointment.bulkCreate:', dataArray);
    // Simulate API call delay and return mock objects
    return new Promise(resolve => setTimeout(() => resolve(dataArray.map((data, index) => ({ id: `apt-${Date.now()}-${index}`, ...data }))), 500));
  }
}

class RecurrencePattern {
  static async create(data) {
    console.log('Mock RecurrencePattern.create:', data);
    // Simulate API call delay and return a mock object
    return new Promise(resolve => setTimeout(() => resolve({ id: `rp-${Date.now()}`, ...data }), 500));
  }
}


export default function AppointmentManager({
  appointments,
  services,
  providers,
  onRefresh,
  isLoading,
  settings, // New prop
  currentUser // New prop
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // New states for form management and recurrence
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Used for edit mode
  const [appointmentData, setAppointmentData] = useState({
    service_id: '',
    provider_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    appointment_date: '',
    start_time: '',
    duration_minutes: 60,
    status: 'agendado'
  });
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceData, setRecurrenceData] = useState({
    pattern_type: '', // e.g., 'daily', 'weekly', 'monthly', 'yearly'
    interval: 1, // Every 'interval' days/weeks/months/years
    end_type: 'never', // 'never', 'on_date', 'after_occurrences'
    end_date: '', // specific end date for 'on_date'
    max_occurrences: 0 // number of occurrences for 'after_occurrences'
  });

  const getStatusColor = (status) => {
    const colors = {
      'agendado': 'bg-blue-100 text-blue-800',
      'confirmado': 'bg-green-100 text-green-800',
      'concluido': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-200';
  };

  const filteredAppointments = appointments.filter(apt => {
    const term = searchTerm.toLowerCase();
    const clientMatch = apt.client_name.toLowerCase().includes(term);
    const emailMatch = apt.client_email.toLowerCase().includes(term);
    const service = services.find(s => s.id === apt.service_id);
    const serviceMatch = service?.name.toLowerCase().includes(term);
    const provider = providers.find(p => p.id === apt.provider_id);
    const providerMatch = provider?.name.toLowerCase().includes(term);

    const statusMatch = statusFilter === 'all' || apt.status === statusFilter;

    return (clientMatch || emailMatch || serviceMatch || providerMatch) && statusMatch;
  });

  // Helper to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to handle select changes
  const handleSelectChange = (name, value) => {
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentData.service_id || !appointmentData.provider_id ||
      !appointmentData.appointment_date || !appointmentData.start_time) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      // Criar agendamento principal
      const appointmentToCreate = {
        ...appointmentData,
        company_id: currentUser?.company_id || "default_company_id", // Using a default if currentUser or company_id is missing
        appointment_number: `APT-${Date.now()}`,
        is_recurring: showRecurrence && recurrenceData.pattern_type !== '',
        booking_type: "admin"
      };

      const createdAppointment = await Appointment.create(appointmentToCreate);

      // Se tem recorrência, criar o padrão e agendamentos adicionais
      if (showRecurrence && recurrenceData.pattern_type) {
        const pattern = await RecurrencePattern.create({
          company_id: currentUser?.company_id || "default_company_id",
          appointment_id: createdAppointment.id,
          service_id: appointmentData.service_id,
          ...recurrenceData
        });

        // Gerar agendamentos recorrentes
        await generateRecurringAppointments(createdAppointment, pattern);
      }

      setShowForm(false);
      setAppointmentData({
        service_id: '',
        provider_id: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        appointment_date: '',
        start_time: '',
        duration_minutes: 60,
        status: 'agendado'
      });
      setRecurrenceData({
        pattern_type: '',
        interval: 1,
        end_type: 'never',
        end_date: '',
        max_occurrences: 0
      });
      setShowRecurrence(false);
      onRefresh(); // Refresh the list of appointments
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
    setIsSaving(false);
  };

  const generateRecurringAppointments = async (baseAppointment, pattern) => {
    const appointmentsToCreate = [];
    let currentDate = new Date(baseAppointment.appointment_date + 'T' + baseAppointment.start_time); // Combine date and time for accurate date operations
    const maxOccurrences = pattern.end_type === 'after_occurrences' ? pattern.max_occurrences : 100; // Cap to 100 or user specified
    const endDate = pattern.end_type === 'on_date' && pattern.end_date ? new Date(pattern.end_date) : null;

    for (let i = 1; i < maxOccurrences; i++) {
      let nextDate = new Date(currentDate); // Create a copy to avoid modifying original currentDate directly
      let breakLoop = false;

      // Calculate próxima data baseada no padrão
      switch (pattern.pattern_type) {
        case 'daily':
          nextDate.setDate(currentDate.getDate() + (pattern.interval || 1));
          break;
        case 'weekly':
          nextDate.setDate(currentDate.getDate() + (7 * (pattern.interval || 1)));
          break;
        case 'monthly':
          nextDate.setMonth(currentDate.getMonth() + (pattern.interval || 1));
          break;
        case 'yearly':
          nextDate.setFullYear(currentDate.getFullYear() + (pattern.interval || 1));
          break;
        default:
          breakLoop = true; // Invalid pattern, break out
          break;
      }

      if (breakLoop) break;

      // Check for end conditions
      if (pattern.end_type === 'on_date' && endDate && nextDate > endDate) break;
      if (pattern.end_type === 'after_occurrences' && i >= maxOccurrences) break;

      appointmentsToCreate.push({
        ...baseAppointment,
        id: undefined, // Remove the ID to create a new entry
        appointment_number: `APT-${Date.now()}-${i}`,
        appointment_date: format(nextDate, 'yyyy-MM-dd'), // Format date back to 'YYYY-MM-DD'
        recurrence_pattern_id: pattern.id,
        parent_appointment_id: baseAppointment.id,
        occurrence_number: i + 1,
        is_recurring: true,
        status: 'agendado' // Default status for recurring appointments
      });
      currentDate = nextDate; // Update currentDate for next iteration
    }

    // Create all appointments in batch
    if (appointmentsToCreate.length > 0) {
      await Appointment.bulkCreate(appointmentsToCreate);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Gerenciar Agendamentos ({appointments.length})
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </CardHeader>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Nome do Cliente</Label>
                  <Input id="client_name" name="client_name" value={appointmentData.client_name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="client_email">Email do Cliente</Label>
                  <Input id="client_email" name="client_email" type="email" value={appointmentData.client_email} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="client_phone">Telefone do Cliente</Label>
                  <Input id="client_phone" name="client_phone" value={appointmentData.client_phone} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="service_id">Serviço</Label>
                  <Select name="service_id" value={appointmentData.service_id} onValueChange={(value) => handleSelectChange('service_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="provider_id">Prestador</Label>
                  <Select name="provider_id" value={appointmentData.provider_id} onValueChange={(value) => handleSelectChange('provider_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um prestador" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="appointment_date">Data</Label>
                  <Input id="appointment_date" name="appointment_date" type="date" value={appointmentData.appointment_date} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="start_time">Hora de Início</Label>
                  <Input id="start_time" name="start_time" type="time" value={appointmentData.start_time} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="duration_minutes">Duração (minutos)</Label>
                  <Input id="duration_minutes" name="duration_minutes" type="number" value={appointmentData.duration_minutes} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" value={appointmentData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nova seção de recorrência */}
              {!selectedAppointment && ( // Recurrence only for new appointments
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={showRecurrence}
                      onCheckedChange={setShowRecurrence}
                    />
                    <Label htmlFor="recurring" className="flex items-center gap-2">
                      <Repeat className="w-4 h-4" />
                      Criar agendamento recorrente
                    </Label>
                  </div>

                  {showRecurrence && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Repeat className="w-4 h-4 text-blue-600" />
                          Configurações de Recorrência
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RecurrenceSettings
                          recurrenceData={recurrenceData}
                          onChange={setRecurrenceData}
                          startDate={appointmentData.appointment_date}
                          service={services.find(s => s.id === appointmentData.service_id)}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Form buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : (selectedAppointment ? 'Atualizar Agendamento' : 'Criar Agendamento')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por cliente, serviço, prestador..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Prestador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan="6" className="text-center">Carregando agendamentos...</TableCell></TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow><TableCell colSpan="6" className="text-center py-12">Nenhum agendamento encontrado.</TableCell></TableRow>
              ) : (
                filteredAppointments.map(apt => {
                  const service = services.find(s => s.id === apt.service_id);
                  const provider = providers.find(p => p.id === apt.provider_id);
                  return (
                    <TableRow key={apt.id}>
                      <TableCell>
                        <div className="font-medium">{apt.client_name}</div>
                        <div className="text-sm text-gray-500">{apt.client_email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{format(new Date(apt.appointment_date), 'dd/MM/yyyy')}</div>
                        <div className="text-sm text-gray-500">{apt.start_time.substring(0, 5)} - {apt.end_time ? apt.end_time.substring(0, 5) : 'N/A'}</div>
                      </TableCell>
                      <TableCell>{service?.name || 'N/A'}</TableCell>
                      <TableCell>{provider?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" className="ml-2"><Edit className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
