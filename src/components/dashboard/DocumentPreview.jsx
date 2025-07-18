import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Download, X, Calendar, User, Info, Paperclip, Sparkles, History, FileCheck, Brain } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InvokeLLM } from "@/api/integrations";
import { Document } from "@/api/entities";

// Importando os novos componentes
import DocumentVersionHistory from "../documents/DocumentVersionHistory";
import OCRProcessor from "../documents/OCRProcessor";

const PreviewContent = ({ document }) => {
  if (!document) return null;

  const fileExtension = document.file_name?.split('.').pop()?.toLowerCase() || '';
  
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  const isImage = imageExtensions.includes(fileExtension);
  const isPdf = fileExtension === 'pdf';

  if (!document.file_url) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8">
        <File className="w-24 h-24 text-gray-300 mb-6" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">URL do Arquivo Inválida</h3>
        <p className="text-gray-500 mb-6 text-center">
          Não foi possível carregar a pré-visualização porque a URL do arquivo não foi encontrada.
        </p>
      </div>
    );
  }

  if (isImage) {
    return (
      <img 
        src={document.file_url} 
        alt={document.title} 
        className="w-full h-full object-contain rounded-lg"
      />
    );
  }

  if (isPdf) {
    return (
      <iframe
        src={document.file_url}
        className="w-full h-full border-0 rounded-lg"
        title={document.title}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8">
      <File className="w-24 h-24 text-gray-300 mb-6" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">Pré-visualização não disponível</h3>
      <p className="text-gray-500 mb-6 text-center">
        O formato de arquivo ".{fileExtension}" não pode ser exibido diretamente no navegador.
      </p>
      <Button asChild className="bg-gradient-to-r from-[#146FE0] to-[#04BF7B]">
        <a href={document.file_url} target="_blank" rel="noopener noreferrer" download>
          <Download className="w-4 h-4 mr-2" />
          Baixar Arquivo
        </a>
      </Button>
    </div>
  );
};

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentPreview({ document: initialDocument, onClose, onUpdate }) {
  const [document, setDocument] = useState(initialDocument);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showOcr, setShowOcr] = useState(false);

  useEffect(() => {
    setDocument(initialDocument);
  }, [initialDocument]);

  if (!document) return null;

  const handleAnalyzeDocument = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Você é um assistente de gestão de documentos (GED) para o sistema FIRSTDOCY GED AI. Sua tarefa é analisar o documento em anexo e criar um resumo executivo claro e conciso. O resumo deve ter no máximo 150 palavras e ser apresentado em um único parágrafo. Destaque os principais objetivos, datas importantes, valores monetários e pessoas ou departamentos envolvidos, se houver.`;
      
      const summary = await InvokeLLM({
        prompt: prompt,
        file_urls: [document.file_url]
      });

      await Document.update(document.id, { ai_summary: summary });
      
      setDocument(prevDoc => ({ ...prevDoc, ai_summary: summary }));
      
      if(onUpdate) {
        onUpdate();
      }

    } catch (error) {
      console.error("Erro ao analisar documento:", error);
    }
    setIsAnalyzing(false);
  };

  const handleDocumentUpdate = () => {
    setTimeout(() => {
      if (onUpdate) {
        onUpdate();
      }
    }, 500);
  };

  const handleVersionsClose = () => {
    setShowVersions(false);
  };

  const handleOcrClose = () => {
    setShowOcr(false);
  };

  const handleOcrComplete = () => {
    setShowOcr(false);
    handleDocumentUpdate();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-[95%] h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 firstdocy-gradient rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800 truncate">{document.title}</span>
              <Badge variant="outline" className="ml-auto text-xs">{document.category?.replace(/_/g, ' ')}</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Conteúdo do Preview */}
            <div className="flex-1 h-full p-4 bg-gray-100">
              <PreviewContent document={document} />
            </div>

            {/* Sidebar com Tabs */}
            <div className="w-96 h-full border-l flex-shrink-0 flex flex-col bg-white">
              <Tabs defaultValue="details" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 p-1 m-4 mb-0">
                  <TabsTrigger value="details" className="text-xs flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Detalhes
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Versões
                  </TabsTrigger>
                   <TabsTrigger value="ocr" className="text-xs flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    OCR IA
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="flex-1 overflow-y-auto p-4 pt-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Nome do Arquivo</Label>
                      <p className="text-sm text-gray-800 flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-400"/>
                        {document.file_name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Tamanho</Label>
                      <p className="text-sm text-gray-800">{formatFileSize(document.file_size)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Criado por</Label>
                      <p className="text-sm text-gray-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400"/>
                        {document.created_by}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Data de Criação</Label>
                      <p className="text-sm text-gray-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400"/>
                        {format(new Date(document.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {document.expiry_date && (
                      <div>
                        <Label className="text-xs text-gray-500 text-red-600">Data de Expiração</Label>
                        <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4"/>
                          {format(new Date(document.expiry_date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                    {document.tags && document.tags.length > 0 && (
                      <div>
                        <Label className="text-xs text-gray-500">Tags</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Seção de Análise de IA */}
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-500"/>
                        Análise de IA
                      </Label>
                      <div className="p-3 bg-purple-50/50 rounded-lg mt-1 border border-purple-100">
                        {isAnalyzing ? (
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                            <p className="text-xs text-purple-700 animate-pulse text-center pt-2">Analisando documento...</p>
                          </div>
                        ) : document.ai_summary ? (
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{document.ai_summary}</p>
                        ) : (
                          <div className="text-center">
                             <p className="text-sm text-gray-600 mb-3">Gere um resumo automático deste documento.</p>
                             <Button 
                               onClick={handleAnalyzeDocument}
                               className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg text-white"
                             >
                               <Sparkles className="w-4 h-4"/>
                               Analisar com IA
                             </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Seção de Ferramentas Avançadas */}
                    <div className="mt-4">
                      <Label className="text-xs text-gray-500">Ferramentas Avançadas</Label>
                      <div className="space-y-2 mt-1">
                         <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowVersions(true)}>
                           <History className="w-4 h-4 text-blue-600"/>
                           Ver Histórico de Versões
                         </Button>
                         <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowOcr(true)}>
                           <Brain className="w-4 h-4 text-purple-600"/>
                           Extrair Dados com OCR
                         </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="flex-1 overflow-y-auto p-4 pt-2">
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Clique no botão "Ver Histórico de Versões" para acessar esta funcionalidade.</p>
                  </div>
                </TabsContent>

                <TabsContent value="ocr" className="flex-1 overflow-y-auto p-4 pt-2">
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Clique no botão "Extrair Dados com OCR" para acessar esta funcionalidade.</p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="p-4 border-t bg-gray-50 flex-shrink-0">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Fechar
                </Button>
                <Button asChild className="bg-gradient-to-r from-[#212153] to-[#146FE0]">
                  <a href={document.file_url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </a>
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showVersions && (
        <DocumentVersionHistory 
          document={document}
          onClose={handleVersionsClose}
          onVersionChange={handleDocumentUpdate}
        />
      )}

      {showOcr && (
        <OCRProcessor
          document={document}
          onClose={handleOcrClose}
          onDataExtracted={handleOcrComplete}
        />
      )}
    </>
  );
}