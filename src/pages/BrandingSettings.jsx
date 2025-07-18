
import React, { useState, useEffect, useCallback } from "react";
import { Company } from "@/api/entities";
import { CompanyBranding } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Palette, UploadCloud, Type, Save, Brush, Code, Loader2, Building2, Globe } from "lucide-react";

import ColorPicker from "../components/branding/ColorPicker";
import LogoUpload from "../components/branding/LogoUpload";
import FontSelector from "../components/branding/FontSelector";
import BrandingPreview from "../components/branding/BrandingPreview";
import DomainConfiguration from "../components/branding/DomainConfiguration";

const defaultBranding = {
    logo_url: "",
    logo_dark_url: "",
    favicon_url: "",
    primary_color: "#212153",
    secondary_color: "#146FE0",
    accent_color: "#04BF7B",
    background_color: "#F8FAFC",
    text_color: "#1E293B",
    font_family: "Sora",
    company_name_display: "",
    tagline: "",
    custom_css: "",
    show_powered_by: true,
    is_active: true,
};

export default function BrandingSettings() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [branding, setBranding] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCompanies() {
      setIsLoading(true);
      try {
        const companyData = await Company.list("-created_date");
        setCompanies(Array.isArray(companyData) ? companyData : []);
      } catch (error) {
        toast({ title: "Erro ao carregar empresas.", variant: "destructive" });
      }
      setIsLoading(false);
    }
    fetchCompanies();
  }, [toast]);

  const loadBrandingForCompany = useCallback(async (companyId) => {
    if (!companyId) {
      setBranding(null);
      return;
    }
    setIsLoading(true);
    try {
      const brandingData = await CompanyBranding.filter({ company_id: companyId });
      if (brandingData && brandingData.length > 0) {
        setBranding(brandingData[0]);
      } else {
        const selectedCompany = companies.find(c => c.id === companyId);
        setBranding({ 
            ...defaultBranding, 
            company_id: companyId,
            company_name_display: selectedCompany?.name || "",
        });
      }
    } catch (error) {
      toast({ title: "Erro ao carregar branding da empresa.", variant: "destructive" });
      setBranding(null);
    }
    setIsLoading(false);
  }, [companies, toast]);

  useEffect(() => {
    loadBrandingForCompany(selectedCompanyId);
  }, [selectedCompanyId, loadBrandingForCompany]);
  
  const handleBrandingChange = (field, value) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setFilesToUpload(prev => ({ ...prev, [field]: file }));
      handleBrandingChange(field, URL.createObjectURL(file));
    } else {
      const newFiles = { ...filesToUpload };
      delete newFiles[field];
      setFilesToUpload(newFiles);
      handleBrandingChange(field, "");
    }
  };

  const handleSave = async () => {
    if (!branding) return;
    setIsSaving(true);
    
    try {
      const dataToSave = { ...branding };

      for (const fieldKey of Object.keys(filesToUpload)) {
        const file = filesToUpload[fieldKey];
        if (file) {
          const { file_url } = await UploadFile({ file });
          dataToSave[fieldKey] = file_url;
        }
      }

      if (branding.id) {
        await CompanyBranding.update(branding.id, dataToSave);
      } else {
        await CompanyBranding.create(dataToSave);
      }
      
      toast({ title: "Branding salvo com sucesso!" });
      setFilesToUpload({});
      loadBrandingForCompany(selectedCompanyId);
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "Erro ao salvar branding.", description: error.message, variant: "destructive" });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Personalização (Branding)
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Customize a aparência do sistema para cada empresa.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !branding}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Selecione a Empresa</CardTitle>
          <CardDescription>Escolha uma empresa para visualizar e editar suas configurações de branding.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} disabled={isLoading}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!selectedCompanyId ? (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <Building2 className="w-16 h-16 text-gray-300 mb-4"/>
                <h3 className="text-xl font-semibold text-gray-700">Nenhuma empresa selecionada</h3>
                <p className="text-gray-500 mt-2">Por favor, selecione uma empresa acima para começar a personalizar.</p>
            </CardContent>
        </Card>
      ) : isLoading || !branding ? (
         <Card className="border-0 shadow-sm">
            <CardContent className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin"/>
                <p className="text-gray-600 mt-4">Carregando configurações de branding...</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="visual" className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
                  <TabsTrigger value="visual" className="flex items-center gap-2"><Brush className="w-4 h-4" /> Visual</TabsTrigger>
                  <TabsTrigger value="logos" className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Logos</TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-2"><Type className="w-4 h-4" /> Informações</TabsTrigger>
                  <TabsTrigger value="domain" className="flex items-center gap-2"><Globe className="w-4 h-4" /> Domínio</TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-2"><Code className="w-4 h-4" /> Avançado</TabsTrigger>
                </TabsList>
              </ScrollArea>

              <TabsContent value="visual" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cores e Fontes</CardTitle>
                    <CardDescription>Defina a paleta de cores principal e a fonte do sistema.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker label="Cor Primária" value={branding.primary_color} onChange={(v) => handleBrandingChange('primary_color', v)} />
                    <ColorPicker label="Cor Secundária" value={branding.secondary_color} onChange={(v) => handleBrandingChange('secondary_color', v)} />
                    <ColorPicker label="Cor de Destaque" value={branding.accent_color} onChange={(v) => handleBrandingChange('accent_color', v)} />
                    <ColorPicker label="Cor de Fundo" value={branding.background_color} onChange={(v) => handleBrandingChange('background_color', v)} />
                    <ColorPicker label="Cor do Texto" value={branding.text_color} onChange={(v) => handleBrandingChange('text_color', v)} />
                    <FontSelector label="Fonte Principal" value={branding.font_family} onChange={(v) => handleBrandingChange('font_family', v)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logos" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Logos e Favicon</CardTitle>
                    <CardDescription>Faça upload dos logos da empresa para tema claro, escuro e do favicon.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LogoUpload label="Logo Principal" value={branding.logo_url} onChange={(f) => handleFileChange('logo_url', f)} description="Para fundos claros." />
                    <LogoUpload label="Logo (Tema Escuro)" value={branding.logo_dark_url} onChange={(f) => handleFileChange('logo_dark_url', f)} description="Opcional, para fundos escuros." />
                    <LogoUpload label="Favicon" value={branding.favicon_url} onChange={(f) => handleFileChange('favicon_url', f)} description=".ico, .png, .svg" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="info" className="space-y-6 mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Informações de Exibição</CardTitle>
                    <CardDescription>Como o nome da empresa e o slogan aparecerão no sistema.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="company_name_display">Nome de Exibição</Label>
                      <Input id="company_name_display" value={branding.company_name_display} onChange={(e) => handleBrandingChange('company_name_display', e.target.value)} />
                    </div>
                     <div>
                      <Label htmlFor="tagline">Slogan (Tagline)</Label>
                      <Input id="tagline" value={branding.tagline} onChange={(e) => handleBrandingChange('tagline', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="domain" className="space-y-6 mt-4">
                <DomainConfiguration 
                  branding={branding}
                  onSave={handleSave}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="custom_css">CSS Personalizado</Label>
                    <Textarea
                      id="custom_css"
                      value={branding.custom_css}
                      onChange={(e) => handleBrandingChange('custom_css', e.target.value)}
                      placeholder="/* Adicione seu CSS aqui */"
                      rows={10}
                      className="font-mono"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="xl:sticky xl:top-24">
            <BrandingPreview branding={branding} />
          </div>
        </div>
      )}
    </div>
  );
}
