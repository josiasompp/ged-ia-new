import React, { useState, useEffect, useCallback } from "react";
import { CompanyGroup } from "@/api/entities";
import { Company } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import CompanyGroupForm from "../components/groups/CompanyGroupForm";

export default function CompanyGroups() {
  const [groups, setGroups] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groupData, companyData, userData] = await Promise.all([
        CompanyGroup.list("-created_date"),
        Company.list(),
        User.list()
      ]);
      setGroups(groupData);
      setCompanies(companyData);
      setUsers(userData.filter(u => u.role === 'admin')); // Apenas admins podem ser master
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os grupos e empresas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddNew = () => {
    setSelectedGroup(null);
    setIsFormOpen(true);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleSave = async (groupData, selectedCompanyIds, masterUser) => {
    try {
      let groupId = selectedGroup?.id;
      // Salvar grupo
      if (selectedGroup) {
        await CompanyGroup.update(selectedGroup.id, groupData);
      } else {
        const newGroup = await CompanyGroup.create(groupData);
        groupId = newGroup.id;
      }

      // Atualizar empresas
      const companiesToUpdate = companies.filter(c => selectedCompanyIds.includes(c.id) || c.group_id === groupId);
      for (const company of companiesToUpdate) {
        const newGroupId = selectedCompanyIds.includes(company.id) ? groupId : null;
        if (company.group_id !== newGroupId) {
          await Company.update(company.id, { group_id: newGroupId });
        }
      }

      // Atualizar usuário master
      if (masterUser) {
        await User.update(masterUser.id, { company_group_id: groupId });
      } else if (selectedGroup?.master_user_email) {
        const oldMaster = users.find(u => u.email === selectedGroup.master_user_email);
        if (oldMaster) {
          await User.update(oldMaster.id, { company_group_id: null });
        }
      }

      toast({
        title: "Grupo salvo com sucesso!",
        description: `O grupo "${groupData.name}" foi salvo.`,
      });
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      toast({
        title: "Erro ao salvar grupo",
        description: "Ocorreu um erro. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Grupos de Empresas
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Crie e gerencie grupos de empresas para visualização consolidada.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Grupo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Card key={i} className="h-48 animate-pulse bg-gray-200" />)
        ) : (
          groups.map(group => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  {group.name}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-500 mb-4">{group.description || "Sem descrição"}</p>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">Empresas no Grupo</h4>
                  <ul className="text-sm">
                    {companies.filter(c => c.group_id === group.id).map(c => <li key={c.id}>- {c.name}</li>)}
                  </ul>
                </div>
                 {group.master_user_email && (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase">Usuário Master</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-gray-500"/>
                            <span className="text-sm">{group.master_user_email}</span>
                        </div>
                    </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isFormOpen && (
        <CompanyGroupForm
          group={selectedGroup}
          allCompanies={companies}
          allUsers={users}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}