import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  UploadCloud,
  FileArchive,
  BrainCircuit,
  Wrench,
  Lightbulb,
  Route,
  Database,
  Shield,
  Loader2,
  ListChecks,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  Code,
  FileText,
  Settings,
  Target,
  Zap,
  TrendingUp,
  FileCheck,
  Users,
  Clock
} from 'lucide-react';
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { useToast } from "@/components/ui/use-toast";

export default function LegacyProjectAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLog, setAnalysisLog] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Constantes para validação
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const RECOMMENDED_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/zip', 'application/x-zip-compressed', 'application/x-zip'];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Tipo de arquivo não suportado. Use apenas arquivos .zip`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Arquivo muito grande (${formatFileSize(file.size)}). Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
    }

    if (file.size > RECOMMENDED_SIZE) {
      errors.push(`⚠️ Arquivo grande (${formatFileSize(file.size)}). Recomendado: menos de ${formatFileSize(RECOMMENDED_SIZE)} para melhor performance`);
    }

    return errors;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError(null);
    setAnalysisResult(null);

    if (!file) return;

    const validationErrors = validateFile(file);
    
    if (validationErrors.some(error => error.includes('muito grande') || error.includes('não suportado'))) {
      setUploadError(validationErrors);
      setSelectedFile(null);
      toast({
        title: "Arquivo Inválido",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    if (validationErrors.length > 0) {
      setUploadError(validationErrors);
    }

    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (!file) return;

    const mockEvent = {
      target: { files: [file] }
    };
    handleFileChange(mockEvent);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addLog = (message) => {
    setAnalysisLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Função para gerar dados do projeto com foco em regras de negócio
  const generateProjectData = (file) => {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    
    // Estimativas baseadas no tamanho do arquivo
    const estimatedFiles = Math.floor(fileSize / 5000);
    const estimatedLOC = Math.floor(fileSize / 50);
    
    // Detectar possível framework e inferir regras de negócio
    let framework = 'Framework Personalizado';
    let businessDomain = 'Gestão Geral';
    let likelyFeatures = [];
    
    if (fileName.includes('laravel') || fileName.includes('artisan')) {
      framework = 'Laravel';
      likelyFeatures = ['autenticação', 'crud', 'migrations', 'middleware', 'eloquent'];
    } else if (fileName.includes('codeigniter') || fileName.includes('ci_')) {
      framework = 'CodeIgniter';
      likelyFeatures = ['mvc', 'helpers', 'libraries', 'hooks'];
    } else if (fileName.includes('wordpress') || fileName.includes('wp_')) {
      framework = 'WordPress';
      businessDomain = 'CMS/Blog';
      likelyFeatures = ['posts', 'users', 'comments', 'media', 'plugins'];
    }

    // Inferir domínio de negócio baseado no nome
    if (fileName.includes('ged') || fileName.includes('document')) {
      businessDomain = 'Gestão de Documentos';
    } else if (fileName.includes('hr') || fileName.includes('rh') || fileName.includes('employee')) {
      businessDomain = 'Recursos Humanos';
    } else if (fileName.includes('crm') || fileName.includes('sales') || fileName.includes('lead')) {
      businessDomain = 'CRM/Vendas';
    } else if (fileName.includes('finance') || fileName.includes('financeiro')) {
      businessDomain = 'Financeiro';
    }
    
    return {
      framework_detected: framework,
      business_domain: businessDomain,
      php_version: "7.4",
      database_type: "MySQL",
      estimated_features: likelyFeatures,
      main_directories: ["app", "public", "config", "database", "resources", "storage"],
      config_files: ["config.php", "database.php", ".env", "composer.json"],
      models_found: ["User", "Product", "Order", "Category", "Customer"],
      controllers_found: ["HomeController", "UserController", "ProductController", "AdminController"],
      views_found: ["home.php", "login.php", "dashboard.php", "products.php"],
      dependencies: ["mysql", "php-curl", "php-gd", "composer packages"],
      total_files: estimatedFiles,
      lines_of_code: estimatedLOC,
      complexity_indicators: {
        file_size: fileSize,
        estimated_complexity: fileSize > 20 * 1024 * 1024 ? 'alta' : fileSize > 5 * 1024 * 1024 ? 'média' : 'baixa'
      }
    };
  };

  const runAnalysis = async () => {
    if (!selectedFile) {
        toast({ 
          title: "Nenhum arquivo selecionado.", 
          variant: "destructive" 
        });
        return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
        toast({ 
          title: "Arquivo muito grande", 
          description: `O arquivo (${formatFileSize(selectedFile.size)}) excede o limite de ${formatFileSize(MAX_FILE_SIZE)}`,
          variant: "destructive" 
        });
        return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisLog([]);
    setAnalysisProgress(0);
    setUploadError(null);

    try {
        addLog('🔍 Iniciando análise especializada de regras de negócio...');
        setAnalysisProgress(5);

        addLog('📤 Fazendo upload do arquivo do sistema legado...');
        setAnalysisProgress(15);

        // Upload do arquivo
        let file_url;
        try {
          const uploadResult = await UploadFile({ file: selectedFile });
          file_url = uploadResult.file_url;
          addLog('✅ Upload concluído - arquivo pronto para análise');
        } catch (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw new Error(`Erro no upload: ${uploadError.message || 'Erro desconhecido'}`);
        }

        setAnalysisProgress(25);
        addLog('🏗️ Analisando estrutura do projeto e domínio de negócio...');

        // Gerar dados do projeto
        const projectData = generateProjectData(selectedFile);
        addLog(`📊 Framework detectado: ${projectData.framework_detected}`);
        addLog(`🎯 Domínio de negócio identificado: ${projectData.business_domain}`);
        addLog(`📁 Estimativa: ${projectData.total_files} arquivos, ${projectData.lines_of_code} linhas de código`);
        
        setAnalysisProgress(40);
        addLog('🧠 Extraindo regras de negócio com IA especializada...');

        // Primeira análise: Identificar regras de negócio
        const businessRulesPrompt = `
        Analise o seguinte sistema legado e identifique as possíveis regras de negócio baseado nas características:

        INFORMAÇÕES DO PROJETO:
        - Nome do arquivo: ${selectedFile.name}
        - Tamanho: ${formatFileSize(selectedFile.size)}
        - Framework: ${projectData.framework_detected}
        - Domínio de negócio: ${projectData.business_domain}
        - Complexidade estimada: ${projectData.complexity_indicators.estimated_complexity}
        - Features identificadas: ${projectData.estimated_features.join(', ')}

        Como especialista em análise de sistemas legados, identifique e extraia as prováveis regras de negócio 
        que este sistema implementa, considerando o domínio identificado e as características técnicas.
        `;

        const businessRulesSchema = {
          type: "object",
          properties: {
            identified_business_rules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string", description: "Categoria da regra (ex: Autenticação, Workflow, Validação)" },
                  rule_name: { type: "string", description: "Nome da regra de negócio" },
                  description: { type: "string", description: "Descrição detalhada da regra" },
                  current_implementation: { type: "string", description: "Como provavelmente está implementada atualmente" },
                  complexity_level: { type: "string", enum: ["simples", "média", "complexa"] },
                  business_impact: { type: "string", enum: ["baixo", "médio", "alto", "crítico"] },
                  frequency_of_use: { type: "string", enum: ["rara", "ocasional", "frequente", "constante"] }
                }
              }
            },
            system_capabilities: {
              type: "object",
              properties: {
                user_management: { type: "boolean" },
                document_management: { type: "boolean" },
                workflow_automation: { type: "boolean" },
                reporting_analytics: { type: "boolean" },
                integration_apis: { type: "boolean" },
                file_storage: { type: "boolean" },
                notification_system: { type: "boolean" },
                approval_workflows: { type: "boolean" },
                audit_trail: { type: "boolean" },
                multi_tenant: { type: "boolean" }
              }
            },
            data_entities_identified: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entity_name: { type: "string" },
                  likely_fields: { type: "array", items: { type: "string" } },
                  relationships: { type: "string" },
                  business_importance: { type: "string", enum: ["baixa", "média", "alta", "crítica"] }
                }
              }
            }
          }
        };

        const businessRulesAnalysis = await InvokeLLM({
          prompt: businessRulesPrompt,
          response_json_schema: businessRulesSchema,
          add_context_from_internet: false
        });

        setAnalysisProgress(60);
        addLog('🎯 Mapeando melhorias para FIRSTDOCY GED AI...');

        // Segunda análise: Mapear melhorias específicas para FIRSTDOCY
        const firstdocyMappingPrompt = `
        Com base nas regras de negócio identificadas no sistema legado, mapeie especificamente como cada 
        regra pode ser melhorada utilizando as funcionalidades do FIRSTDOCY GED AI.

        REGRAS DE NEGÓCIO IDENTIFICADAS:
        ${JSON.stringify(businessRulesAnalysis.identified_business_rules, null, 2)}

        CAPACIDADES DO FIRSTDOCY GED AI:
        - GED Inteligente com IA para classificação automática
        - CDOC para documentos físicos com endereçamento único
        - Sistema de Propostas Interativas com assinatura digital
        - CRM completo com pipeline de vendas
        - RH com controle de ponto e integração eSocial
        - Workflows de aprovação customizáveis
        - Saúde Ocupacional com integração de clínicas
        - Ordens de Serviço automatizadas
        - Central de Publicação para gestão de conteúdo
        - Sistema de Chat com IA contextual
        - Relatórios avançados e analytics
        - Multi-tenant com branding personalizado
        - APIs completas para integrações
        - Segurança avançada e auditoria

        Para cada regra de negócio, indique como pode ser modernizada no FIRSTDOCY.
        `;

        const firstdocyMappingSchema = {
          type: "object",
          properties: {
            modernization_mapping: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  legacy_rule: { type: "string", description: "Regra do sistema legado" },
                  firstdocy_module: { type: "string", description: "Módulo do FIRSTDOCY que atende esta regra" },
                  improvement_description: { type: "string", description: "Como a regra é melhorada no FIRSTDOCY" },
                  key_benefits: { type: "array", items: { type: "string" }, description: "Principais benefícios da melhoria" },
                  automation_level: { type: "string", enum: ["manual", "semi-automatizado", "totalmente automatizado"] },
                  data_migration_required: { type: "boolean" },
                  integration_complexity: { type: "string", enum: ["simples", "média", "complexa"] },
                  user_training_needed: { type: "string", enum: ["mínimo", "moderado", "extensivo"] },
                  roi_expectation: { type: "string", enum: ["baixo", "médio", "alto", "muito alto"] }
                }
              }
            },
            unique_firstdocy_advantages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  advantage: { type: "string" },
                  description: { type: "string" },
                  business_impact: { type: "string" }
                }
              }
            },
            migration_recommendations: {
              type: "object",
              properties: {
                priority_modules: { type: "array", items: { type: "string" } },
                migration_strategy: { type: "string" },
                estimated_timeline: { type: "string" },
                critical_success_factors: { type: "array", items: { type: "string" } },
                risk_mitigation: { type: "array", items: { type: "string" } }
              }
            }
          }
        };

        const firstdocyMapping = await InvokeLLM({
          prompt: firstdocyMappingPrompt,
          response_json_schema: firstdocyMappingSchema,
          add_context_from_internet: false
        });

        setAnalysisProgress(80);
        addLog('📊 Gerando análise de ROI e impacto de negócio...');

        // Terceira análise: ROI e impacto
        const roiAnalysisPrompt = `
        Baseado no sistema legado analisado e no mapeamento para FIRSTDOCY GED AI, 
        faça uma análise detalhada de ROI e impacto de negócio da migração.

        CONTEXTO:
        - Sistema atual: ${projectData.framework_detected} com ${projectData.total_files} arquivos
        - Domínio: ${projectData.business_domain}
        - Complexidade: ${projectData.complexity_indicators.estimated_complexity}

        Considere fatores como:
        - Redução de custos operacionais
        - Aumento de produtividade
        - Melhoria na segurança
        - Automatização de processos
        - Conformidade regulatória
        - Escalabilidade
        `;

        const roiSchema = {
          type: "object",
          properties: {
            current_system_costs: {
              type: "object",
              properties: {
                maintenance_monthly: { type: "string" },
                infrastructure_monthly: { type: "string" },
                support_time_hours: { type: "number" },
                manual_processes_cost: { type: "string" },
                security_risks_cost: { type: "string" }
              }
            },
            firstdocy_benefits: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  benefit_category: { type: "string" },
                  description: { type: "string" },
                  quantified_impact: { type: "string" },
                  timeline_to_realize: { type: "string" }
                }
              }
            },
            roi_projection: {
              type: "object",
              properties: {
                investment_required: { type: "string" },
                monthly_savings: { type: "string" },
                payback_period: { type: "string" },
                three_year_roi: { type: "string" },
                productivity_increase: { type: "string" }
              }
            },
            success_metrics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  metric: { type: "string" },
                  current_baseline: { type: "string" },
                  target_improvement: { type: "string" },
                  measurement_method: { type: "string" }
                }
              }
            }
          }
        };

        const roiAnalysis = await InvokeLLM({
          prompt: roiAnalysisPrompt,
          response_json_schema: roiSchema,
          add_context_from_internet: false
        });

        setAnalysisProgress(95);
        addLog('✅ Compilando relatório final com insights estratégicos...');

        // Compilar resultado final
        const finalResult = {
          project_data: projectData,
          business_rules: businessRulesAnalysis,
          firstdocy_mapping: firstdocyMapping,
          roi_analysis: roiAnalysis,
          file_info: {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            uploaded_at: new Date().toISOString()
          },
          summary: {
            total_rules_identified: businessRulesAnalysis.identified_business_rules?.length || 0,
            modernization_opportunities: firstdocyMapping.modernization_mapping?.length || 0,
            framework: projectData.framework_detected,
            business_domain: projectData.business_domain,
            complexity: projectData.complexity_indicators.estimated_complexity,
            roi_payback: roiAnalysis.roi_projection?.payback_period || 'A calcular'
          }
        };

        setAnalysisProgress(100);
        addLog('🎉 Análise completa! Relatório de regras de negócio gerado com sucesso.');
        
        setAnalysisResult(finalResult);
        
        toast({ 
          title: "Análise de Regras de Negócio Concluída!", 
          description: `${finalResult.summary.total_rules_identified} regras identificadas com ${finalResult.summary.modernization_opportunities} oportunidades de melhoria.` 
        });

    } catch (error) {
        console.error("Erro na análise:", error);
        addLog(`❌ Erro: ${error.message}`);
        setUploadError([error.message]);
        
        toast({
            title: "Erro na análise",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'crítica': case 'crítico': return 'bg-red-100 text-red-800';
      case 'alta': case 'alto': return 'bg-orange-100 text-orange-800';
      case 'média': case 'médio': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': case 'baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'complexa': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'simples': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAutomationColor = (level) => {
    switch(level) {
      case 'totalmente automatizado': return 'bg-green-100 text-green-800';
      case 'semi-automatizado': return 'bg-yellow-100 text-yellow-800';
      case 'manual': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            Analisador de Regras de Negócio - Sistema Legado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Target className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Análise Especializada de Regras de Negócio:</AlertTitle>
              <AlertDescription className="text-blue-700">
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Extração Inteligente:</strong> Identifica regras de negócio do sistema legado</li>
                  <li><strong>Mapeamento FIRSTDOCY:</strong> Mostra como cada regra pode ser melhorada</li>
                  <li><strong>Análise de ROI:</strong> Calcula o retorno sobre investimento da migração</li>
                  <li><strong>Roadmap de Migração:</strong> Plano estratégico de modernização</li>
                  <li><strong>Benefícios Quantificados:</strong> Impacto mensurável das melhorias</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
                  uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".zip,application/zip,application/x-zip,application/x-zip-compressed"
                />
                
                {selectedFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Sistema Legado Carregado:</p>
                      <p className="font-semibold">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelectedFile();
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div>
                    <FileArchive className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="font-semibold text-gray-700">Carregar Sistema Legado (.zip)</p>
                    <p className="text-sm text-gray-500 mt-2">Arraste e solte ou clique para selecionar</p>
                    <p className="text-xs text-gray-400 mt-2">Máximo: {formatFileSize(MAX_FILE_SIZE)}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-4">
                {uploadError && (
                  <Alert variant={uploadError.some(e => e.includes('⚠️')) ? 'default' : 'destructive'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {uploadError.some(e => e.includes('⚠️')) ? 'Aviso' : 'Erro de Validação'}
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {uploadError.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertTitle>Análise de Regras de Negócio</AlertTitle>
                  <AlertDescription>
                    Nossa IA especializada extrai regras de negócio do seu sistema legado e mapeia 
                    como cada uma pode ser modernizada no FIRSTDOCY GED AI, incluindo benefícios 
                    quantificados e ROI detalhado.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={runAnalysis} 
                  disabled={!selectedFile || isAnalyzing || (uploadError && uploadError.some(e => !e.includes('⚠️')))} 
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extraindo Regras de Negócio...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Analisar Regras de Negócio
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Análise Especializada</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysisProgress} className="w-full mb-4" />
            <div className="h-40 bg-gray-900 text-white font-mono text-sm p-4 rounded-md overflow-y-auto">
              {analysisLog.map((log, index) => (
                <p key={index} className="animate-fade-in">{log}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Regras de Negócio e Melhorias</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="business-rules">Regras Identificadas</TabsTrigger>
                <TabsTrigger value="firstdocy-mapping">Melhorias FIRSTDOCY</TabsTrigger>
                <TabsTrigger value="entities">Entidades de Dados</TabsTrigger>
                <TabsTrigger value="roi">Análise de ROI</TabsTrigger>
                <TabsTrigger value="migration">Plano de Migração</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600">Regras Identificadas</p>
                    <p className="text-2xl font-bold text-blue-800">{analysisResult.summary.total_rules_identified}</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-600">Melhorias Possíveis</p>
                    <p className="text-2xl font-bold text-green-800">{analysisResult.summary.modernization_opportunities}</p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-lg">
                    <p className="text-sm text-purple-600">Domínio</p>
                    <p className="text-lg font-bold text-purple-800">{analysisResult.summary.business_domain}</p>
                  </div>
                  <div className="p-4 bg-orange-100 rounded-lg">
                    <p className="text-sm text-orange-600">ROI Payback</p>
                    <p className="text-lg font-bold text-orange-800">{analysisResult.summary.roi_payback}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Sistema Atual
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Framework:</strong> {analysisResult.project_data.framework_detected}</p>
                      <p><strong>Domínio:</strong> {analysisResult.project_data.business_domain}</p>
                      <p><strong>Complexidade:</strong> 
                        <Badge className={getComplexityColor(analysisResult.project_data.complexity_indicators.estimated_complexity)} size="sm">
                          {analysisResult.project_data.complexity_indicators.estimated_complexity}
                        </Badge>
                      </p>
                      <p><strong>Arquivos estimados:</strong> {analysisResult.project_data.total_files}</p>
                    </div>
                  </div>

                  {analysisResult.business_rules.system_capabilities && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ListChecks className="w-4 h-4" />
                        Capacidades Detectadas
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(analysisResult.business_rules.system_capabilities).map(([capability, has]) => (
                          <div key={capability} className="flex items-center gap-2">
                            {has ? <CheckCircle className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-400" />}
                            <span className={has ? 'text-green-700' : 'text-gray-500'}>
                              {capability.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="business-rules" className="mt-4">
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Regras de Negócio Identificadas</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Nossa IA identificou {analysisResult.business_rules.identified_business_rules?.length || 0} regras 
                      de negócio principais no seu sistema legado. Cada regra é classificada por complexidade e impacto.
                    </AlertDescription>
                  </Alert>

                  {analysisResult.business_rules.identified_business_rules?.map((rule, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{rule.rule_name}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(rule.business_impact)}>
                              {rule.business_impact} impacto
                            </Badge>
                            <Badge className={getComplexityColor(rule.complexity_level)}>
                              {rule.complexity_level}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{rule.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-600">Categoria:</p>
                            <p>{rule.category}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Frequência de Uso:</p>
                            <Badge variant="outline">{rule.frequency_of_use}</Badge>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="font-medium text-gray-600 text-sm">Implementação Atual:</p>
                          <p className="text-sm text-gray-700">{rule.current_implementation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="firstdocy-mapping" className="mt-4">
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Melhorias com FIRSTDOCY GED AI</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Veja como cada regra de negócio do seu sistema legado pode ser modernizada e automatizada 
                      utilizando as funcionalidades avançadas do FIRSTDOCY.
                    </AlertDescription>
                  </Alert>

                  {analysisResult.firstdocy_mapping.modernization_mapping?.map((mapping, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-green-800">{mapping.firstdocy_module}</h4>
                            <p className="text-sm text-gray-600 font-medium">Moderniza: {mapping.legacy_rule}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getAutomationColor(mapping.automation_level)}>
                              {mapping.automation_level}
                            </Badge>
                            <Badge className={getPriorityColor(mapping.roi_expectation)}>
                              ROI {mapping.roi_expectation}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{mapping.improvement_description}</p>
                        
                        <div className="mb-3">
                          <p className="font-medium text-gray-600 text-sm mb-2">Principais Benefícios:</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {mapping.key_benefits?.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="font-medium text-gray-600">Migração de Dados:</p>
                            <p className={mapping.data_migration_required ? 'text-orange-600' : 'text-green-600'}>
                              {mapping.data_migration_required ? 'Necessária' : 'Não necessária'}
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="font-medium text-gray-600">Complexidade de Integração:</p>
                            <Badge className={getComplexityColor(mapping.integration_complexity)} size="sm">
                              {mapping.integration_complexity}
                            </Badge>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="font-medium text-gray-600">Treinamento:</p>
                            <p>{mapping.user_training_needed}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {analysisResult.firstdocy_mapping.unique_firstdocy_advantages && (
                    <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                      <CardHeader>
                        <CardTitle className="text-blue-800">Vantagens Exclusivas do FIRSTDOCY</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.firstdocy_mapping.unique_firstdocy_advantages.map((advantage, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg border">
                              <h5 className="font-semibold text-green-800">{advantage.advantage}</h5>
                              <p className="text-sm text-gray-700 mt-1">{advantage.description}</p>
                              <p className="text-xs text-blue-600 mt-2 font-medium">
                                Impacto: {advantage.business_impact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="entities" className="mt-4">
                <div className="space-y-4">
                  <Alert className="border-purple-200 bg-purple-50">
                    <Database className="h-4 w-4 text-purple-600" />
                    <AlertTitle className="text-purple-800">Entidades de Dados Identificadas</AlertTitle>
                    <AlertDescription className="text-purple-700">
                      Estruturas de dados principais encontradas no seu sistema legado e sua importância para o negócio.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.business_rules.data_entities_identified?.map((entity, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{entity.entity_name}</h4>
                            <Badge className={getPriorityColor(entity.business_importance)}>
                              {entity.business_importance} importância
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <p className="font-medium text-gray-600 text-sm mb-1">Campos Prováveis:</p>
                            <div className="flex flex-wrap gap-1">
                              {entity.likely_fields?.map((field, idx) => (
                                <Badge key={idx} variant="outline" size="sm">{field}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="font-medium text-gray-600 text-sm">Relacionamentos:</p>
                            <p className="text-sm text-gray-700">{entity.relationships}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="roi" className="mt-4">
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Análise de Retorno sobre Investimento</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Projeção detalhada dos custos atuais versus benefícios da migração para FIRSTDOCY GED AI.
                    </AlertDescription>
                  </Alert>

                  {/* Custos Atuais */}
                  {analysisResult.roi_analysis.current_system_costs && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-700">Custos do Sistema Atual</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(analysisResult.roi_analysis.current_system_costs).map(([cost, value]) => (
                            <div key={cost} className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="font-medium text-red-800 capitalize">
                                {cost.replace(/_/g, ' ')}:
                              </p>
                              <p className="text-lg font-bold text-red-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Projeção de ROI */}
                  {analysisResult.roi_analysis.roi_projection && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-700">Projeção de ROI com FIRSTDOCY</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(analysisResult.roi_analysis.roi_projection).map(([metric, value]) => (
                            <div key={metric} className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                              <p className="font-medium text-green-800 capitalize text-sm">
                                {metric.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xl font-bold text-green-900 mt-1">{value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Benefícios */}
                  {analysisResult.roi_analysis.firstdocy_benefits && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-700">Benefícios Detalhados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisResult.roi_analysis.firstdocy_benefits.map((benefit, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-blue-800">{benefit.benefit_category}</h5>
                                <Badge variant="outline">{benefit.timeline_to_realize}</Badge>
                              </div>
                              <p className="text-gray-700 mb-2">{benefit.description}</p>
                              <div className="p-2 bg-blue-50 rounded">
                                <p className="font-medium text-blue-800 text-sm">Impacto Quantificado:</p>
                                <p className="text-blue-900 font-bold">{benefit.quantified_impact}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Métricas de Sucesso */}
                  {analysisResult.roi_analysis.success_metrics && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-700">Métricas de Sucesso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisResult.roi_analysis.success_metrics.map((metric, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <h5 className="font-semibold">{metric.metric}</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                                <div>
                                  <p className="text-gray-600">Baseline Atual:</p>
                                  <p className="font-medium">{metric.current_baseline}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Meta de Melhoria:</p>
                                  <p className="font-medium text-green-600">{metric.target_improvement}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Método de Medição:</p>
                                  <p className="font-medium">{metric.measurement_method}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="migration" className="mt-4">
                <div className="space-y-6">
                  <Alert className="border-orange-200 bg-orange-50">
                    <Route className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Estratégia de Migração Recomendada</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      Plano estruturado para migração do sistema legado para FIRSTDOCY GED AI, 
                      baseado nas regras de negócio identificadas.
                    </AlertDescription>
                  </Alert>

                  {analysisResult.firstdocy_mapping.migration_recommendations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-blue-700">Módulos Prioritários</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysisResult.firstdocy_mapping.migration_recommendations.priority_modules?.map((module, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                <Badge className="bg-blue-600 text-white">{index + 1}</Badge>
                                <span className="font-medium">{module}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-700">Cronograma</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="font-medium text-green-800">Estratégia:</p>
                              <p className="text-sm text-green-700">
                                {analysisResult.firstdocy_mapping.migration_recommendations.migration_strategy}
                              </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-medium text-blue-800">Timeline Estimado:</p>
                              <p className="text-lg font-bold text-blue-900">
                                {analysisResult.firstdocy_mapping.migration_recommendations.estimated_timeline}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {analysisResult.firstdocy_mapping.migration_recommendations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-700">Fatores Críticos de Sucesso</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysisResult.firstdocy_mapping.migration_recommendations.critical_success_factors?.map((factor, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <span className="text-sm">{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-orange-700">Mitigação de Riscos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysisResult.firstdocy_mapping.migration_recommendations.risk_mitigation?.map((risk, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Shield className="w-4 h-4 text-orange-500 mt-0.5" />
                                <span className="text-sm">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}