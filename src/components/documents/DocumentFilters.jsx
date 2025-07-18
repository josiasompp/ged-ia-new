
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

const categories = [
  { value: "all", label: "Todas as Categorias" },
  { value: "contrato", label: "Contratos" },
  { value: "nota_fiscal", label: "Notas Fiscais" },
  { value: "relatorio", label: "Relatórios" },
  { value: "procedimento", label: "Procedimentos" },
  { value: "politica", label: "Políticas" },
  { value: "certificado", label: "Certificados" },
  { value: "outros", label: "Outros" }
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "rascunho", label: "Rascunhos" },
  { value: "pendente_aprovacao", label: "Pendente Aprovação" },
  { value: "aprovado", label: "Aprovados" },
  { value: "rejeitado", label: "Rejeitados" },
  { value: "arquivado", label: "Arquivados" }
];

const documentTypes = [
  { value: "all", label: "Todos os Tipos" },
  { value: "upload", label: "Arquivos Locais" },
  { value: "google_drive", label: "Google Drive" }
];

const accessLevels = [
  { value: "all", label: "Todos os Níveis" },
  { value: "publico", label: "Público" },
  { value: "departamento", label: "Departamento" },
  { value: "restrito", label: "Restrito" },
  { value: "confidencial", label: "Confidencial" }
];

// Added companies data for the new filter
const companies = [
  { value: "all", label: "Todas as Empresas" },
  { value: "empresa_a", label: "Empresa A" },
  { value: "empresa_b", label: "Empresa B" },
  { value: "empresa_c", label: "Empresa C" },
];

export default function DocumentFilters({ filters, onFiltersChange, documents }) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      status: "all",
      company: "all", // This is already present and will be handled by the new filter
      document_type: "all",
      access_level: "all"
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all");
  const filteredCount = documents.length;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Filtros Avançados</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  {filteredCount} documentos
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Limpar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
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

            <div>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filters.document_type || "all"} onValueChange={(value) => updateFilter("document_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filters.access_level || "all"} onValueChange={(value) => updateFilter("access_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível de Acesso" />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New: Company Filter */}
            <div>
              <Select value={filters.company || "all"} onValueChange={(value) => updateFilter("company", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.value} value={company.value}>
                      {company.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* The Reset button will now wrap to the next line on lg screens as there are 6 items in a 5-column grid */}
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                Resetar
              </Button>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {documents.filter(doc => doc.document_type === 'google_drive').length}
              </div>
              <div className="text-xs text-gray-500">Google Drive</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {documents.filter(doc => doc.status === 'aprovado').length}
              </div>
              <div className="text-xs text-gray-500">Aprovados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">
                {documents.filter(doc => doc.status === 'pendente_aprovacao').length}
              </div>
              <div className="text-xs text-gray-500">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {documents.filter(doc => doc.access_level === 'confidencial').length}
              </div>
              <div className="text-xs text-gray-500">Confidenciais</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
