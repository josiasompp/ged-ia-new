import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus, 
  Eye,
  FileCheck,
  User,
  Mail,
  Phone,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
// Supondo que você terá um modal de detalhes
// import HiringProcessDetails from './HiringProcessDetails'; 

export default function HiringManager({ 
  hiringProcesses, 
  employees, 
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const [selectedProcess, setSelectedProcess] = useState(null);

  const getStatusColor = (status) => {
    // ... (mesma função de antes)
    switch (status) {
      case 'iniciado': return 'bg-blue-100 text-blue-800';
      case 'documentos_pendentes': return 'bg-yellow-100 text-yellow-800';
      case 'em_analise': return 'bg-purple-100 text-purple-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'contratado': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    // ... (mesma função de antes)
     const labels = {
      'iniciado': 'Iniciado',
      'documentos_pendentes': 'Docs Pendentes',
      'em_analise': 'Em Análise',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado',
      'contratado': 'Contratado'
    };
    return labels[status] || status;
  };

  if (isLoading) {
    // ... (mesmo loading state de antes)
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // TODO: A lógica para aplicar o checklist deve rodar quando um novo processo de contratação é criado.
  // Como estamos na UI, simulamos aqui, mas idealmente isso é um trigger no backend.
  // Ex: const applyChecklist = async (hiringProcess) => { ... }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Processos de Contratação ({hiringProcesses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso Checklist</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hiringProcesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-12">
                    <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum processo em andamento</h3>
                    <p className="text-gray-500">Inicie um novo processo de contratação para aplicar checklists automaticamente.</p>
                  </TableCell>
                </TableRow>
              ) : (
                hiringProcesses.map((process) => {
                  const progress = process.checklist_progress?.completion_percentage || 0;
                  const completedItems = process.checklist_progress?.completed_items || 0;
                  const totalItems = process.checklist_progress?.total_items || 0;

                  return (
                    <TableRow 
                      key={process.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProcess(process)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{process.candidate_name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {process.candidate_email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{process.position}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(process.status)}>
                          {getStatusLabel(process.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="w-24 h-2" />
                          <span className="text-sm text-gray-600 font-medium">
                            {Math.round(progress)}%
                          </span>
                          <span className="text-xs text-gray-400">
                            ({completedItems}/{totalItems})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* {selectedProcess && (
        <HiringProcessDetails 
          process={selectedProcess} 
          onClose={() => setSelectedProcess(null)}
          onRefresh={onRefresh}
        />
      )} */}
    </div>
  );
}