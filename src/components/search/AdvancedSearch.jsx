import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  FileText,
  User,
  Building2,
  Tag,
  Clock,
  SlidersHorizontal,
  Brain,
  Sparkles,
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SearchResult = ({ document, onView, onDownload }) => {
  const getStatusColor = (status) => {
    const colors = {
      'aprovado': 'bg-green-100 text-green-800',
      'pendente_aprovacao': 'bg-yellow-100 text-yellow-800',
      'rascunho': 'bg-gray-100 text-gray-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'arquivado': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'contrato': 'bg-purple-100 text-purple-800',
      'nota_fiscal': 'bg-green-100 text-green-800',
      'relatorio': 'bg-blue-100 text-blue-800',
      'procedimento': 'bg-orange-100 text-orange-800',
      'politica': 'bg-red-100 text-red-800',
      'certificado': 'bg-yellow-100 text-yellow-800',
      'outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="ghost" size="icon" onClick={() => onView(document)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDownload(document)}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getCategoryColor(document.category)}>
            {document.category?.replace('_', ' ') || 'Outros'}
          </Badge>
          <Badge className={getStatusColor(document.status)}>
            {document.status?.replace('_', ' ') || 'Rascunho'}
          </Badge>
          {document.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {document.created_by || 'Sistema'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {document.created_date ? format(new Date(document.created_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}
          </span>
        </div>
        
        {document.ai_summary && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center gap-1 mb-1">
              <Brain className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Resumo IA</span>
            </div>
            <p className="text-xs text-blue-700 line-clamp-2">{document.ai_summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdvancedSearch({ 
  documents = [], 
  onSearch, 
  isLoading = false,
  departments = [],
  categories = [],
  onViewDocument,
  onDownloadDocument 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    department: 'all',
    access_level: 'all',
    document_type: 'all',
    created_by: '',
    date_from: null,
    date_to: null,
    file_type: 'all',
    tags: []
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState('simple'); // 'simple', 'advanced', 'ai'
  const [aiQuery, setAiQuery] = useState('');
  const [tagInput, setTagInput] = useState('');

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'rascunho', label: 'Rascunhos' },
    { value: 'pendente_aprovacao', label: 'Pendente Aprovação' },
    { value: 'aprovado', label: 'Aprovados' },
    { value: 'rejeitado', label: 'Rejeitados' },
    { value: 'arquivado', label: 'Arquivados' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'contrato', label: 'Contratos' },
    { value: 'nota_fiscal', label: 'Notas Fiscais' },
    { value: 'relatorio', label: 'Relatórios' },
    { value: 'procedimento', label: 'Procedimentos' },
    { value: 'politica', label: 'Políticas' },
    { value: 'certificado', label: 'Certificados' },
    { value: 'outros', label: 'Outros' }
  ];

  const accessLevelOptions = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'publico', label: 'Público' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'restrito', label: 'Restrito' },
    { value: 'confidencial', label: 'Confidencial' }
  ];

  const fileTypeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'application/pdf', label: 'PDF' },
    { value: 'application/msword', label: 'Word (DOC)' },
    { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (DOCX)' },
    { value: 'application/vnd.ms-excel', label: 'Excel (XLS)' },
    { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (XLSX)' },
    { value: 'image/jpeg', label: 'Imagem (JPG)' },
    { value: 'image/png', label: 'Imagem (PNG)' }
  ];

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters, documents]);

  const performSearch = () => {
    let results = [...documents];

    // Busca por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(doc => 
        doc.title?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        doc.ai_summary?.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros
    if (filters.category !== 'all') {
      results = results.filter(doc => doc.category === filters.category);
    }

    if (filters.status !== 'all') {
      results = results.filter(doc => doc.status === filters.status);
    }

    if (filters.department !== 'all') {
      results = results.filter(doc => doc.department_id === filters.department);
    }

    if (filters.access_level !== 'all') {
      results = results.filter(doc => doc.access_level === filters.access_level);
    }

    if (filters.file_type !== 'all') {
      results = results.filter(doc => doc.file_type === filters.file_type);
    }

    if (filters.created_by.trim()) {
      results = results.filter(doc => 
        doc.created_by?.toLowerCase().includes(filters.created_by.toLowerCase())
      );
    }

    if (filters.date_from) {
      results = results.filter(doc => 
        new Date(doc.created_date) >= filters.date_from
      );
    }

    if (filters.date_to) {
      results = results.filter(doc => 
        new Date(doc.created_date) <= filters.date_to
      );
    }

    if (filters.tags.length > 0) {
      results = results.filter(doc => 
        filters.tags.some(tag => doc.tags?.includes(tag))
      );
    }

    setSearchResults(results);
    
    if (onSearch) {
      onSearch(results, { query: searchQuery, filters });
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      department: 'all',
      access_level: 'all',
      document_type: 'all',
      created_by: '',
      date_from: null,
      date_to: null,
      file_type: 'all',
      tags: []
    });
    setSearchQuery('');
    setAiQuery('');
  };

  const addTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAiSearch = async () => {
    // Implementar busca semântica com IA
    console.log('AI Search:', aiQuery);
    // TODO: Integrar com API de busca semântica
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Busca Avançada de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={searchMode} onValueChange={setSearchMode}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Busca Simples
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros Avançados
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Busca Inteligente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Digite sua busca (título, descrição, tags...)  "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={clearFilters} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nível de Acesso</Label>
                  <Select value={filters.access_level} onValueChange={(value) => updateFilter('access_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevelOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Arquivo</Label>
                  <Select value={filters.file_type} onValueChange={(value) => updateFilter('file_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Criado Por</Label>
                  <Input
                    placeholder="Nome do usuário"
                    value={filters.created_by}
                    onChange={(e) => updateFilter('created_by', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Data de Criação</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {filters.date_from ? format(filters.date_from, 'dd/MM/yyyy', { locale: ptBR }) : 'De'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.date_from}
                          onSelect={(date) => updateFilter('date_from', date)}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {filters.date_to ? format(filters.date_to, 'dd/MM/yyyy', { locale: ptBR }) : 'Até'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.date_to}
                          onSelect={(date) => updateFilter('date_to', date)}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Digite uma tag e pressione Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} variant="outline">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={clearFilters} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Busca Inteligente com IA</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Faça perguntas em linguagem natural sobre seus documentos. A IA entenderá o contexto e encontrará os documentos mais relevantes.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 'Mostre contratos assinados no último mês' ou 'Documentos sobre políticas de RH'"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAiSearch} disabled={!aiQuery.trim()}>
                    <Brain className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAiQuery('Contratos vencendo nos próximos 30 dias')}>
                    Contratos vencendo
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiQuery('Documentos aguardando aprovação')}>
                    Pendentes de aprovação
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiQuery('Relatórios financeiros do último trimestre')}>
                    Relatórios financeiros
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAiQuery('Políticas de segurança atualizadas')}>
                    Políticas de segurança
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resultados da Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resultados da Busca
            </span>
            <Badge variant="secondary">
              {searchResults.length} documento(s) encontrado(s)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Buscando documentos...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((document) => (
                <SearchResult
                  key={document.id}
                  document={document}
                  onView={onViewDocument}
                  onDownload={onDownloadDocument}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== '' && f !== null && f?.length !== 0) 
                  ? 'Nenhum documento encontrado com os critérios especificados'
                  : 'Digite uma busca ou configure filtros para encontrar documentos'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}