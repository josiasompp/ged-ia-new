import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ServiceOrderPDF({ order, company, clientUser }) {
  const statusConfig = {
    solicitada: { label: 'Solicitada', color: 'bg-blue-100 text-blue-800' },
    em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-800' },
    em_transito: { label: 'Em Trânsito', color: 'bg-orange-100 text-orange-800' },
    concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
    cancelada: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
  };

  const InfoBlock = ({ label, value }) => (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="bg-white p-8 font-sans">
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">FIRSTDOCY</h1>
          <p className="text-gray-600">Gestão Eletrônica de Documentos</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">Ordem de Serviço #{order.order_number}</h2>
          <p className="text-sm text-gray-500">
            {format(new Date(order.created_date), "'Gerado em' dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-4 my-6">
        <InfoBlock label="OS Número" value={order.order_number} />
        <InfoBlock label="Data" value={format(new Date(order.request_date), 'dd/MM/yyyy', { locale: ptBR })} />
        <InfoBlock label="Hora" value={format(new Date(order.request_date), 'HH:mm:ss', { locale: ptBR })} />
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
          <Badge className={`mt-1 text-sm ${statusConfig[order.status]?.color}`}>
            {statusConfig[order.status]?.label}
          </Badge>
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-bold mb-2">Cliente</h3>
        <div className="grid grid-cols-4 gap-4">
          <InfoBlock label="Nome Fantasia" value={company?.name} />
          <InfoBlock label="Razão Social" value={company?.razao_social || 'N/A'} />
          <InfoBlock label="CPF/CNPJ" value={company?.cnpj} />
          <InfoBlock label="IE/RG" value={company?.ie || 'N/A'} />
        </div>
      </section>
      
      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-bold mb-2">Solicitante</h3>
        <div className="grid grid-cols-3 gap-4">
          <InfoBlock label="Solicitante" value={clientUser?.full_name} />
          <InfoBlock label="Telefone" value={clientUser?.phone || 'N/A'} />
          <InfoBlock label="Email" value={clientUser?.email} />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold mb-2">Serviços e Itens Solicitados</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-sm font-semibold">ID/Endereço</th>
              <th className="border p-2 text-left text-sm font-semibold">Descrição do Item/Serviço</th>
              <th className="border p-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {order.requested_items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 text-sm">{item.address || `#${index + 1}`}</td>
                <td className="border p-2 text-sm">{item.description}</td>
                <td className="border p-2 text-sm">
                  <Badge variant="outline">{order.service_type.replace(/_/g, ' ')}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <div>
          <h4 className="font-bold">Observações do Cliente</h4>
          <p className="text-sm p-2 bg-gray-50 rounded-md mt-1">{order.notes_client || 'Nenhuma observação.'}</p>
        </div>
        <div>
          <h4 className="font-bold">Histórico e Observações de Status</h4>
          <div className="text-sm p-2 bg-gray-50 rounded-md mt-1 space-y-2">
            {(order.history || []).map((entry, index) => (
              <p key={index} className="text-xs">
                <strong>{format(new Date(entry.timestamp), 'dd/MM/yy HH:mm', { locale: ptBR })}:</strong> {entry.notes} ({entry.changed_by})
              </p>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-20 pt-8 flex justify-around border-t-2 border-dashed">
        <div className="text-center">
          <div className="h-12"></div>
          <p className="border-t border-gray-400 pt-2 text-sm">Assinatura Conferente</p>
        </div>
        <div className="text-center">
          <div className="h-12"></div>
          <p className="border-t border-gray-400 pt-2 text-sm">Assinatura Transportador</p>
        </div>
        <div className="text-center">
          <div className="h-12"></div>
          <p className="border-t border-gray-400 pt-2 text-sm">Assinatura Recebedor</p>
        </div>
      </footer>
    </div>
  );
}