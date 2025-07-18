import React, { useState, useEffect, useMemo } from 'react';
import { CdocStructure } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, ChevronRight, Building, Library, DoorOpen, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Form Modal Component
const StructureForm = ({ item, structureType, parentId, onSave, onClose, currentUser }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (item) {
      setFormData({ name: item.name, description: item.description || '' });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      company_id: currentUser?.company_id,
      structure_type: structureType,
      parent_id: parentId,
    };
    onSave(dataToSave, item?.id);
  };

  const typeLabels = {
    street: { title: 'Rua', placeholder: 'Ex: A' },
    shelf: { title: 'Prateleira', placeholder: 'Ex: P1' },
    side: { title: 'Lado', placeholder: 'Ex: AEE' },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{item ? 'Editar' : 'Criar'} {typeLabels[structureType].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome/Código</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={typeLabels[structureType].placeholder}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
export default function CdocStructureManager() {
  const [structures, setStructures] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formConfig, setFormConfig] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [structureData, userData] = await Promise.all([
        CdocStructure.list('-created_date'),
        User.me()
      ]);
      setStructures(structureData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const { streets, shelves, sides } = useMemo(() => {
    const streets = structures.filter(s => s.structure_type === 'street');
    const shelves = structures.filter(s => s.structure_type === 'shelf');
    const sides = structures.filter(s => s.structure_type === 'side');
    return { streets, shelves, sides };
  }, [structures]);

  const handleSave = async (data, id) => {
    if (!data.company_id) {
      toast({
        title: "Erro ao Salvar",
        description: "A identificação da sua empresa não foi encontrada. Por favor, recarregue a página e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (id) {
        await CdocStructure.update(id, data);
        toast({ title: "Estrutura atualizada com sucesso!" });
      } else {
        await CdocStructure.create(data);
        toast({ title: "Estrutura criada com sucesso!" });
      }
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar estrutura:", error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta estrutura e todos os seus filhos?")) {
        try {
            await CdocStructure.delete(id);
            toast({ title: "Estrutura excluída." });
            // Reset selections if a parent was deleted
            if (selectedStreet?.id === id) setSelectedStreet(null);
            if (selectedShelf?.id === id) setSelectedShelf(null);
            loadData();
        } catch(error) {
            console.error("Erro ao excluir", error);
            toast({ title: "Erro ao excluir", variant: "destructive" });
        }
    }
  };

  const openForm = (structureType, parentId = null, item = null) => {
    setFormConfig({ structureType, parentId, item });
    setShowForm(true);
  };

  const renderColumn = (title, icon, items, selectedItem, onSelect, onAdd, onEdit, onDelete) => (
    <Card className="flex-1 min-w-[300px] flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">{icon} {title}</CardTitle>
        {onAdd && <Button size="sm" onClick={onAdd}><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center pt-8">Nenhum item.</p>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${selectedItem?.id === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(item); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><Trash2 className="w-4 h-4" /></Button>
                  {onSelect && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Gerenciador de Estrutura CDOC</CardTitle>
                <p className="text-gray-500 text-sm">Crie e gerencie a estrutura física de armazenamento: Ruas, Prateleiras e Lados.</p>
            </CardHeader>
        </Card>
      <div className="flex flex-col md:flex-row gap-4 h-[60vh]">
        {/* Streets Column */}
        {renderColumn(
          'Ruas', <Building className="w-5 h-5"/>, streets, selectedStreet,
          (item) => { setSelectedStreet(item); setSelectedShelf(null); },
          () => openForm('street'),
          (item) => openForm('street', null, item),
          (id) => handleDelete(id)
        )}
        {/* Shelves Column */}
        {selectedStreet && renderColumn(
          `Prateleiras em ${selectedStreet.name}`, <Library className="w-5 h-5"/>, shelves.filter(s => s.parent_id === selectedStreet.id), selectedShelf,
          (item) => setSelectedShelf(item),
          () => openForm('shelf', selectedStreet.id),
          (item) => openForm('shelf', selectedStreet.id, item),
          (id) => handleDelete(id)
        )}
        {/* Sides Column */}
        {selectedShelf && renderColumn(
          `Lados em ${selectedShelf.name}`, <DoorOpen className="w-5 h-5"/>, sides.filter(s => s.parent_id === selectedShelf.id), null,
          null, // No selection for sides
          () => openForm('side', selectedShelf.id),
          (item) => openForm('side', selectedShelf.id, item),
          (id) => handleDelete(id)
        )}
      </div>
      {showForm && <StructureForm {...formConfig} onSave={handleSave} onClose={() => setShowForm(false)} currentUser={currentUser} />}
    </div>
  );
}