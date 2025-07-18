import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, User, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingDashboard({ appointments, services, providers, stats, onRefresh }) {

  const upcomingAppointments = appointments
    .filter(a => new Date(a.appointment_date) >= new Date())
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);
  
  const getStatusColor = (status) => ({
    'agendado': 'bg-blue-100 text-blue-800',
    'confirmado': 'bg-green-100 text-green-800',
    'concluido': 'bg-gray-100 text-gray-800',
    'cancelado': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-200');

  // Prepare data for chart
  const serviceBookingCounts = services.map(service => ({
      name: service.name,
      bookings: appointments.filter(apt => apt.service_id === service.id).length
  })).sort((a,b) => b.bookings - a.bookings).slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard de Agendamentos</h2>
        <Button variant="outline" onClick={onRefresh} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar Dados
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum agendamento futuro.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map(apt => (
                    <TableRow key={apt.id}>
                      <TableCell>{apt.client_name}</TableCell>
                      <TableCell>{format(new Date(apt.appointment_date), 'dd/MM/yy')} às {apt.start_time.substring(0,5)}</TableCell>
                      <TableCell><Badge className={getStatusColor(apt.status)}>{apt.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceBookingCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#146FE0" name="Agendamentos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}