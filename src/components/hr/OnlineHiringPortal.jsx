import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ChevronDown, 
  ChevronRight,
  User,
  FileText,
  MapPin,
  MessageSquare,
  BookOpen,
  Award,
  Star,
  Sprout,
  Circle,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Monitor,
  FileCheck,
  Upload,
  Download,
  Eye,
  Settings,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { HiringProcess } from '@/api/entities';
import { HrDocumentType } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { useToast } from "@/components/ui/use-toast";

// --- Componentes Internos ---

const OnlineHiringSidebar = ({ onSectionChange, process }) => {
  const sideMenuItems = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'pessoais', label: 'Dados Pessoais', icon: FileText },
    { id: 'endereco', label: 'Endereço', icon: MapPin },
    { id: 'social', label: 'Social', icon: MessageSquare },
    { id: 'documentos', label: 'Documentos', icon: BookOpen, active: true },
    { id: 'formacao', label: 'Formação', icon: Award },
    { id: 'cursos', label: 'Cursos', icon: Star },
    { id: 'habilidades', label: 'Habilidades', icon: Sprout },
    { id: 'cond_especiais', label: 'Cond. Especiais', icon: Circle },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2 flex-shrink-0">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 text-sm">Contratação Online</h3>
        <p className="text-xs text-blue-600 mt-1 truncate">
          {process?.candidate_name || 'Selecione um processo'}
        </p>
      </div>
      
      {sideMenuItems.map(item => (
        <Button
          key={item.id}
          variant={item.active ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => onSectionChange(item.id)}
          disabled={!process}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Button>
      ))}
    </div>
  );
};

