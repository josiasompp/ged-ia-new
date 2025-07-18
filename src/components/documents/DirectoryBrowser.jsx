
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderPlus, Lock, FileText } from 'lucide-react';

const accessLevelIcons = {
  publico: { icon: FileText, color: 'text-green-600' },
  departamento: { icon: Folder, color: 'text-blue-600' },
  restrito: { icon: Lock, color: 'text-amber-600' },
  confidencial: { icon: Lock, color: 'text-red-600' }
};

export default function DirectoryBrowser({ directories, onSelect, department }) {
  if (directories.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum diretório neste departamento</h3>
        <p className="text-gray-500">Crie diretórios em "{department?.name}" para organizar os documentos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {directories.map(dir => {
        const accessConfig = accessLevelIcons[dir.access_level] || accessLevelIcons.departamento;
        const AccessIcon = accessConfig.icon;

        return (
          <Card 
            key={dir.id}
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-sm"
            onClick={() => onSelect(dir)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: department?.color + '20' }}
                >
                  <Folder className="w-8 h-8" style={{ color: department?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-md text-gray-900 truncate mb-1">{dir.name}</h3>
                  <p className="text-sm text-gray-500 truncate mb-2">{dir.description || 'Nenhuma descrição'}</p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs flex items-center gap-1 ${accessConfig.color}`}>
                      <AccessIcon className="w-3 h-3" />
                      {dir.access_level}
                    </Badge>
                    
                    {dir.inherit_permissions && (
                      <Badge variant="secondary" className="text-xs">
                        Herda permissões
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{dir.document_count} documentos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
