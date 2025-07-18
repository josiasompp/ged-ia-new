
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Calendar,
  User,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  rascunho: { color: "bg-gray-100 text-gray-800", icon: FileText, label: "Rascunho" },
  pendente_aprovacao: { color: "bg-amber-100 text-amber-800", icon: Clock, label: "Pendente" },
  aprovado: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Aprovado" },
  rejeitado: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Rejeitado" },
  arquivado: { color: "bg-blue-100 text-blue-800", icon: Archive, label: "Arquivado" }
};

const categoryColors = {
  contrato: "border-l-blue-500",
  nota_fiscal: "border-l-green-500",
  relatorio: "border-l-purple-500",
  procedimento: "border-l-amber-500",
  politica: "border-l-red-500",
  certificado: "border-l-indigo-500",
  outros: "border-l-gray-500"
};

export default function RecentDocuments({ documents, isLoading, onRefresh, onPreview }) {
  return (
    <Card className="shadow-sm border-0 bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-[#146FE0] to-[#04BF7B] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
              Documentos Recentes
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
          >
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum documento encontrado</p>
            </div>
          ) : (
            documents.slice(0, 8).map((document) => {
              const status = statusConfig[document.status] || statusConfig.rascunho;
              const StatusIcon = status.icon;

              return (
                <div key={document.id} className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 ${categoryColors[document.category] || categoryColors.outros} bg-gray-50 hover:bg-gray-100 transition-colors`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-firstdocy-blue" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {document.title}
                      </h4>
                      <Badge variant="secondary" className={`${status.color} text-xs flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(document.created_date), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {document.created_by}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {document.category?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-firstdocy-blue hover:text-white hover:bg-firstdocy-blue"
                      onClick={() => onPreview(document)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
