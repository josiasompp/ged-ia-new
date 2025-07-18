
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, MessageSquare, Loader2, ServerCrash, Shield, Lock } from 'lucide-react';
import { ChatSession } from '@/api/entities';
import { ChatMessage } from '@/api/entities';
import { User as UserEntity } from '@/api/entities';
import EnhancedChatWindow from '../components/chat/EnhancedChatWindow';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SupportChatDashboard() {
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('open');
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const checkAccess = async () => {
    try {
      const user = await UserEntity.me();
      setCurrentUser(user);
      if (user.role === 'admin') {
        setHasAccess(true);
        loadSessions();
      } else {
        setHasAccess(false);
        setIsLoading(false);
      }
    } catch (e) {
      setHasAccess(false);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkAccess();
  }, []);

  const loadSessions = useCallback(async () => {
    if (!hasAccess) return;
    setIsLoading(true);
    try {
      const data = await ChatSession.list('-last_message_at');
      setSessions(data);
    } catch (error) {
      console.error("Erro ao carregar sessões de chat:", error);
    }
    setIsLoading(false);
  }, [hasAccess]);

  useEffect(() => {
    loadSessions();
  }, [statusFilter, loadSessions]);

  const loadMessages = async (sessionId) => {
    if (!sessionId) return;
    try {
      const msgs = await ChatMessage.filter({ session_id: sessionId }, 'created_date');
      setMessages(msgs);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    loadMessages(session.id);
    if (session.agent_unread_count > 0) {
        await ChatSession.update(session.id, { agent_unread_count: 0 });
        loadSessions();
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedSession || !currentUser) return;

    try {
      await ChatMessage.create({
        session_id: selectedSession.id,
        sender_email: currentUser.email,
        content: content,
      });

      const sessionUpdate = {
        last_message_at: new Date().toISOString(),
        last_message_snippet: content.substring(0, 50),
        status: 'in_progress',
        agent_email: selectedSession.agent_email || currentUser.email,
        client_unread_count: (selectedSession.client_unread_count || 0) + 1,
      };

      await ChatSession.update(selectedSession.id, sessionUpdate);

      loadMessages(selectedSession.id);
      loadSessions();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };
  
  const handleCloseSession = async () => {
    if (!selectedSession) return;
    await ChatSession.update(selectedSession.id, { status: 'closed' });
    loadSessions();
    setSelectedSession(prev => ({...prev, status: 'closed'}));
  };

  if (!hasAccess && !isLoading) {
    return (
        <div className="p-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-red-500"/>
            <h1 className="mt-4 text-2xl font-bold">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Apenas administradores podem acessar o painel de suporte.</p>
        </div>
    )
  }

  const filteredSessions = sessions.filter(s => statusFilter === 'all' || s.status === statusFilter);

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Sidebar de Sessões */}
      <aside className="w-1/3 min-w-[300px] border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversas de Suporte</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filtrar por status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Abertas</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="closed">Fechadas</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedSession?.id === session.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold">{session.subject}</p>
                  {session.agent_unread_count > 0 && <Badge className="bg-blue-600">{session.agent_unread_count}</Badge>}
                </div>
                <p className="text-sm text-gray-700 truncate">{session.client_name} ({session.client_email})</p>
                <p className="text-xs text-gray-500 truncate mt-1">{session.last_message_snippet || 'Nenhuma mensagem ainda.'}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(session.last_message_at || session.created_date), { addSuffix: true, locale: ptBR })}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
                <MessageSquare className="mx-auto h-10 w-10 text-gray-400"/>
                <p className="mt-2">Nenhuma conversa encontrada.</p>
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Janela de Chat */}
      <main className="w-2/3 flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-lg">{selectedSession.subject}</h3>
                <p className="text-sm text-gray-600">Cliente: {selectedSession.client_name}</p>
              </div>
              {selectedSession.status !== 'closed' && (
                  <Button variant="outline" size="sm" onClick={handleCloseSession}>Encerrar Conversa</Button>
              )}
            </div>
            <EnhancedChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserEmail={currentUser?.email}
              currentUser={currentUser}
              sessionId={selectedSession.id}
              sessionStatus={selectedSession.status}
              companyFeatures={{}} // Adicionar features da empresa se necessário
              onEscalateToHuman={(reason) => {
                console.log('Escalação para humano:', reason);
                // Implementar lógica de escalação se necessário
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-500 bg-gray-50">
            <MessageSquare className="w-16 h-16 text-gray-300" />
            <p className="mt-4 text-lg">Selecione uma conversa para começar</p>
            <p>As mensagens aparecerão aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
