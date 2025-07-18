import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import LeadCard from './LeadCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from '@/components/ui/badge';


export default function PipelineKanbanView({ leads, pipeline, users, onUpdateLead, onNewLead, onEditLead }) {
  const [columns, setColumns] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (pipeline && pipeline.stages && Array.isArray(leads)) {
      const stageMap = pipeline.stages.reduce((acc, stage) => {
        acc[stage.id] = {
          ...stage,
          leads: [],
        };
        return acc;
      }, {});
      
      leads.forEach(lead => {
        // Use a stage do lead ou a primeira stage do pipeline como fallback
        const stageId = lead.stage && stageMap[lead.stage] ? lead.stage : (pipeline.stages[0]?.id || null);
        if (stageId) {
          stageMap[stageId].leads.push(lead);
        }
      });
      
      // Ordenar leads em cada estágio
      Object.values(stageMap).forEach(stage => {
          stage.leads.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
      });

      setColumns(stageMap);
    }
  }, [leads, pipeline]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];

    if (startColumn === endColumn) {
      // Movendo dentro da mesma coluna (reordenando)
      const newLeads = Array.from(startColumn.leads);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);

      const newColumn = { ...startColumn, leads: newLeads };
      setColumns(prev => ({ ...prev, [newColumn.id]: newColumn }));
    } else {
      // Movendo para uma coluna diferente
      const startLeads = Array.from(startColumn.leads);
      const [movedLead] = startLeads.splice(source.index, 1);
      const endLeads = Array.from(endColumn.leads);
      endLeads.splice(destination.index, 0, movedLead);

      const newStartColumn = { ...startColumn, leads: startLeads };
      const newEndColumn = { ...endColumn, leads: endLeads };

      setColumns(prev => ({
        ...prev,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      }));
      
      const newStageId = destination.droppableId;
      const newStage = pipeline.stages.find(s => s.id === newStageId);
      
      onUpdateLead(draggableId, { stage: newStageId });
      toast({
          title: "Lead movido!",
          description: `O lead foi movido para o estágio "${newStage.name}".`
      });
    }
  };

  if (!pipeline || !pipeline.stages) {
    return <div className="p-4 text-center">Nenhum pipeline de vendas configurado.</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex gap-4 p-4 bg-gray-50">
                {(pipeline.stages || []).map(stage => (
                    <div key={stage.id} className="w-72 md:w-80 flex-shrink-0">
                        <div className="h-full flex flex-col">
                            <div className="p-3 bg-gray-100 rounded-t-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span style={{backgroundColor: stage.color}} className="w-3 h-3 rounded-full"/>
                                        <h3 className="text-sm font-semibold text-gray-700">{stage.name}</h3>
                                    </div>
                                    <Badge variant="secondary">{columns[stage.id]?.leads.length || 0}</Badge>
                                </div>
                            </div>
                            <Droppable droppableId={stage.id}>
                                {(provided, snapshot) => (
                                    <ScrollArea 
                                        className={`p-2 transition-colors duration-200 bg-gray-100 rounded-b-lg grow ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                                    >
                                      <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[400px]">
                                        {columns[stage.id]?.leads.map((lead, index) => {
                                             const responsibleUser = users.find(u => u.email === lead.assigned_to);
                                             return (
                                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                  {(providedDraggable, snapshotDraggable) => (
                                                    <LeadCard 
                                                        lead={lead} 
                                                        user={responsibleUser} 
                                                        index={index}
                                                        onEdit={onEditLead}
                                                        provided={providedDraggable}
                                                        snapshot={snapshotDraggable}
                                                    />
                                                  )}
                                                </Draggable>
                                             )
                                        })}
                                        {provided.placeholder}
                                      </div>
                                    </ScrollArea>
                                )}
                            </Droppable>
                             <Button variant="ghost" className="w-full mt-2" onClick={onNewLead}>
                                <Plus className="w-4 h-4 mr-2"/>
                                Adicionar Lead
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </DragDropContext>
  );
}