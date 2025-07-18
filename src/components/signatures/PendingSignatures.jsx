
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  FileSignature, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Document } from "@/api/entities";
import { DigitalSignature } from "@/api/entities";
import DocumentPreview from "../dashboard/DocumentPreview";
import SignaturePad from "./SignaturePad";

export default function PendingSignatures({ 
  signatures, 
  documents, // Added new prop
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const [viewingDocument, setViewingDocument] = useState(null);
  const [signingSignature, setSigningSignature] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (signatures.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma assinatura pendente
          </h3>
          <p className="text-gray-500">
            Ótimo! Você não tem documentos aguardando sua assinatura no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSign = (signature) => {
    setSigningSignature(signature);
  };

  const handleDecline = async (signature) => {
    const reason = prompt("Por favor, informe o motivo da recusa:");
    if (reason) {
      // Assuming DigitalSignature.update exists and takes ID and an object of fields to update
      await DigitalSignature.update(signature.id, { status: 'recusado', refusal_reason: reason });
      onRefresh();
    }
  };

  const handleView = async (signature) => {
    try {
      // Assuming Document.get exists and fetches a document by ID
      const doc = await Document.get(signature.document_id);
      setViewingDocument(doc);
    } catch (error) {
      console.error("Erro ao buscar documento para visualização:", error);
      alert("Não foi possível carregar o documento para visualização.");
    }
  };

  const handleConfirmSignature = async (signatureId, signatureData) => {
    try {
      await DigitalSignature.update(signatureId, {
        status: 'assinado',
        signed_at: new Date().toISOString(),
        signature_data: signatureData, // Save the base64 image of the signature
        ip_address: '127.0.0.1', // Placeholder: In a real app, get this from request context or a service
        user_agent: navigator.userAgent
      });
      setSigningSignature(null); // Close the signature pad
      onRefresh(); // Refresh the list of pending signatures
    } catch (error) {
      console.error("Erro ao confirmar assinatura:", error);
      alert("Ocorreu um erro ao salvar sua assinatura.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        {signatures.map((signature) => {
          const isExpiringSoon = signature.expiry_date && 
            new Date(signature.expiry_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

          return (
            <Card key={signature.id} className={`border-l-4 ${
              isExpiringSoon ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isExpiringSoon ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <FileSignature className={`w-5 h-5 ${
                        isExpiringSoon ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Documento para Assinatura
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Workflow: {signature.workflow_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      isExpiringSoon 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    } flex items-center gap-1`}>
                      <AlertTriangle className="w-3 h-3" />
                      {isExpiringSoon ? 'Expirando' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Signatário:</span>
                      <div className="font-medium">{signature.signer_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">
                        {isExpiringSoon ? 'Expira em:' : 'Prazo:'}
                      </span>
                      <div className={`font-medium ${isExpiringSoon ? 'text-red-600' : ''}`}>
                        {signature.expiry_date 
                          ? format(new Date(signature.expiry_date), "dd/MM/yyyy", { locale: ptBR })
                          : 'Sem prazo'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Tipo de assinatura: 
                    <span className="font-medium ml-1">
                      {signature.signature_type === 'simples' ? 'Simples' :
                       signature.signature_type === 'avancada' ? 'Avançada' : 'Qualificada'}
                    </span>
                  </span>
                </div>

                {isExpiringSoon && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Atenção! Este documento expira em breve
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      Assine o quanto antes para não perder o prazo.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={() => handleView(signature)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </Button>
                  <Button 
                    onClick={() => handleSign(signature)}
                    className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] flex-1"
                  >
                    <FileSignature className="w-4 h-4" />
                    Assinar Documento
                  </Button>
                  <Button 
                    onClick={() => handleDecline(signature)}
                    variant="outline"
                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Recusar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {viewingDocument && (
        <DocumentPreview
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
          onUpdate={onRefresh}
        />
      )}

      {signingSignature && (
        <SignaturePad
          signature={signingSignature}
          onClose={() => setSigningSignature(null)}
          onConfirm={handleConfirmSignature}
        />
      )}
    </>
  );
}
