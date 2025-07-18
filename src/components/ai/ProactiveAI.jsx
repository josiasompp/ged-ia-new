import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  Target,
  Mail,
  Phone,
  CheckCircle,
  X,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { Document } from '@/api/entities';
import { Proposal } from '@/api/entities';
import { Lead } from '@/api/entities';
import { Task } from '@/api/entities';
import { Appointment } from '@/api/entities';

const suggestionTypes = {
  follow_up: {
    icon: <Phone className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800',
    action: 'Fazer Follow-up'
  },
  send_proposal: {
    icon: <FileText className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800',
    action: 'Enviar Proposta'
  },
  schedule_meeting: {
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800',
    action: 'Agendar Reunião'
  },
  document_reminder: {
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-800',
    action: 'Lembrete de Documento'
  },
  opportunity: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-emerald-100 text-emerald-800',
    action: 'Nova Oportunidade'
  }
};

export default function ProactiveAI({ user, onActionTaken }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);

  useEffect(() => {
    if (user) {
      generateSuggestions();
    }
  }, [user]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // Buscar dados relevantes do usuário
      const [documents, proposals, leads, tasks, appointments] = await Promise.all([
        Document.filter({ company_id: user.company_id }, '-created_date', 20),
        Proposal.filter({ company_id: user.company_id }, '-created_date', 20),
        Lead.filter({ company_id: user.company_id }, '-created_date', 20),
        Task.filter({ company_id: user.company_id }, '-created_date', 20),
        Appointment.filter({ company_id: user.company_id }, '-created_date', 20)
      ]);

      // Criar contexto para a IA
      const context = {
        user_role: user.role,
        user_email: user.email,
        documents_count: documents.length,
        proposals_count: proposals.length,
        leads_count: leads.length,
        tasks_count: tasks.length,
        appointments_count: appointments.length,
        recent_proposals: proposals.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          client_name: p.client_name,
          created_date: p.created_date
        })),
        recent_leads: leads.slice(0, 5).map(l => ({
          id: l.id,
          name: l.name,
          status: l.status,
          last_contact: l.last_contact,
          next_followup: l.next_followup
        })),
        pending_tasks: tasks.filter(t => t.status === 'pendente').slice(0, 5),
        upcoming_appointments: appointments.filter(a => 
          new Date(a.appointment_date) >= new Date() && a.status === 'agendado'
        ).slice(0, 5)
      };

      // Gerar sugestões com IA
      const aiSuggestions = await InvokeLLM({
        prompt: `Você é um assistente de IA proativo para um sistema de gestão empresarial. 
        
        Analise os dados do usuário e sugira ações inteligentes e contextuais.
        
        Dados do usuário:
        ${JSON.stringify(context, null, 2)}
        
        Crie sugestões específicas e acionáveis. Foque em:
        1. Leads que precisam de follow-up
        2. Propostas pendentes há muito tempo
        3. Oportunidades de negócio
        4. Documentos com prazo vencendo
        5. Tarefas prioritárias
        
        Para cada sugestão, forneça:
        - Tipo (follow_up, send_proposal, schedule_meeting, document_reminder, opportunity)
        - Título descritivo
        - Descrição clara da ação sugerida
        - Prioridade (alta, media, baixa)
        - ID da entidade relacionada (se aplicável)
        - Motivo da sugestão`,
        
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string", enum: ["alta", "media", "baixa"] },
                  entity_id: { type: "string" },
                  entity_type: { type: "string" },
                  reason: { type: "string" },
                  confidence: { type: "number" }
                }
              }
            }
          }
        }
      });

      // Filtrar sugestões já dispensadas
      const filteredSuggestions = aiSuggestions.suggestions.filter(
        s => !dismissedSuggestions.includes(s.id)
      );

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Erro ao gerar sugestões de IA:', error);
      // Fallback com sugestões básicas
      setSuggestions(generateFallbackSuggestions());
    }
    setIsLoading(false);
  };

  const generateFallbackSuggestions = () => {
    return [
      {
        id: 'fallback_1',
        type: 'follow_up',
        title: 'Revisar leads pendentes',
        description: 'Há leads sem atividade recente que podem precisar de follow-up.',
        priority: 'media',
        reason: 'Manter engajamento com prospects'
      },
      {
        id: 'fallback_2',
        type: 'document_reminder',
        title: 'Verificar documentos pendentes',
        description: 'Alguns documentos podem estar aguardando aprovação.',
        priority: 'baixa',
        reason: 'Manter fluxo de aprovações em dia'
      }
    ];
  };

  const handleDismissSuggestion = (suggestionId) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleTakeAction = (suggestion) => {
    // Aqui implementaríamos a navegação para a ação específica
    if (onActionTaken) {
      onActionTaken(suggestion);
    }
    handleDismissSuggestion(suggestion.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Assistente IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Assistente IA
          <Badge variant="secondary" className="text-xs">
            {suggestions.length} sugestões
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Tudo em dia! Não há sugestões de IA no momento.
            </AlertDescription>
          </Alert>
        ) : (
          suggestions.slice(0, 3).map((suggestion) => {
            const typeConfig = suggestionTypes[suggestion.type] || suggestionTypes.opportunity;
            
            return (
              <div key={suggestion.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      {typeConfig.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                
                {suggestion.reason && (
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">{suggestion.reason}</span>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleTakeAction(suggestion)}
                    className="gap-2"
                  >
                    {typeConfig.action}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {suggestions.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* Expandir para ver todas as sugestões */}}
          >
            Ver todas as {suggestions.length} sugestões
          </Button>
        )}
      </CardContent>
    </Card>
  );
}