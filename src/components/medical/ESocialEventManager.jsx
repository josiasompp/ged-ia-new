import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  FileText,
  RefreshCw
} from 'lucide-react';

const ESOCIAL_EVENTS = {
  'S-2220': {
    name: 'S-2220 - Monitoramento da Saúde do Trabalhador',
    description: 'Comunicação dos resultados de exames médicos ocupacionais'
  },
  'S-2240': {
    name: 'S-2240 - Condições Ambientais do Trabalho - Agentes Nocivos',
    description: 'Informações sobre condições ambientais de trabalho'
  }
};

const EVENT_STATUS = {
  'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'enviado': { label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: Upload },
  'processado': { label: 'Processado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'rejeitado': { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function ESocialEventManager({ exams, employees, currentUser, onRefresh, isLoading }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Obter exames que precisam gerar eventos eSocial
  const examsNeedingEvents = exams.filter(exam => 
    exam.status === 'concluido' && 
    exam.aso_document &&
    (!exam.esocial_events || exam.esocial_events.length === 0)
  );

  // Obter todos os eventos eSocial existentes
  const allESocialEvents = exams
    .filter(exam => exam.esocial_events && exam.esocial_events.length > 0)
    .flatMap(exam => 
      exam.esocial_events.map(event => ({
        ...event,
        exam_id: exam.id,
        employee_id: exam.employee_id,
        exam_type: exam.exam_type
      }))
    );

  const handleGenerateEvents = async () => {
    setIsGenerating(true);
    try {
      // Simulação da geração de eventos eSocial
      console.log('Gerando eventos eSocial para', examsNeedingEvents.length, 'exames');
      
      // Aqui seria feita a geração real dos XMLs eSocial
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onRefresh();
    } catch (error) {
      console.error('Erro ao gerar eventos:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEvents = async () => {
    setIsSending(true);
    try {
      const pendingEvents = allESocialEvents.filter(event => event.status === 'pendente');
      console.log('Enviando', pendingEvents.length, 'eventos para o eSocial');
      
      // Aqui seria feito o envio real para o eSocial
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onRefresh();
    } catch (error) {
      console.error('Erro ao enviar eventos:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Eventos eSocial</h2>
          <p className="text-gray-600">Geração e envio de eventos de saúde ocupacional</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateEvents}
            disabled={isGenerating || examsNeedingEvents.length === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Gerar Eventos ({examsNeedingEvents.length})
          </Button>
          <Button 
            onClick={handleSendEvents}
            disabled={isSending || allESocialEvents.filter(e => e.status === 'pendente').length === 0}
            className="gap-2"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Enviar Eventos
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allESocialEvents.filter(e => e.status === 'pendente').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allESocialEvents.filter(e => e.status === 'enviado').length}
                </p>
              </div>
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processados</p>
                <p className="text-2xl font-bold text-green-600">
                  {allESocialEvents.filter(e => e.status === 'processado').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">
                  {allESocialEvents.filter(e => e.status === 'rejeitado').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {examsNeedingEvents.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Existem {examsNeedingEvents.length} exames concluídos que precisam gerar eventos eSocial.
            Clique em "Gerar Eventos" para criar os XMLs automaticamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Eventos eSocial</CardTitle>
        </CardHeader>
        <CardContent>
          {allESocialEvents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum evento eSocial encontrado</p>
              <p className="text-sm text-gray-400 mt-2">
                Os eventos serão gerados automaticamente quando os exames forem concluídos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo de Evento</TableHead>
                    <TableHead>Tipo de Exame</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allESocialEvents.map((event, index) => {
                    const employee = getEmployee(event.employee_id);
                    const eventInfo = ESOCIAL_EVENTS[event.event_type];
                    const statusInfo = EVENT_STATUS[event.status];
                    const StatusIcon = statusInfo?.icon || Clock;

                    return (
                      <TableRow key={`${event.exam_id}-${index}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                              {employee?.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'FU'}
                            </div>
                            <div>
                              <p className="font-medium">{employee?.full_name || 'Funcionário não encontrado'}</p>
                              <p className="text-sm text-gray-500">{employee?.position}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.event_type}</p>
                            <p className="text-sm text-gray-500">{eventInfo?.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {event.exam_type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDateTime(event.sent_date)}
                        </TableCell>
                        <TableCell>
                          {event.receipt_number || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                            {event.status === 'rejeitado' && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Types Info */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Eventos eSocial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(ESOCIAL_EVENTS).map(([key, eventInfo]) => (
              <div key={key} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{eventInfo.name}</h4>
                <p className="text-sm text-gray-600">{eventInfo.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}