const DocumentCategory = ({ category, onDocumentUpload }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleTriggerUpload = (doc) => {
    setUploadingDoc(doc);
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && uploadingDoc) {
      await onDocumentUpload(uploadingDoc, file);
      setUploadingDoc(null);
    }
    // Reset file input
    event.target.value = null;
  };

  const statusConfig = {
    pendente: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    parcial: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    completo: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    anexado: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
  };
  
  const config = statusConfig[category.status] || statusConfig.pendente;

  return (
    <div className={`rounded-lg border ${config.border} overflow-hidden`}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <div 
        className={`flex items-center p-3 cursor-pointer transition-colors ${config.bg} ${config.text}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 font-semibold">{category.categoryName}</div>
        <div className="w-32 text-center font-medium capitalize">{category.status}</div>
        <div className="w-48 flex items-center gap-2">
          <Progress value={category.completeness} className="h-2" />
          <span className="text-xs font-bold">{Math.round(category.completeness)}%</span>
        </div>
        <div className="w-10 text-right">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-white border-t">
          <div className="space-y-2">
            {category.items.map((doc) => {
               const docStatusConfig = {
                 pendente: 'bg-red-50 text-red-700',
                 aprovado: 'bg-green-50 text-green-700',
                 recebido: 'bg-blue-50 text-blue-700',
                 rejeitado: 'bg-orange-50 text-orange-700',
               };
               const docConfig = docStatusConfig[doc.status] || 'bg-gray-50';

               return (
                <div key={doc.hr_document_type_id} className={`p-3 rounded flex items-center justify-between ${docConfig}`}>
                  <span className="font-medium">{doc.document_type}</span>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="capitalize">{doc.status}</Badge>
                     {doc.submitted_file_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(doc.submitted_file_url, '_blank')}>
                           <Eye className="w-4 h-4 mr-2" /> Ver
                        </Button>
                     )}
                     <Button size="sm" variant="outline" onClick={() => handleTriggerUpload(doc)} disabled={uploadingDoc === doc}>
                       {uploadingDoc === doc ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <>
                           <Upload className="w-4 h-4 mr-2" />
                           {doc.submitted_file_url ? 'Substituir' : 'Anexar'}
                         </>
                       )}
                     </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


// --- Componente Principal ---

export default function OnlineHiringPortal({ 
  hiringProcesses, 
  currentUser, 
  onRefresh, 
  isLoading: isParentLoading
}) {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('admin');
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [activeSection, setActiveSection] = useState('documentos');
  const [documentChecklist, setDocumentChecklist] = useState([]);
  const [hrDocTypes, setHrDocTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        const types = await HrDocumentType.list();
        setHrDocTypes(types);
      } catch (error) {
        console.error("Erro ao carregar tipos de documento de RH:", error);
      }
    };
    fetchDocTypes();
  }, []);

  const structuredChecklist = useMemo(() => {
    if (!selectedProcess || hrDocTypes.length === 0) return [];
    
    const requiredDocs = selectedProcess.required_documents || [];
    
    const docTypesMap = new Map(hrDocTypes.map(type => [type.id, type]));
    
    const groupedByCategory = requiredDocs.reduce((acc, doc) => {
      const docTypeInfo = docTypesMap.get(doc.hr_document_type_id);
      const category = docTypeInfo?.category || 'Outros';
      
      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        ...doc,
        document_type: docTypeInfo?.name || doc.document_type,
      });
      
      return acc;
    }, {});
    
    return Object.entries(groupedByCategory).map(([categoryName, items]) => {
      const completedItems = items.filter(item => ['aprovado', 'recebido'].includes(item.status)).length;
      const completeness = (completedItems / items.length) * 100;
      
      let status = 'pendente';
      if (completeness === 100) {
        status = 'completo';
      } else if (completeness > 0) {
        status = 'parcial';
      }

      return {
        categoryName,
        items,
        completeness,
        status
      };
    });
  }, [selectedProcess, hrDocTypes]);

  const handleSelectProcess = (process) => {
    setSelectedProcess(process);
    setActiveView('candidate');
  };

  const handleBackToList = () => {
    setSelectedProcess(null);
    setActiveView('admin');
  };

  const handleFileUpload = async (doc, file) => {
    if (!selectedProcess) return;
    setIsLoading(true);

    try {
      const { file_url } = await UploadFile({ file });
      
      const updatedDocs = selectedProcess.required_documents.map(d => {
        if (d.hr_document_type_id === doc.hr_document_type_id) {
          return {
            ...d,
            submitted_file_url: file_url,
            status: 'recebido', // Muda para 'recebido' para indicar que precisa de análise do RH
            submitted_at: new Date().toISOString(),
          };
        }
        return d;
      });

      await HiringProcess.update(selectedProcess.id, { required_documents: updatedDocs });
      
      toast({
        title: "Documento enviado!",
        description: `O documento ${doc.document_type} foi anexado com sucesso.`,
      });
      
      onRefresh(); // Atualiza a lista de processos no componente pai
    } catch (error) {
      console.error("Erro ao fazer upload do documento:", error);
      toast({
        title: "Erro no Upload",
        description: "Não foi possível enviar o documento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProcessStats = () => {
    const processes = hiringProcesses || [];
    const pending = processes.filter(p => ['documentos_pendentes', 'em_analise'].includes(p.status)).length;
    const completed = processes.filter(p => p.status === 'contratado').length;
    
    return {
      total: processes.length,
      pending,
      completed,
      inProgress: processes.filter(p => p.status === 'em_analise').length,
    };
  };

  const stats = getProcessStats();

  if (isParentLoading) {
    return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" />;
  }

  return (
    <div className="space-y-6">
      {activeView === 'admin' && (
        <>
          {/* Header com estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
              </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Processos de Contratação Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {(hiringProcesses || []).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium">Nenhum processo de contratação encontrado.</h3>
                </div>
              ) : (
                <div className="space-y-3">
                  {(hiringProcesses || []).map((process) => (
                    <div 
                      key={process.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectProcess(process)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{process.candidate_name}</div>
                          <div className="text-sm text-gray-500">{process.position}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="capitalize">{process.status?.replace(/_/g, ' ')}</Badge>
                        <div className="text-right w-32">
                          <div className="text-sm font-medium">
                            {Math.round(process.checklist_progress?.completion_percentage || 0)}%
                          </div>
                          <Progress 
                            value={process.checklist_progress?.completion_percentage || 0} 
                            className="h-2 mt-1" 
                          />
                        </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeView === 'candidate' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
               <Button variant="ghost" onClick={handleBackToList}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a lista
               </Button>
               <CardTitle>Portal do Candidato: {selectedProcess?.candidate_name}</CardTitle>
               <div></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex min-h-[600px]">
              <OnlineHiringSidebar 
                onSectionChange={setActiveSection}
                process={selectedProcess}
              />
              
              <div className="flex-1 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Documentos</h2>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div><span>Pendente</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><span>Parcial</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-full"></div><span>Completo</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-full"></div><span>Anexado pelo RH</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm font-bold text-gray-500 px-3">
                    <div className="flex-1">Tipo de Documento</div>
                    <div className="w-32 text-center">Status</div>
                    <div className="w-48">Completude</div>
                    <div className="w-10"></div>
                  </div>
                  
                  {structuredChecklist.length > 0 ? (
                     structuredChecklist.map(category => (
                       <DocumentCategory 
                         key={category.categoryName} 
                         category={category}
                         onDocumentUpload={handleFileUpload}
                       />
                     ))
                  ) : (
                     <div className="text-center py-12 text-gray-500">
                       <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                       <h3 className="text-lg font-medium">Nenhum checklist de documento aplicado.</h3>
                       <p>Configure templates de checklist para este tipo de contratação.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}