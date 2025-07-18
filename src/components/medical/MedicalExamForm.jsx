
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  User, 
  Stethoscope, 
  FileText, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

const EXAM_TYPES = {
  'admissional': 'Exame Admissional',
  'periodico': 'Exame Periódico',
  'mudanca_funcao': 'Mudança de Função',
  'retorno_afastamento': 'Retorno de Afastamento',
  'demissional': 'Exame Demissional'
};

const EXAM_STATUS = {
  'agendado': 'Agendado',
  'realizado': 'Realizado',
  'cancelado': 'Cancelado',
  'reagendado': 'Reagendado',
  'pendente_aso': 'Pendente ASO',
  'concluido': 'Concluído'
};

export default function MedicalExamForm({ 
  exam, 
  employees, 
  integrationConfigs, 
  onSave, 
  onClose, 
  currentUser 
}) {
  const [formData, setFormData] = useState({
    employee_id: exam?.employee_id || '',
    exam_type: exam?.exam_type || 'admissional',
    scheduled_date: exam?.scheduled_date || '',
    clinic_provider: exam?.clinic_provider || '',
    clinic_id: exam?.clinic_id || '',
    clinic_name: exam?.clinic_name || '',
    doctor_crm: exam?.doctor_crm || '',
    doctor_name: exam?.doctor_name || '',
    status: exam?.status || 'agendado',
    exam_results: exam?.exam_results || {},
    costs: exam?.costs || {},
    notes: exam?.notes || ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar exame:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const selectedEmployee = getEmployee(formData.employee_id);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            {exam ? 'Editar Exame de Saúde Ocupacional' : 'Agendar Novo Exame'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="clinic">Clínica</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
              <TabsTrigger value="costs">Custos</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Funcionário *</Label>
                  <Select 
                    value={formData.employee_id} 
                    onValueChange={(value) => handleInputChange('employee_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {employee.full_name} - {employee.position}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEmployee && (
                    <div className="text-sm text-gray-600">
                      <p>Cargo: {selectedEmployee.position}</p>
                      <p>Departamento: {selectedEmployee.department}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam_type">Tipo de Exame *</Label>
                  <Select 
                    value={formData.exam_type} 
                    onValueChange={(value) => handleInputChange('exam_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXAM_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Data e Hora Agendada *</Label>
                  <Input
                    id="scheduled_date"
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXAM_STATUS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.exam_type && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Orientações para {EXAM_TYPES[formData.exam_type]}:</strong>
                    {formData.exam_type === 'admissional' && ' Exame obrigatório antes do início das atividades.'}
                    {formData.exam_type === 'periodico' && ' Exame de acompanhamento da saúde ocupacional.'}
                    {formData.exam_type === 'mudanca_funcao' && ' Necessário para mudança de cargo ou setor.'}
                    {formData.exam_type === 'demissional' && ' Exame final obrigatório no desligamento.'}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="clinic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic_provider">Provedor/Sistema *</Label>
                  <Select 
                    value={formData.clinic_provider} 
                    onValueChange={(value) => handleInputChange('clinic_provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o provedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {integrationConfigs.map((config) => (
                        <SelectItem key={config.provider} value={config.provider}>
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            {config.provider_name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic_name">Nome da Clínica *</Label>
                  <Input
                    id="clinic_name"
                    value={formData.clinic_name}
                    onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                    placeholder="Nome da clínica ou laboratório"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic_id">ID da Clínica no Sistema</Label>
                  <Input
                    id="clinic_id"
                    value={formData.clinic_id}
                    onChange={(e) => handleInputChange('clinic_id', e.target.value)}
                    placeholder="ID no sistema externo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Médico Responsável</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                    placeholder="Nome do médico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor_crm">CRM do Médico</Label>
                  <Input
                    id="doctor_crm"
                    value={formData.doctor_crm}
                    onChange={(e) => handleInputChange('doctor_crm', e.target.value)}
                    placeholder="CRM/12345"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aptitude">Resultado da Aptidão</Label>
                  <Select 
                    value={formData.exam_results?.aptitude || ''} 
                    onValueChange={(value) => handleNestedChange('exam_results', 'aptitude', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apto">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Apto
                        </div>
                      </SelectItem>
                      <SelectItem value="inapto">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          Inapto
                        </div>
                      </SelectItem>
                      <SelectItem value="apto_com_restricoes">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          Apto com Restrições
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next_exam_date">Próximo Exame</Label>
                  <Input
                    id="next_exam_date"
                    type="date"
                    value={formData.exam_results?.next_exam_date || ''}
                    onChange={(e) => handleNestedChange('exam_results', 'next_exam_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="restrictions">Restrições Médicas</Label>
                  <Textarea
                    id="restrictions"
                    value={formData.exam_results?.restrictions?.join(', ') || ''}
                    onChange={(e) => handleNestedChange('exam_results', 'restrictions', e.target.value.split(', ').filter(Boolean))}
                    placeholder="Lista de restrições separadas por vírgula"
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observations">Observações Médicas</Label>
                  <Textarea
                    id="observations"
                    value={formData.exam_results?.observations || ''}
                    onChange={(e) => handleNestedChange('exam_results', 'observations', e.target.value)}
                    placeholder="Observações e recomendações médicas"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_cost">Custo do Exame</Label>
                  <Input
                    id="exam_cost"
                    type="number"
                    step="0.01"
                    value={formData.costs?.exam_cost || ''}
                    onChange={(e) => handleNestedChange('costs', 'exam_cost', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_costs">Custos Adicionais</Label>
                  <Input
                    id="additional_costs"
                    type="number"
                    step="0.01"
                    value={formData.costs?.additional_costs || ''}
                    onChange={(e) => handleNestedChange('costs', 'additional_costs', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_cost">Custo Total</Label>
                  <Input
                    id="total_cost"
                    type="number"
                    step="0.01"
                    value={(formData.costs?.exam_cost || 0) + (formData.costs?.additional_costs || 0)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_status">Status do Pagamento</Label>
                  <Select 
                    value={formData.costs?.payment_status || 'pendente'} 
                    onValueChange={(value) => handleNestedChange('costs', 'payment_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Pendente
                        </div>
                      </SelectItem>
                      <SelectItem value="pago">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Pago
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelado">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          Cancelado
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : exam ? 'Atualizar Exame' : 'Agendar Exame'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
