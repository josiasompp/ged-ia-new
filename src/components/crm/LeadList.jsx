
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Phone, 
  Mail, 
  Building2, 
  Edit, 
  FileText, 
  MoreVertical,
  DollarSign,
  Calendar,
  User,
  CheckSquare // Added for the new "Criar Tarefa" option
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  novo: "bg-blue-100 text-blue-800",
  contatado: "bg-purple-100 text-purple-800",
  qualificado: "bg-green-100 text-green-800",
  interessado: "bg-yellow-100 text-yellow-800",
  proposta_enviada: "bg-orange-100 text-orange-800",
  negociacao: "bg-red-100 text-red-800",
  ganho: "bg-emerald-100 text-emerald-800",
  perdido: "bg-gray-100 text-gray-800"
};

export default function LeadList({ 
  leads, 
  onEditLead, 
  onConvertToProposal, 
  onCreateTask, // New prop
  onRefresh, 
  isLoading, 
  getRelatedData // New prop
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum lead encontrado
          </h3>
          <p className="text-gray-500">
            Comece adicionando seus primeiros leads para gerenciar seu pipeline de vendas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const relatedData = getRelatedData ? getRelatedData(lead.id) : { proposals: [], tasks: [], activities: [] };
        
        return (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 items-center gap-4">
                <div className="flex items-center gap-3 md:col-span-2">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                    {lead.company_name && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {lead.company_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="font-medium">Contato</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> 
                    <span className="truncate">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {lead.phone}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <div className="font-medium">Valor Estimado</div>
                  <div className="flex items-center gap-1 mt-1 text-green-600 font-semibold">
                    <DollarSign className="w-3 h-3" />
                    {formatCurrency(lead.estimated_value)}
                  </div>
                </div>

                <div className="flex flex-col items-start space-y-2"> {/* Added space-y-2 for spacing between badge groups */}
                  <Badge className={`${statusColors[lead.status]} text-xs`}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  
                  {/* Indicadores de relacionamento */}
                  <div className="flex gap-1">
                    {relatedData.proposals.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        {relatedData.proposals.length} Proposta(s)
                      </Badge>
                    )}
                    {relatedData.tasks.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {relatedData.tasks.length} Tarefa(s)
                      </Badge>
                    )}
                  </div>

                  {lead.next_followup && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(lead.next_followup), "dd/MM/yy", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditLead(lead)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onConvertToProposal(lead)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Criar Proposta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCreateTask(lead)}>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Criar Tarefa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
