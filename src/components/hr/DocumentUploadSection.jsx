import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  AlertTriangle,
  FileCheck,
  Trash2,
  Download
} from 'lucide-react';
import { UploadFile, ExtractDataFromUploadedFile } from '@/api/integrations';
import { useToast } from '@/components/ui/use-toast';

const DOCUMENT_TYPES = {
  'rg': { 
    label: 'RG (Carteira de Identidade)', 
    validation: ['numero', 'orgao_emissor', 'data_expedicao'],
    requiredFields: ['numero', 'orgao_emissor']
  },
  'cpf': { 
    label: 'CPF', 
    validation: ['numero'],
    requiredFields: ['numero']
  },
  'carteira_trabalho': { 
    label: 'Carteira de Trabalho', 
    validation: ['numero', 'serie'],
    requiredFields: ['numero']
  },
  'titulo_eleitor': { 
    label: 'Título de Eleitor', 
    validation: ['numero', 'zona', 'secao'],
    requiredFields: ['numero']
  },
  'comprovante_residencia': { 
    label: 'Comprovante de Residência', 
    validation: ['endereco', 'data_documento'],
    requiredFields: ['endereco']
  },
  'certidao_nascimento': { 
    label: 'Certidão de Nascimento', 
    validation: ['numero_registro', 'cartorio'],
    requiredFields: ['numero_registro']
  },
  'diploma': { 
    label: 'Diploma/Certificado', 
    validation: ['instituicao', 'curso', 'data_conclusao'],
    requiredFields: ['instituicao', 'curso']
  },
  'exame_medico': { 
    label: 'Exame Médico Admissional', 
    validation: ['medico_responsavel', 'data_exame', 'resultado'],
    requiredFields: ['data_exame', 'resultado']
  }
};

