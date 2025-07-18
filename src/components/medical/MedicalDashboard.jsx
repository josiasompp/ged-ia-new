
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Activity,
  Users,
  TrendingUp
} from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MedicalDashboard({ exams, employees, integrationConfigs, stats, isLoading }) {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const nextMonth = addDays(today, 30);

  // Exames agendados para os próximos 7 dias
  const upcomingExams = exams.filter(exam => {
    if (!exam.scheduled_date) return false;
    const examDate = new Date(exam.scheduled_date);
    return isAfter(examDate, today) && isBefore(examDate, nextWeek);
  });

  // Exames vencidos que precisam ser reagendados
  const overdueExams = exams.filter(exam => {
    if (!exam.scheduled_date) return false;
    const examDate = new Date(exam.scheduled_date);
    return isBefore(examDate, today) && ['agendado', 'reagendado'].includes(exam.status);
  });

  // Funcionários que precisam de exames periódicos
  const getEmployeesNeedingPeriodicExams = () => {
    return employees.filter(employee => {
      const lastPeriodicExam = exams
        .filter(exam => exam.employee_id === employee.id && exam.exam_type === 'periodico')
        .sort((a, b) => new Date(b.exam_date || b.scheduled_date) - new Date(a.exam_date || a.scheduled_date))[0];
      
      if (!lastPeriodicExam) return true;
      
      const lastExamDate = new Date(lastPeriodicExam.exam_date || lastPeriodicExam.scheduled_date);
      const monthsSinceLastExam = (today - lastExamDate) / (1000 * 60 * 60 * 24 * 30);
      
      return monthsSinceLastExam >= 12; // Assume exame anual
    });
  };

  const employeesNeedingExams = getEmployeesNeedingPeriodicExams();

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const calculateComplianceRate = () => {
    const totalActiveEmployees = employees.filter(emp => emp.status === 'ativo').length;
    const employeesWithValidExams = employees.filter(employee => {
      const validExam = exams.find(exam => 
        exam.employee_id === employee.id && 
        exam.status === 'concluido' &&
        exam.exam_date
      );
      return validExam;
    }).length;
    
    return totalActiveEmployees > 0 ? Math.round((employeesWithValidExams / totalActiveEmployees) * 100) : 0;
  };

  const complianceRate = calculateComplianceRate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conformidade</p>
                <p className="text-2xl font-bold text-green-600">{complianceRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos 7 Dias</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingExams.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">{overdueExams.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Precisam de Exames</p>
                <p className="text-2xl font-bold text-yellow-600">{employeesNeedingExams.length}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Exames (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum exame agendado para os próximos 7 dias</p>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 5).map((exam) => {
                  const employee = getEmployee(exam.employee_id);
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {employee?.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{employee?.full_name}</p>
                          <p className="text-sm text-gray-600">{exam.exam_type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(new Date(exam.scheduled_date), 'dd/MM', { locale: ptBR })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(exam.scheduled_date), 'HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Exames em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueExams.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum exame em atraso</p>
            ) : (
              <div className="space-y-3">
                {overdueExams.slice(0, 5).map((exam) => {
                  const employee = getEmployee(exam.employee_id);
                  const daysOverdue = Math.floor((today - new Date(exam.scheduled_date)) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">
                          {employee?.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{employee?.full_name}</p>
                          <p className="text-sm text-gray-600">{exam.exam_type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-red-100 text-red-800">
                          {daysOverdue} dias
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employees Needing Periodic Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Funcionários que Precisam de Exames Periódicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employeesNeedingExams.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Todos os funcionários estão com exames em dia</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {employeesNeedingExams.slice(0, 9).map((employee) => (
                <div key={employee.id} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-600">
                      {employee.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{employee.full_name}</p>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Status das Integrações de Saúde Ocupacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          {integrationConfigs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma integração configurada</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {integrationConfigs.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{config.provider_name}</p>
                    <p className="text-sm text-gray-600">{config.provider}</p>
                  </div>
                  <Badge 
                    className={
                      config.health_status === 'healthy' ? 'bg-green-100 text-green-800' :
                      config.health_status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {config.health_status === 'healthy' ? 'Saudável' :
                     config.health_status === 'degraded' ? 'Degradado' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
