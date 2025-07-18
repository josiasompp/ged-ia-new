import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatWindow({ messages, onSendMessage, currentUserEmail, sessionStatus }) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
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
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Nenhuma mensagem nesta conversa ainda.</p>
              {!isChatClosed && <p>Envie uma mensagem para começar.</p>}
            </div>
          ) : (
            messages.map((msg) => {
              const isSender = msg.sender_email === currentUserEmail;
              return (
                <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-2xl ${isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isSender ? 'text-blue-200' : 'text-gray-500'}`}>
                      {format(new Date(msg.created_date), "HH:mm, dd/MM/yy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      {isChatClosed ? (
         <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600 font-medium">
           Esta conversa foi encerrada.
         </div>
      ) : (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isChatClosed}
            />
            <Button size="icon" variant="ghost">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || isChatClosed}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}