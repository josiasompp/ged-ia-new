import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Building2, 
  Package, 
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

export default function LocationMap({ locations, documents, onLocationSelect }) {
  // Garantir que sempre temos arrays válidos
  const safeLocations = Array.isArray(locations) ? locations : [];
  const safeDocuments = Array.isArray(documents) ? documents : [];

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedStreet, setSelectedStreet] = useState('all');

  // Agrupar localizações por rua
  const streetGroups = safeLocations.reduce((groups, location) => {
    if (!location) return groups;
    const street = location.street || 'Sem Rua';
    if (!groups[street]) {
      groups[street] = [];
    }
    groups[street].push(location);
    return groups;
  }, {});

  const streets = Object.keys(streetGroups).sort();

  const getLocationUsage = (locationId) => {
    const docsInLocation = safeDocuments.filter(doc => doc && doc.physical_location_id === locationId);
    return docsInLocation.length;
  };

  const getLocationColor = (location) => {
    const usage = getLocationUsage(location.id);
    const capacity = location.capacity || 100;
    const percentage = (usage / capacity) * 100;

    if (percentage === 0) return 'bg-gray-100 border-gray-300 text-gray-600';
    if (percentage < 30) return 'bg-green-100 border-green-300 text-green-700';
    if (percentage < 70) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    if (percentage < 90) return 'bg-orange-100 border-orange-300 text-orange-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const filteredStreets = selectedStreet === 'all' ? streets : [selectedStreet];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">Todas as Ruas</option>
              {streets.map(street => (
                <option key={street} value={street}>Rua {street}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Legenda de Ocupação:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Vazio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>0-30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>30-70%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
              <span>70-90%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>90-100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map View */}
      <div className="space-y-6">
        {filteredStreets.map(street => {
          const streetLocations = streetGroups[street] || [];
          
          return (
            <Card key={street} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Rua {street}
                  <Badge variant="outline" className="ml-2">
                    {streetLocations.length} posições
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {streetLocations
                      .sort((a, b) => {
                        // Ordenar por prateleira e depois por posição
                        const shelfCompare = (a.shelf || '').localeCompare(b.shelf || '');
                        if (shelfCompare !== 0) return shelfCompare;
                        return (a.position || '').localeCompare(b.position || '');
                      })
                      .map(location => {
                        const usage = getLocationUsage(location.id);
                        const capacity = location.capacity || 100;
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => onLocationSelect && onLocationSelect(location)}
                            className={`
                              aspect-square border-2 rounded-lg p-2 hover:scale-105 transition-all
                              ${getLocationColor(location)}
                              hover:shadow-md
                            `}
                            title={`${location.full_address || 'Sem endereço'} - ${usage}/${capacity} ocupado`}
                          >
                            <div className="flex flex-col items-center justify-center h-full text-xs">
                              <div className="font-semibold">
                                {location.position || '??'}
                              </div>
                              <div className="text-xs opacity-75">
                                {usage}/{capacity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {streetLocations
                      .sort((a, b) => (a.full_address || '').localeCompare(b.full_address || ''))
                      .map(location => {
                        const usage = getLocationUsage(location.id);
                        const capacity = location.capacity || 100;
                        const percentage = capacity > 0 ? (usage / capacity) * 100 : 0;
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => onLocationSelect && onLocationSelect(location)}
                            className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <div>
                                  <div className="font-medium">
                                    {location.full_address || `${location.street}${location.shelf}${location.side}${location.position}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {location.shelf} - {location.side} - Posição {location.position}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right text-sm">
                                  <div className="font-medium">{usage}/{capacity}</div>
                                  <div className="text-gray-500">{percentage.toFixed(0)}% ocupado</div>
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStreets.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma localização encontrada
            </h3>
            <p className="text-gray-500">
              Crie localizações físicas para visualizá-las no mapa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}