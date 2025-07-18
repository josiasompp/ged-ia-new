import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineTitle, TimelineIcon, TimelineDescription } from '@/components/ui/timeline';
import { 
  GitCommit, 
  FileText, 
  User, 
  Calendar,
  Download,
  Upload,
  Loader2,
  X,
  History
} from 'lucide-react';
import { DocumentVersion } from '@/api/entities';
import { Document } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User as UserEntity } from '@/api/entities';

export default function DocumentVersionHistory({ document, onVersionChange, onClose }) {
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const fileInputRef = useRef(null);
  
    useEffect(() => {
        const fetchUserAndVersions = async () => {
            setIsLoading(true);
            try {
                const [user, versionData] = await Promise.all([
                    UserEntity.me(),
                    DocumentVersion.filter({ document_id: document.id }, '-created_date')
                ]);
                setCurrentUser(user);
                setVersions(versionData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
            setIsLoading(false);
        };

        if(document?.id) {
            fetchUserAndVersions();
        }
    }, [document]);
  
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !currentUser) return;

        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            const newVersionNumber = (parseFloat(document.version || "1.0") + 0.1).toFixed(1);

            await DocumentVersion.create({
                document_id: document.id,
                company_id: document.company_id,
                version_number: newVersionNumber,
                file_url,
                file_name: file.name,
                file_size: file.size,
                change_description: "Nova versão enviada pelo usuário.",
                uploaded_by: currentUser.email
            });

            await Document.update(document.id, {
                version: newVersionNumber,
                file_url,
                file_name: file.name,
                file_size: file.size,
            });

            if (onVersionChange) {
                onVersionChange();
            }
            // Re-fetch versions after upload
            const versionData = await DocumentVersion.filter({ document_id: document.id }, '-created_date');
            setVersions(versionData);

        } catch (error) {
            console.error("Erro ao fazer upload da nova versão:", error);
            alert("Falha ao enviar nova versão. Tente novamente.");
        }
        setIsUploading(false);
    };

    const handleRevertToVersion = async (version) => {
        if(!window.confirm(`Tem certeza que deseja reverter para a versão ${version.version_number}? O arquivo atual será substituído.`)) return;

        try {
            await Document.update(document.id, {
                version: version.version_number,
                file_url: version.file_url,
                file_name: version.file_name,
                file_size: version.file_size,
            });
            alert(`Documento revertido para a versão ${version.version_number}.`);
            if (onVersionChange) {
                onVersionChange();
            }
        } catch (error) {
            console.error("Erro ao reverter versão:", error);
            alert("Falha ao reverter a versão. Tente novamente.");
        }
    };
  
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <History className="w-5 h-5"/>
                    Histórico de Versões
                </DialogTitle>
                <DialogDescription>Acompanhe todas as alterações e reverta para versões anteriores se necessário.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <Button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="mb-6 w-full gap-2">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>}
                    {isUploading ? "Enviando..." : "Carregar Nova Versão"}
                </Button>
                
                <div className="max-h-[50vh] overflow-y-auto pr-4">
                    {isLoading ? (
                        <p className="text-center text-gray-500">Carregando histórico...</p>
                    ) : (
                        <Timeline>
                        {versions.map((version, index) => (
                            <TimelineItem key={version.id}>
                            <TimelineConnector />
                            <TimelineHeader>
                                <TimelineIcon>
                                    <GitCommit className="w-4 h-4" />
                                </TimelineIcon>
                                <TimelineTitle>Versão {version.version_number}</TimelineTitle>
                                {index === 0 && <Badge variant="default" className="ml-2 bg-green-600">Atual</Badge>}
                            </TimelineHeader>
                            <div className="pl-8 py-3 space-y-2">
                                <p className="text-sm text-gray-600">{version.change_description}</p>
                                <div className="text-xs text-gray-500 flex items-center gap-4 flex-wrap">
                                    <span className="flex items-center gap-1.5"><User className="w-3 h-3"/> {version.uploaded_by}</span>
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3"/> {format(parseISO(version.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={version.file_url} target="_blank" rel="noopener noreferrer" className="gap-1.5"><Download className="w-3 h-3"/> Baixar</a>
                                    </Button>
                                    {index !== 0 && (
                                        <Button size="sm" variant="ghost" onClick={() => handleRevertToVersion(version)}>
                                            Reverter para esta versão
                                        </Button>
                                    )}
                                </div>
                            </div>
                            </TimelineItem>
                        ))}
                        </Timeline>
                    )}
                    {versions.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-center py-8">Nenhuma versão anterior encontrada.</p>
                    )}
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    <X className="w-4 h-4 mr-2"/>
                    Fechar
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}