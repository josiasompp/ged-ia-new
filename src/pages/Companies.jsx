
import React, { useState, useEffect, useCallback } from "react";
import { Company } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // Added for toast notifications

import CompanyList from "../components/companies/CompanyList";
import CompanyForm from "../components/companies/CompanyForm";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast(); // Initialize toast hook

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const companyData = await Company.list("-created_date");
      setCompanies(companyData);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar a lista de empresas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Added toast to useCallback dependencies

  useEffect(() => {
    loadCompanies();
    document.title = "FIRSTDOCY GED AI - Empresas | Gestão Multi-Tenant";
  }, [loadCompanies]); // Kept loadCompanies in dependencies to ensure it's always the latest version if useCallback invalidates it, although with `toast` as the only dependency it's usually stable.
  // The outline suggested `[]` but keeping `loadCompanies` is safer with useCallback to avoid lint warnings or stale closures if `loadCompanies` ever truly changed.
  // Given toast is a stable dependency, loadCompanies itself is stable, so `[]` would also work and might be the intention.
  // Reverting to the outline's explicit intention for `useEffect` dependency change.

  useEffect(() => {
    loadCompanies();
    document.title = "FIRSTDOCY GED AI - Empresas | Gestão Multi-Tenant";
  }, []); // Changed dependency to [] as per outline for a single run on mount

  const handleAddNew = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCompany) {
        await Company.update(selectedCompany.id, data);
        toast({
          title: "Empresa atualizada!",
          description: `A empresa "${data.name}" foi atualizada com sucesso.`,
        });
      } else {
        await Company.create(data);
        toast({
          title: "Empresa criada!",
          description: `A empresa "${data.name}" foi criada com sucesso.`,
        });
      }
      setIsFormOpen(false);
      loadCompanies();
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      toast({
        title: "Erro ao salvar empresa",
        description: "Não foi possível salvar a empresa. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (company) => {
    try {
      const newStatus = !company.is_active;
      await Company.update(company.id, { is_active: newStatus });
      loadCompanies();
      toast({
        title: "Status da empresa atualizado!",
        description: `A empresa "${company.name}" foi ${newStatus ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao alterar status da empresa:", error);
      toast({
        title: "Erro ao alterar status",
        description: `Não foi possível alterar o status da empresa "${company.name}". Por favor, tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Gestão de Empresas
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Administre empresas na plataforma FIRSTDOCY GED AI</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          Adicionar Empresa
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#04BF7B] to-[#146FE0] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white"/>
            </div>
            <span className="bg-gradient-to-r from-[#212153] to-[#04BF7B] bg-clip-text text-transparent font-bold">
              Empresas Cadastradas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyList
            companies={companies}
            isLoading={isLoading}
            onEdit={handleEdit}
            onToggleStatus={handleStatusChange}
          />
        </CardContent>
      </Card>
      
      {isFormOpen && (
        <CompanyForm
          company={selectedCompany}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
