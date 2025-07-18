
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Package,
  Search,
  FileText,
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  List,
  X
} from 'lucide-react';
import { PhysicalLocation } from '@/api/entities';
import { PhysicalDocument } from '@/api/entities';
import { User } from '@/api/entities'; // Added import for User entity

export default function LocationDetailManager({ location, onClose, currentUser: propCurrentUser }) { // Renamed currentUser prop
  const [individualAddresses, setIndividualAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentUser, setCurrentUser] = useState(propCurrentUser); // Managed currentUser in state
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUserAndInitialize();
  }, [location]); // Depend on location prop

  const loadUserAndInitialize = async () => {
    setIsLoading(true); // Start loading
    try {
      let user = propCurrentUser; // Start with the user passed via props

      // If user from props is null or doesn't have company_id, try to fetch it
      if (!user || !user.company_id) {
        user = await User.me(); // Fetch current user data
        setCurrentUser(user); // Update state with the fetched user
      } else {
        // If propCurrentUser is valid, ensure the state is synced
        setCurrentUser(propCurrentUser);
      }

      // If, after all attempts, company_id is still missing, log error and exit
      if (!user?.company_id) {
        console.error('Usuário não possui company_id válido após tentativa de carregamento.');
        // The UI will handle displaying an error message based on !currentUser?.company_id
        return;
      }

      if (location) {
        await generateIndividualAddresses(user); // Pass the resolved user object
        await loadDocuments();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Optionally, set an error state here for more specific user feedback
    }
    setIsLoading(false); // End loading regardless of success or failure
  };

  const generateIndividualAddresses = async (user) => { // User object passed as argument
    // Secondary safeguard: ensure user and company_id are present
    if (!user?.company_id) {
      console.error('Company ID não encontrado para gerar endereços individuais.');
      return;
    }

    try {
      // Check if individual addresses already exist for this parent location
      const existingAddresses = await PhysicalLocation.filter({
        parent_location_id: location.id,
        is_individual_address: true
      }) || []; // Ensure existingAddresses is always an array

      if (existingAddresses.length === 0) {
        // Generate individual addresses if none exist
        const addresses = [];
        for (let i = 1; i <= location.capacity; i++) {
          const position = String(i).padStart(2, '0');
          const fullAddress = `${location.street}${location.shelf}${location.side}${position}`;

          const addressData = {
            company_id: user.company_id, // Use the company_id from the passed user
            street: location.street,
            shelf: location.shelf,
            side: location.side,
            position: position,
            full_address: fullAddress,
            capacity: 1,
            occupied: 0,
            is_active: true,
            is_individual_address: true,
            parent_location_id: location.id,
            content_indexed: {
              document_count: 0,
              tags: []
            }
          };

          addresses.push(addressData);
        }

        // Create addresses in batch, with individual error handling for each creation
        const createdAddresses = [];
        for (const addressData of addresses) {
          try {
            const created = await PhysicalLocation.create(addressData);
            createdAddresses.push(created);
          } catch (error) {
            console.error(`Erro ao criar endereço ${addressData.full_address}:`, error);
          }
        }
        setIndividualAddresses(createdAddresses); // Update state with successfully created addresses
      } else {
        setIndividualAddresses(existingAddresses); // Use existing addresses
      }
    } catch (error) {
      console.error('Erro ao gerar endereços individuais:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const docsData = await PhysicalDocument.filter({
        physical_location_id: location.id
      });
      setDocuments(docsData || []); // Ensure docsData is always an array
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setDocuments([]); // Clear documents on error
    }
  };

  const filteredAddresses = individualAddresses.filter(addr =>
    !searchTerm ||
    addr.full_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAddressStatus = (address) => {
    const docsInAddress = documents.filter(doc =>
      doc.full_address === address.full_address
    );
    return {
      occupied: docsInAddress.length > 0,
      documentCount: docsInAddress.length,
      documents: docsInAddress
    };
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando detalhes da localização...</p> {/* Updated loading message */}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display an error if currentUser's company_id is not available after loading
  if (!currentUser?.company_id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md w-full m-4">
          <CardContent className="p-8 text-center">
            <X className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro de Autenticação
            </h3>
            <p className="text-gray-500 mb-4">
              Não foi possível carregar as informações da sua empresa. Por favor, recarregue a página ou entre em contato com o suporte.
            </p>
            <Button onClick={onClose}>Fechar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Detalhes da Localização: {location.full_address}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Informações da Localização */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{location.capacity}</div>
                <p className="text-sm text-blue-600">Capacidade Total</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{documents.length}</div>
                <p className="text-sm text-green-600">Documentos</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800">
                  {filteredAddresses.filter(addr => getAddressStatus(addr).occupied).length}
                </div>
                <p className="text-sm text-orange-600">Ocupados</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <Grid3X3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {filteredAddresses.filter(addr => !getAddressStatus(addr).occupied).length}
                </div>
                <p className="text-sm text-gray-600">Disponíveis</p>
              </CardContent>
            </Card>
          </div>

          {/* Controles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar endereços específicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
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

          {/* Lista de Endereços */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {filteredAddresses.map((address) => {
                const status = getAddressStatus(address);
                return (
                  <Card
                    key={address.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      status.occupied
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : 'bg-green-50 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="font-mono text-xs font-medium mb-1">
                        {address.position}
                      </div>
                      <Badge
                        className={`text-xs ${
                          status.occupied
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {status.occupied ? 'Ocupado' : 'Livre'}
                      </Badge>
                      {status.documentCount > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {status.documentCount} doc{status.documentCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAddresses.map((address) => {
                const status = getAddressStatus(address);
                return (
                  <Card key={address.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-medium">
                            {address.full_address}
                          </div>
                          <Badge
                            className={`text-xs ${
                              status.occupied
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {status.occupied ? 'Ocupado' : 'Disponível'}
                          </Badge>
                        </div>
                        {status.documentCount > 0 && (
                          <div className="text-sm text-gray-600">
                            {status.documentCount} documento{status.documentCount > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      {status.documents.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            Documentos: {status.documents.map(doc => doc.box_description).join(', ')}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredAddresses.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum endereço encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
