
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PhysicalDocumentForm from './PhysicalDocumentForm';
import { PhysicalDocument } from '@/api/entities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper for safe date formatting
const safeFormatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString.replace(/-/g, '/'));
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }
        return format(date, formatStr, { locale: ptBR });
    } catch (e) {
        console.error("Date formatting error for:", dateString, e);
        return 'Erro na data';
    }
};

export default function DocumentManager({ documents: initialDocuments = [], locations = [], onEdit, isLoading: initialIsLoading, compact = false }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDocument, setEditingDocument] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const itemsPerPage = compact ? 5 : 10;

  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  React.useEffect(() => {
    setIsLoading(initialIsLoading);
  }, [initialIsLoading]);

  const filteredDocuments = documents.filter(doc => {
    if (!doc) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.client_name?.toLowerCase().includes(searchLower) ||
      doc.company_name?.toLowerCase().includes(searchLower) ||
      doc.department?.toLowerCase().includes(searchLower) ||
      doc.box_description?.toLowerCase().includes(searchLower) ||
      doc.content_detail?.toLowerCase().includes(searchLower) ||
      doc.full_address?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditDocument = (doc) => {
    if (onEdit) {
      onEdit(doc);
    } else {
      setEditingDocument(doc);
      setIsFormOpen(true);
    }
  };
  
  const handleSaveDocument = async (docData) => {
    try {
      if (editingDocument) {
        await PhysicalDocument.update(editingDocument.id, docData);
      } else {
        await PhysicalDocument.create(docData);
      }
      setIsFormOpen(false);
      setEditingDocument(null);
      // Idealmente, onRefresh seria chamado aqui
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };
  
  const getDestructionStatusInfo = (doc) => {
    if (!doc) return { label: 'N/A', color: 'bg-gray-100 text-gray-800', icon: Clock };
    if (doc.is_permanent) {
      return { label: 'Permanente', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
    }
    if (!doc.destruction_date) {
      return { label: 'Não Definido', color: 'bg-gray-100 text-gray-800', icon: Package };
    }
    try {
        const destructionDate = new Date(doc.destruction_date.replace(/-/g, '/'));
        if (isNaN(destructionDate.getTime())) {
             return { label: 'Data Inválida', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0); // To compare dates only
        if (destructionDate < today) {
            return { label: 'Vencido', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
        } else {
            return { label: 'A Vencer', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
        }
    } catch(e) {
        return { label: 'Erro na Data', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
  };

  if (!compact && documents.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
          <p className="text-gray-500">Comece adicionando novos registros de documentos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        {!compact && (
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lista de Documentos</h3>
              <div className="w-full max-w-sm relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, empresa, conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className={compact ? "p-0" : "p-6"}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição da Caixa</TableHead>
                  <TableHead>Endereço Físico</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Status de Destruição</TableHead>
                  <TableHead>Status</TableHead>
                  {!compact && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={compact ? 6 : 7}><Skeleton className="h-8" /></TableCell>
                    </TableRow>
                  ))
                ) : currentDocuments.map((doc) => {
                  if (!doc) return null;
                  const destructionInfo = getDestructionStatusInfo(doc);
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.client_name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{doc.box_description}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{doc.content_detail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{doc.full_address}</TableCell>
                      <TableCell>{safeFormatDate(doc.entry_date)}</TableCell>
                      <TableCell>
                        <Badge className={`${destructionInfo.color} gap-1`}>
                          <destructionInfo.icon className="w-3 h-3" />
                          {destructionInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'arquivado' ? 'default' : 'secondary'}>{doc.status}</Badge>
                      </TableCell>
                      {!compact && (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditDocument(doc)}>
                              <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {!compact && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {isFormOpen && (
        <PhysicalDocumentForm
          document={editingDocument}
          locations={locations}
          onSave={handleSaveDocument}
          onClose={() => { setIsFormOpen(false); setEditingDocument(null); }}
        />
      )}
    </div>
  );
}
