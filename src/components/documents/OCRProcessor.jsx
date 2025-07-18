import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Download,
  Edit,
  X
} from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { Document } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ocrTemplates = {
  invoice: {
    name: "Nota Fiscal",
    fields: {
      invoice_number: "Número da NF",
      invoice_date: "Data de emissão",
      due_date: "Data de vencimento",
      supplier_name: "Nome do fornecedor",
      supplier_cnpj: "CNPJ do fornecedor",
      total_amount: "Valor total",
      tax_amount: "Valor dos impostos",
      items: "Lista de itens"
    }
  },
  contract: {
    name: "Contrato",
    fields: {
      contract_number: "Número do contrato",
      contract_date: "Data do contrato",
      parties: "Partes envolvidas",
      contract_value: "Valor do contrato",
      start_date: "Data de início",
      end_date: "Data de término",
      payment_terms: "Condições de pagamento"
    }
  },
  receipt: {
    name: "Recibo",
    fields: {
      receipt_number: "Número do recibo",
      receipt_date: "Data do recibo",
      payer_name: "Nome do pagador",
      recipient_name: "Nome do recebedor",
      amount: "Valor",
      description: "Descrição do pagamento"
    }
  },
  certificate: {
    name: "Certificado",
    fields: {
      certificate_number: "Número do certificado",
      issue_date: "Data de emissão",
      expiry_date: "Data de validade",
      issuer: "Órgão emissor",
      holder_name: "Nome do portador",
      certificate_type: "Tipo de certificado"
    }
  }
};

export default function OCRProcessor({ document, onDataExtracted, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  const processOCR = async () => {
    if (!document.file_url) {
      alert("Documento não possui arquivo para processar.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Analisando documento...');

    try {
      setProcessingStep('Classificando tipo de documento...');
      
      const classificationPrompt = `Analise este documento e determine seu tipo. Tipos disponíveis: invoice (Nota Fiscal), contract (Contrato), receipt (Recibo), certificate (Certificado), other (Outro). Retorne apenas o tipo identificado em minúsculas.`;

      const documentTypeResult = await InvokeLLM({
        prompt: classificationPrompt,
        file_urls: [document.file_url]
      });
      const documentType = documentTypeResult.toLowerCase().trim();

      setProcessingStep('Extraindo dados estruturados...');
      
      const template = ocrTemplates[documentType] || ocrTemplates.contract;
      
      const extractionPrompt = `Você é um especialista em OCR. Analise este documento do tipo "${template.name}" e extraia os seguintes dados: ${Object.values(template.fields).join(', ')}. Use o formato YYYY-MM-DD para datas. Para valores monetários, extraia apenas números. Se um campo não for encontrado, use null. Retorne um JSON com os dados e um campo "confidence_level" (0-100).`;

      const extractionResult = await InvokeLLM({
        prompt: extractionPrompt,
        file_urls: [document.file_url],
        response_json_schema: {
          type: "object",
          properties: {
            ...Object.keys(template.fields).reduce((acc, key) => {
              acc[key] = { type: "string" };
              return acc;
            }, {}),
            confidence_level: { type: "number" },
          }
        }
      });
      
      setExtractedData(extractionResult);
      setConfidence(extractionResult.confidence_level || 0);
      
      setProcessingStep('Salvando dados...');
      await Document.update(document.id, { ocr_data: extractionResult });

      if (onDataExtracted) {
        onDataExtracted();
      }
      
    } catch (error) {
      console.error("Erro no processo de OCR:", error);
      alert("Falha ao processar o OCR. Tente novamente.");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600"/>
                    Extração de Dados com IA (OCR)
                </DialogTitle>
            </DialogHeader>
            
            {!extractedData && !isProcessing && (
                 <div className="text-center p-6">
                    <p className="text-gray-600 mb-6">Extraia dados estruturados deste documento automaticamente. A IA irá classificar o tipo de documento e extrair as informações relevantes.</p>
                    <Button onClick={processOCR} className="gap-2">
                        <Sparkles className="w-4 h-4"/>
                        Iniciar Extração com IA
                    </Button>
                 </div>
            )}
            {isProcessing && (
                <div className="flex flex-col items-center p-6">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4"/>
                    <p className="font-medium text-purple-700 mb-2">Processando...</p>
                    <Progress value={confidence} className="w-full mb-2" />
                    <p className="text-sm text-gray-500">{processingStep}</p>
                </div>
            )}
            {extractedData && !isProcessing && (
                <div className="space-y-4 p-4">
                    <Alert variant="default" className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            Dados extraídos com sucesso! Nível de confiança: {confidence}%
                        </AlertDescription>
                    </Alert>
                    <div className="max-h-64 overflow-y-auto space-y-2 p-3 border rounded-lg bg-gray-50">
                        {Object.entries(extractedData).map(([key, value]) => (
                            <div key={key} className="text-sm grid grid-cols-2">
                                <strong className="font-medium capitalize text-gray-800">{key.replace(/_/g, ' ')}:</strong> 
                                <span className="text-gray-600 ml-2 truncate">{value ? String(value) : "N/A"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <DialogFooter>
                 <Button variant="outline" onClick={onClose}>
                    <X className="w-4 h-4 mr-2"/> Fechar
                 </Button>
                 {extractedData && (
                     <Button onClick={processOCR} disabled={isProcessing}>
                        <Sparkles className="w-4 h-4 mr-2"/>
                        Processar Novamente
                    </Button>
                 )}
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}