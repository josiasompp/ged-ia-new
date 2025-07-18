
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Upload, 
  Eye, 
  Wand2,
  Monitor,
  Smartphone,
  Tablet,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { UploadFile } from "@/api/integrations";

import ColorPicker from "../branding/ColorPicker";
import LogoUpload from "../branding/LogoUpload";

const clientThemes = [
  { 
    value: "corporativo", 
    label: "Corporativo", 
    description: "Profissional e confiável",
    colors: { primary: "#1E40AF", secondary: "#3B82F6", accent: "#10B981" }
  },
  { 
    value: "moderno", 
    label: "Moderno", 
    description: "Inovador e tecnológico",
    colors: { primary: "#7C2D12", secondary: "#EA580C", accent: "#F59E0B" }
  },
  { 
    value: "elegante", 
    label: "Elegante", 
    description: "Sofisticado e premium",
    colors: { primary: "#581C87", secondary: "#7C3AED", accent: "#A855F7" }
  },
  { 
    value: "minimalista", 
    label: "Minimalista", 
    description: "Limpo e simples",
    colors: { primary: "#374151", secondary: "#6B7280", accent: "#10B981" }
  },
  { 
    value: "criativo", 
    label: "Criativo", 
    description: "Vibrante e dinâmico",
    colors: { primary: "#BE185D", secondary: "#EC4899", accent: "#F59E0B" }
  }
];

const backgroundPatterns = [
  { value: "none", label: "Sem padrão", preview: "bg-white" },
  { value: "dots", label: "Pontos", preview: "bg-dot-pattern" },
  { value: "waves", label: "Ondas", preview: "bg-wave-pattern" },
  { value: "geometric", label: "Geométrico", preview: "bg-geometric-pattern" },
  { value: "gradient", label: "Gradiente", preview: "bg-gradient-pattern" }
];

