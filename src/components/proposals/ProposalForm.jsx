
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UploadFile } from "@/api/integrations";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Calendar as CalendarIcon, 
  User, 
  Building2,
  DollarSign,
  Link,
  Send,
  Paperclip,
  UploadCloud,
  X,
  File as FileIcon,
  Eye,
  Palette
} from "lucide-react";

import ProposalBrandingTab from "./ProposalBrandingTab";

const categories = [
  { value: "servicos", label: "Serviços" },
  { value: "produtos", label: "Produtos" },
  { value: "consultoria", label: "Consultoria" },
  { value: "manutencao", label: "Manutenção" },
  { value: "outros", label: "Outros" }
];

const FileAttachment = ({ label, fieldKey, fileName, onFileSelect, onFileRemove, disabled }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(fieldKey, e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50/50">
        {fileName ? (
          <>
            <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-gray-700 truncate">{fileName}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => onFileRemove(fieldKey)} disabled={disabled} className="w-8 h-8 flex-shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm text-gray-500">Nenhum arquivo anexado</span>
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current.click()} disabled={disabled}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Anexar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default function ProposalForm({ proposal, templates, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    client_company: "",
    category: "",
    template_id: "",
    total_value: "",
    expiry_date: null,
    redirect_url: "",
    content: {},
    main_proposal_url: "",
    main_proposal_filename: "",
    scope_document_url: "",
    scope_document_filename: "",
    presentation_url: "",
    presentation_filename: ""
  });

  const [proposalBranding, setProposalBranding] = useState({
    primary_color: "#212153",
    secondary_color: "#146FE0",
    accent_color: "#04BF7B",
    background_color: "#F8FAFC",
    text_color: "#1E293B",
    font_family: "Sora",
    client_theme: "corporativo",
    background_pattern: "none",
    use_client_branding: false,
    custom_header_title: "",
    custom_footer_text: "",
    client_logo_url: "",
    custom_css: "",
    is_active: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (proposal) {
      setFormData({
        ...proposal,
        expiry_date: proposal.expiry_date ? new Date(proposal.expiry_date) : null
      });
      if (proposal.custom_branding) {
        setProposalBranding(proposal.custom_branding);
      } else {
        setProposalBranding({
          primary_color: "#212153",
          secondary_color: "#146FE0",
          accent_color: "#04BF7B",
          background_color: "#F8FAFC",
          text_color: "#1E293B",
          font_family: "Sora",
          client_theme: "corporativo",
          background_pattern: "none",
          use_client_branding: false,
          custom_header_title: "",
          custom_footer_text: "",
          client_logo_url: "",
          custom_css: "",
          is_active: true
        });
      }
    }
  }, [proposal]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileSelect = (fieldKey, file) => {
    setFilesToUpload(prev => ({ ...prev, [fieldKey]: file }));
    handleChange(`${fieldKey}_filename`, file.name);
    handleChange(`${fieldKey}_url`, "");
  };
  
  const handleFileRemove = (fieldKey) => {
    setFilesToUpload(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldKey];
      return newFiles;
    });
    handleChange(`${fieldKey}_url`, "");
    handleChange(`${fieldKey}_filename`, "");
  };

  const generateShareableLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return createPageUrl(`ProposalView?id=${uniqueId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.title || !formData.client_name || !formData.client_email || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios: Título, Nome do Cliente, Email e Categoria.");
      return;
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.client_email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    setIsSaving(true);

    const dataWithUploads = { ...formData };

    try {
      // Upload dos arquivos
      for (const fieldKey of Object.keys(filesToUpload)) {
        const file = filesToUpload[fieldKey];
        if (file) {
          const { file_url } = await UploadFile({ file });
          dataWithUploads[`${fieldKey}_url`] = file_url;
        }
      }

      // Preparar os dados para envio
      const dataToSave = {
        ...dataWithUploads,
        // Garantir que company_id está presente
        company_id: currentUser?.company_id || "default_company",
        // Converter total_value para número ou null
        total_value: dataWithUploads.total_value ? parseFloat(dataWithUploads.total_value) : null,
        // Formatar data corretamente
        expiry_date: dataWithUploads.expiry_date ? format(dataWithUploads.expiry_date, "yyyy-MM-dd") : null,
        // Garantir que share_link está presente
        share_link: proposal?.share_link || generateShareableLink(),
        // Status padrão
        status: proposal?.status || "rascunho",
        // Incluir dados de branding personalizado apenas se estiver ativo
        custom_branding: proposalBranding.use_client_branding ? proposalBranding : null,
        // Garantir que salesperson_email está presente
        salesperson_email: currentUser?.email || ""
      };

      // Remover campos vazios ou undefined
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === "" || dataToSave[key] === undefined) {
          if (key === 'total_value') {
            dataToSave[key] = null;
          } else if (key !== 'company_id' && key !== 'salesperson_email') {
            delete dataToSave[key];
          }
        }
      });

      await onSave(dataToSave);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert("Erro ao salvar proposta. Verifique os dados e tente novamente.");
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {proposal ? "Editar Proposta" : "Nova Proposta Comercial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 border-b border-gray-200">
            <Button
              type="button"
              variant={activeTab === "basic" ? "default" : "ghost"}
              onClick={() => setActiveTab("basic")}
              className="rounded-b-none"
            >
              Informações Básicas
            </Button>
            <Button
              type="button"
              variant={activeTab === "branding" ? "default" : "ghost"}
              onClick={() => setActiveTab("branding")}
              className="rounded-b-none gap-2"
            >
              <Palette className="w-4 h-4" />
              Personalização Visual
            </Button>
            <Button
              type="button"
              variant={activeTab === "files" ? "default" : "ghost"}
              onClick={() => setActiveTab("files")}
              className="rounded-b-none"
            >
              Anexos
            </Button>
          </div>

          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Informações da Proposta
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Proposta *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Ex: Proposta de Desenvolvimento de Sistema"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleChange("category", value)}
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

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descrição detalhada da proposta..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Dados do Cliente
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Nome do Cliente *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => handleChange("client_name", e.target.value)}
                      placeholder="Nome completo do cliente"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_email">Email *</Label>
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => handleChange("client_email", e.target.value)}
                      placeholder="email@cliente.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_phone">Telefone</Label>
                    <Input
                      id="client_phone"
                      value={formData.client_phone}
                      onChange={(e) => handleChange("client_phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_company">Empresa do Cliente</Label>
                    <Input
                      id="client_company"
                      value={formData.client_company}
                      onChange={(e) => handleChange("client_company", e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Configurações Comerciais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_value">Valor Total (R$)</Label>
                    <Input
                      id="total_value"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.total_value}
                      onChange={(e) => handleChange("total_value", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data de Validade</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expiry_date ? format(formData.expiry_date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.expiry_date}
                          onSelect={(date) => handleChange("expiry_date", date)}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template_id">Template</Label>
                    <Select 
                      value={formData.template_id} 
                      onValueChange={(value) => handleChange("template_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redirect_url">URL de Redirecionamento (pós-aceite)</Label>
                  <Input
                    id="redirect_url"
                    type="url"
                    value={formData.redirect_url}
                    onChange={(e) => handleChange("redirect_url", e.target.value)}
                    placeholder="https://seusite.com/obrigado"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "branding" && (
            <ProposalBrandingTab
              branding={proposalBranding}
              onBrandingChange={setProposalBranding}
              clientName={formData.client_name}
              clientCompany={formData.client_company}
            />
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-gray-600" />
                Anexos da Proposta
              </h3>
              
              <FileAttachment 
                label="Documento Principal da Proposta"
                fieldKey="main_proposal"
                fileName={formData.main_proposal_filename || (formData.main_proposal_url ? "Arquivo existente" : "")}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                disabled={isSaving}
              />
              <FileAttachment 
                label="Documento de Escopo"
                fieldKey="scope_document"
                fileName={formData.scope_document_filename || (formData.scope_document_url ? "Arquivo existente" : "")}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                disabled={isSaving}
              />
              <FileAttachment 
                label="Apresentação da Empresa"
                fieldKey="presentation"
                fileName={formData.presentation_filename || (formData.presentation_url ? "Arquivo existente" : "")}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                disabled={isSaving}
              />
            </div>
          )}

          <DialogFooter className="gap-3 border-t pt-6">
            {proposal && proposal.share_link && (
              <Button asChild variant="secondary" className="mr-auto">
                <a href={proposal.share_link} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar como Cliente
                </a>
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !formData.title || !formData.client_name || !formData.client_email || !formData.category}
              className="bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {proposal ? "Atualizar Proposta" : "Criar Proposta"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
