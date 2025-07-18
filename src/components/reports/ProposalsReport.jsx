
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSignature, TrendingUp, Eye, CheckCircle, XCircle } from "lucide-react";

export default function ProposalsReport({ proposals = [], isLoading }) {
  const getProposalStats = () => {
    const stats = {
      total: proposals.length,
      rascunho: proposals.filter(p => p.status === 'rascunho').length,
      enviada: proposals.filter(p => p.status === 'enviada').length,
      visualizada: proposals.filter(p => p.status === 'visualizada').length,
      aceita: proposals.filter(p => p.status === 'aceita').length,
      recusada: proposals.filter(p => p.status === 'recusada').length,
      totalValue: proposals.reduce((sum, p) => sum + (p.total_value || 0), 0),
      acceptedValue: proposals
        .filter(p => p.status === 'aceita')
        .reduce((sum, p) => sum + (p.total_value || 0), 0)
    };

    // Calculate conversion rate. The denominator includes all states that have moved past 'rascunho'.
    // If 'enviada' is 0, conversionRate is 0 to avoid division by zero.
    const denominator = stats.enviada + stats.visualizada + stats.aceita + stats.recusada;
    stats.conversionRate = denominator > 0 ?
      ((stats.aceita / denominator) * 100).toFixed(1) : 0;
    
    return stats;
  };

  const stats = getProposalStats();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FileSignature className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
            Relatório de Propostas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Status Overview */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Status das Propostas</h4>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <div className="text-lg font-bold text-blue-600">{stats.enviada}</div>
                <div className="text-xs text-blue-600">Enviadas</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-center">
                <div className="text-lg font-bold text-purple-600">{stats.visualizada}</div>
                <div className="text-xs text-purple-600">Visualizadas</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-center">
                <div className="text-lg font-bold text-green-600">{stats.aceita}</div>
                <div className="text-xs text-green-600">Aceitas</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50 text-center">
                <div className="text-lg font-bold text-red-600">{stats.recusada}</div>
                <div className="text-xs text-red-600">Recusadas</div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                <span className="font-medium text-amber-800">Valor Total</span>
                <span className="font-bold text-amber-600">
                  R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <span className="font-medium text-green-800">Valor Aceito</span>
                <span className="font-bold text-green-600">
                  R$ {stats.acceptedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="border-t pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats.conversionRate}% 
            </div>
            <div className="text-sm text-gray-500">Taxa de Conversão</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600">Performance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
