
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Plus,
  Edit,
  Search,
  Building2,
  Package,
  MoreVertical,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PhysicalLocation } from '@/api/entities';
import LocationForm from './LocationForm';
import LocationDetailManager from './LocationDetailManager'; // New import for LocationDetailManager

export default function LocationManager({ locations = [], onRefresh, currentUser, compact = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDetailManager, setShowDetailManager] = useState(false); // New state variable

  const filteredLocations = locations.filter(loc =>
    !searchTerm ||
    loc.full_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.street?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('Tem certeza que deseja excluir esta localização?')) {
      try {
        await PhysicalLocation.delete(locationId);
        onRefresh();
      } catch (error) {
        console.error('Erro ao excluir localização:', error);
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedLocation(null);
    onRefresh();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  const handleViewDetails = (location) => { // New handler for viewing details
    setSelectedLocation(location);
    setShowDetailManager(true);
  };

  if (locations.length === 0) {
    return (
      <div className="space-y-4">
        {!compact && (
          <div className="flex justify-between items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar localizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreateLocation} className="ml-4 gap-2">
              <Plus className="w-4 h-4" />
              Nova Localização
            </Button>
          </div>
        )}

        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma localização encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Crie sua primeira localização física para começar.
            </p>
            <Button onClick={handleCreateLocation} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeira Localização
            </Button>
          </CardContent>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <LocationForm
            location={selectedLocation}
            onSave={handleFormSave}
            onClose={handleFormClose}
            currentUser={currentUser}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex justify-between items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar localizações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreateLocation} className="ml-4 gap-2">
            <Plus className="w-4 h-4" />
            Nova Localização
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.slice(0, compact ? 6 : undefined).map((location) => (
          <Card key={location.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {location.full_address || `${location.street}${location.shelf}${location.side}${location.position}`}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Rua {location.street} - {location.shelf} - {location.side}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(location)}>
                      <Package className="w-4 h-4 mr-2" />
                      Ver Endereços
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(location)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(location.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacidade:</span>
                  <span className="font-medium">{location.capacity || 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ocupado:</span>
                  <span className="font-medium">{location.occupied || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(((location.occupied || 0) / (location.capacity || 100)) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Badge
                    className={location.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {location.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {Math.max(0, (location.capacity || 100) - (location.occupied || 0))} disponíveis
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!compact && filteredLocations.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Mostrando {filteredLocations.length} de {locations.length} localizações
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <LocationForm
          location={selectedLocation}
          onSave={handleFormSave}
          onClose={handleFormClose}
          currentUser={currentUser}
        />
      )}

      {/* Detail Manager Modal */}
      {showDetailManager && selectedLocation && (
        <LocationDetailManager
          location={selectedLocation}
          onClose={() => setShowDetailManager(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
