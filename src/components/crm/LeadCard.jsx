import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function LeadCard({ lead, user, index, onEdit, provided, snapshot }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const responsibleUser = user;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-3"
    >
      <Card className={`bg-white hover:shadow-lg transition-shadow duration-200 ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-3 space-y-2">
          <h4 className="font-semibold text-sm text-gray-800 leading-tight">{lead.name}</h4>
          <p className="text-sm font-bold text-green-600">{formatCurrency(lead.estimated_value)}</p>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Fonte: <span className="font-medium text-gray-700">{lead.source?.replace('_', ' ')}</span></p>
            {lead.company_name && <p>Empresa: <span className="font-medium text-gray-700">{lead.company_name}</span></p>}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-2">
               {responsibleUser ? (
                <Avatar className="w-6 h-6">
                  <AvatarFallback>{responsibleUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
               ) : (
                <Avatar className="w-6 h-6"><AvatarFallback><User className="w-4 h-4" /></AvatarFallback></Avatar>
               )}
              <span className="text-xs font-medium text-gray-600">{responsibleUser?.full_name || 'Não atribuído'}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => onEdit(lead)}>
              Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}