export default function ProposalBrandingTab({ 
  branding, 
  onBrandingChange, 
  clientName = "",
  clientCompany = "" 
}) {
  const [previewMode, setPreviewMode] = useState("desktop");

  const handleChange = (field, value) => {
    onBrandingChange({ ...branding, [field]: value });
  };

  const handleFileUpload = async (field, file) => {
    try {
      const { file_url } = await UploadFile({ file });
      handleChange(field, file_url);
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };

  const applyTheme = (theme) => {
    const selectedTheme = clientThemes.find(t => t.value === theme);
    if (selectedTheme) {
      handleChange("client_theme", theme);
      handleChange("primary_color", selectedTheme.colors.primary);
      handleChange("secondary_color", selectedTheme.colors.secondary);
      handleChange("accent_color", selectedTheme.colors.accent);
    }
  };

  const generateClientBranding = () => {
    // IA simulada para gerar branding baseado no cliente
    const suggestions = {
      custom_header_title: `Proposta Exclusiva para ${clientCompany || clientName}`,
      custom_footer_text: `Desenvolvido especialmente para ${clientName}`,
      client_theme: "corporativo"
    };
    
    Object.keys(suggestions).forEach(key => {
      handleChange(key, suggestions[key]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com ações rápidas */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalização Visual da Proposta
              </h3>
              <p className="text-gray-600 text-sm">
                Customize o visual desta proposta para criar uma experiência única para {clientName || "o cliente"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={generateClientBranding}
                className="gap-2"
              >
                <Wand2 className="w-4 h-4" />
                IA: Gerar Branding
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="use_client_branding"
                  checked={branding.use_client_branding}
                  onChange={(e) => handleChange("use_client_branding", e.target.checked)}
                />
                <Label htmlFor="use_client_branding" className="text-sm">
                  Priorizar branding do cliente
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Configurações */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Tema
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Cores
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Imagens
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temas Pré-definidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientThemes.map((theme) => (
                      <div
                        key={theme.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          branding.client_theme === theme.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => applyTheme(theme.value)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{theme.label}</h4>
                          {branding.client_theme === theme.value && (
                            <Badge className="bg-blue-500">Ativo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                        <div className="flex gap-2">
                          {Object.values(theme.colors).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Padrões de Fundo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {backgroundPatterns.map((pattern) => (
                      <div
                        key={pattern.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all h-20 ${
                          branding.background_pattern === pattern.value
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${pattern.preview}`}
                        onClick={() => handleChange("background_pattern", pattern.value)}
                      >
                        <div className="text-xs font-medium text-center">
                          {pattern.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cores Personalizadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Cor Primária"
                      value={branding.primary_color}
                      onChange={(color) => handleChange("primary_color", color)}
                      description="Cor principal dos cabeçalhos e botões"
                    />
                    <ColorPicker
                      label="Cor Secundária"
                      value={branding.secondary_color}
                      onChange={(color) => handleChange("secondary_color", color)}
                      description="Cor secundária para destaques"
                    />
                    <ColorPicker
                      label="Cor de Destaque" 
                      value={branding.accent_color}
                      onChange={(color) => handleChange("accent_color", color)}
                      description="Cor para elementos de ação"
                    />
                    <ColorPicker
                      label="Cor de Fundo"
                      value={branding.background_color}
                      onChange={(color) => handleChange("background_color", color)}
                      description="Cor de fundo da proposta"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <LogoUpload
                    label="Logo do Cliente (Opcional)"
                    value={branding.client_logo_url}
                    onChange={(file) => handleFileUpload("client_logo_url", file)}
                    description="Adicione o logo do cliente para personalizar ainda mais a proposta"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Textos Personalizados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom_header_title">Título do Cabeçalho</Label>
                    <Input
                      id="custom_header_title"
                      value={branding.custom_header_title || ""}
                      onChange={(e) => handleChange("custom_header_title", e.target.value)}
                      placeholder={`Proposta para ${clientName || "Cliente"}`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custom_footer_text">Texto do Rodapé</Label>
                    <Textarea
                      id="custom_footer_text"
                      value={branding.custom_footer_text || ""}
                      onChange={(e) => handleChange("custom_footer_text", e.target.value)}
                      placeholder="Texto personalizado para o rodapé da proposta..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="font_family">Fonte</Label>
                    <Select 
                      value={branding.font_family} 
                      onValueChange={(value) => handleChange("font_family", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sora">Sora (Padrão FirstDocy)</SelectItem>
                        <SelectItem value="Inter">Inter (Moderno)</SelectItem>
                        <SelectItem value="Roboto">Roboto (Google)</SelectItem>
                        <SelectItem value="Open Sans">Open Sans (Legível)</SelectItem>
                        <SelectItem value="Montserrat">Montserrat (Elegante)</SelectItem>
                        <SelectItem value="Poppins">Poppins (Amigável)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom_css">CSS Personalizado</Label>
                    <Textarea
                      id="custom_css"
                      value={branding.custom_css || ""}
                      onChange={(e) => handleChange("custom_css", e.target.value)}
                      placeholder="/* CSS personalizado para esta proposta */"
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview da Proposta
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProposalBrandingPreview 
                branding={branding}
                mode={previewMode}
                clientName={clientName}
                clientCompany={clientCompany}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const ProposalBrandingPreview = ({ branding, mode, clientName, clientCompany }) => {
  const containerClass = {
    desktop: "w-full h-96",
    tablet: "w-80 h-96 mx-auto",
    mobile: "w-64 h-96 mx-auto"
  };

  const previewStyle = {
    '--preview-primary': branding.primary_color,
    '--preview-secondary': branding.secondary_color,
    '--preview-accent': branding.accent_color,
    '--preview-background': branding.background_color,
    '--preview-text': branding.text_color,
    fontFamily: branding.font_family || 'Sora',
    backgroundColor: branding.background_color,
    color: branding.text_color
  };

  return (
    <div className={`${containerClass[mode]} border rounded-lg overflow-hidden shadow-sm`} style={previewStyle}>
      {/* Header da Proposta */}
      <div 
        className="h-20 px-4 flex items-center justify-between"
        style={{ 
          background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.secondary_color} 100%)`,
          color: 'white'
        }}
      >
        <div className="flex items-center gap-3">
          {branding.client_logo_url ? (
            <img 
              src={branding.client_logo_url} 
              alt="Cliente Logo" 
              className="h-10 max-w-32 object-contain"
            />
          ) : (
            <div className="font-bold text-lg">
              {branding.custom_header_title || `Proposta para ${clientCompany || clientName}`}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da Proposta */}
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        <div className="bg-white/80 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2" style={{ color: branding.primary_color }}>
            Nossa Proposta
          </h3>
          <p className="text-sm text-gray-600">
            Apresentamos uma solução personalizada desenvolvida especialmente para suas necessidades...
          </p>
        </div>

        <div className="bg-white/80 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2" style={{ color: branding.secondary_color }}>
            Investimento
          </h3>
          <div 
            className="text-2xl font-bold"
            style={{ color: branding.accent_color }}
          >
            R$ 15.000,00
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-gray-500 mt-auto">
          {branding.custom_footer_text || `Desenvolvido especialmente para ${clientName}`}
        </div>
      </div>
    </div>
  );
};
