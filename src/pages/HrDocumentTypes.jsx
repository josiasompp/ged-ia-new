import React, { useState, useEffect, useCallback } from 'react';
import { HrDocumentType } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, FileCog, CheckCircle, XCircle } from 'lucide-react';
import HrDocumentTypeForm from '@/components/hr/HrDocumentTypeForm';
import { useToast } from "@/components/ui/use-toast";

export default function HrDocumentTypes() {
  const [docTypes, setDocTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const { toast } = useToast();

  const loadDocTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await HrDocumentType.list('-created_date');
      setDocTypes(data);
    } catch (error) {
      console.error("Erro ao carregar tipos de documento:", error);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDocTypes();
  }, [loadDocTypes]);

  const handleAddNew = () => {
    setSelectedType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (docType) => {
    setSelectedType(docType);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedType) {
        await HrDocumentType.update(selectedType.id, data);
        toast({ title: "Tipo de Documento atualizado com sucesso!" });
      } else {
        await HrDocumentType.create(data);
        toast({ title: "Tipo de Documento criado com sucesso!" });
      }
      setIsFormOpen(false);
      loadDocTypes();
    } catch (error) {
      console.error("Erro ao salvar tipo de documento:", error);
      toast({ title: "Erro ao salvar", description: "Ocorreu um erro ao salvar o tipo de documento.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Tipos de Documentos (RH)
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Defina os templates e permissões para os documentos do RH.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg">
          <PlusCircle className="w-4 h-4" />
          Novo Tipo de Documento
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docTypes.map(docType => (
            <Card key={docType.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCog className="w-5 h-5 text-blue-600" />
                  {docType.name}
                </CardTitle>
                <CardDescription>{docType.abbreviated_name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm">
                  {docType.is_active ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>{docType.is_active ? 'Ativo' : 'Inativo'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Responsável: <span className="font-medium">{docType.responsible_group}</span></p>
              </CardContent>
              <div className="p-4 border-t">
                <Button variant="outline" onClick={() => handleEdit(docType)} className="w-full gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <HrDocumentTypeForm
          docType={selectedType}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}