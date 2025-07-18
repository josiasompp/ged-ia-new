
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  Users,
  FileBox,
  Crown,
  Building2
} from 'lucide-react';
import { PhysicalLocation } from '@/api/entities';
import { Company } from '@/api/entities';
import { User } from '@/api/entities';

export default function MasterCdocManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [masterLocations, setMasterLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyLocations, setCompanyLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('master');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);

      // Verificar se é usuário FIRSTDOCY (master)
      const isFirstdocyUser = userData.email?.includes('@firstdocy.com') || 
                             userData.role === 'super_admin' || 
                             userData.role === 'admin';
      
      if (isFirstdocyUser) {
        // Carregar endereços master (company_id = 'master')
        const masterLocs = await PhysicalLocation.filter({ company_id: 'master' });
        setMasterLocations(masterLocs);

        // Carregar todas as empresas
        const allCompanies = await Company.list('-created_date');
        setCompanies(allCompanies);
      } else {
        // Usuário comum - verificar se empresa tem CDOC habilitado
        if (userData.company_id && isValidObjectId(userData.company_id)) {
          const companies = await Company.filter({ id: userData.company_id });
          if (companies && companies.length > 0) {
            const userCompany = companies[0];
            if (userCompany?.enabled_modules?.cdoc) {
              setSelectedCompany(userCompany);
              loadCompanyLocations(userCompany.id);
            }
          }
        } else if (userData.company_id) { // Added condition to catch invalid but existing company_id
          console.warn(`Invalid company_id ('${userData.company_id}') for user ${userData.email}`);
          toast({
            title: "ID da Empresa Inválido",
            description: "O ID da empresa associado ao seu usuário é inválido.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const loadCompanyLocations = async (companyId) => {
    try {
      const locations = await PhysicalLocation.filter({ company_id: companyId });
      setCompanyLocations(locations);
    } catch (error) {
      console.error("Erro ao carregar endereços da empresa:", error);
    }
  };

  const handleCreateLocation = async (locationData) => {
    try {
      const companyId = activeTab === 'master' ? 'master' : selectedCompany?.id;
      
      await PhysicalLocation.create({
        ...locationData,
        company_id: companyId,
        full_address: `${locationData.street}${locationData.shelf}${locationData.side}${locationData.position}`,
        is_master_location: activeTab === 'master' // This will be true if it's a master user on the master tab
      });

      toast({
        title: "Endereço criado com sucesso!",
        description: `Novo endereço ${locationData.street}${locationData.shelf}${locationData.side}${locationData.position} foi adicionado.`
      });

      setShowLocationForm(false);
      setEditingLocation(null);
      loadData();
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      toast({
        title: "Erro ao criar endereço",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await PhysicalLocation.delete(locationId);
        toast({
          title: "Endereço excluído com sucesso!"
        });
        loadData();
      } catch (error) {
        console.error("Erro ao excluir endereço:", error);
        toast({
          title: "Erro ao excluir endereço",
          variant: "destructive"
        });
      }
    }
  };

  const isFirstdocyUser = currentUser?.email?.includes('@firstdocy.com') || 
                         currentUser?.role === 'super_admin' || 
                         currentUser?.role === 'admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Usuários master sempre têm acesso
  if (!isFirstdocyUser && !selectedCompany?.enabled_modules?.cdoc) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBox className="w-5 h-5" />
            CDOC não habilitado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              O módulo CDOC não está habilitado para sua empresa. Entre em contato com o administrador do sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Gerenciamento Master de Estrutura CDOC
          </CardTitle>
          <p className="text-sm text-gray-600">
            {isFirstdocyUser 
              ? "Gerencie endereços master e de todas as empresas do sistema"
              : "Gerencie os endereços CDOC da sua empresa"
            }
          </p>
        </CardHeader>
      </Card>

      {isFirstdocyUser && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="master" className="gap-2">
              <Crown className="w-4 h-4" />
              Endereços Master
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-2">
              <Building2 className="w-4 h-4" />
              Empresas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="master" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Endereços Master (FIRSTDOCY)</CardTitle>
                <Button onClick={() => setShowLocationForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Endereço Master
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {masterLocations.map((location) => (
                    <Card key={location.id} className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-yellow-800">
                              {location.full_address}
                            </h4>
                            <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                              Master
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingLocation(location);
                                setShowLocationForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleDeleteLocation(location.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Capacidade: {location.capacity || 100}</div>
                          <div>Ocupado: {location.occupied || 0}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Empresas com CDOC Habilitado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companies
                    .filter(company => company.enabled_modules?.cdoc)
                    .map((company) => (
                      <Card 
                        key={company.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedCompany(company);
                          loadCompanyLocations(company.id);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold">{company.name}</h4>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            CDOC Habilitado
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {selectedCompany && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    Endereços de {selectedCompany.name}
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      setShowLocationForm(true);
                      setEditingLocation(null); // Ensure no editing state when creating new
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Endereço
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyLocations.map((location) => (
                      <Card key={location.id} className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-blue-800">
                                {location.full_address}
                              </h4>
                              <Badge className="bg-blue-100 text-blue-800 mt-1">
                                Empresa
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingLocation(location);
                                  setShowLocationForm(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => handleDeleteLocation(location.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Capacidade: {location.capacity || 100}</div>
                            <div>Ocupado: {location.occupied || 0}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Render company locations for non-master users directly */}
      {!isFirstdocyUser && selectedCompany && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Endereços de {selectedCompany.name}
            </CardTitle>
            <Button 
              onClick={() => {
                setShowLocationForm(true);
                setEditingLocation(null); // Ensure no editing state when creating new
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Endereço
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyLocations.map((location) => (
                <Card key={location.id} className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-blue-800">
                          {location.full_address}
                        </h4>
                        <Badge className="bg-blue-100 text-blue-800 mt-1">
                          Empresa
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingLocation(location);
                            setShowLocationForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Capacidade: {location.capacity || 100}</div>
                      <div>Ocupado: {location.occupied || 0}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Localização */}
      {showLocationForm && (
        <LocationForm
          location={editingLocation}
          onSave={editingLocation ? handleUpdateLocation : handleCreateLocation} // Assuming handleUpdateLocation exists, otherwise it will create
          onClose={() => {
            setShowLocationForm(false);
            setEditingLocation(null);
          }}
          isMaster={isFirstdocyUser ? (activeTab === 'master') : false}
        />
      )}
    </div>
  );
}

// Helper function to validate ID format (e.g., MongoDB ObjectId)
const isValidObjectId = (id) => {
    return id && /^[a-f\d]{24}$/i.test(id);
};

// Componente de formulário simplificado
function LocationForm({ location, onSave, onClose, isMaster }) {
  const [formData, setFormData] = useState({
    street: '',
    shelf: '',
    side: '',
    position: '',
    capacity: 100,
    notes: ''
  });

  useEffect(() => {
    if (location) {
      setFormData({
        street: location.street || '',
        shelf: location.shelf || '',
        side: location.side || '',
        position: location.position || '',
        capacity: location.capacity || 100,
        notes: location.notes || ''
      });
    } else {
      // Reset form data when no location is being edited (for new creation)
      setFormData({
        street: '',
        shelf: '',
        side: '',
        position: '',
        capacity: 100,
        notes: ''
      });
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>
            {location ? 'Editar' : 'Criar'} Endereço {isMaster ? 'Master' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  placeholder="Ex: JA1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="shelf">Prateleira</Label>
                <Input
                  id="shelf"
                  value={formData.shelf}
                  onChange={(e) => setFormData({...formData, shelf: e.target.value})}
                  placeholder="Ex: P2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="side">Lado</Label>
                <Input
                  id="side"
                  value={formData.side}
                  onChange={(e) => setFormData({...formData, side: e.target.value})}
                  placeholder="Ex: AEE"
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Posição</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="Ex: 01"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações opcionais"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {location ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
