
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  Tag,
  Plus,
  Link,
  Cloud,
  Calendar as CalendarIcon,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Document } from "@/api/entities";
import { UploadFile, InvokeLLM, ExtractDataFromUploadedFile } from "@/api/integrations";

const categories = [
  { value: "contrato", label: "Contrato" },
  { value: "nota_fiscal", label: "Nota Fiscal" },
  { value: "relatorio", label: "Relatório" },
  { value: "procedimento", label: "Procedimento" },
  { value: "politica", label: "Política" },
  { value: "certificado", label: "Certificado" },
  { value: "outros", label: "Outros" }
];

const accessLevels = [
  { value: "publico", label: "Público", description: "Todos podem ver" },
  { value: "departamento", label: "Departamento", description: "Apenas o departamento" },
  { value: "restrito", label: "Restrito", description: "Usuários específicos" },
  { value: "confidencial", label: "Confidencial", description: "Acesso muito limitado" }
];

export default function DocumentUpload({ 
  onClose, 
  onComplete, 
  currentUser,
  departments,
  directories,
  initialDepartmentId,
  initialDirectoryId
}) {
  const [uploadType, setUploadType] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    access_level: "departamento",
    approval_required: false,
    google_drive_link: "",
    department_id: initialDepartmentId || "",
    directory_id: initialDirectoryId || "",
    document_date: new Date(), // Data de criação do documento
    expiry_date: null, // Data de validade
    extracted_dates: null // Datas extraídas automaticamente
  });
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef(null);

  const [availableDirectories, setAvailableDirectories] = useState([]);

  useEffect(() => {
    if (currentDocument.department_id) {
      setAvailableDirectories(directories.filter(d => d.department_id === currentDocument.department_id));
    } else {
      setAvailableDirectories([]);
    }
  }, [currentDocument.department_id, directories]);

  const handleDepartmentChange = (deptId) => {
    setCurrentDocument(prev => ({ ...prev, department_id: deptId, directory_id: "" }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Auto-extrair datas do primeiro arquivo se for PDF
    if (selectedFiles.length > 0 && selectedFiles[0].type === 'application/pdf') {
      extractDatesFromFile(selectedFiles[0]);
    }
  };

  const extractDatesFromFile = async (file) => {
    setIsExtracting(true);
    try {
      // Primeiro, fazer upload do arquivo
      const { file_url } = await UploadFile({ file });
      
      // Definir schema para extração de datas
      const dateSchema = {
        type: "object",
        properties: {
          document_date: {
            type: "string",
            format: "date",
            description: "Data de criação ou assinatura do documento"
          },
          expiry_date: {
            type: "string",
            format: "date", 
            description: "Data de validade ou vencimento do documento"
          },
          other_dates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string", format: "date" },
                context: { type: "string", description: "Contexto da data encontrada" }
              }
            },
            description: "Outras datas importantes encontradas no documento"
          }
        }
      };

      // Extrair dados estruturados do arquivo
      const extractResult = await ExtractDataFromUploadedFile({
        file_url: file_url,
        json_schema: dateSchema
      });

      if (extractResult.status === "success" && extractResult.output) {
        const extractedData = extractResult.output;
        
        setCurrentDocument(prev => ({
          ...prev,
          document_date: extractedData.document_date ? new Date(extractedData.document_date) : prev.document_date,
          expiry_date: extractedData.expiry_date ? new Date(extractedData.expiry_date) : prev.expiry_date,
          extracted_dates: extractedData
        }));
      }
    } catch (error) {
      console.error("Erro ao extrair datas:", error);
    }
    setIsExtracting(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !currentDocument.tags.includes(newTag.trim())) {
      setCurrentDocument(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentDocument(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if ((uploadType === 'upload' && files.length === 0) || !currentDocument.title || !currentDocument.category || !currentDocument.department_id || !currentDocument.directory_id) {
      alert("Por favor, preencha todos os campos obrigatórios, incluindo Departamento e Diretório.");
      return;
    }
    if (uploadType === 'google_drive' && !currentDocument.google_drive_link) {
      return;
    }

    setIsSaving(true);

    try {
      if (uploadType === 'upload') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadProgress(prev => ({ ...prev, [i]: 0 }));
          
          const { file_url } = await UploadFile({ file });
          setUploadProgress(prev => ({ ...prev, [i]: 100 }));

          await Document.create({
            ...currentDocument,
            company_id: currentUser?.company_id || "default_company",
            file_url,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            document_type: "upload",
            title: files.length > 1 ? `${currentDocument.title} - ${i + 1}` : currentDocument.title,
            document_date: currentDocument.document_date ? format(currentDocument.document_date, "yyyy-MM-dd") : null,
            expiry_date: currentDocument.expiry_date ? format(currentDocument.expiry_date, "yyyy-MM-dd") : null
          });
        }
      } else {
        await Document.create({
          ...currentDocument,
          company_id: currentUser?.company_id || "default_company",
          document_type: "google_drive",
          file_name: currentDocument.title,
          file_type: "google-drive-link",
          document_date: currentDocument.document_date ? format(currentDocument.document_date, "yyyy-MM-dd") : null,
          expiry_date: currentDocument.expiry_date ? format(currentDocument.expiry_date, "yyyy-MM-dd") : null
        });
      }

      onComplete();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }

    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Novo Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seletor de Origem */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <Button 
              variant={uploadType === 'upload' ? 'default' : 'ghost'} 
              onClick={() => setUploadType('upload')}
              className="flex-1 gap-2"
            >
              <Upload className="w-4 h-4"/>
              Fazer Upload
            </Button>
            <Button 
              variant={uploadType === 'google_drive' ? 'default' : 'ghost'} 
              onClick={() => setUploadType('google_drive')}
              className="flex-1 gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.457 9.416 8.74 3.028 5.023 9.416h7.434zm-3.07-5.83.15.266 3.454 6.01-1.65.953H5.068l-1.65-.953 3.454-6.01.15-.266z"/>
                <path d="M3.213 13.33 1.004 9.69h2.383l2.209 3.64-2.383.001zm11.782-3.64h2.383l-2.209 3.64-2.383-.001 2.209-3.64zM8.74 14.153h5.068l-2.534-4.17-2.534 4.17zM2.205 10.024l2.534 4.129H4.67l-2.534-4.17.069.044z"/>
              </svg>
              Link do Google Drive
            </Button>
          </div>

          {uploadType === 'upload' ? (
            <>
              {/* Área de Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </h3>
                <p className="text-gray-500 mb-4">
                  Suporte para PDF, DOC, XLS, PPT, imagens
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  Selecionar Arquivos
                </Button>
                
                {isExtracting && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Extraindo datas automaticamente...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Arquivos */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Arquivos Selecionados:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {uploadProgress[index] !== undefined && (
                          <Progress value={uploadProgress[index]} className="w-full mt-2 h-1" />
                        )}
                      </div>
                      {!isSaving && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      {uploadProgress[index] === 100 && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="google_drive_link">Link de Compartilhamento do Google Drive *</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="google_drive_link"
                  value={currentDocument.google_drive_link}
                  onChange={(e) => setCurrentDocument(prev => ({...prev, google_drive_link: e.target.value}))}
                  placeholder="https://drive.google.com/file/d/..."
                  className="pl-10"
                  required
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-1">Como obter o link:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Abra o arquivo no Google Drive</li>
                  <li>2. Clique em "Compartilhar"</li>
                  <li>3. Mude para "Qualquer pessoa com o link pode visualizar"</li>
                  <li>4. Copie o link e cole aqui</li>
                </ol>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informações do Documento</h3>
            
            {/* Departamento e Diretório */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_id">Departamento *</Label>
                <Select 
                  value={currentDocument.department_id} 
                  onValueChange={handleDepartmentChange}
                  disabled={isSaving}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="directory_id">Diretório *</Label>
                <Select 
                  value={currentDocument.directory_id} 
                  onValueChange={(value) => setCurrentDocument(prev => ({ ...prev, directory_id: value }))}
                  disabled={isSaving || !currentDocument.department_id}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!currentDocument.department_id ? "Escolha um depto primeiro" : "Selecione um diretório"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDirectories.map((dir) => (
                      <SelectItem key={dir.id} value={dir.id}>
                        {dir.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={currentDocument.title}
                  onChange={(e) => setCurrentDocument(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome do documento"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={currentDocument.category} 
                  onValueChange={(value) => setCurrentDocument(prev => ({ ...prev, category: value }))}
                  disabled={isSaving}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Datas do Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Criação do Documento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentDocument.document_date ? format(currentDocument.document_date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentDocument.document_date}
                      onSelect={(date) => setCurrentDocument(prev => ({ ...prev, document_date: date }))}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data de Validade</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentDocument.expiry_date ? format(currentDocument.expiry_date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentDocument.expiry_date}
                      onSelect={(date) => setCurrentDocument(prev => ({ ...prev, expiry_date: date }))}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Mostrar datas extraídas automaticamente */}
            {currentDocument.extracted_dates && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Datas extraídas automaticamente:</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  {currentDocument.extracted_dates.document_date && (
                    <p>• Data do documento: {format(new Date(currentDocument.extracted_dates.document_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  )}
                  {currentDocument.extracted_dates.expiry_date && (
                    <p>• Data de validade: {format(new Date(currentDocument.extracted_dates.expiry_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  )}
                  {currentDocument.extracted_dates.other_dates && currentDocument.extracted_dates.other_dates.length > 0 && (
                    <div>
                      <p>• Outras datas encontradas:</p>
                      {currentDocument.extracted_dates.other_dates.map((dateInfo, index) => (
                        <p key={index} className="ml-4">- {dateInfo.context}: {format(new Date(dateInfo.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={currentDocument.description}
                onChange={(e) => setCurrentDocument(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o conteúdo do documento..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access_level">Nível de Acesso</Label>
              <Select 
                value={currentDocument.access_level} 
                onValueChange={(value) => setCurrentDocument(prev => ({ ...prev, access_level: value }))}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de acesso" />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-gray-500">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  disabled={isSaving}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTag}
                  disabled={isSaving || !newTag.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {currentDocument.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentDocument.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTag(tag)}
                        disabled={isSaving}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Aprovação */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="approval_required"
                checked={currentDocument.approval_required}
                onChange={(e) => setCurrentDocument(prev => ({ ...prev, approval_required: e.target.checked }))}
                disabled={isSaving}
              />
              <Label htmlFor="approval_required" className="text-sm">
                Este documento requer aprovação antes de ser publicado
              </Label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={
                isSaving || 
                (uploadType === 'upload' && files.length === 0) || 
                (uploadType === 'google_drive' && !currentDocument.google_drive_link) ||
                !currentDocument.title || 
                !currentDocument.category
              }
              className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {uploadType === 'google_drive' ? 'Conectar Documento' : 'Salvar Documento'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
