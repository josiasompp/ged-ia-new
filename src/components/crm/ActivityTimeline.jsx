import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timeline, TimelineItem, TimelineDot, TimelineTitle, TimelineBody } from "@/components/ui/timeline";
import { Phone, Mail, Users, ClipboardCheck, MessageSquare, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const activityIcons = {
  chamada: Phone,
  email: Mail,
  reuniao: Users,
  tarefa: ClipboardCheck,
  nota: MessageSquare,
  proposta: FileText,
  follow_up: Phone,
  demo: Users
};

export default function ActivityTimeline({ activities, leads, currentUser, onRefresh, isLoading }) {
  if (isLoading) return <p>Carregando atividades...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Linha do Tempo de Atividades</CardTitle>
        {/* Hook up the "Nova Atividade" button to the onRefresh callback. 
            In a real application, this would typically trigger a modal or navigation
            to an activity creation form, and then a refresh would happen after successful creation.
            For this context, using onRefresh makes the button functional. */}
        <Button size="sm" variant="outline" onClick={onRefresh}><Plus className="w-4 h-4 mr-2"/>Nova Atividade</Button>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <Timeline>
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || MessageSquare;
              const lead = leads.find(l => l.id === activity.lead_id);
              return (
                <TimelineItem key={activity.id}>
                  <TimelineDot>
                    <Icon className="w-4 h-4" />
                  </TimelineDot>
                  <TimelineTitle>{activity.subject}</TimelineTitle>
                  <TimelineBody>
                    <p>{activity.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <span><Badge variant="secondary" className="capitalize">{activity.type.replace('_', ' ')}</Badge></span>
                      {lead && <span>Lead: <span className="font-medium">{lead.name}</span></span>}
                      <span>Por: <span className="font-medium">{activity.user_email}</span></span>
                      <span>{format(new Date(activity.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                  </TimelineBody>
                </TimelineItem>
              );
            })}
          </Timeline>
        ) : (
          <div className="text-center py-10">
            <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma atividade registrada</h3>
            <p className="mt-1 text-sm text-gray-500">Adicione uma nova atividade para começar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}