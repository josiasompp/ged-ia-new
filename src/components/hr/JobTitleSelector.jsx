
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Briefcase,
  Filter,
  X,
  Check
} from "lucide-react";

// Placeholder for JOB_TITLES_DATA. In a real application, this would likely be imported from a separate data file.
// Assuming the structure is an object where keys are countries and values are arrays of job objects.
const JOB_TITLES_DATA = {
  brasil: [
    { title: "Desenvolvedor Frontend", code: "DEV001", category: "Tecnologia", keywords: ["web", "javascript", "react"] },
    { title: "Desenvolvedor Backend", code: "DEV002", category: "Tecnologia", keywords: ["api", "node", "python"] },
    { title: "Analista de Dados", code: "ANA001", category: "Dados", keywords: ["sql", "bi", "tableau"] },
    { title: "Gerente de Projetos", code: "GER001", category: "Gerência", keywords: ["agile", "scrum", "pmp"] },
    { title: "Designer UX/UI", code: "DES001", category: "Design", keywords: ["figma", "adobe", "usability"] },
    { title: "Engenheiro de Software Sênior", code: "DEV003", category: "Tecnologia", keywords: ["arquitetura", "cloud", "devops"] },
    { title: "Cientista de Dados", code: "ANA002", category: "Dados", keywords: ["machine learning", "estatistica", "r", "python"] },
    { title: "Especialista em Marketing Digital", code: "MKT001", category: "Marketing", keywords: ["seo", "ads", "redes sociais"] },
    { title: "Contador", code: "CON001", category: "Finanças", keywords: ["auditoria", "impostos", "contabilidade"] },
    { title: "Advogado Empresarial", code: "ADV001", category: "Direito", keywords: ["contratos", "corporativo", "societario"] },
    { title: "Enfermeiro", code: "SAU001", category: "Saúde", keywords: ["hospital", "paciente", "urgencia"] },
    { title: "Médico Clínico Geral", code: "SAU002", category: "Saúde", keywords: ["diagnostico", "tratamento", "saude"] },
    { title: "Professor de Ensino Fundamental", code: "EDU001", category: "Educação", keywords: ["pedagogia", "didatica", "alunos"] },
    { title: "Jornalista", code: "COM001", category: "Comunicação", keywords: ["reportagem", "noticia", "midia"] },
    { title: "Arquiteto", code: "ARQ001", category: "Arquitetura", keywords: ["projetos", "construcao", "plantas"] },
  ],
  // Add more countries if needed
  usa: [
    { title: "Software Engineer", code: "SE001", category: "Technology", keywords: ["java", "cloud", "aws"] },
    { title: "Data Scientist", code: "DS001", category: "Data", keywords: ["ml", "r", "python"] }
  ]
};

export default function JobTitleSelector({
  country = 'brasil',
  currentPositionTitle = '',
  currentPositionCode = '',
  onChangePositionTitle,
  onChangePositionCode
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jobTitles, setJobTitles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const titles = JOB_TITLES_DATA[country] || [];
    setJobTitles(titles);

    const uniqueCategories = [...new Set(titles.map(job => job.category))].sort();
    setCategories(uniqueCategories);
  }, [country]);

  // Busca inteligente melhorada
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      return selectedCategory !== "all"
        ? jobTitles.filter(job => job.category === selectedCategory).slice(0, 10)
        : jobTitles.slice(0, 10);
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = jobTitles.filter(job => {
      const titleMatch = job.title.toLowerCase().includes(lowerCaseSearchTerm);
      const codeMatch = job.code.toLowerCase().includes(lowerCaseSearchTerm);
      const categoryMatch = job.category.toLowerCase().includes(lowerCaseSearchTerm);
      const keywordMatch = job.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseSearchTerm));

      const categoryFilter = selectedCategory === "all" || job.category === selectedCategory;

      return (titleMatch || codeMatch || categoryMatch || keywordMatch) && categoryFilter;
    });

    // Sorting logic: prioritize titles that start with the search term
    return filtered.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(lowerCaseSearchTerm);
      const bStarts = b.title.toLowerCase().startsWith(lowerCaseSearchTerm);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return a.title.localeCompare(b.title); // Fallback to alphabetical sort
    }).slice(0, 50); // Limit results for performance
  }, [searchTerm, selectedCategory, jobTitles]);

  const handleSelectJob = (job) => {
    onChangePositionTitle(job.title);
    onChangePositionCode(job.code);
  };

  const isSelected = (job) => {
    return job.title === currentPositionTitle && job.code === currentPositionCode;
  };

  return (
    <div className="space-y-4">
      {/* Header informativo */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione seu Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use a barra de busca para encontrar o cargo ideal. Você pode filtrar por categoria e o sistema irá sugerir os melhores resultados.
          </p>
        </CardContent>
      </Card>

      {/* Filtro por categoria */}
      <div>
        <Label>Filtrar por Categoria</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.filter(Boolean).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campo de busca melhorado */}
      <div>
        <Label htmlFor="search-job-title">Buscar Cargo</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-job-title"
            placeholder="Ex: Desenvolvedor, Analista de Dados..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchTerm.length > 0 && searchTerm.length < 2 && (
          <p className="text-sm text-muted-foreground mt-1">Digite pelo menos 2 caracteres para buscar.</p>
        )}
      </div>

      {/* Resultados da busca */}
      <div className="max-h-80 overflow-y-auto border rounded-md p-2">
        {searchResults.length === 0 && searchTerm.length >= 2 ? (
          <p className="text-center text-muted-foreground p-4">Nenhum cargo encontrado para "{searchTerm}".</p>
        ) : searchResults.length === 0 && searchTerm.length < 2 && jobTitles.length > 0 ? (
          <p className="text-center text-muted-foreground p-4">Selecione uma categoria ou digite na busca.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {searchResults.map((job) => (
              <Button
                key={job.code}
                variant={isSelected(job) ? "default" : "outline"}
                className="justify-between items-center h-auto py-2"
                onClick={() => handleSelectJob(job)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-left">{job.title}</span>
                  <span className="text-xs text-muted-foreground">{job.category} ({job.code})</span>
                </div>
                {isSelected(job) && <Check className="h-4 w-4 ml-2" />}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Exibição do cargo selecionado */}
      {currentPositionTitle && (
        <div className="mt-4 p-3 border rounded-md bg-accent text-accent-foreground flex items-center justify-between">
          <span>
            Cargo Selecionado: <strong className="font-semibold">{currentPositionTitle}</strong> (Código: {currentPositionCode})
          </span>
          <Button variant="ghost" size="sm" onClick={() => { onChangePositionTitle(''); onChangePositionCode(''); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
