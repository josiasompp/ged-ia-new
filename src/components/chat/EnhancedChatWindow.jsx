import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, MessageSquare, Zap, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AIAssistant from './AIAssistant';

export default function EnhancedChatWindow({ 
  messages, 
  onSendMessage, 
  currentUserEmail, 
  currentUser,
  sessionId,
  sessionStatus,
  companyFeatures,
  onEscalateToHuman 
}) {
  const [newMessage, setNewMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showingAIResponse, setShowingAIResponse] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, showingAIResponse]);

  const handleSend = () => {
    if (newMessage.trim()) {
      // Se IA está habilitada e parece ser uma pergunta sobre o sistema
      if (aiEnabled && isSystemQuestion(newMessage)) {
        setPendingQuestion(newMessage);
        setShowingAIResponse(true);
      } else {
        // Enviar diretamente para agente humano
        onSendMessage(newMessage);
      }
      setNewMessage('');
    }
  };

  const isSystemQuestion = (message) => {
    const systemKeywords = [
      'como', 'onde', 'quando', 'o que é', 'para que serve',
      'funciona', 'documento', 'proposta', 'usuario', 'senha',
      'acesso', 'permissão', 'configurar', 'criar', 'editar',
      'excluir', 'upload', 'download', 'relatório', 'dashboard'
    ];
    
    const messageLower = message.toLowerCase();
    return systemKeywords.some(keyword => messageLower.includes(keyword));
  };

  const handleAIResponse = (aiResponse) => {
    // IA respondeu, agora o usuário pode decidir se quer escalonar
    if (!aiResponse.requires_human) {
      // Se a IA conseguiu responder bem, não precisa enviar para humano
      setShowingAIResponse(true);
    }
  };

  const handleEscalateFromAI = (reason) => {
    // Escalonar da IA para humano
    const escalationMessage = `[Escalonado da IA] ${pendingQuestion}\n\nMotivo: ${reason}`;
    onSendMessage(escalationMessage);
    setShowingAIResponse(false);
    setPendingQuestion('');
    
    if (onEscalateToHuman) {
      onEscalateToHuman(reason);
    }
  };

  const handleSendToHumanAnyway = () => {
    // Usuário quer falar com humano mesmo após resposta da IA
    onSendMessage(pendingQuestion);
    setShowingAIResponse(false);
    setPendingQuestion('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const isChatClosed = sessionStatus === 'closed';

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header com controles de IA */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Chat de Suporte</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">IA Assistente</span>
            <Switch 
              checked={aiEnabled} 
              onCheckedChange={setAiEnabled}
              disabled={isChatClosed}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && !showingAIResponse ? (
            <div className="text-center text-gray-500 py-10">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Nenhuma mensagem nesta conversa ainda.</p>
              {!isChatClosed && (
                <div className="mt-4 space-y-2">
                  <p>Envie uma mensagem para começar.</p>
                  {aiEnabled && (
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                      <Bot className="w-4 h-4" />
                      <span>IA Assistente ativada para respostas rápidas</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isSender = msg.sender_email === currentUserEmail;
                const isAIEscalation = msg.content.startsWith('[Escalonado da IA]');
                
                return (
                  <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-2xl ${
                      isSender 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {isAIEscalation && (
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3" />
                          <span className="text-xs opacity-75">Via IA</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isSender ? 'text-blue-200' : 'text-gray-500'}`}>
                        {format(new Date(msg.created_date), "HH:mm, dd/MM/yy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Resposta da IA */}
              {showingAIResponse && pendingQuestion && (
                <div className="space-y-4">
                  {/* Mostrar pergunta do usuário primeiro */}
                  <div className="flex justify-end">
                    <div className="max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-2xl bg-blue-600 text-white rounded-br-none">
                      <p className="text-sm">{pendingQuestion}</p>
                      <p className="text-xs mt-1 text-blue-200">Agora</p>
                    </div>
                  </div>

                  {/* Resposta da IA */}
                  <AIAssistant
                    sessionId={sessionId}
                    userQuestion={pendingQuestion}
                    currentUser={currentUser}
                    companyFeatures={companyFeatures}
                    onEscalateToHuman={handleEscalateFromAI}
                    onAIResponse={handleAIResponse}
                  />

                  {/* Opção de escalonar para humano */}
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-3">
                      <p className="text-sm text-gray-600 mb-3">
                        A resposta da IA foi útil? Se precisar de mais ajuda, posso conectá-lo com um agente humano.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowingAIResponse(false)}
                        >
                          Problema Resolvido
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSendToHumanAnyway}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Falar com Agente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input de mensagem */}
      {isChatClosed ? (
        <div className="p-4 bg-gray-100 text-center text-gray-500">
          <p>Esta conversa foi encerrada.</p>
        </div>
      ) : (
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              placeholder={aiEnabled ? "Digite sua mensagem (IA habilitada)..." : "Digite sua mensagem..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {aiEnabled && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              IA ativada: Perguntas sobre o sistema serão respondidas automaticamente
            </p>
          )}
        </div>
      )}
    </div>
  );
}