const DocumentUploadSection = ({ documentType, onDocumentSaved, existingDocument }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(existingDocument || null);
  const [extractedData, setExtractedData] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const docTypeConfig = DOCUMENT_TYPES[documentType];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Por favor, envie apenas arquivos JPG, PNG ou PDF.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { file_url } = await UploadFile({ file });
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      const documentData = {
        document_type: documentType,
        file_url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        upload_date: new Date().toISOString(),
        status: 'pendente'
      };

      setUploadedFile(documentData);
      setActiveTab('extract');
      
      toast({
        title: "Upload concluído!",
        description: "Arquivo enviado com sucesso. Agora vamos extrair os dados."
      });

      // Auto-iniciar extração
      setTimeout(() => {
        handleDataExtraction(file_url);
      }, 1000);

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDataExtraction = async (fileUrl) => {
    setIsAnalyzing(true);
    
    try {
      // Schema dinâmico baseado no tipo de documento
      const extractionSchema = {
        type: "object",
        properties: {}
      };

      // Adicionar campos baseados no tipo de documento
      docTypeConfig.validation.forEach(field => {
        extractionSchema.properties[field] = {
          type: "string",
          description: `${field} do documento`
        };
      });

      const result = await ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: extractionSchema
      });

      if (result.status === 'success') {
        setExtractedData(result.output || {});
        validateExtractedData(result.output || {});
        setActiveTab('validate');
        
        toast({
          title: "Dados extraídos com sucesso!",
          description: "Revise os dados extraídos e faça as correções necessárias."
        });
      } else {
        throw new Error(result.details || 'Erro na extração');
      }

    } catch (error) {
      console.error('Erro na extração:', error);
      toast({
        title: "Erro na extração de dados",
        description: "Não foi possível extrair automaticamente os dados. Você pode inseri-los manualmente.",
        variant: "destructive"
      });
      setActiveTab('manual');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateExtractedData = (data) => {
    const results = {};
    
    docTypeConfig.requiredFields.forEach(field => {
      if (data[field] && data[field].trim()) {
        results[field] = { valid: true, message: 'Campo preenchido corretamente' };
      } else {
        results[field] = { valid: false, message: 'Campo obrigatório não encontrado' };
      }
    });

    // Validações específicas
    if (documentType === 'cpf' && data.numero) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
      results.numero = {
        valid: cpfRegex.test(data.numero),
        message: cpfRegex.test(data.numero) ? 'CPF válido' : 'Formato de CPF inválido'
      };
    }

    if (documentType === 'rg' && data.numero) {
      results.numero = {
        valid: data.numero.length >= 7,
        message: data.numero.length >= 7 ? 'RG válido' : 'Número de RG muito curto'
      };
    }

    setValidationResults(results);
  };

  const handleDataChange = (field, value) => {
    const newData = { ...extractedData, [field]: value };
    setExtractedData(newData);
    validateExtractedData(newData);
  };

  const handleSaveDocument = () => {
    const documentData = {
      ...uploadedFile,
      extracted_data: extractedData,
      validation_results: validationResults,
      status: Object.values(validationResults).every(r => r.valid) ? 'aprovado' : 'pendente'
    };

    onDocumentSaved(documentType, documentData);
    
    toast({
      title: "Documento salvo!",
      description: `${docTypeConfig.label} foi salvo com sucesso.`
    });
  };

  const isValid = Object.keys(validationResults).length > 0 && 
                  Object.values(validationResults).every(r => r.valid);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {docTypeConfig.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="extract" disabled={!uploadedFile}>Extrair</TabsTrigger>
            <TabsTrigger value="validate" disabled={!extractedData || Object.keys(extractedData).length === 0}>Validar</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Envie o documento</p>
                  <p className="text-sm text-gray-500">
                    Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`file-upload-${documentType}`}
                  disabled={isUploading}
                />
                <Label htmlFor={`file-upload-${documentType}`}>
                  <Button asChild disabled={isUploading} className="mt-4">
                    <span>
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Selecionar Arquivo
                        </>
                      )}
                    </span>
                  </Button>
                </Label>
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500 mt-2">{uploadProgress}% concluído</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Arquivo enviado com sucesso: <strong>{uploadedFile.file_name}</strong>
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('extract')}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Extrair Dados
                  </Button>
                  <Button variant="outline" onClick={() => setUploadedFile(null)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover Arquivo
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="extract" className="space-y-4">
            <div className="text-center">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                  <div>
                    <p className="text-lg font-medium">Analisando documento...</p>
                    <p className="text-sm text-gray-500">
                      Nossa IA está extraindo os dados automaticamente
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileCheck className="mx-auto h-12 w-12 text-green-600" />
                  <Button onClick={() => handleDataExtraction(uploadedFile.file_url)}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Iniciar Extração
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Dados Extraídos - Revise e Corrija</h4>
              
              {docTypeConfig.validation.map(field => (
                <div key={field} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {field.replace('_', ' ').toUpperCase()}
                    {docTypeConfig.requiredFields.includes(field) && (
                      <span className="text-red-500">*</span>
                    )}
                    {validationResults[field] && (
                      validationResults[field].valid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )
                    )}
                  </Label>
                  <Input
                    value={extractedData[field] || ''}
                    onChange={(e) => handleDataChange(field, e.target.value)}
                    className={validationResults[field] ? 
                      (validationResults[field].valid ? 'border-green-500' : 'border-red-500') : ''
                    }
                  />
                  {validationResults[field] && (
                    <p className={`text-sm ${validationResults[field].valid ? 'text-green-600' : 'text-red-600'}`}>
                      {validationResults[field].message}
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-4">
                {isValid ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Todos os dados obrigatórios foram validados com sucesso!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Alguns campos obrigatórios estão faltando ou inválidos.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleSaveDocument}
                  className="w-full mt-4"
                  disabled={!isValid}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Salvar Documento
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Preencha os dados manualmente caso a extração automática não tenha funcionado.
              </AlertDescription>
            </Alert>
            
            {docTypeConfig.validation.map(field => (
              <div key={field} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {field.replace('_', ' ').toUpperCase()}
                  {docTypeConfig.requiredFields.includes(field) && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  value={extractedData[field] || ''}
                  onChange={(e) => handleDataChange(field, e.target.value)}
                  placeholder={`Digite o ${field.replace('_', ' ')}`}
                />
              </div>
            ))}

            <Button 
              onClick={handleSaveDocument}
              className="w-full"
              disabled={!docTypeConfig.requiredFields.every(field => extractedData[field])}
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Salvar Documento
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;