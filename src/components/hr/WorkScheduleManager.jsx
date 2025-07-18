
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Edit,
  Plus,
  Settings,
  MoreVertical,
  CalendarDays,
  Coffee,
  Sun,
  Moon,
  Zap,
  Banknote,
  ShieldCheck
} from "lucide-react";
import { WorkSchedule } from "@/api/entities";
import { useToast } from "@/components/ui/use-toast";

const ShiftTypeDetails = ({ type }) => {
  const details = {
    fixo: { icon: Clock, label: "Fixo", color: "bg-blue-100 text-blue-800" },
    flexivel: { icon: Zap, label: "Flexível", color: "bg-purple-100 text-purple-800" },
    rotativo: { icon: Sun, label: "Rotativo", color: "bg-orange-100 text-orange-800" },
    '12x36': { icon: Moon, label: "12x36", color: "bg-indigo-100 text-indigo-800" },
    esporadico: { icon: Coffee, label: "Esporádico", color: "bg-gray-100 text-gray-800" },
  };
  const detail = details[type] || details.fixo;
  return (
    <Badge className={detail.color}>
      <detail.icon className="w-3 h-3 mr-1" />
      {detail.label}
    </Badge>
  );
};

const WorkScheduleForm = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    schedule || {
      name: "",
      description: "",
      country: "brasil",
      shift_type: "fixo",
      weekly_hours: 44,
      daily_hours: 8,
      tolerance_minutes: 5,
      schedule_days: {
        monday: { work_day: true, start_time: '08:00', end_time: '18:00', break_start: '12:00', break_end: '13:00' },
        tuesday: { work_day: true, start_time: '08:00', end_time: '18:00', break_start: '12:00', break_end: '13:00' },
        wednesday: { work_day: true, start_time: '08:00', end_time: '18:00', break_start: '12:00', break_end: '13:00' },
        thursday: { work_day: true, start_time: '08:00', end_time: '18:00', break_start: '12:00', break_end: '13:00' },
        friday: { work_day: true, start_time: '08:00', end_time: '18:00', break_start: '12:00', break_end: '13:00' },
        saturday: { work_day: false, start_time: '', end_time: '', break_start: '', break_end: '' },
        sunday: { work_day: false, start_time: '', end_time: '', break_start: '', break_end: '' },
      },
      break_rules: { mandatory_break: true, min_break_duration: 60, auto_deduct_break: false, flexible_break: false },
      overtime_rules: { allow_overtime: true, max_daily_overtime: 120, overtime_rates_json: '{"weekday": 50, "holiday": 100}', requires_approval: true },
      time_bank_rules: { enable_time_bank: false, compensation_ratio: 1.5, time_bank_limit_hours: 40 },
      holiday_work_policy: "extra_pay",
      is_active: true,
    }
  );
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Preparar dados para envio - converter objetos para JSON strings
      const dataToSend = {
        ...formData,
        company_id: formData.company_id || "default_company", // Garantir que company_id existe
        schedule_days: JSON.stringify(formData.schedule_days),
        break_rules: JSON.stringify(formData.break_rules),
        overtime_rules: JSON.stringify(formData.overtime_rules),
        time_bank_rules: JSON.stringify(formData.time_bank_rules)
      };

      if (formData.id) {
        await WorkSchedule.update(formData.id, dataToSend);
      } else {
        await WorkSchedule.create(dataToSend);
      }
      toast({ title: "Sucesso!", description: "Turno de trabalho salvo." });
      onSave();
    } catch (error) {
      console.error("Erro ao salvar turno:", error);
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar o turno." });
    }
  };

  const handleDayScheduleChange = (day, field, value) => {
    setFormData(prev => ({
        ...prev,
        schedule_days: {
            ...prev.schedule_days,
            [day]: { ...prev.schedule_days[day], [field]: value }
        }
    }));
  };

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>{formData.id ? "Editar Turno" : "Novo Turno de Trabalho"}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-4">
        {/* Coluna 1: Informações Gerais */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Informações Gerais</h3>
          <div>
            <Label htmlFor="name">Nome do Turno</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Administrativo, Turno 12x36" />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes sobre este turno" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shift_type">Tipo de Turno</Label>
              <Select value={formData.shift_type} onValueChange={v => setFormData({...formData, shift_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixo">Fixo</SelectItem>
                  <SelectItem value="flexivel">Flexível</SelectItem>
                  <SelectItem value="rotativo">Rotativo</SelectItem>
                  <SelectItem value="12x36">12x36</SelectItem>
                  <SelectItem value="esporadico">Esporádico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">País (Legislação)</Label>
              <Select value={formData.country} onValueChange={v => setFormData({...formData, country: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasil">Brasil</SelectItem>
                  <SelectItem value="espanha">Espanha</SelectItem>
                  <SelectItem value="portugal">Portugal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label htmlFor="weekly_hours">Horas/Semana</Label><Input type="number" id="weekly_hours" value={formData.weekly_hours} onChange={e => setFormData({...formData, weekly_hours: +e.target.value})} /></div>
            <div><Label htmlFor="daily_hours">Horas/Dia</Label><Input type="number" id="daily_hours" value={formData.daily_hours} onChange={e => setFormData({...formData, daily_hours: +e.target.value})} /></div>
            <div><Label htmlFor="tolerance_minutes">Tolerância (min)</Label><Input type="number" id="tolerance_minutes" value={formData.tolerance_minutes} onChange={e => setFormData({...formData, tolerance_minutes: +e.target.value})} /></div>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={c => setFormData({...formData, is_active: c})} />
            <Label htmlFor="is_active">Turno Ativo</Label>
          </div>
        </div>

        {/* Coluna 2: Regras */}
        <div className="space-y-4">
          {/* Horários Semanais */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg border-b pb-2">Horários Semanais</h3>
            {Object.keys(formData.schedule_days).map(day => (
                <div key={day} className="flex items-center gap-2">
                    <div className="w-28">
                        <Checkbox checked={formData.schedule_days[day].work_day} onCheckedChange={c => handleDayScheduleChange(day, 'work_day', c)} id={`work_${day}`} />
                        <Label htmlFor={`work_${day}`} className="ml-2 capitalize">{day}</Label>
                    </div>
                    <Input disabled={!formData.schedule_days[day].work_day} type="time" value={formData.schedule_days[day].start_time} onChange={e => handleDayScheduleChange(day, 'start_time', e.target.value)} />
                    <Input disabled={!formData.schedule_days[day].work_day} type="time" value={formData.schedule_days[day].end_time} onChange={e => handleDayScheduleChange(day, 'end_time', e.target.value)} />
                </div>
            ))}
          </div>

          {/* Regras de Intervalo */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg border-b pb-2">Regras de Intervalo</h3>
            <div className="flex items-center space-x-2"><Checkbox id="flexible_break" checked={formData.break_rules.flexible_break} onCheckedChange={c => setFormData({...formData, break_rules: {...formData.break_rules, flexible_break: c}})} /><Label htmlFor="flexible_break">Permitir intervalo flexível</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="auto_deduct_break" checked={formData.break_rules.auto_deduct_break} onCheckedChange={c => setFormData({...formData, break_rules: {...formData.break_rules, auto_deduct_break: c}})} /><Label htmlFor="auto_deduct_break">Descontar intervalo automaticamente</Label></div>
          </div>
          
          {/* Regras de Hora Extra e Banco de Horas */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg border-b pb-2">Hora Extra e Banco de Horas</h3>
            <div className="flex items-center space-x-2"><Checkbox id="allow_overtime" checked={formData.overtime_rules.allow_overtime} onCheckedChange={c => setFormData({...formData, overtime_rules: {...formData.overtime_rules, allow_overtime: c}})} /><Label htmlFor="allow_overtime">Permitir Horas Extras</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="enable_time_bank" checked={formData.time_bank_rules.enable_time_bank} onCheckedChange={c => setFormData({...formData, time_bank_rules: {...formData.time_bank_rules, enable_time_bank: c}})} /><Label htmlFor="enable_time_bank">Habilitar Banco de Horas</Label></div>
            <div>
                <Label htmlFor="holiday_work_policy">Política para Feriados e DSR</Label>
                <Select value={formData.holiday_work_policy} onValueChange={v => setFormData({...formData, holiday_work_policy: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="extra_pay">Pagamento de Hora Extra</SelectItem>
                        <SelectItem value="time_bank">Compensar no Banco de Horas</SelectItem>
                        <SelectItem value="day_off">Folga Compensatória</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar Turno</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default function WorkScheduleManager({ 
  workSchedules, 
  currentUser, 
  onRefresh, 
  isLoading 
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleEdit = (schedule) => {
    // Parse JSON strings back to objects for editing
    const scheduleForEdit = {
      ...schedule,
      schedule_days: typeof schedule.schedule_days === 'string' ? JSON.parse(schedule.schedule_days) : schedule.schedule_days,
      break_rules: typeof schedule.break_rules === 'string' ? JSON.parse(schedule.break_rules) : schedule.break_rules,
      overtime_rules: typeof schedule.overtime_rules === 'string' ? JSON.parse(schedule.overtime_rules) : schedule.overtime_rules,
      time_bank_rules: typeof schedule.time_bank_rules === 'string' ? JSON.parse(schedule.time_bank_rules) : schedule.time_bank_rules
    };
    setSelectedSchedule(scheduleForEdit);
    setShowForm(true);
  };
  
  const handleNew = () => {
    setSelectedSchedule(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    onRefresh();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-firstdocy-primary" />
                Gerenciador de Turnos ({workSchedules.length})
              </CardTitle>
              <CardDescription>Crie e gerencie os turnos e jornadas de trabalho da sua empresa.</CardDescription>
            </div>
            <Button onClick={handleNew} className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]">
              <Plus className="w-4 h-4" />
              Novo Turno
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Turno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Banco de Horas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum turno configurado</h3>
                      <p className="text-gray-500">Clique em "Novo Turno" para começar.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  workSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-semibold">{schedule.name}</div>
                        <div className="text-sm text-gray-500">{schedule.description}</div>
                      </TableCell>
                      <TableCell>
                        <ShiftTypeDetails type={schedule.shift_type} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{schedule.weekly_hours}h / semana</div>
                        <div className="text-sm text-gray-500">{schedule.daily_hours}h / dia</div>
                      </TableCell>
                      <TableCell>
                        {schedule.time_bank_rules?.enable_time_bank ? (
                          <Badge variant="outline" className="text-green-700 border-green-200">Ativo</Badge>
                        ) : (
                          <Badge variant="outline">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={schedule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {schedule.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(schedule)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <WorkScheduleForm 
          schedule={selectedSchedule}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
