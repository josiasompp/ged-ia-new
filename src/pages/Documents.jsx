
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Search, 
  SlidersHorizontal,
  Home,
  FolderPlus,
  Brain,
  FileCheck
} from "lucide-react";
import { Document } from "@/api/entities";
import { Department } from "@/api/entities";
import { Directory } from "@/api/entities";
import { User } from "@/api/entities";

import DocumentUpload from "../components/documents/DocumentUpload";
import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentFilters from "../components/documents/DocumentFilters";
import DepartmentBrowser from "../components/documents/DepartmentBrowser";
import DirectoryBrowser from "../components/documents/DirectoryBrowser";
import DocumentBreadcrumb from "../components/documents/DocumentBreadcrumb";
import DirectoryForm from "../components/documents/DirectoryForm";
import SemanticSearch from "../components/documents/SemanticSearch";
import DocumentPreview from "../components/dashboard/DocumentPreview";

export default function Documents() {
  // Data States
  const [documents, setDocuments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI & Navigation States
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('departments'); // departments, directories, documents
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: "Início", view: "departments" }]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showDirectoryForm, setShowDirectoryForm] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState(null);

  useEffect(() => {
    loadData();
    document.title = "FIRSTDOCY GED AI - Documentos | Sistema de Gestão Documental";
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docs, depts, dirs, user] = await Promise.all([
        Document.list("-created_date", 200),
        Department.list(),
        Directory.list(),
        User.me()
      ]);

      // Garante que apenas departamentos com nomes únicos sejam exibidos
      const uniqueDepartments = [...new Map((depts || []).map(item => [item.name, item])).values()];
      const uniqueDirectories = [...new Map((dirs || []).map(item => [item.id, item])).values()];
      const uniqueDocuments = [...new Map((docs || []).map(item => [item.id, item])).values()];
      
      setDepartments(uniqueDepartments || []);
      setDirectories(uniqueDirectories || []);
      setDocuments(uniqueDocuments || []);
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };
  
  const handleSelectDepartment = (department) => {
    setSelectedDepartment(department);
    setView('directories');
    setBreadcrumbs([
      { name: "Início", view: "departments" },
      { name: department.name, view: "directories", id: department.id }
    ]);
  };

  const handleSelectDirectory = (directory) => {
    setSelectedDirectory(directory);
    setView('documents');
    setBreadcrumbs([
      ...breadcrumbs,
      { name: directory.name, view: "documents", id: directory.id }
    ]);
  };

  const handleBreadcrumbClick = (index) => {
    const clickedCrumb = breadcrumbs[index];
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setView(clickedCrumb.view);

    if (clickedCrumb.view === 'departments') {
      setSelectedDepartment(null);
      setSelectedDirectory(null);
    } else if (clickedCrumb.view === 'directories') {
      setSelectedDirectory(null);
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadData();
  };

  const handleDirectoryCreated = () => {
    setShowDirectoryForm(false);
    loadData();
  };

  const handleDocumentUpdate = () => {
    loadData();
  };

  const getActionButton = () => {
    switch (view) {
      case 'departments':
        return null; 
      case 'directories':
        return (
          <Button 
            onClick={() => setShowDirectoryForm(true)}
            className="gap-2 bg-gradient-to-r from-[#04BF7B] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <FolderPlus className="w-4 h-4" />
            Criar Diretório
          </Button>
        );
      case 'documents':
        return (
          <Button 
            onClick={() => setShowUpload(true)}
            className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
          >
            <Upload className="w-4 h-4" />
            Novo Documento
          </Button>
        );
      default:
        return null;
    }
  };

  const renderBrowserContent = () => {
    switch (view) {
      case 'departments':
        return <DepartmentBrowser departments={departments} onSelect={handleSelectDepartment} />;
      case 'directories':
        const dirsInDept = directories.filter(dir => dir.department_id === selectedDepartment?.id);
        return <DirectoryBrowser directories={dirsInDept} onSelect={handleSelectDirectory} department={selectedDepartment} />;
      case 'documents':
        const docsInDir = documents.filter(doc => doc.directory_id === selectedDirectory?.id);
        return <DocumentGrid documents={docsInDir} isLoading={isLoading} onPreview={setPreviewingDoc} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'departments':
        return "Navegador de Documentos";
      case 'directories':
        return `Diretórios - ${selectedDepartment?.name}`;
      case 'documents':
        return `Documentos - ${selectedDirectory?.name}`;
      default:
        return "Navegador de Documentos";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case 'departments':
        return "Navegue por departamentos e diretórios";
      case 'directories':
        return "Escolha um diretório para visualizar os documentos";
      case 'documents':
        return "Documentos organizados no diretório selecionado";
      default:
        return "Navegue por departamentos e diretórios";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              {getTitle()}
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">{getSubtitle()}</p>
        </div>
        {getActionButton()}
      </div>

      <Tabs defaultValue="browser" className="w-full">
        <TabsList className="grid w-fit grid-cols-2 p-1">
          <TabsTrigger value="browser" className="gap-2">
            <Home className="w-4 h-4" />
            Navegador
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Brain className="w-4 h-4" />
            Busca Inteligente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          <DocumentBreadcrumb items={breadcrumbs} onItemClick={handleBreadcrumbClick} />
          
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            renderBrowserContent()
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <SemanticSearch 
            documents={documents} 
            onSelectDocument={setPreviewingDoc}
          />
        </TabsContent>
      </Tabs>

      {showUpload && (
        <DocumentUpload 
          onClose={() => setShowUpload(false)}
          onComplete={handleUploadComplete}
          currentUser={currentUser}
          departments={departments}
          directories={directories}
          initialDepartmentId={selectedDepartment?.id}
          initialDirectoryId={selectedDirectory?.id}
        />
      )}

      {showDirectoryForm && (
        <DirectoryForm
          department={selectedDepartment}
          onSave={handleDirectoryCreated}
          onClose={() => setShowDirectoryForm(false)}
          currentUser={currentUser}
        />
      )}

      {previewingDoc && (
        <DocumentPreview 
          key={previewingDoc.id}
          document={previewingDoc} 
          onClose={() => setPreviewingDoc(null)} 
          onUpdate={handleDocumentUpdate}
        />
      )}
    </div>
  );
}
