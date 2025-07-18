
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/api/entities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

import UserForm from "../users/UserForm";

export default function CompanyUsersTab({ company, onRefresh, currentUser }) { // Added currentUser prop
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    loadCompanyUsers();
  }, [company.id]);

  const loadCompanyUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await User.list("-created_date");
      const companyUsers = allUsers.filter(user => user.company_id === company.id);
      setUsers(companyUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários da empresa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários da empresa.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleSaveUser = async (userData, isInvite = false) => {
    try {
      if (selectedUser) {
        // Atualizar usuário existente
        await User.update(selectedUser.id, userData);
        toast({
          title: "Usuário atualizado!",
          description: `O usuário "${userData.full_name}" foi atualizado com sucesso.`,
        });
      } else {
        // Convidar novo usuário
        if (isInvite) {
          // Preparar dados do convite com senha temporária
          const inviteData = {
            ...userData,
            company_id: company.id,
            invited_by: currentUser?.email, // Using currentUser for invited_by
            invite_sent_at: new Date().toISOString()
          };

          // Se deve gerar senha temporária
          if (userData.generate_temporary_password && userData.temporary_password) {
            inviteData.temporary_password = userData.temporary_password;
            inviteData.password_expires_at = userData.password_expires_at;
          }

          // Chamar endpoint de convite
          const response = await fetch('/api/users/invite-user-with-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inviteData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao enviar convite');
          }

          const result = await response.json();

          toast({
            title: "Convite enviado com sucesso!",
            description: `Convite enviado para "${userData.full_name}" no email ${userData.email}. ${userData.generate_temporary_password ? 'Senha temporária incluída no email.' : ''}`,
          });
        } else {
          // Fallback: criar usuário diretamente
          await User.create({
            ...userData,
            company_id: company.id,
            permissions: userData.permissions || ["documentos.visualizar"],
            is_active: "ativo",
            last_login: null,
            mfa_enabled: false
          });

          toast({
            title: "Usuário criado!",
            description: `O usuário "${userData.full_name}" foi criado com sucesso.`,
          });
        }
      }

      setShowUserForm(false);
      loadCompanyUsers();
      onRefresh();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast({
        title: "Erro ao salvar usuário",
        description: error.message || "Não foi possível salvar o usuário. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
      // Re-throw to allow UserForm to handle its own error display if needed
      throw new Error(error.message || "Erro ao salvar usuário");
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await User.update(user.id, { is_active: !user.is_active });
      loadCompanyUsers();
      toast({
        title: "Status do usuário atualizado",
        description: `O status de "${user.full_name}" foi alterado para ${user.is_active ? 'Inativo' : 'Ativo'}.`,
      });
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    admins: users.filter(u => u.role === "admin").length,
    available: company.max_users - users.length
  };

  return (
    <div className="space-y-6">
      {/* Header e Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Usuários da Empresa: {company.name}
          </h3>
          <p className="text-sm text-gray-500">
            {stats.total} de {company.max_users} usuários utilizados
          </p>
        </div>
        <Button
          onClick={handleCreateUser}
          disabled={stats.available <= 0}
          className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário {stats.available > 0 && `(${stats.available} disponíveis)`}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ativos</p>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Disponíveis</p>
                <div className={`text-2xl font-bold ${stats.available > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {stats.available}
                </div>
              </div>
              <Plus className={`w-8 h-8 ${stats.available > 0 ? 'text-blue-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de Busca */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuários por nome, email ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? "Tente ajustar o termo de busca."
                        : "Clique em 'Novo Usuário' para começar."
                      }
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.full_name || 'Nome não definido'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.department}</span>
                      {user.position && (
                        <div className="text-xs text-gray-500">{user.position}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? 'default' : 'destructive'}
                        className={`text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.last_login ? (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(user.last_login), "dd/MM/yy HH:mm", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Usuário */}
      {showUserForm && (
        <UserForm
          user={selectedUser}
          companies={[company]}
          departments={[]}
          onSave={handleSaveUser}
          onClose={() => setShowUserForm(false)}
          currentUser={currentUser} // Pass currentUser to UserForm
          companyContext={company}
        />
      )}
    </div>
  );
}
