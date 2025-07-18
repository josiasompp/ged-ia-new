
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Folder, Users } from 'lucide-react';

export default function DepartmentBrowser({ departments, onSelect }) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum departamento encontrado</h3>
        <p className="text-gray-500">Crie departamentos para começar a organizar seus documentos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {departments.map(dept => (
        <Card 
          key={dept.id}
          className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-sm"
          onClick={() => onSelect(dept)}
        >
          <CardContent className="p-6 text-center">
            <div 
              className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ backgroundColor: dept.color || '#146FE0' }}
            >
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 truncate mb-2">{dept.name}</h3>
            <p className="text-sm text-gray-500 truncate mb-4">{dept.description || 'Nenhuma descrição'}</p>
            
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Folder className="w-3 h-3" />
                <span>3-4 diretórios</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>1-2 docs</span>
              </div>
            </div>

            {!dept.is_active && (
              <Badge variant="secondary" className="mt-3 text-xs">
                Inativo
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
