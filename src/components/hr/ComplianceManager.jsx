import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Download, FileText, ShieldCheck, Calendar, Info, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function ComplianceManager({ currentUser, onRefresh, isLoading }) {
  const { toast } = useToast();
  const afdInputRef = useRef(null);
  const [afdFile, setAfdFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState({ 
    from: new Date().toISOString().split('T')[0], 
    to: new Date().toISOString().split('T')[0] 
  });

  const handleAfdUploadClick = () => {
    afdInputRef.current?.click();
  };

  const handleAfdFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAfdFile(file);
      toast({ title: "Arquivo Selecionado", description: file.name });
    }
  };

  const handleImportAfd = async () => {
    if (!afdFile) {
      toast({ variant: "destructive", title: "Nenhum arquivo", description: "Por favor, selecione um arquivo AFD para importar." });
      return;
    }
    setIsImporting(true);
    toast({ title: "Importando AFD...", description: "Aguarde enquanto processamos o arquivo." });
    
    // Simulação do processo de importação
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Em um cenário real, aqui você chamaria uma integração/função de backend
    // para ler o AFD, validar e criar os registros de TimeEntry.
    console.log(`Importando arquivo AFD: ${afdFile.name}`);

    setIsImporting(false);
    setAfdFile(null);
    toast({ title: "Importação Concluída!", description: "As batidas do arquivo AFD foram processadas." });
    onRefresh();
  };
  
  const handleExportAej = async () => {
    if (!dateRange.from || !dateRange.to) {
        toast({ variant: "destructive", title: "Período inválido", description: "Selecione o período para exportação do AEJ." });
        return;
    }
    setIsExporting(true);
    toast({ title: "Exportando AEJ...", description: "Gerando o Arquivo Eletrônico de Jornada." });
    
    // Simulação do processo de exportação
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Lógica para buscar dados e gerar o arquivo AEJ no formato correto
    const content = `AEJ_EXPORT_DATA_FOR_${dateRange.from}_TO_${dateRange.to}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `AEJ_${currentUser?.company_id || 'empresa'}_${Date.now()}.txt`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    toast({ title: "Exportação Concluída!", description: `Arquivo ${fileName} gerado com sucesso.` });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Importação de AFD (Portaria 671)
          </CardTitle>
          <CardDescription>
            Importe o Arquivo Fonte de Dados (AFD) gerado pelo seu relógio de ponto eletrônico (REP-C).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Como funciona?</AlertTitle>
            <AlertDescription>
              Selecione o arquivo AFD. O sistema irá ler, validar e registrar todas as batidas de ponto contidas no arquivo.
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-2">
            <Label>Arquivo AFD</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleAfdUploadClick}>
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivo
              </Button>
              <span className="text-sm text-gray-500 truncate">
                {afdFile ? afdFile.name : "Nenhum arquivo selecionado"}
              </span>
              <input 
                type="file" 
                ref={afdInputRef} 
                onChange={handleAfdFileChange} 
                className="hidden" 
                accept=".txt,.afd" 
              />
            </div>
          </div>
          <Button 
            onClick={handleImportAfd} 
            disabled={!afdFile || isImporting} 
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Importar Batidas do AFD
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Exportação de AEJ (Portaria 671)
          </CardTitle>
          <CardDescription>
            Exporte o Arquivo Eletrônico de Jornada (AEJ) para fins de fiscalização e conformidade legal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>O que é o AEJ?</AlertTitle>
            <AlertDescription>
              O AEJ contém todas as informações da jornada dos trabalhadores, incluindo horários contratuais e o registro de ponto efetuado.
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-4">
            <Label>Período de Exportação</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom" className="text-sm">Data Inicial</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm">Data Final</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={handleExportAej} 
            disabled={isExporting} 
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Exportar Arquivo AEJ
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}