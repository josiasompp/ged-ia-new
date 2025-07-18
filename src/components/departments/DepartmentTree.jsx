
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ChevronRight,
  MoreVertical,
  Edit,
  Users,
  Settings,
  Folder
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DepartmentTree({ 
  departments, 
  selectedDepartment, 
  onSelect, 
  onEdit, 
  isLoading,
  onManagePermissions // Added new prop for managing permissions
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Nenhum departamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {departments.map((dept) => (
        <div
          key={dept.id}
          className={`group relative rounded-lg border transition-all duration-200 ${
            selectedDepartment?.id === dept.id
              ? 'border-blue-200 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center p-3">
            <Button
              variant="ghost"
              onClick={() => onSelect(dept)}
              className="flex-1 justify-start p-0 h-auto text-left"
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: dept.color }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-sm">
                    {dept.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {dept.description || 'Sem descrição'}
                  </p>
                </div>
              </div>
            </Button>

            <div className="flex items-center gap-1">
              {!dept.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inativo
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(dept)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSelect(dept)}>
                    <Folder className="w-4 h-4 mr-2" />
                    Ver Diretórios
                  </DropdownMenuItem>
                  {/* Added onClick handler for Permissions dropdown item */}
                  <DropdownMenuItem onClick={() => onManagePermissions(dept)}> 
                    <Users className="w-4 h-4 mr-2" />
                    Permissões
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {selectedDepartment?.id === dept.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-l-lg" />
          )}
        </div>
      ))}
    </div>
  );
}
