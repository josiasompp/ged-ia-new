import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  FileSignature,
  Users,
  MoreVertical,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SignatureTemplateManager({ 
  templates, 
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
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

  const exampleTemplates = [
    {
      id: "template-1",
      name: "Contrato de Prestação de Serviços",
      description: "Template padrão para contratos de serviços com 2 signatários",
      document_type: "contrato",
      signature_fields: [
        { label: "Assinatura Contratante", type: "signature", signer_role: "contratante" },
        { label: "Assinatura Contratado", type: "signature", signer_role: "contratado" }
      ],
      default_signers: [
        { role: "contratante", name: "", email: "", order: 1 },
        { role: "contratado", name: "", email: "", order: 2 }
      ],
      usage_count: 15,
      is_active: true
    },
    {
      id: "template-2", 
      name: "Termo de Aceite de Proposta",
      description: "Template simples para aceite de propostas comerciais",
      document_type: "termo",
      signature_fields: [
        { label: "Assinatura Cliente", type: "signature", signer_role: "cliente" },
        { label: "Data de Aceite", type: "date", signer_role: "cliente" }
      ],
      default_signers: [
        { role: "cliente", name: "", email: "", order: 1 }
      ],
      usage_count: 8,
      is_active: true
    }
  ];

  const allTemplates = [...templates, ...exampleTemplates];

  if (allTemplates.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Crie templates reutilizáveis para agilizar o processo de assinatura.
          </p>
          <Button onClick={() => setShowCreateTemplate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates de Assinatura</h2>
        <Button onClick={() => setShowCreateTemplate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTemplates.map((template) => (
          <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {template.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.document_type}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {template.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Badge className={`${
                  template.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                } flex items-center gap-1`}>
                  {template.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{template.default_signers?.length || 0} signatários</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-medium">{template.usage_count || 0}</span> uso(s)
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Campos de Assinatura:
                </div>
                <div className="space-y-1">
                  {template.signature_fields?.slice(0, 3).map((field, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <FileSignature className="w-3 h-3" />
                      <span>{field.label}</span>
                    </div>
                  ))}
                  {template.signature_fields?.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{template.signature_fields.length - 3} mais...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}