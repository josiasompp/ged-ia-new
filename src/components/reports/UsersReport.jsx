
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, Shield, Building } from "lucide-react"; // Added Building icon

export default function UsersReport({ users, companies, isLoading }) {
  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      inactive: users.filter(u => !u.is_active).length,
      admins: users.filter(u => u.role === 'admin').length,
      withMFA: users.filter(u => u.mfa_enabled).length
    };
  };

  const getDepartmentStats = () => {
    const departments = {};
    users.forEach(user => {
      const dept = user.department || 'Não definido';
      departments[dept] = (departments[dept] || 0) + 1;
    });
    return Object.entries(departments)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  // New function: getCompanyStats
  const getCompanyStats = () => {
    return {
      total: companies.length,
    };
  };

  const stats = getUserStats();
  const topDepartments = getDepartmentStats();
  const companyStats = getCompanyStats(); // Call the new company stats function

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent font-bold">
            Relatório de Usuários
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* User Status */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Status dos Usuários</h4>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 text-center">
                <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-600">{stats.active}</div>
                <div className="text-xs text-green-600">Ativos</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50 text-center">
                <UserX className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-red-600">{stats.inactive}</div>
                <div className="text-xs text-red-600">Inativos</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">{stats.admins}</div>
                <div className="text-xs text-blue-600">Admins</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-center">
                <Shield className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-amber-600">{stats.withMFA}</div>
                <div className="text-xs text-amber-600">Com MFA</div>
              </div>
            </div>
          )}
        </div>

        {/* New Section: Company Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Visão Geral das Empresas</h4>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 text-center">
                <Building className="w-6 h-6 text-indigo-600 mx-auto mb-1" /> {/* Building icon for company */}
                <div className="text-lg font-bold text-indigo-600">{companyStats.total}</div>
                <div className="text-xs text-indigo-600">Total de Empresas</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Departments */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Principais Departamentos</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {topDepartments.map(([department, count]) => (
                <div key={department} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{department}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Total de Usuários</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
