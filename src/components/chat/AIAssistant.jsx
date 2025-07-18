import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { ChatAIResponse } from '@/api/entities';
import { ChatAIContext } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';

export default function AIAssistant({ 
  sessionId, 
  userQuestion, 
  currentUser, 
  companyFeatures,
  onEscalateToHuman,
  onAIResponse 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);

  const generateAIResponse = async () => {
    setIsGenerating(true);
    const startTime = Date.now();

    try {
      // Preparar contexto do usuário
      const userContext = await prepareUserContext();
      
      // Gerar resposta com IA
      const response = await InvokeLLM({
        prompt: buildSystemPrompt(userQuestion, userContext),
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            confidence: { type: "number" },
            suggested_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  description: { type: "string" },
                  url: { type: "string" }
                }
              }
            },
            requires_human: { type: "boolean" },
            escalation_reason: { type: "string" }
          }
        }
      });

      const responseTime = Date.now() - startTime;

      // Salvar resposta da IA
      const aiResponseRecord = await ChatAIResponse.create({
        session_id: sessionId,
        user_question: userQuestion,
        ai_response: response.response,
        confidence_score: response.confidence,
        suggested_actions: response.suggested_actions || [],
        requires_human_support: response.requires_human || false,
        escalation_reason: response.escalation_reason,
        response_time_ms: responseTime,
        used_context: userContext.accessible_modules
      });

      setAiResponse(response);
      
      // Notificar componente pai
      if (onAIResponse) {
        onAIResponse(response);
      }

      // Se requer suporte humano, escalonar automaticamente
      if (response.requires_human && onEscalateToHuman) {
        onEscalateToHuman(response.escalation_reason);
      }

    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      setAiResponse({
        response: "Desculpe, não consegui processar sua pergunta no momento. Um agente humano será notificado para ajudá-lo.",
        confidence: 0,
        requires_human: true,
        escalation_reason: "Erro técnico na IA"
      });
    }

    setIsGenerating(false);
  };

  const prepareUserContext = async () => {
    // Preparar contexto baseado no usuário atual
    const context = {
      user_role: currentUser.role,
      accessible_modules: [],
      user_permissions: currentUser.permissions || [],
      company_features: companyFeatures || {}
    };

    // Determinar módulos acessíveis baseado no papel
    if (currentUser.role === 'admin') {
      context.accessible_modules = [
        'GED', 'CDOC', 'Propostas', 'CRM', 'RH', 'Ordens de Serviço',
        'Assinaturas Digitais', 'Exames Médicos', 'Email', 'Relatórios'
      ];
    } else if (currentUser.role === 'client') {
      context.accessible_modules = [
        'Portal do Cliente', 'Ordens de Serviço', 'Documentos', 'Suporte'
      ];
    } else {
      context.accessible_modules = [
        'GED', 'Documentos', 'Propostas'
      ];
    }

    return context;
  };

  const buildSystemPrompt = (question, context) => {
    return `
Você é o assistente de IA do FIRSTDOCY GED AI, um sistema completo de gestão empresarial.

CONTEXTO DO USUÁRIO:
- Papel: ${context.user_role}
- Módulos acessíveis: ${context.accessible_modules.join(', ')}
- Permissões: ${context.user_permissions.join(', ')}

INSTRUÇÕES IMPORTANTES:
1. Responda APENAS sobre funcionalidades do FIRSTDOCY GED AI
2. Seja específico sobre como usar o sistema
3. Considere apenas os módulos que o usuário tem acesso
4. Use linguagem amigável e profissional
5. Se não souber algo específico, seja honesto
6. Sugira ações práticas quando possível
7. Se a pergunta não for sobre o sistema, redirecione educadamente

PERGUNTA DO USUÁRIO: "${question}"

Forneça uma resposta útil, considerando o contexto de acesso do usuário. Se a pergunta requer demonstração prática ou configuração específica que você não pode realizar, indique que é necessário suporte humano.
    `;
  };

  const handleFeedback = async (feedback) => {
    setUserFeedback(feedback);
    
    if (aiResponse && sessionId) {
      try {
        // Atualizar feedback no banco
        await ChatAIResponse.update(aiResponse.id, {
          user_feedback: feedback
        });
      } catch (error) {
        console.error('Erro ao salvar feedback:', error);
      }
    }
  };

  React.useEffect(() => {
    if (userQuestion && !aiResponse) {
      generateAIResponse();
    }
  }, [userQuestion]);

  if (isGenerating) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800">Assistente IA analisando...</p>
              <p className="text-sm text-blue-600">Preparando uma resposta personalizada para você</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aiResponse) return null;

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-purple-600" />
          Assistente IA do FIRSTDOCY
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="w-3 h-3 mr-1" />
            {Math.round(aiResponse.confidence * 100)}% confiança
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {aiResponse.response}
          </p>
        </div>

        {/* Ações Sugeridas */}
        {aiResponse.suggested_actions && aiResponse.suggested_actions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Ações Sugeridas:</h4>
            <div className="space-y-2">
              {aiResponse.suggested_actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => action.url && window.open(action.url, '_blank')}
                >
                  <div>
                    <div className="font-medium">{action.action}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                  {action.url && <ExternalLink className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Alerta se requer suporte humano */}
        {aiResponse.requires_human && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Suporte Humano Recomendado</p>
              <p className="text-sm text-amber-700">{aiResponse.escalation_reason}</p>
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => onEscalateToHuman && onEscalateToHuman(aiResponse.escalation_reason)}
              >
                <User className="w-4 h-4 mr-2" />
                Falar com Agente
              </Button>
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">Esta resposta foi útil?</p>
          <div className="flex gap-2">
            <Button
              variant={userFeedback === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedback('helpful')}
              disabled={userFeedback !== null}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant={userFeedback === 'not_helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedback('not_helpful')}
              disabled={userFeedback !== null}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {userFeedback && (
          <div className="text-center">
            <p className="text-sm text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Obrigado pelo seu feedback!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}