import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Calendar,
  User,
  Download,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  Grid3X3,
  List
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
  rascunho: { color: "bg-gray-100 text-gray-800", icon: FileText, label: "Rascunho" },
  pendente_aprovacao: { color: "bg-amber-100 text-amber-800", icon: Clock, label: "Pendente" },
  aprovado: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Aprovado" },
  rejeitado: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Rejeitado" },
  arquivado: { color: "bg-blue-100 text-blue-800", icon: Archive, label: "Arquivado" }
};

const GoogleDriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.457 9.416 8.74 3.028 5.023 9.416h7.434zm-3.07-5.83.15.266 3.454 6.01-1.65.953H5.068l-1.65-.953 3.454-6.01.15-.266z"/>
    <path d="M3.213 13.33 1.004 9.69h2.383l2.209 3.64-2.383.001zm11.782-3.64h2.383l-2.209 3.64-2.383-.001 2.209-3.64z"/>
  </svg>
);

export default function DocumentGrid({ documents, isLoading, onPreview }) {
  const [viewMode, setViewMode] = useState('grid');
  
  const handleDownload = (document) => {
    const url = document.document_type === 'google_drive' ? document.google_drive_link : document.file_url;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.file_name || 'documento'); 
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn("No URL available for download.", document);
      alert("Não foi possível baixar o documento. URL não disponível.");
    }
  };

  const handlePreview = (document) => {
    if (onPreview && typeof onPreview === 'function') {
      onPreview(document);
    } else {
      console.error("onPreview function not provided or not a function");
    }
  };

  const CardView = ({ document }) => {
    const status = statusConfig[document.status] || statusConfig.rascunho;
    return (
      <Card className="group flex flex-col h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50`}>
                {document.document_type === 'google_drive' ? <GoogleDriveIcon /> : <FileText className="w-5 h-5 text-blue-600"/>}
              </div>
              <Badge className={`${status.color} text-xs`}>{status.label}</Badge>
            </div>
            <h3 className="font-semibold text-gray-800 truncate">{document.title}</h3>
            <p className="text-xs text-gray-500 mt-1 capitalize">{document.category?.replace(/_/g, ' ')}</p>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3"/> <span>{document.created_by}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3 h-3"/> <span>{format(new Date(document.created_date), "dd/MM/yyyy")}</span>
            </div>
          </div>
        </CardContent>
        <div className="p-2 bg-gray-50/70 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePreview(document)}>
            <Eye className="w-4 h-4 text-blue-600"/>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(document)}>
            <Download className="w-4 h-4 text-gray-600"/>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4 text-gray-600"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePreview(document)}><Edit className="w-4 h-4 mr-2"/>Editar / Ver Detalhes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(document)}><Download className="w-4 h-4 mr-2"/>Baixar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  };
  
  const ListView = ({ document }) => {
    const status = statusConfig[document.status] || statusConfig.rascunho;
    return (
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-blue-50`}>
          {document.document_type === 'google_drive' ? <GoogleDriveIcon /> : <FileText className="w-4 h-4 text-blue-600"/>}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm truncate">{document.title}</p>
          <p className="text-xs text-gray-500">{document.created_by} • {format(new Date(document.created_date), "dd/MM/yyyy")}</p>
        </div>
        <Badge className={`${status.color} text-xs mx-4`}>{status.label}</Badge>
        <Badge variant="outline" className="text-xs mx-4 hidden md:block capitalize">{document.category?.replace(/_/g, ' ')}</Badge>
        <div className="flex gap-1 ml-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePreview(document)}>
            <Eye className="w-4 h-4 text-blue-600"/>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4 text-gray-600"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePreview(document)}><Edit className="w-4 h-4 mr-2"/>Editar / Ver Detalhes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(document)}><Download className="w-4 h-4 mr-2"/>Baixar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-48"/>)}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento neste diretório</h3>
        <p className="text-gray-500">Clique em "Novo Documento" para começar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex items-center p-1 bg-gray-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="gap-2">
            <Grid3X3 className="w-4 h-4"/> Grade
          </Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="gap-2">
            <List className="w-4 h-4"/> Lista
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map(doc => <CardView key={doc.id} document={doc}/>)}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => <ListView key={doc.id} document={doc}/>)}
        </div>
      )}
    </>
  );
}