import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ServiceOrderPrintView({ order, company }) {
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      solicitada: 'SOLICITADA',
      em_atendimento: 'EM ATENDIMENTO',
      em_transito: 'EM TRÂNSITO',
      concluida: 'CONCLUÍDA',
      cancelada: 'CANCELADA'
    };
    return statusLabels[status] || status.toUpperCase();
  };

  const getServiceTypeLabel = (type) => {
    const serviceTypes = {
      retirada_entrega: 'RETIRADA/ENTREGA',
      recolhimento: 'RECOLHIMENTO',
      descarte_seguro: 'DESCARTE SEGURO',
      digitalizacao: 'DIGITALIZAÇÃO'
    };
    return serviceTypes[type] || type.toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-right mb-6">
        <div className="text-sm">{formatDate(new Date())}</div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Ordem de Serviço # {order.order_number}</h1>
        <div className="mt-2 text-sm">
          OS número: {order.order_number} | Data: {formatDateTime(order.request_date)} | Status: {getStatusLabel(order.status)}
        </div>
      </div>

      {/* Cliente Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Cliente</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left text-sm">Nome Fantasia</th>
              <th className="border border-gray-300 p-2 text-left text-sm">Razão Social</th>
              <th className="border border-gray-300 p-2 text-left text-sm">CPF/CNPJ</th>
              <th className="border border-gray-300 p-2 text-left text-sm">IE/RG</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">{company?.name || order.client_user_email}</td>
              <td className="border border-gray-300 p-2 text-sm">{company?.name || '-'}</td>
              <td className="border border-gray-300 p-2 text-sm">{company?.cnpj || '-'}</td>
              <td className="border border-gray-300 p-2 text-sm">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Solicitante Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Solicitante</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left text-sm">Solicitante</th>
              <th className="border border-gray-300 p-2 text-left text-sm">Telefone</th>
              <th className="border border-gray-300 p-2 text-left text-sm">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">{order.contact_person || order.client_user_email}</td>
              <td className="border border-gray-300 p-2 text-sm">{order.contact_phone || '-'}</td>
              <td className="border border-gray-300 p-2 text-sm">{order.client_user_email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Documento Section */}
      {order.requested_items && order.requested_items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Documentos/Itens Solicitados</h2>
          <div className="border border-gray-300 p-3">
            {order.requested_items.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="text-sm font-medium">
                  {item.description}
                  {item.address && <span className="text-gray-600 ml-2">({item.address})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Serviços Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Serviços</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left text-sm">ID</th>
              <th className="border border-gray-300 p-2 text-left text-sm">Serviço</th>
              <th className="border border-gray-300 p-2 text-left text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-sm">{order.order_number}</td>
              <td className="border border-gray-300 p-2 text-sm">{getServiceTypeLabel(order.service_type)}</td>
              <td className="border border-gray-300 p-2 text-sm">{getStatusLabel(order.status)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Observações */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Observações</h2>
        <div className="border border-gray-300 p-3 min-h-16 text-sm">
          {order.notes_client || 'Nenhuma observação registrada.'}
        </div>
      </div>

      {/* Observações de status */}
      {order.notes_internal && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Observações de Status</h2>
          <div className="border border-gray-300 p-3 min-h-16 text-sm">
            {order.notes_internal}
          </div>
        </div>
      )}

      {/* Endereço de Entrega */}
      {order.delivery_address && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">Endereço de Entrega/Recolhimento</h2>
          <div className="border border-gray-300 p-3 text-sm">
            {order.delivery_address}
          </div>
        </div>
      )}

      {/* Signature Section */}
      <div className="mt-12">
        <div className="border-t border-gray-300 pt-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="border-b border-gray-300 mb-2 pb-1">____/____/____</div>
              <div className="text-sm">Hora: ____:____</div>
              <div className="text-xs mt-2">Assinatura Conferente</div>
            </div>
            <div>
              <div className="border-b border-gray-300 mb-2 pb-1">____/____/____</div>
              <div className="text-sm">Hora: ____:____</div>
              <div className="text-xs mt-2">Assinatura Transportador</div>
            </div>
            <div>
              <div className="border-b border-gray-300 mb-2 pb-1">____/____/____</div>
              <div className="text-sm">Hora: ____:____</div>
              <div className="text-xs mt-2">Assinatura Recebedor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}