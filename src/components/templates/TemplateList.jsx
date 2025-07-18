
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Layout,
  Video,
  Image,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const sectionTypeIcons = {
  text: FileText,
  video: Video,
  image: Image,
  pricing: DollarSign,
  timeline: Calendar
};

const categoryColors = {
  servicos: "bg-blue-100 text-blue-800",
  produtos: "bg-green-100 text-green-800",
  consultoria: "bg-purple-100 text-purple-800",
  manutencao: "bg-amber-100 text-amber-800",
  outros: "bg-gray-100 text-gray-800"
};

export default function TemplateList({ templates, isLoading, onEdit, onPreview, onDuplicate, onRefresh }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-gray-500">
            Crie seu primeiro template para agilizar a criação de propostas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-[#146FE0] to-[#04BF7B] rounded-xl flex items-center justify-center">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                    {template.is_default && (
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                    )}
                  </div>
                  <Badge className={`${categoryColors[template.category]} text-xs mt-1`}>
                    {template.category}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPreview(template)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(template)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Descrição */}
              <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

              {/* Seções do Template */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Seções ({template.sections?.length || 0})</h4>
                <div className="flex flex-wrap gap-1">
                  {template.sections?.slice(0, 4).map((section, index) => {
                    const Icon = sectionTypeIcons[section.type] || FileText;
                    return (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <Icon className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600">{section.title}</span>
                      </div>
                    );
                  })}
                  {template.sections?.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.sections.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Data de criação */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Criado em {format(new Date(template.created_date), "dd/MM/yyyy", { locale: ptBR })}
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(template)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
