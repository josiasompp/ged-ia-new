import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Brain, 
  FileText,
  Calendar,
  User,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { Document } from "@/api/entities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SemanticSearch({ documents, onSelectDocument }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("semantic"); // "semantic" or "traditional"

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const documentsContext = documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        tags: doc.tags,
        content: doc.ai_summary || doc.description || ""
      }));

      const prompt = `Você é um assistente de busca semântica para um sistema GED. 
      
      Consulta do usuário: "${query}"
      
      Documentos disponíveis:
      ${documentsContext.map((doc, index) => 
        `${index + 1}. ID: ${doc.id}
        Título: ${doc.title}
        Categoria: ${doc.category}
        Descrição: ${doc.description}
        Tags: ${doc.tags?.join(', ') || 'Nenhuma'}
        Conteúdo: ${doc.content}
        ---`
      ).join('\n')}
      
      Tarefas:
      1. Interprete a intenção da consulta do usuário
      2. Encontre documentos relevantes baseado no significado, não apenas palavras exatas
      3. Ordene por relevância (mais relevante primeiro)
      4. Para cada resultado, explique por que é relevante
      5. Sugira consultas relacionadas que o usuário pode fazer
      
      Considere sinônimos, contexto e intenção do usuário.`;

      const searchResults = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            interpretation: {
              type: "string",
              description: "Como você interpretou a consulta do usuário"
            },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  document_id: { type: "string" },
                  relevance_score: { type: "number" },
                  relevance_explanation: { type: "string" },
                  matching_aspects: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            suggested_queries: {
              type: "array",
              items: { type: "string" }
            },
            total_found: { type: "number" }
          }
        }
      });

      // Mapear resultados com dados completos dos documentos
      const enrichedResults = searchResults.results.map(result => {
        const document = documents.find(doc => doc.id === result.document_id);
        return {
          ...result,
          document: document
        };
      }).filter(result => result.document); // Filtrar resultados sem documento

      setResults({
        ...searchResults,
        results: enrichedResults
      });

    } catch (error) {
      console.error("Erro na busca semântica:", error);
      alert("Erro ao realizar busca. Tente novamente.");
    }
    setIsSearching(false);
  };

  const handleTraditionalSearch = () => {
    if (!query.trim()) return;

    const searchTerms = query.toLowerCase().split(' ');
    const filteredResults = documents.filter(doc => {
      const searchText = `${doc.title} ${doc.description} ${doc.category} ${doc.tags?.join(' ') || ''}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });

    setResults({
      interpretation: `Busca tradicional por palavras-chave: "${query}"`,
      results: filteredResults.map(doc => ({
        document_id: doc.id,
        document: doc,
        relevance_score: 85,
        relevance_explanation: "Correspondência por palavra-chave",
        matching_aspects: ["título", "descrição", "tags"]
      })),
      suggested_queries: [],
      total_found: filteredResults.length
    });
  };

  const handleSearch = () => {
    if (searchType === "semantic") {
      handleSemanticSearch();
    } else {
      handleTraditionalSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            Busca Inteligente
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Ex: 'Contratos assinados no último trimestre' ou 'Relatórios financeiros da empresa X'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="gap-2"
          >
            {searchType === "semantic" ? (
              <Brain className={`w-4 h-4 ${isSearching ? 'animate-pulse' : ''}`} />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-2">
          <Button
            variant={searchType === "semantic" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType("semantic")}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            Busca Semântica
          </Button>
          <Button
            variant={searchType === "traditional" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType("traditional")}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Busca Tradicional
          </Button>
        </div>

        {/* Search Results */}
        {results.interpretation && (
          <div className="space-y-4">
            {/* Interpretation */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                <MessageSquare className="w-4 h-4" />
                Interpretação da Consulta:
              </div>
              <p className="text-blue-600 text-sm">{results.interpretation}</p>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {results.total_found} documento(s) encontrado(s)
              </h4>
              {searchType === "semantic" && (
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  IA
                </Badge>
              )}
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {results.results.map((result, index) => (
                <div 
                  key={result.document_id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectDocument(result.document)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold">{result.document.title}</h5>
                    </div>
                    {searchType === "semantic" && (
                      <Badge variant="outline">
                        {Math.round(result.relevance_score)}% relevante
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {result.document.description}
                  </p>

                  {searchType === "semantic" && result.relevance_explanation && (
                    <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="text-green-700 font-medium">Por que é relevante: </span>
                      <span className="text-green-600">{result.relevance_explanation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(result.document.created_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {result.document.created_by}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {result.document.category?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Queries */}
            {results.suggested_queries && results.suggested_queries.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2">Consultas Relacionadas:</h5>
                <div className="flex flex-wrap gap-2">
                  {results.suggested_queries.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(suggestion);
                        handleSemanticSearch();
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!results.interpretation && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Busca Inteligente
            </h3>
            <p className="text-gray-500 mb-4">
              Use linguagem natural para encontrar documentos. 
              <br />Ex: "Contratos da empresa ABC" ou "Relatórios do último mês"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}