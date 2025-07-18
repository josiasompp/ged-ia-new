
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckSquare, 
  FileText,
  User,
  Calendar,
  Check,
  X,
  Clock,
  Eye,
  Building2,
  Folder,
  AlertCircle
} from "lucide-react";
import { Document } from "@/api/entities";
import { User as UserEntity } from "@/api/entities";
import { Department } from "@/api/entities";
import { Directory } from "@/api/entities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Approvals() {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [processingDoc, setProcessingDoc] = useState(null);
  const [approvedTodayCount, setApprovedTodayCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    loadUserAndDocs();
  }, []);

  const loadUserAndDocs = async () => {
    setIsLoading(true);
    try {
      const [user, pendingDocsData, depts, dirs, allDocs] = await Promise.all([
        UserEntity.me(),
        Document.filter({ status: 'pendente_aprovacao' }),
        Department.list(),
        Directory.list(),
        Document.list() // Fetch all documents to calculate statistics
      ]);
      
      setCurrentUser(user);
      setPendingDocs(pendingDocsData);
      setDepartments(depts);
      setDirectories(dirs);

      // Calculate statistics
      const today = new Date();
      // Set time to start of today for accurate comparison
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      // Set time to end of today for accurate comparison
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      let approvedCount = 0;
      let rejectedTotal = 0;

      allDocs.forEach(doc => {
        if (doc.status === 'aprovado' && doc.approved_at) {
          const approvedAtDate = new Date(doc.approved_at);
          if (approvedAtDate >= startOfDay && approvedAtDate <= endOfDay) {
            approvedCount++;
          }
        } else if (doc.status === 'rejeitado') {
          rejectedTotal++;
        }
      });

      setApprovedTodayCount(approvedCount);
      setRejectedCount(rejectedTotal);

    } catch (error) {
      console.error("Erro ao carregar dados de aprovação:", error);
    }
    setIsLoading(false);
  };

  const handleDecision = async (document, decision) => {
    setProcessingDoc(document.id);
    const updateData = { status: decision === 'approve' ? 'aprovado' : 'rejeitado' };
    
    if (decision === 'approve') {
      updateData.approved_by = currentUser.email;
      updateData.approved_at = new Date().toISOString();
      updateData.rejected_by = null; // Clear rejected fields if previously set
      updateData.rejected_at = null;
    } else { // 'reject'
      updateData.rejected_by = currentUser.email;
      updateData.rejected_at = new Date().toISOString();
      updateData.approved_by = null; // Clear approved fields if previously set
      updateData.approved_at = null;
    }
    
    try {
      await Document.update(document.id, updateData);
      
      loadUserAndDocs(); // Recarrega a lista e as estatísticas
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
    }
    setProcessingDoc(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'Departamento não encontrado';
  };

  const getDirectoryName = (dirId) => {
    const dir = directories.find(d => d.id === dirId);
    return dir?.name || 'Diretório não encontrado';
  };

  const getDocumentPath = (document) => {
    const deptName = getDepartmentName(document.department_id);
    const dirName = getDirectoryName(document.directory_id);
    return `${deptName} > ${dirName}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Workflow de Aprovações
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Revise e aprove os documentos pendentes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
            <Clock className="w-4 h-4" />
            {pendingDocs.length} pendentes
          </Badge>
          <Button 
            variant="outline"
            onClick={loadUserAndDocs}
            className="gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-amber-50">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white"/>
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#F59E0B] bg-clip-text text-transparent font-bold">
              Documentos Pendentes de Aprovação
            </span>
            <Badge variant="secondary" className="ml-2">{pendingDocs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      Carregando aprovações...
                    </div>
                  </TableCell>
                </TableRow>
              ) : pendingDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12">
                    <Check className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum documento pendente
                    </h3>
                    <p className="text-gray-500">
                      Todos os documentos foram aprovados ou não há documentos aguardando aprovação.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                pendingDocs.map(doc => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          {doc.document_type === 'google_drive' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-blue-600">
                              <path d="M12.457 9.416 8.74 3.028 5.023 9.416h7.434zm-3.07-5.83.15.266 3.454 6.01-1.65.953H5.068l-1.65-.953 3.454-6.01.15-.266z"/>
                              <path d="M3.213 13.33 1.004 9.69h2.383l2.209 3.64-2.383.001zm11.782-3.64h2.383l-2.209 3.64-2.383-.001 2.209-3.64z"/>
                            </svg>
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{doc.title}</div>
                          {doc.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {doc.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate max-w-xs">{getDocumentPath(doc)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{doc.created_by}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{format(new Date(doc.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {doc.category?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const url = doc.document_type === 'google_drive' ? doc.google_drive_link : doc.file_url;
                            window.open(url, '_blank');
                          }} 
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" /> Ver
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleDecision(doc, 'approve')} 
                          disabled={processingDoc === doc.id}
                          className="gap-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                        >
                          {processingDoc === doc.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Aprovar
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleDecision(doc, 'reject')}
                          disabled={processingDoc === doc.id}
                          className="gap-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                        >
                          {processingDoc === doc.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Seção de Estatísticas */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{pendingDocs.length}</div>
                  <p className="text-sm text-gray-500">Pendentes de Aprovação</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{approvedTodayCount}</div>
                  <p className="text-sm text-gray-500">Aprovados Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{rejectedCount}</div>
                  <p className="text-sm text-gray-500">Rejeitados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
