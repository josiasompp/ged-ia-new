import React, { useState, useEffect } from 'react';
import { Company } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, FileText, FileSignature, Target, CheckSquare, Briefcase, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const moduleDefinitions = [
    { id: 'ged', name: 'Gestão de Documentos (GED)', icon: FileText },
    { id: 'proposals', name: 'Gestão de Propostas', icon: FileSignature },
    { id: 'crm', name: 'CRM (Gestão de Leads)', icon: Target },
    { id: 'tasks', name: 'Tarefas e Aprovações', icon: CheckSquare },
    { id: 'signatures', name: 'Assinaturas Digitais', icon: FileSignature },
    { id: 'hr', name: 'Recursos Humanos (RH)', icon: Briefcase },
];

const defaultModules = {
    ged: true, proposals: true, crm: false, tasks: false, signatures: false, hr: false
};

export default function ModuleAccessManager() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [companyModules, setCompanyModules] = useState(defaultModules);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const companyData = await Company.list();
                setCompanies(companyData);
            } catch (error) {
                console.error("Erro ao buscar empresas:", error);
                toast({ title: "Erro ao buscar empresas.", variant: "destructive" });
            }
            setIsLoading(false);
        };
        fetchCompanies();
    }, [toast]);

    const handleCompanyChange = (companyId) => {
        setSelectedCompanyId(companyId);
        if (companyId) {
            const company = companies.find(c => c.id === companyId);
            setCompanyModules(company?.enabled_modules || defaultModules);
        } else {
            setCompanyModules(defaultModules);
        }
    };

    const handleModuleToggle = (moduleId, value) => {
        setCompanyModules(prev => ({ ...prev, [moduleId]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedCompanyId) {
            toast({ title: "Nenhuma empresa selecionada.", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        try {
            await Company.update(selectedCompanyId, { enabled_modules: companyModules });
            toast({ title: "Permissões salvas com sucesso!", description: "Os acessos da empresa foram atualizados." });
            // Atualizar a lista de empresas para refletir as mudanças
            const companyData = await Company.list();
            setCompanies(companyData);
        } catch (error) {
            console.error("Erro ao salvar permissões:", error);
            toast({ title: "Erro ao salvar permissões.", variant: "destructive" });
        }
        setIsSaving(false);
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Controle de Acesso por Módulo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="company-select">Selecione uma Empresa</Label>
                     {isLoading ? <Skeleton className="h-10 w-full" /> : (
                        <Select onValueChange={handleCompanyChange} value={selectedCompanyId}>
                            <SelectTrigger id="company-select">
                                <SelectValue placeholder="Selecione para gerenciar o acesso..." />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map(company => (
                                    <SelectItem key={company.id} value={company.id}>
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     )}
                </div>

                {selectedCompanyId && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-gray-800">Módulos Habilitados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {moduleDefinitions.map(module => (
                                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <Label htmlFor={module.id} className="flex items-center gap-3 cursor-pointer">
                                        <module.icon className="w-5 h-5 text-gray-600" />
                                        <span>{module.name}</span>
                                    </Label>
                                    <Switch
                                        id={module.id}
                                        checked={companyModules[module.id]}
                                        onCheckedChange={(value) => handleModuleToggle(module.id, value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}