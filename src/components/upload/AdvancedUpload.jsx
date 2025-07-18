import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Archive,
  X,
  CheckCircle,
  AlertTriangle,
  File,
  Cloud,
  Loader2
} from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { useToast } from "@/components/ui/use-toast";

const ALLOWED_TYPES = {
  'application/pdf': { icon: FileText, color: 'text-red-500', name: 'PDF' },
  'application/msword': { icon: FileText, color: 'text-blue-500', name: 'DOC' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-500', name: 'DOCX' },
  'application/vnd.ms-excel': { icon: FileText, color: 'text-green-500', name: 'XLS' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileText, color: 'text-green-500', name: 'XLSX' },
  'image/jpeg': { icon: Image, color: 'text-purple-500', name: 'JPG' },
  'image/png': { icon: Image, color: 'text-purple-500', name: 'PNG' },
  'image/gif': { icon: Image, color: 'text-purple-500', name: 'GIF' },
  'video/mp4': { icon: Video, color: 'text-orange-500', name: 'MP4' },
  'application/zip': { icon: Archive, color: 'text-gray-500', name: 'ZIP' }
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;

export default function AdvancedUpload({ 
  onUploadComplete, 
  onClose, 
  companyId, 
  departmentId, 
  directoryId,
  allowMultiple = false,
  acceptedTypes = Object.keys(ALLOWED_TYPES)
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'outros',
    tags: '',
    access_level: 'departamento'
  });
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];
    
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`Tipo de arquivo não suportado: ${file.type}`);
    }
    
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Arquivo muito grande: ${formatFileSize(file.size)} (máx: ${formatFileSize(MAX_FILE_SIZE)})`);
    }
    
    return errors;
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newErrors = [];
    const validFiles = [];

    if (!allowMultiple && selectedFiles.length > 1) {
      newErrors.push('Apenas um arquivo é permitido');
      setErrors(newErrors);
      return;
    }

    if (files.length + selectedFiles.length > MAX_FILES) {
      newErrors.push(`Máximo de ${MAX_FILES} arquivos permitidos`);
      setErrors(newErrors);
      return;
    }

    selectedFiles.forEach((file, index) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          id: Date.now() + index,
          file,
          status: 'pending',
          progress: 0
        });
      } else {
        newErrors.push(...fileErrors);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
    setErrors(newErrors);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    // Simular evento de input para reutilizar lógica de validação
    const mockEvent = {
      target: { files: droppedFiles }
    };
    handleFileSelect(mockEvent);
  };

  const uploadSingleFile = async (fileItem) => {
    try {
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileItem.id] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [fileItem.id]: currentProgress + 10 };
        });
      }, 200);

      const result = await UploadFile({ file: fileItem.file });
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));
      
      return {
        ...fileItem,
        status: 'completed',
        file_url: result.file_url,
        progress: 100
      };
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
      
      return {
        ...fileItem,
        status: 'error',
        error: error.message,
        progress: 0
      };
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(uploadSingleFile);
      const uploadResults = await Promise.all(uploadPromises);
      
      // Atualizar status dos arquivos
      setFiles(uploadResults);
      
      const successfulUploads = uploadResults.filter(result => result.status === 'completed');
      const failedUploads = uploadResults.filter(result => result.status === 'error');

      if (successfulUploads.length > 0) {
        // Preparar dados para salvar documentos
        const documentsData = successfulUploads.map(upload => ({
          company_id: companyId,
          department_id: departmentId,
          directory_id: directoryId,
          title: allowMultiple ? `${formData.title} - ${upload.file.name}` : formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          access_level: formData.access_level,
          document_type: 'upload',
          file_url: upload.file_url,
          file_name: upload.file.name,
          file_size: upload.file.size,
          file_type: upload.file.type
        }));

        onUploadComplete(documentsData);
        
        toast({
          title: "Upload concluído!",
          description: `${successfulUploads.length} arquivo(s) enviado(s) com sucesso.`
        });
      }

      if (failedUploads.length > 0) {
        toast({
          title: "Alguns uploads falharam",
          description: `${failedUploads.length} arquivo(s) não puderam ser enviados.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Erro geral no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro durante o envio dos arquivos.",
        variant: "destructive"
      });
    }
    
    setUploading(false);
  };

  const getFileIcon = (fileType) => {
    const typeInfo = ALLOWED_TYPES[fileType] || { icon: File, color: 'text-gray-500', name: 'FILE' };
    const IconComponent = typeInfo.icon;
    return <IconComponent className={`w-8 h-8 ${typeInfo.color}`} />;
  };

  const getFileTypeName = (fileType) => {
    return ALLOWED_TYPES[fileType]?.name || 'UNKNOWN';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Upload de Documentos</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Área de Drop */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Cloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700">
              Arraste e solte arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Máximo: {formatFileSize(MAX_FILE_SIZE)} por arquivo
              {allowMultiple && ` • Até ${MAX_FILES} arquivos`}
            </p>
          </div>

          {/* Erros */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Lista de Arquivos */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Arquivos Selecionados</h3>
              {files.map((fileItem) => (
                <div key={fileItem.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(fileItem.file.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium truncate">{fileItem.file.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge variant="secondary" className="text-xs">
                            {getFileTypeName(fileItem.file.type)}
                          </Badge>
                          <span>{formatFileSize(fileItem.file.size)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(fileItem.id)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Progress bar */}
                    {uploadProgress[fileItem.id] !== undefined && (
                      <div className="mt-2">
                        <Progress value={uploadProgress[fileItem.id]} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>
                            {fileItem.status === 'completed' && <CheckCircle className="inline w-3 h-3 text-green-500 mr-1" />}
                            {fileItem.status === 'error' && <AlertTriangle className="inline w-3 h-3 text-red-500 mr-1" />}
                            {fileItem.status === 'pending' && uploading && <Loader2 className="inline w-3 h-3 animate-spin mr-1" />}
                            {fileItem.status || 'Aguardando...'}
                          </span>
                          <span>{uploadProgress[fileItem.id]}%</span>
                        </div>
                        {fileItem.error && (
                          <p className="text-xs text-red-500 mt-1">{fileItem.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário de Metadados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do documento"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrato">Contrato</SelectItem>
                  <SelectItem value="nota_fiscal">Nota Fiscal</SelectItem>
                  <SelectItem value="relatorio">Relatório</SelectItem>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="politica">Política</SelectItem>
                  <SelectItem value="certificado">Certificado</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional do documento"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <Label htmlFor="access_level">Nível de Acesso</Label>
              <Select value={formData.access_level} onValueChange={(value) => setFormData(prev => ({ ...prev, access_level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="restrito">Restrito</SelectItem>
                  <SelectItem value="confidencial">Confidencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Documentos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}