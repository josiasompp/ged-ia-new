
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Calendar,
  User,
  Eye,
  Edit,
  Share2,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  rascunho: { 
    color: "bg-gray-100 text-gray-800", 
    icon: FileText, 
    label: "Rascunho" 
  },
  enviada: { 
    color: "bg-blue-100 text-blue-800", 
    icon: Share2, 
    label: "Enviada" 
  },
  visualizada: { 
    color: "bg-purple-100 text-purple-800", 
    icon: Eye, 
    label: "Visualizada" 
  },
  aceita: { 
    color: "bg-green-100 text-green-800", 
    icon: CheckCircle, 
    label: "Aceita" 
  },
  recusada: { 
    color: "bg-red-100 text-red-800", 
    icon: XCircle, 
    label: "Recusada" 
  },
  expirada: { 
    color: "bg-amber-100 text-amber-800", 
    icon: AlertTriangle, 
    label: "Expirada" 
  }
};

const categoryColors = {
  servicos: "border-l-blue-500",
  produtos: "border-l-green-500",
  consultoria: "border-l-purple-500",
  manutencao: "border-l-amber-500",
  outros: "border-l-gray-500"
};

export default function ProposalList({ proposals, isLoading, onEdit, onRefresh, currentUser }) {
  const handleShare = (proposal) => {
    if (proposal.share_link) {
      navigator.clipboard.writeText(proposal.share_link);
      // Aqui você poderia mostrar uma notificação de sucesso, e.g., toast message
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Dummy data for demonstration/development purposes when no proposals are provided
  const dummyProposals = [
    {
      id: "dummy-1",
      title: "Proposta de Consultoria para Startup X",
      client_name: "Startup X Ltda.",
      status: "enviada",
      category: "consultoria",
      created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      total_value: 15000,
      share_link: "https://example.com/proposta/dummy-startup-x"
    },
    {
      id: "dummy-2",
      title: "Orçamento de Desenvolvimento de Software",
      client_name: "Empresa Y S.A.",
      status: "rascunho",
      category: "servicos",
      created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      expiry_date: null,
      total_value: 25000,
      share_link: null
    },
    {
      id: "dummy-3",
      title: "Manutenção Preventiva de Equipamentos",
      client_name: "Indústria Z",
      status: "visualizada",
      category: "manutencao",
      created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      expiry_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (expired)
      total_value: 5000,
      share_link: "https://example.com/proposta/dummy-industria-z"
    },
    {
      id: "dummy-4",
      title: "Fornecimento de Produtos de Escritório",
      client_name: "Escritório Alfa",
      status: "aceita",
      category: "produtos",
      created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      expiry_date: null,
      total_value: 1200,
      share_link: "https://example.com/proposta/dummy-escritorio-alfa"
    },
    {
      id: "dummy-5",
      title: "Consultoria Estratégica em Marketing Digital",
      client_name: "Agência Digital Beta",
      status: "recusada",
      category: "consultoria",
      created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      expiry_date: null,
      total_value: 8000,
      share_link: "https://example.com/proposta/dummy-agencia-beta"
    },
    {
      id: "dummy-6",
      title: "Projeto de Design de Interiores para Residência",
      client_name: "Família Silva",
      status: "expirada",
      category: "outros",
      created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      expiry_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (expired)
      total_value: 18000,
      share_link: "https://example.com/proposta/dummy-familia-silva"
    }
  ];

  // If no proposals are provided and not loading, use dummy data
  const proposalsToDisplay = proposals.length === 0 && !isLoading ? dummyProposals : proposals;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-12 h-12 rounded-lg" />
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

  // If after considering dummy data, there are still no proposals, show the empty state message
  if (proposalsToDisplay.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-500">
            Crie sua primeira proposta comercial digital.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposalsToDisplay.map((proposal) => {
        const status = statusConfig[proposal.status] || statusConfig.rascunho;
        const StatusIcon = status.icon;
        const categoryColor = categoryColors[proposal.category] || categoryColors.outros;

        return (
          <Card key={proposal.id} className={`border-l-4 ${categoryColor} hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                      <Badge className={`${status.color} text-xs flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {proposal.client_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(proposal.created_date), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      {proposal.expiry_date && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-3 h-3" />
                          Expira em {format(new Date(proposal.expiry_date), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {proposal.category?.replace(/_/g, ' ')}
                      </Badge>
                      {proposal.total_value && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          {formatCurrency(proposal.total_value)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {proposal.share_link && (
                    <a href={proposal.share_link} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-700"
                        title="Visualizar Proposta"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(proposal)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild disabled={!proposal.share_link}>
                        <a 
                          href={proposal.share_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(proposal)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Copiar Link
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
