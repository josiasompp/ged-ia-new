import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Sparkles, 
  Tag,
  FileText,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { Document } from "@/api/entities";

const categoryLabels = {
  contrato: "Contrato",
  nota_fiscal: "Nota Fiscal",
  relatorio: "Relatório",
  procedimento: "Procedimento",
  politica: "Política",
  certificado: "Certificado",
  outros: "Outros"
};

const confidenceColors = {
  high: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-red-100 text-red-800"
};

export default function AIDocumentClassifier({ document, onUpdate }) {
  const [classification, setClassification] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    // Verificar se o documento já foi classificado pela IA
    if (document.ai_classification) {
      setClassification(JSON.parse(document.ai_classification));
      setHasAnalyzed(true);
    }
  }, [document]);

  const analyzeDocument = async () => {
    if (!document.file_url) {
      alert("Documento precisa ter um arquivo para análise.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const prompt = `Analise o documento anexado e classifique-o automaticamente.

      Título: ${document.title}
      Descrição atual: ${document.description || 'Não informado'}
      Categoria atual: ${document.category || 'Não informado'}

      Tarefas:
      1. Identifique a categoria mais apropriada do documento
      2. Sugira tags relevantes baseadas no conteúdo
      3. Extraia informações-chave (pessoas, empresas, datas, valores)
      4. Avalie a qualidade e completude do documento
      5. Sugira melhorias nos metadados

      Categorias disponíveis: contrato, nota_fiscal, relatorio, procedimento, politica, certificado, outros`;

      const analysis = await InvokeLLM({
        prompt: prompt,
        file_urls: [document.file_url],
        response_json_schema: {
          type: "object",
          properties: {
            suggested_category: {
              type: "string",
              enum: ["contrato", "nota_fiscal", "relatorio", "procedimento", "politica", "certificado", "outros"]
            },
            confidence_level: {
              type: "string",
              enum: ["high", "medium", "low"]
            },
            confidence_percentage: {
              type: "number"
            },
            suggested_tags: {
              type: "array",
              items: { type: "string" }
            },
            key_entities: {
              type: "object",
              properties: {
                people: { type: "array", items: { type: "string" } },
                companies: { type: "array", items: { type: "string" } },
                dates: { type: "array", items: { type: "string" } },
                values: { type: "array", items: { type: "string" } }
              }
            },
            quality_score: {
              type: "number",
              description: "Score de qualidade de 0 a 100"
            },
            suggested_title: {
              type: "string"
            },
            suggested_description: {
              type: "string"
            },
            classification_explanation: {
              type: "string"
            },
            improvement_suggestions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setClassification(analysis);
      setHasAnalyzed(true);

      // Salvar classificação no documento
      await Document.update(document.id, {
        ai_classification: JSON.stringify(analysis)
      });

    } catch (error) {
      console.error("Erro na classificação:", error);
      alert("Erro ao analisar documento. Tente novamente.");
    }
    setIsAnalyzing(false);
  };

  const applyClassification = async () => {
    if (!classification) return;

    try {
      const updates = {
        category: classification.suggested_category,
        tags: [...(document.tags || []), ...classification.suggested_tags],
      };

      // Aplicar sugestões de título e descrição se estiverem vazios
      if (!document.title.trim() && classification.suggested_title) {
        updates.title = classification.suggested_title;
      }
      if (!document.description && classification.suggested_description) {
        updates.description = classification.suggested_description;
      }

      await Document.update(document.id, updates);
      onUpdate();
      alert("Classificação aplicada com sucesso!");
    } catch (error) {
      console.error("Erro ao aplicar classificação:", error);
      alert("Erro ao aplicar classificação.");
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            Classificação Inteligente
          </span>
        </CardTitle>
        
        <div className="flex items-center gap-2">
          {hasAnalyzed && (
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeDocument}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {!hasAnalyzed && (
            <Button 
              onClick={analyzeDocument}
              disabled={isAnalyzing}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              {isAnalyzing ? "Analisando..." : "Classificar com IA"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!hasAnalyzed && !isAnalyzing ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Classificação Automática
            </h3>
            <p className="text-gray-500 mb-4">
              Use IA para classificar automaticamente este documento e sugerir metadados.
            </p>
            <Button 
              onClick={analyzeDocument}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Sparkles className="w-4 h-4" />
              Iniciar Análise
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analisando documento...</h3>
            <p className="text-gray-500">A IA está processando o conteúdo do arquivo.</p>
          </div>
        ) : classification ? (
          <div className="space-y-6">
            {/* Classification Results */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Classificação Sugerida</h4>
                <Badge className={confidenceColors[classification.confidence_level]}>
                  {classification.confidence_percentage}% confiança
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Categoria:</span>
                  <p className="font-medium text-lg">
                    {categoryLabels[classification.suggested_category]}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Score de Qualidade:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={classification.quality_score} className="flex-1" />
                    <span className="font-medium">{classification.quality_score}%</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-sm text-gray-500">Explicação:</span>
                <p className="text-sm mt-1">{classification.classification_explanation}</p>
              </div>

              <Button 
                onClick={applyClassification}
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <CheckCircle className="w-4 h-4" />
                Aplicar Classificação
              </Button>
            </div>

            {/* Suggested Tags */}
            {classification.suggested_tags && classification.suggested_tags.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags Sugeridas
                </h5>
                <div className="flex flex-wrap gap-2">
                  {classification.suggested_tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Entities */}
            {classification.key_entities && (
              <div>
                <h5 className="font-semibold mb-3">Informações Extraídas</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {classification.key_entities.people?.length > 0 && (
                    <div>
                      <span className="text-gray-500">Pessoas:</span>
                      <ul className="mt-1">
                        {classification.key_entities.people.map((person, index) => (
                          <li key={index} className="font-medium">• {person}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classification.key_entities.companies?.length > 0 && (
                    <div>
                      <span className="text-gray-500">Empresas:</span>
                      <ul className="mt-1">
                        {classification.key_entities.companies.map((company, index) => (
                          <li key={index} className="font-medium">• {company}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classification.key_entities.dates?.length > 0 && (
                    <div>
                      <span className="text-gray-500">Datas:</span>
                      <ul className="mt-1">
                        {classification.key_entities.dates.map((date, index) => (
                          <li key={index} className="font-medium">• {date}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classification.key_entities.values?.length > 0 && (
                    <div>
                      <span className="text-gray-500">Valores:</span>
                      <ul className="mt-1">
                        {classification.key_entities.values.map((value, index) => (
                          <li key={index} className="font-medium">• {value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {classification.improvement_suggestions && classification.improvement_suggestions.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Sugestões de Melhoria
                </h5>
                <ul className="space-y-1">
                  {classification.improvement_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}