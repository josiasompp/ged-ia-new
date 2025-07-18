
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Users,
  Search,
  Filter,
  Edit,
  MoreHorizontal
} from "lucide-react";

import UserForm from "../components/users/UserForm";
import UserDetails from "../components/users/UserDetails";

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-100 text-green-800" },
  inativo: { label: "Inativo", color: "bg-red-100 text-red-800" },
  pausado: { label: "Pausado", color: "bg-amber-100 text-amber-800" },
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - Gestão de Usuários";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário atual:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, companiesData] = await Promise.all([
        User.list("-created_date"),
        Company.list()
      ]);
      // Certificar que `is_active` é uma string, para consistência.
      const sanitizedUsers = usersData.map(u => ({
        ...u,
        is_active: typeof u.is_active === 'boolean' ? (u.is_active ? 'ativo' : 'inativo') : u.is_active,
      }));
      setUsers(sanitizedUsers);
      setCompanies(companiesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os usuários. Tente novamente.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSaveUser = async (userData, isInvite = false) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await User.update(editingUser.id, userData);
        toast({
          title: "Usuário atualizado!",
          description: `O usuário "${userData.full_name}" foi atualizado com sucesso.`,
        });
      } else {
        // Convidar novo usuário
        if (isInvite) {
          // Preparar dados do convite com senha temporária e email
          const inviteData = {
            ...userData,
            company_id: currentUser?.company_id || "default_company",
            invited_by: currentUser?.email,
            invite_sent_at: new Date().toISOString()
          };

          // Se deve gerar senha temporária
          if (userData.generate_temporary_password && userData.temporary_password) {
            inviteData.temporary_password = userData.temporary_password;
            inviteData.password_expires_at = userData.password_expires_at;
          }

          // Simular envio de email (aqui você integraria com seu serviço de email)
          console.log("Enviando email de convite:", {
            to: userData.email,
            subject: "Convite para acessar o FIRSTDOCY GED AI",
            data: {
              userName: userData.full_name,
              companyName: companies.find(c => c.id === currentUser?.company_id)?.name || "sua empresa", // Correctly get company name
              temporaryPassword: userData.temporary_password,
              loginUrl: window.location.origin,
              permissions: userData.permissions
            }
          });

          // Criar usuário no sistema
          await User.create(inviteData);
          
          toast({
            title: "Convite enviado com sucesso!",
            description: `Convite enviado para "${userData.full_name}" no email ${userData.email}. ${userData.generate_temporary_password ? 'Senha temporária: ' + userData.temporary_password : ''}`,
          });
        } else {
          // Fallback: criar usuário diretamente
          await User.create({
            ...userData,
            company_id: currentUser?.company_id || "default_company",
          });
          
          toast({
            title: "Usuário criado!",
            description: `O usuário "${userData.full_name}" foi criado com sucesso.`,
          });
        }
      }
      
      setIsFormOpen(false);
      setEditingUser(null);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast({
        title: "Erro ao salvar usuário",
        description: error.message || "Não foi possível salvar o usuário. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await User.update(userId, updates);
      loadData();
      toast({
        title: "Usuário atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Empresa não encontrada';
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCompanyName(user.company_id).toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === 'all' || user.is_active === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
                Gestão de Usuários
              </span>
            </CardTitle>
            <p className="text-gray-600 mt-1">Gerencie usuários e suas permissões na plataforma</p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Novo Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {filteredUsers.length} usuários
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan="6"><Skeleton className="h-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.map(user => {
                  const statusInfo = statusConfig[user.is_active] || { label: 'Desconhecido', color: 'bg-gray-200' };
                  return (
                    <TableRow key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getCompanyName(user.company_id)}</TableCell>
                      <TableCell>{user.position || '-'}</TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.color} font-medium`}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onEdit={() => handleEdit(selectedUser)}
          onUpdate={handleUpdateUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {isFormOpen && (
        <UserForm 
          user={editingUser} 
          onSave={handleSaveUser} 
          onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
          companyContext={companies.find(c => c.id === currentUser?.company_id)}
        />
      )}
    </div>
  );
}
