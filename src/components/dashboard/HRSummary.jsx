
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Added this import
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Briefcase, 
  Users, 
  UserPlus, 
  Calendar, 
  Gift, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HRSummary({
  employees,
  hiringProcesses,
  vacationRequests,
  isLoading,
}) {
  const pendingHires = hiringProcesses.filter(hp => ['documentos_pendentes', 'em_analise'].includes(hp.status)).length;
  const pendingVacations = vacationRequests.filter(vr => vr.status === 'solicitada').length;

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const upcoming = employees
      .map(emp => {
        if (!emp.birth_date) return null;
        const birthDate = parseISO(emp.birth_date);
        const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (birthdayThisYear < today) {
          birthdayThisYear.setFullYear(today.getFullYear() + 1);
        }
        return {
          ...emp,
          daysUntil: Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24)),
          birthdayDisplay: format(birthdayThisYear, "dd 'de' MMMM", { locale: ptBR }),
        };
      })
      .filter(emp => emp && emp.daysUntil <= 30) // Próximos 30 dias
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3); // Pegar os 3 próximos

    return upcoming;
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
                Resumo de RH
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
            <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
                Resumo de RH
            </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 flex-grow">
        <div className="space-y-3">
          <Link to={createPageUrl("HumanResources?tab=hiring")} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Contratações Pendentes</span>
              </div>
              <Badge variant="secondary">{pendingHires}</Badge>
            </div>
          </Link>
          <Link to={createPageUrl("HumanResources?tab=vacations")} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Férias para Aprovar</span>
              </div>
              <Badge variant="secondary">{pendingVacations}</Badge>
            </div>
          </Link>
        </div>
        
        <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Gift className="w-5 h-5 text-pink-500"/> Próximos Aniversariantes</h4>
            <div className="space-y-3">
                {upcomingBirthdays.length > 0 ? (
                    upcomingBirthdays.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                                    {emp.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                                </div>
                                <span>{emp.full_name}</span>
                            </div>
                            <span className="text-gray-500">{emp.birthdayDisplay}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhum aniversário nos próximos 30 dias.</p>
                )}
            </div>
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <Link to={createPageUrl("HumanResources")}>
            <Button variant="outline" className="w-full gap-2">
                Ver Módulo de RH
                <ArrowRight className="w-4 h-4" />
            </Button>
        </Link>
      </div>
    </Card>
  );
}
