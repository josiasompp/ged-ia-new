import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileBox, 
  MapPin, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Package
} from 'lucide-react';

export default function PhysicalDocumentStats({ documents, locations, isLoading }) {
  // Garantir que sempre temos arrays válidos
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeLocations = Array.isArray(locations) ? locations : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = {
    totalDocuments: safeDocuments.length,
    totalLocations: safeLocations.length,
    uniqueClients: [...new Set(safeDocuments.map(doc => doc?.client_name).filter(Boolean))].length,
    expiringDocuments: safeDocuments.filter(doc => {
      if (!doc || doc.is_permanent) return false;
      try {
        const expiryDate = new Date(doc.destruction_date);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      } catch {
        return false;
      }
    }).length,
    archivedDocuments: safeDocuments.filter(doc => doc?.status === 'arquivado').length,
    permanentDocuments: safeDocuments.filter(doc => doc?.is_permanent).length,
    occupiedLocations: safeLocations.filter(loc => loc?.occupied > 0).length,
    // Corrigir cálculo de capacidade disponível
    totalCapacity: safeLocations.reduce((sum, loc) => sum + (loc?.capacity || 0), 0),
    totalOccupied: safeLocations.reduce((sum, loc) => sum + (loc?.occupied || 0), 0)
  };

  // Calcular capacidade disponível corretamente
  stats.availableCapacity = stats.totalCapacity - stats.totalOccupied;

  const statsCards = [
    {
      title: "Total de Documentos",
      value: stats.totalDocuments.toLocaleString(),
      subtitle: `${stats.archivedDocuments} arquivados`,
      icon: FileBox,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Localizações Ativas",
      value: stats.occupiedLocations.toLocaleString(),
      subtitle: `${stats.totalLocations} totais`,
      icon: MapPin,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Clientes Ativos",
      value: stats.uniqueClients.toLocaleString(),
      subtitle: "empresas distintas",
      icon: Building2,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Documentos Expirando",
      value: stats.expiringDocuments.toLocaleString(),
      subtitle: "próximos 30 dias",
      icon: AlertTriangle,
      color: "from-amber-500 to-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`} />
          
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Additional Stats Cards */}
      <Card className="md:col-span-2 lg:col-span-2 border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumo de Armazenamento</h3>
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.permanentDocuments}</div>
              <p className="text-sm text-gray-600">Documentos Permanentes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.availableCapacity.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Capacidade Disponível</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCapacity.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Capacidade Total</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Ocupação atual:</span>
              <span className="font-medium">{stats.totalOccupied.toLocaleString()} / {stats.totalCapacity.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                style={{
                  width: `${stats.totalCapacity > 0 ? Math.min((stats.totalOccupied / stats.totalCapacity) * 100, 100) : 0}%`
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}