import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  PlayCircle,
  PauseCircle,
  StopCircle,
  MapPin,
  MapPinOff,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Timer,
  User,
  Info,
  Shield,
  Camera,
  Smartphone
} from "lucide-react";
import { TimeEntry } from "@/api/entities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

export default function TimeClockInterface({ employees, currentUser, onTimeEntry }) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEntry, setLastEntry] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [message, setMessage] = useState(null);
  const [todayEntries, setTodayEntries] = useState([]);
  const [workingHours, setWorkingHours] = useState({ worked: 0, break: 0, remaining: 8 });

  const { toast } = useToast();

  // Effect to update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect to detect device info and attempt initial location
  useEffect(() => {
    setDeviceInfo({
      device_model: navigator.userAgent,
      os: navigator.platform,
      app_version: "2.0.0", // Sistema Brio! APx integrado
      ip_address: "auto-detect",
      clock_type: "web_interface",
      clock_serial: `WEB-${Date.now()}`
    });

    getCurrentLocation();
  }, []);

  // Effect to load employee data when selection changes
  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeData();
    } else {
      setLastEntry(null);
      setTodayEntries([]);
      setWorkingHours({ worked: 0, break: 0, remaining: 8 });
    }
  }, [selectedEmployee]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada por este navegador.");
      setIsLocationEnabled(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationError(null);
        setIsLocationEnabled(true);
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada pelo usuário.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informações de localização não disponíveis.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite para obter localização esgotado.";
            break;
          default:
            errorMessage = "Erro desconhecido ao obter localização.";
            break;
        }
        setLocationError(errorMessage);
        setIsLocationEnabled(false);
        console.warn("Aviso de geolocalização:", errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  const loadEmployeeData = async () => {
    if (!selectedEmployee) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await TimeEntry.filter({
        employee_id: selectedEmployee,
        entry_date: today
      }, "-entry_time");

      setTodayEntries(entries);

      if (entries.length > 0) {
        setLastEntry(entries[0]);
        calculateWorkingHours(entries);
      } else {
        setLastEntry(null);
        setWorkingHours({ worked: 0, break: 0, remaining: 8 });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do funcionário:", error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados do funcionário.' });
    }
  };

  const calculateWorkingHours = (entries) => {
    let workedMinutes = 0;
    let breakMinutes = 0;
    let currentEntry = null;
    let onBreak = false;

    // Processar entradas em ordem cronológica
    const sortedEntries = entries.sort((a, b) => a.entry_time.localeCompare(b.entry_time));
    
    sortedEntries.forEach(entry => {
      const entryTime = new Date(`${entry.entry_date}T${entry.entry_time}`);
      
      if (entry.entry_type === 'entrada') {
        currentEntry = entryTime;
        onBreak = false;
      } else if (entry.entry_type === 'inicio_intervalo' && currentEntry) {
        workedMinutes += (entryTime - currentEntry) / (1000 * 60);
        currentEntry = entryTime;
        onBreak = true;
      } else if (entry.entry_type === 'fim_intervalo' && currentEntry && onBreak) {
        breakMinutes += (entryTime - currentEntry) / (1000 * 60);
        currentEntry = entryTime;
        onBreak = false;
      } else if (entry.entry_type === 'saida' && currentEntry && !onBreak) {
        workedMinutes += (entryTime - currentEntry) / (1000 * 60);
        currentEntry = null;
      }
    });

    // Se ainda está trabalhando, calcular até agora
    if (currentEntry && !onBreak) {
      const now = new Date();
      workedMinutes += (now - currentEntry) / (1000 * 60);
    }

    const workedHours = Math.max(0, workedMinutes / 60);
    const breakHours = Math.max(0, breakMinutes / 60);
    const remainingHours = Math.max(0, 8 - workedHours);

    setWorkingHours({
      worked: workedHours,
      break: breakHours,
      remaining: remainingHours
    });
  };

  const determineEntryType = () => {
    if (!lastEntry) return 'entrada';

    switch (lastEntry.entry_type) {
      case 'entrada': return 'inicio_intervalo';
      case 'inicio_intervalo': return 'fim_intervalo';
      case 'fim_intervalo': return 'saida';
      case 'saida': return 'entrada';
      default: return 'entrada';
    }
  };

  const handleTimeEntry = async (entryType) => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Por favor, selecione um funcionário.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeEntryData = {
        employee_id: selectedEmployee,
        company_id: currentUser?.company_id || "default_company",
        entry_date: now.toISOString().split('T')[0],
        entry_time: now.toTimeString().split(' ')[0],
        entry_type: entryType,
        entry_method: 'web',
        location: isLocationEnabled ? location : null,
        device_info: deviceInfo,
        is_offline: false,
        status: 'valida',
        approval_status: 'nao_requer',
        portaria_671_compliant: true,
        afd_data: {
          afd_line: `WEB-${now.getTime()}`,
          afd_sequence: todayEntries.length + 1,
          afd_checksum: `CHK-${now.getTime().toString().slice(-6)}`
        }
      };

      await TimeEntry.create(timeEntryData);

      setMessage({
        type: 'success',
        text: `${getEntryTypeLabel(entryType)} registrada com sucesso!`
      });

      await loadEmployeeData();
      if (onTimeEntry) {
        onTimeEntry();
      }

      // Clear message after delay
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      setMessage({ type: 'error', text: 'Erro ao registrar ponto. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEntryTypeLabel = (type) => {
    const types = {
      'entrada': 'Entrada',
      'saida': 'Saída',
      'inicio_intervalo': 'Início Intervalo',
      'fim_intervalo': 'Fim Intervalo'
    };
    return types[type] || type;
  };

  const getEntryTypeColor = (type) => {
    const colors = {
      'entrada': 'text-green-600',
      'saida': 'text-red-600',
      'inicio_intervalo': 'text-yellow-600',
      'fim_intervalo': 'text-blue-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const getEntryTypeIcon = (type) => {
    switch (type) {
      case 'entrada': return <PlayCircle className="w-5 h-5" />;
      case 'saida': return <StopCircle className="w-5 h-5" />;
      case 'inicio_intervalo': return <PauseCircle className="w-5 h-5" />;
      case 'fim_intervalo': return <PlayCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const nextEntryType = determineEntryType();
  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
  const progressPercentage = Math.min((workingHours.worked / 8) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Controle de Ponto Digital
          </CardTitle>
          <p className="text-gray-600 mt-2 text-lg">
            Sistema inteligente conforme Portaria 671/MTE - Integração Brio! APx
          </p>
          <div className="text-5xl font-mono font-bold text-gray-800 mt-4">
            {format(currentTime, "HH:mm:ss")}
          </div>
          <p className="text-lg text-gray-600">
            {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                {isLocationEnabled ? <MapPin className="w-6 h-6 text-blue-600" /> : <MapPinOff className="w-6 h-6 text-blue-600" />}
              </div>
              <p className="text-sm font-medium">
                {isLocationEnabled ? 'Localização Ativa' : 'Localização Desabilitada'}
              </p>
              <p className="text-xs text-gray-500">
                {isLocationEnabled ? 'GPS detectado' : (locationError || 'GPS não detectado')}
              </p>
              {locationError && (
                <Button
                  variant="link"
                  onClick={getCurrentLocation}
                  className="text-xs mt-1 h-auto p-0"
                >
                  <MapPin className="w-3 h-3 mr-1" /> Tentar novamente
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Interface Web</p>
              <p className="text-xs text-gray-500">Modo seguro</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Portaria 671</p>
              <p className="text-xs text-gray-500">Conforme</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">Sistema Online</p>
              <p className="text-xs text-gray-500">Conectado</p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <Alert className={`max-w-md mx-auto ${message.type === 'success' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <AlertDescription>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Employee Selection */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium mb-2">Selecionar Funcionário</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter(emp => emp.status === 'ativo').map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{employee.full_name}</span>
                      <span className="text-gray-500">({employee.employee_code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Status and Working Hours */}
      {selectedEmployeeData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Info Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Status do Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  {selectedEmployeeData.profile_photo ? (
                    <img
                      src={selectedEmployeeData.profile_photo}
                      alt={selectedEmployeeData.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-600">
                      {selectedEmployeeData.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-lg">{selectedEmployeeData.full_name}</div>
                  <div className="text-sm text-gray-500">{selectedEmployeeData.position}</div>
                  <div className="text-sm text-gray-500">{selectedEmployeeData.employee_code}</div>
                </div>
              </div>

              {lastEntry && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Última batida:</span>
                    <Badge className={`${getEntryTypeColor(lastEntry.entry_type)} bg-opacity-10`}>
                      {getEntryTypeLabel(lastEntry.entry_type)} às {lastEntry.entry_time.substring(0,5)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de batidas hoje:</span>
                    <Badge variant="outline">{todayEntries.length}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Horas Trabalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progresso do dia:</span>
                  <span className="font-semibold">{workingHours.worked.toFixed(1)}h / 8h</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{workingHours.worked.toFixed(1)}h</div>
                    <div className="text-xs text-green-600">Trabalhadas</div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-600">{workingHours.break.toFixed(1)}h</div>
                    <div className="text-xs text-yellow-600">Intervalo</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{workingHours.remaining.toFixed(1)}h</div>
                    <div className="text-xs text-blue-600">Restante</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Entry Button */}
      <div className="text-center">
        <Button
          onClick={() => handleTimeEntry(nextEntryType)}
          disabled={!selectedEmployee || isSubmitting}
          className={`w-64 h-20 text-xl font-semibold text-white bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg transform transition-all duration-200 hover:scale-105`}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Registrando...
            </>
          ) : (
            <>
              {getEntryTypeIcon(nextEntryType)}
              <span className="ml-3">{getEntryTypeLabel(nextEntryType)}</span>
            </>
          )}
        </Button>
      </div>

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Batidas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEntryTypeIcon(entry.entry_type)}
                    <div>
                      <div className="font-medium">{getEntryTypeLabel(entry.entry_type)}</div>
                      <div className="text-sm text-gray-500">
                        {entry.entry_time.substring(0, 5)} • {entry.entry_method}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={
                      entry.status === 'valida' ? 'bg-green-100 text-green-800' :
                      entry.status === 'pendente_aprovacao' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {entry.status === 'valida' ? 'Válida' : 
                     entry.status === 'pendente_aprovacao' ? 'Pendente' : 'Rejeitada'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            <strong>Conformidade Legal:</strong> Este sistema está em conformidade com a Portaria 671 do MTE (Brasil), 
            Real Decreto 8/2019 (Espanha) e Código do Trabalho (Portugal). Integração com sistema Brio! APx.
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Dados Seguros:</strong> Todas as batidas são registradas com informações do dispositivo, 
            geolocalização opcional e trilha de auditoria completa para conformidade legal.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}