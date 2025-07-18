import React, { useState, useEffect, useCallback } from "react";
import { Department } from "@/api/entities";
import { Directory } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderPlus, Users, Building2, Folder } from "lucide-react";

import DepartmentTree from "../components/departments/DepartmentTree";
import DepartmentForm from "../components/departments/DepartmentForm";
import DirectoryManager from "../components/departments/DirectoryManager";
import PermissionManager from "../components/departments/PermissionManager";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('tree'); // 'tree', 'directories', 'permissions'
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [depts, dirs, usrs, user] = await Promise.all([
        Department.list("-created_date"),
        Directory.list(),
        User.list(),
        User.me()
      ]);
      setDepartments(depts);
      setDirectories(dirs);
      setUsers(usrs);
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    document.title = "FIRSTDOCY GED AI - Departamentos | Estrutura Organizacional";
  }, [loadData]);

  const handleSaveDepartment = async (deptData) => {
    if (editingDept) {
      await Department.update(editingDept.id, deptData);
    } else {
      await Department.create({ ...deptData, company_id: currentUser.company_id });
    }
    setShowDeptForm(false);
    setEditingDept(null);
    loadData();
  };
  
  const handleEditDepartment = (dept) => {
    setEditingDept(dept);
    setShowDeptForm(true);
  };
  
  const handleDeleteDepartment = async (deptId) => {
    if (window.confirm("Tem certeza que deseja remover este departamento?")) {
      await Department.delete(deptId);
      loadData();
    }
  };

  const handleSelectDepartment = (dept) => {
    setSelectedDept(dept);
    setView('directories');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Departamentos
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Gerencie a estrutura organizacional da sua empresa</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline"
            onClick={() => setView('permissions')}
          >
            <Users className="w-4 h-4 mr-2" />
            Acessos
          </Button>
          <Button 
            onClick={() => setShowDeptForm(true)}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <FolderPlus className="w-4 h-4" />
            Novo Departamento
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 border-b border-gray-200 pb-2 min-w-[400px]">
          <Button
            variant={view === 'tree' ? 'default' : 'ghost'}
            onClick={() => setView('tree')}
            className={view === 'tree' ? 'bg-gradient-to-r from-[#212153] to-[#146FE0]' : ''}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Estrutura
          </Button>
          <Button
            variant={view === 'directories' ? 'default' : 'ghost'}
            onClick={() => setView('directories')}
            className={view === 'directories' ? 'bg-gradient-to-r from-[#212153] to-[#146FE0]' : ''}
          >
            <Folder className="w-4 h-4 mr-2" />
            Diretórios
          </Button>
          <Button
            variant={view === 'permissions' ? 'default' : 'ghost'}
            onClick={() => setView('permissions')}
            className={view === 'permissions' ? 'bg-gradient-to-r from-[#212153] to-[#146FE0]' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Controle de Acesso
          </Button>
        </div>
      </ScrollArea>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {view === 'tree' && (
            <DepartmentTree 
              departments={departments} 
              onEdit={handleEditDepartment} 
              onDelete={handleDeleteDepartment}
              onSelect={handleSelectDepartment}
              isLoading={isLoading}
            />
          )}
          {view === 'directories' && selectedDept && (
            <DirectoryManager 
              department={selectedDept} 
              directories={directories.filter(d => d.department_id === selectedDept.id)}
              users={users}
              onBack={() => setView('tree')}
              onRefresh={loadData}
            />
          )}
          {view === 'permissions' && (
            <PermissionManager 
              departments={departments}
              directories={directories}
              users={users}
              currentUser={currentUser}
              onRefresh={loadData}
            />
          )}
        </div>
      </div>

      {showDeptForm && (
        <DepartmentForm
          department={editingDept}
          departments={departments}
          onSave={handleSaveDepartment}
          onClose={() => {
            setShowDeptForm(false);
            setEditingDept(null);
          }}
        />
      )}
    </div>
  );
}