import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EmailLogs({ logs, onRefresh, isLoading }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'retry':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { label: 'Enviado', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', className: 'bg-red-100 text-red-800' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      retry: { label: 'Tentando', className: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.to_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.to_name && log.to_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header e Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Histórico de Emails</h3>
          <p className="text-gray-600">Acompanhe todos os emails enviados pelo sistema</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por email, assunto ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'sent', 'failed', 'pending'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="gap-2"
                >
                  {status !== 'all' && getStatusIcon(status)}
                  {status === 'all' ? 'Todos' : 
                   status === 'sent' ? 'Enviados' :
                   status === 'failed' ? 'Falharam' : 'Pendentes'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <div className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))
        ) : filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum email encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Ainda não há emails enviados pelo sistema.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{log.subject}</h4>
                      {getStatusBadge(log.status)}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Para:</strong> {log.to_name ? `${log.to_name} <${log.to_email}>` : log.to_email}</p>
                      
                      {log.cc_emails && log.cc_emails.length > 0 && (
                        <p><strong>Cópia:</strong> {log.cc_emails.join(', ')}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {log.sent_at 
                              ? format(new Date(log.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                              : format(new Date(log.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            }
                          </span>
                        </div>
                        
                        {log.triggered_by && (
                          <Badge variant="outline" className="text-xs">
                            {log.triggered_by}
                          </Badge>
                        )}
                        
                        {log.retry_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {log.retry_count} tentativas
                          </Badge>
                        )}
                      </div>

                      {log.error_message && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-red-700 text-xs">
                            <strong>Erro:</strong> {log.error_message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Aqui você pode implementar visualização do email
                        alert('Funcionalidade de visualização em desenvolvimento');
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}