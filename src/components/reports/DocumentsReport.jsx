
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle, Clock, AlertCircle, Archive } from "lucide-react";

const statusConfig = {
  rascunho: { label: "Rascunhos", icon: FileText, color: "bg-gray-100 text-gray-800" },
  pendente_aprovacao: { label: "Pendentes", icon: Clock, color: "bg-amber-100 text-amber-800" },
  aprovado: { label: "Aprovados", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  rejeitado: { label: "Rejeitados", icon: AlertCircle, color: "bg-red-100 text-red-800" },
  arquivado: { label: "Arquivados", icon: Archive, color: "bg-blue-100 text-blue-800" }
};

export default function DocumentsReport({ documents, isLoading }) {
  const getDocumentsByStatus = () => {
    const statusCounts = {};
    Object.keys(statusConfig).forEach(status => {
      statusCounts[status] = documents.filter(doc => doc.status === status).length;
    });
    return statusCounts;
  };

  const getDocumentsByCategory = () => {
    const categories = {};
    documents.forEach(doc => {
      const category = doc.category || 'outros';
      categories[category] = (categories[category] || 0) + 1;
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const statusCounts = getDocumentsByStatus();
  const topCategories = getDocumentsByCategory();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            Relatório de Documentos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Status Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Distribuição por Status</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                const percentage = documents.length > 0 ? (count / documents.length * 100).toFixed(1) : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={config.color}>{count}</Badge>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Principais Categorias</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {documents.length}
              </div>
              <div className="text-xs text-gray-500">Total de Documentos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.aprovado || 0}
              </div>
              <div className="text-xs text-gray-500">Aprovados</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
