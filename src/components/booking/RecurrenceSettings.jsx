import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Repeat, 
  Calendar as CalendarIcon, 
  Clock, 
  Info,
  X
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const daysOfWeek = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' }
];

export default function RecurrenceSettings({ 
  recurrenceData, 
  onChange, 
  startDate, 
  service 
}) {
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      ...recurrenceData,
      [field]: value
    });
  };

  const generatePreviewDates = () => {
    if (!startDate || !recurrenceData.pattern_type) return [];
    
    const dates = [];
    let currentDate = parseISO(startDate);
    const maxPreview = 5;
    
    for (let i = 0; i < maxPreview && dates.length < maxPreview; i++) {
      if (i > 0) {
        switch (recurrenceData.pattern_type) {
          case 'daily':
            currentDate = addDays(currentDate, recurrenceData.interval || 1);
            break;
          case 'weekly':
            currentDate = addWeeks(currentDate, recurrenceData.interval || 1);
            break;
          case 'monthly':
            currentDate = addMonths(currentDate, recurrenceData.interval || 1);
            break;
        }
      }
      dates.push(currentDate);
    }
    
    return dates;
  };

  const handleDayOfWeekToggle = (dayValue) => {
    const currentDays = recurrenceData.days_of_week || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort();
    
    handleChange('days_of_week', newDays);
  };

  return (
    <div className="space-y-4">
      {/* Tipo de Recorrência */}
      <div className="space-y-2">
        <Label>Tipo de Recorrência</Label>
        <Select 
          value={recurrenceData.pattern_type || ''} 
          onValueChange={(value) => handleChange('pattern_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o padrão de repetição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diariamente</SelectItem>
            <SelectItem value="weekly">Semanalmente</SelectItem>
            <SelectItem value="monthly">Mensalmente</SelectItem>
            <SelectItem value="yearly">Anualmente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intervalo */}
      {recurrenceData.pattern_type && (
        <div className="space-y-2">
          <Label>Repetir a cada</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="12"
              value={recurrenceData.interval || 1}
              onChange={(e) => handleChange('interval', parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">
              {recurrenceData.pattern_type === 'daily' && 'dia(s)'}
              {recurrenceData.pattern_type === 'weekly' && 'semana(s)'}
              {recurrenceData.pattern_type === 'monthly' && 'mês(es)'}
              {recurrenceData.pattern_type === 'yearly' && 'ano(s)'}
            </span>
          </div>
        </div>
      )}

      {/* Dias da Semana (para recorrência semanal) */}
      {recurrenceData.pattern_type === 'weekly' && (
        <div className="space-y-2">
          <Label>Dias da Semana</Label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day.value}
                className={`cursor-pointer px-3 py-2 rounded-lg border text-sm transition-colors ${
                  (recurrenceData.days_of_week || []).includes(day.value)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleDayOfWeekToggle(day.value)}
              >
                {day.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Como Terminar */}
      <div className="space-y-2">
        <Label>Terminar</Label>
        <Select 
          value={recurrenceData.end_type || 'never'} 
          onValueChange={(value) => handleChange('end_type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Nunca</SelectItem>
            <SelectItem value="after_occurrences">Após um número de ocorrências</SelectItem>
            <SelectItem value="end_date">Em uma data específica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Número máximo de ocorrências */}
      {recurrenceData.end_type === 'after_occurrences' && (
        <div className="space-y-2">
          <Label>Número de Ocorrências</Label>
          <Input
            type="number"
            min="1"
            max="52"
            value={recurrenceData.max_occurrences || ''}
            onChange={(e) => handleChange('max_occurrences', parseInt(e.target.value))}
            placeholder="Ex: 10"
          />
        </div>
      )}

      {/* Data final */}
      {recurrenceData.end_type === 'end_date' && (
        <div className="space-y-2">
          <Label>Data Final</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recurrenceData.end_date 
                  ? format(new Date(recurrenceData.end_date), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Selecionar data final'
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={recurrenceData.end_date ? new Date(recurrenceData.end_date) : undefined}
                onSelect={(date) => handleChange('end_date', date ? format(date, 'yyyy-MM-dd') : null)}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Preview das próximas datas */}
      {recurrenceData.pattern_type && startDate && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Preview das Próximas Datas</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
          
          {showPreview && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex flex-wrap gap-2">
                {generatePreviewDates().map((date, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aviso importante */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Agendamentos recorrentes serão criados automaticamente. 
          Você poderá cancelar ou modificar agendamentos individuais posteriormente.
        </AlertDescription>
      </Alert>
    </div>
  );
}