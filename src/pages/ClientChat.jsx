
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, MessageSquare, Plus } from 'lucide-react';
import { ChatSession } from '@/api/entities';
import { ChatMessage } from '@/api/entities';
import { User } from '@/api/entities';
import EnhancedChatWindow from '../components/chat/EnhancedChatWindow';

export default function ClientChat() {
    const [sessions, setSessions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewChatForm, setShowNewChatForm] = useState(false);
    const [newChatSubject, setNewChatSubject] = useState('');

    const loadData = useCallback(async (user) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await ChatSession.filter({ client_email: user.email }, "-last_message_at");
            setSessions(data);
            if (data.length > 0 && !selectedSession) {
                handleSelectSession(data[0]);
            }
        } catch (error) {
            console.error("Erro ao carregar sessões de chat:", error);
        }
        setIsLoading(false);
    }, [selectedSession]);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await User.me();
                setCurrentUser(user);
                loadData(user);
            } catch (e) {
                setIsLoading(false);
            }
        };
        init();
    }, [loadData]);

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
        if (session.client_unread_count > 0) {
            await ChatSession.update(session.id, { client_unread_count: 0 });
            loadData(currentUser);
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
            await ChatSession.update(selectedSession.id, { 
                last_message_at: new Date().toISOString(),
                last_message_snippet: content.substring(0, 50),
                agent_unread_count: (selectedSession.agent_unread_count || 0) + 1,
            });
            loadMessages(selectedSession.id);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    const handleCreateNewChat = async () => {
        if (!newChatSubject.trim() || !currentUser) return;
        try {
            const newSession = await ChatSession.create({
                company_id: currentUser.company_id,
                client_email: currentUser.email,
                client_name: currentUser.full_name,
                subject: newChatSubject,
                last_message_at: new Date().toISOString()
            });
            setNewChatSubject('');
            setShowNewChatForm(false);
            loadData(currentUser);
            handleSelectSession(newSession);
        } catch (error) {
            console.error("Erro ao criar chat:", error);
        }
    };
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Meu Suporte</CardTitle>
                <Button onClick={() => setShowNewChatForm(true)}><Plus className="w-4 h-4 mr-2"/> Nova Conversa</Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[60vh]">
                    <div className="md:col-span-1 border-r pr-4">
                        <h3 className="font-semibold mb-2">Minhas Conversas</h3>
                        <div className="space-y-2">
                        {sessions.length > 0 ? sessions.map(session => (
                            <div key={session.id} onClick={() => handleSelectSession(session)}
                                className={`p-3 rounded-lg cursor-pointer ${selectedSession?.id === session.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <p className="font-medium truncate">{session.subject}</p>
                                <p className="text-sm text-gray-500 capitalize">{session.status}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 p-3">Nenhuma conversa iniciada.</p>
                        )}
                        </div>
                    </div>
                    <div className="md:col-span-2 h-full">
                        {selectedSession ? (
                           <EnhancedChatWindow 
                             messages={messages} 
                             onSendMessage={handleSendMessage} 
                             currentUserEmail={currentUser?.email}
                             currentUser={currentUser}
                             sessionId={selectedSession.id}
                             sessionStatus={selectedSession.status}
                             companyFeatures={{}} // Adicionar features da empresa se necessário
                           />
                        ) : (
                          <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 bg-gray-50 rounded-lg">
                            <MessageSquare className="w-16 h-16 text-gray-300" />
                            <p className="mt-4 text-lg">Selecione ou crie uma conversa</p>
                          </div>
                        )}
                    </div>
                </div>
            </CardContent>
            {showNewChatForm && (
                <Dialog open={showNewChatForm} onOpenChange={setShowNewChatForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Iniciar Nova Conversa</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input 
                                placeholder="Qual o assunto?"
                                value={newChatSubject}
                                onChange={(e) => setNewChatSubject(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowNewChatForm(false)}>Cancelar</Button>
                            <Button onClick={handleCreateNewChat} disabled={!newChatSubject.trim()}>Criar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}
