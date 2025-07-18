
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileBox, 
  MapPin, 
  Building2, 
  Plus, 
  Search,
  BarChart3,
  Package,
  Map,
  FileText,
  Filter
} from 'lucide-react';
import { PhysicalDocument } from '@/api/entities';
import { PhysicalLocation } from '@/api/entities';
import { User } from '@/api/entities';

import LocationManager from '../components/physical-docs/LocationManager';
import DocumentManager from '../components/physical-docs/DocumentManager';
import PhysicalDocumentForm from '../components/physical-docs/PhysicalDocumentForm';
import LocationMap from '../components/physical-docs/LocationMap';
import PhysicalDocumentReports from '../components/physical-docs/PhysicalDocumentReports';
import PhysicalDocumentStats from '../components/physical-docs/PhysicalDocumentStats';

export default function PhysicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
    loadCurrentUser();
    document.title = "FIRSTDOCY GED AI - CDOC | Sistema de Controle de Documentos";
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData); // Update currentUser state here as well

      // Carregar documentos da empresa
      const docsData = await PhysicalDocument.filter({ 
        company_id: userData.company_id 
      });
      
      // Carregar localizações disponíveis
      let availableLocations = [];
      
      // Usuários FIRSTDOCY veem todos os endereços
      if (userData.email?.includes('@firstdocy.com') || userData.role === 'super_admin') {
        const masterLocs = await PhysicalLocation.filter({ company_id: 'master' });
        const companyLocs = await PhysicalLocation.filter({ company_id: userData.company_id });
        availableLocations = [...masterLocs, ...companyLocs];
      } else {
        // Outros usuários veem apenas endereços master + da própria empresa
        const masterLocs = await PhysicalLocation.filter({ company_id: 'master' });
        const companyLocs = await PhysicalLocation.filter({ company_id: userData.company_id });
        availableLocations = [...masterLocs, ...companyLocs];
      }
      
      // Atualizar ocupação baseada nos documentos existentes
      const updatedLocations = availableLocations.map(location => {
        const documentsInLocation = docsData.filter(doc => 
          doc.physical_location_id === location.id || 
          doc.full_address === location.full_address
        );
        
        return {
          ...location,
          occupied: documentsInLocation.length,
          // Manter a capacidade original ou usar padrão
          capacity: location.capacity || 100
        };
      });
      
      setDocuments(Array.isArray(docsData) ? docsData : []);
      setLocations(updatedLocations);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setDocuments([]);
      setLocations([]);
    }
    setIsLoading(false);
  };

  const handleDocumentSave = async (documentData) => {
    try {
      if (selectedDocument) {
        await PhysicalDocument.update(selectedDocument.id, documentData);
      } else {
        await PhysicalDocument.create({
          ...documentData,
          company_id: currentUser?.company_id || 'default_company'
        });
      }
      setShowDocumentForm(false);
      setSelectedDocument(null);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setShowDocumentForm(true);
  };

  const handleNewDocument = () => {
    setSelectedDocument(null);
    setShowDocumentForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              CDOC - Controle de Documentos
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Sistema completo de controle e endereçamento de documentos
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setActiveTab('reports')}
            className="gap-2 border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
          >
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </Button>
          <Button 
            onClick={handleNewDocument}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] to-[#04BF7B] shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Novo Documento
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <PhysicalDocumentStats 
        documents={documents}
        locations={locations}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <FileBox className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="w-4 h-4" />
            Endereçamento
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <Map className="w-4 h-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Documentos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <DocumentManager
                  documents={documents.slice(0, 10)}
                  locations={locations}
                  onEdit={handleEditDocument}
                  isLoading={isLoading}
                  compact={true}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  Endereços Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <LocationManager
                  locations={locations.slice(0, 10)}
                  onRefresh={loadData}
                  currentUser={currentUser}
                  compact={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent font-bold">
                  Controle de Documentos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentManager
                documents={documents}
                locations={locations}
                onEdit={handleEditDocument}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="bg-gradient-to-r from-[#04BF7B] to-[#146FE0] bg-clip-text text-transparent font-bold">
                  Sistema de Endereçamento
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocationManager
                locations={locations}
                onRefresh={loadData}
                currentUser={currentUser}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-600" />
                <span className="bg-gradient-to-r from-[#212153] to-purple-600 bg-clip-text text-transparent font-bold">
                  Mapa de Endereçamento
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocationMap
                locations={locations}
                documents={documents}
                onLocationSelect={(location) => console.log('Location selected:', location)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <PhysicalDocumentReports
            documents={documents}
            locations={locations}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Document Form Modal */}
      {showDocumentForm && (
        <PhysicalDocumentForm
          document={selectedDocument}
          locations={locations}
          onSave={handleDocumentSave}
          onClose={() => {
            setShowDocumentForm(false);
            setSelectedDocument(null);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
