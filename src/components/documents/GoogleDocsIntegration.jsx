
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  RefreshCw, 
  ExternalLink, 
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Link as LinkIcon
} from "lucide-react";
import { GoogleDocsIntegration as GoogleDocsEntity } from "@/api/entities";
import { DocumentVersion } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

const statusConfig = {
  synced: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Sincronizado" },
  pending: { color: "bg-amber-100 text-amber-800", icon: Clock, label: "Pendente" },
  conflict: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Conflito" },
  error: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Erro" }
};

const GoogleDocsSetupForm = ({ document, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    google_drive_link: "",
    auto_sync_enabled: false,
    sync_frequency: "manual"
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const extractGoogleDocsId = (link) => {
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleConnect = async () => {
    if (!formData.google_drive_link) {
      alert("Por favor, insira o link do Google Drive.");
      return;
    }

    const googleDocsId = extractGoogleDocsId(formData.google_drive_link);
    if (!googleDocsId) {
      alert("Link do Google Drive inválido. Verifique o formato.");
      return;
    }

    setIsConnecting(true);
    try {
      await GoogleDocsEntity.create({
        document_id: document.id,
        company_id: document.company_id,
        google_docs_id: googleDocsId,
        google_drive_link: formData.google_drive_link,
        auto_sync_enabled: formData.auto_sync_enabled,
        sync_frequency: formData.sync_frequency,
        sync_status: "pending"
      });

      onSave();
    } catch (error) {
      console.error("Erro ao conectar Google Docs:", error);
      alert("Erro ao conectar com Google Docs. Tente novamente.");
    }
    setIsConnecting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            Conectar Google Docs
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Link do Google Drive *</Label>
            <Input
              placeholder="https://docs.google.com/document/d/..."
              value={formData.google_drive_link}
              onChange={(e) => setFormData(prev => ({ ...prev, google_drive_link: e.target.value }))}
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-1">Como obter o link:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Abra o documento no Google Docs</li>
                <li>2. Clique em "Compartilhar"</li>
                <li>3. Defina como "Qualquer pessoa com o link pode editar"</li>
                <li>4. Copie o link e cole aqui</li>
              </ol>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frequência de Sincronização</Label>
            <Select 
              value={formData.sync_frequency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, sync_frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="on_change">Ao detectar mudanças</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto_sync"
              checked={formData.auto_sync_enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, auto_sync_enabled: e.target.checked }))}
            />
            <Label htmlFor="auto_sync" className="text-sm">
              Ativar sincronização automática
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={isConnecting || !formData.google_drive_link}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isConnecting ? "Conectando..." : "Conectar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function GoogleDocsIntegration({ document, onRefresh }) {
  const [integration, setIntegration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadIntegration();
  }, [document]);

  const loadIntegration = async () => {
    setIsLoading(true);
    try {
      const integrations = await GoogleDocsEntity.filter({ 
        document_id: document.id 
      });
      setIntegration(integrations.length > 0 ? integrations[0] : null);
    } catch (error) {
      console.error("Erro ao carregar integração:", error);
    }
    setIsLoading(false);
  };

  const handleSync = async () => {
    if (!integration) return;

    setIsSyncing(true);
    try {
      // Simular sincronização com Google Docs
      // Em uma implementação real, isso faria uma chamada para a API do Google Docs
      // para verificar mudanças e baixar a versão mais recente
      
      const prompt = `Simule uma sincronização com Google Docs. 
      Documento: ${document.title}
      Google Docs ID: ${integration.google_docs_id}
      
      Retorne um status de sincronização simulado.`;

      const syncResult = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["synced", "conflict", "error"] },
            changes_detected: { type: "boolean" },
            version_number: { type: "string" },
            change_description: { type: "string" }
          }
        }
      });

      if (syncResult.changes_detected) {
        // Criar nova versão se mudanças foram detectadas
        await DocumentVersion.create({
          document_id: document.id,
          company_id: document.company_id,
          version_number: syncResult.version_number || "1.1",
          file_url: integration.google_drive_link, // Em produção, seria o arquivo baixado
          file_name: `${document.title}_synced.pdf`,
          file_size: 0,
          change_description: syncResult.change_description || "Sincronização do Google Docs",
          change_type: "minor",
          uploaded_by: "system@google-sync",
          merge_from_google_docs: true,
          google_docs_revision_id: Date.now().toString()
        });
      }

      // Atualizar status da integração
      await GoogleDocsEntity.update(integration.id, {
        sync_status: syncResult.status,
        last_sync_at: new Date().toISOString()
      });

      loadIntegration();
      onRefresh();
    } catch (error) {
      console.error("Erro na sincronização:", error);
    }
    setIsSyncing(false);
  };

  const handleFormSave = () => {
    setShowSetupForm(false);
    loadIntegration();
  };

  if (isLoading) {
    return <p>Carregando integração...</p>;
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.5 1.5A1.5 1.5 0 0 1 4 0h4.586A1.5 1.5 0 0 1 9.672.158L12.328 2.828a1.5 1.5 0 0 1 .158 1.086L12.5 14.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-13zm2 0v13h7V3.5L9 1.5H4.5z"/>
          </svg>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            Google Docs
          </span>
        </CardTitle>
        
        {!integration ? (
          <Button 
            onClick={() => setShowSetupForm(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4" />
            Conectar
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(integration.google_drive_link, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!integration ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Google Docs não conectado
            </h3>
            <p className="text-gray-500 mb-4">
              Conecte este documento ao Google Docs para edição colaborativa em tempo real.
            </p>
            <Button 
              onClick={() => setShowSetupForm(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Conectar Google Docs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Status da Sincronização</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={statusConfig[integration.sync_status].color}>
                    {statusConfig[integration.sync_status].label}
                  </Badge>
                  {integration.last_sync_at && (
                    <span className="text-sm text-gray-500">
                      Última sync: {new Date(integration.last_sync_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? "Sincronizando..." : "Sincronizar"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Sincronização automática:</span>
                <p className="font-medium">
                  {integration.auto_sync_enabled ? "Ativada" : "Desativada"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Frequência:</span>
                <p className="font-medium capitalize">
                  {integration.sync_frequency.replace('_', ' ')}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => window.open(integration.google_drive_link, '_blank')}
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no Google Docs
            </Button>
          </div>
        )}

        {showSetupForm && (
          <GoogleDocsSetupForm
            document={document}
            onSave={handleFormSave}
            onClose={() => setShowSetupForm(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
