
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Added Label import
import {
  FileText,
  LayoutDashboard,
  Building2,
  Bell,
  User,
  Menu,
  Eye // Added Eye icon import
} from "lucide-react";

export default function BrandingPreview({ branding, mode = "desktop" }) {
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    // Verificar se há domínio personalizado configurado
    if (branding?.custom_domain) {
      setCustomDomain(branding.custom_domain);
    }
  }, [branding]);

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
    '--preview-font': branding.font_family,
    backgroundColor: branding.background_color,
    color: branding.text_color,
    fontFamily: branding.font_family
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Pré-visualização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Preview */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <Label className="text-xs text-gray-500">URL do Sistema</Label>
          <div className="mt-1 text-sm font-mono bg-white p-2 rounded border">
            {customDomain || branding?.custom_domain ? (
              <span className="text-green-600">https://{customDomain || branding.custom_domain}</span>
            ) : (
              <span className="text-gray-500">https://sistema.suaempresa.com.br</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure um domínio personalizado para ocultar a URL base
          </p>
        </div>

        {/* Original Branding Preview Content */}
        <div className={`${containerClass[mode]} border rounded-lg overflow-hidden shadow-sm`} style={previewStyle}>
          {/* Header */}
          <div
            className="h-16 px-4 flex items-center justify-between border-b"
            style={{
              background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.secondary_color} 100%)`,
              color: 'white'
            }}
          >
            <div className="flex items-center gap-3">
              {branding.logo_url ? (
                <img
                  src={branding.logo_url}
                  alt="Logo"
                  className="h-8 max-w-32 object-contain"
                />
              ) : (
                <div className="font-bold text-lg">
                  {branding.company_name_display || "Sua Empresa"}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            {/* Cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" style={{ color: branding.secondary_color }} />
                    <h4 className="font-medium text-sm">Dashboard</h4>
                  </div>
                  <Badge style={{ backgroundColor: branding.accent_color, color: 'white' }} className="text-xs">
                    Novo
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">Visão geral do sistema</p>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" style={{ color: branding.secondary_color }} />
                  <h4 className="font-medium text-sm">Documentos</h4>
                </div>
                <p className="text-xs text-gray-600">Gestão documental</p>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4" style={{ color: branding.secondary_color }} />
                  <h4 className="font-medium text-sm">Empresas</h4>
                </div>
                <p className="text-xs text-gray-600">Multi-tenant</p>
              </div>
            </div>

            {/* Button Preview */}
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.secondary_color} 100%)`
                }}
              >
                Botão Primário
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                style={{
                  borderColor: branding.secondary_color,
                  color: branding.secondary_color
                }}
              >
                Botão Secundário
              </Button>
            </div>

            {/* Tagline */}
            {branding.tagline && (
              <div className="text-center">
                <p className="text-xs italic" style={{ color: branding.secondary_color }}>
                  {branding.tagline}
                </p>
              </div>
            )}

            {/* Powered by */}
            {branding.show_powered_by && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Powered by FirstDocy
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
