import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, MapPin } from 'lucide-react';
import { PhysicalLocation } from '@/api/entities';

export default function LocationForm({ location, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    street: '',
    shelf: 'P1',
    side: 'AEE',
    position: '01',
    capacity: 100,
    occupied: 0,
    is_active: true,
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!location;

  useEffect(() => {
    if (location) {
      setFormData({
        street: location.street || '',
        shelf: location.shelf || 'P1',
        side: location.side || 'AEE',
        position: location.position || '01',
        capacity: location.capacity || 100,
        occupied: location.occupied || 0,
        is_active: location.is_active !== false,
        notes: location.notes || ''
      });
    } else {
      // Reset para novo registro
      setFormData({
        street: '',
        shelf: 'P1',
        side: 'AEE',
        position: '01',
        capacity: 100,
        occupied: 0,
        is_active: true,
        notes: ''
      });
    }
  }, [location]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
      };

      if (field === 'street') {
        // Garante que o valor seja maiúsculo e tenha no máximo 3 caracteres
        updated[field] = value.toUpperCase().slice(0, 3);
      } else {
        updated[field] = value;
      }
      
      return updated;
    });
  };

  const getFullAddress = () => {
    return `${formData.street}${formData.shelf}${formData.side}${formData.position}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // FIX: Garantir que company_id está sempre incluído
    if (!currentUser?.company_id) {
      alert('Erro: Informações do usuário não carregadas. Recarregue a página e tente novamente.');
      setIsSaving(false);
      return;
    }
    
    const dataToSave = {
      ...formData,
      company_id: currentUser.company_id,
      full_address: getFullAddress()
    };

    try {
      if (location) {
        await PhysicalLocation.update(location.id, dataToSave);
      } else {
        await PhysicalLocation.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
      alert('Erro ao salvar localização. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const shelfOptions = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];
  const sideOptions = ['AEE', 'ADD', 'AFF', 'AGG', 'AHH', 'AII', 'AJJ', 'AKK'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {location ? 'Editar Localização' : 'Nova Localização'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Endereço Físico */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Ex: JA1"
                  maxLength={3}
                  pattern="[A-Z]{2}[0-9]{1}"
                  title="A rua deve ter 2 letras e 1 número (ex: JA1)."
                  required
                  disabled={isEditing}
                  className={isEditing ? 'bg-gray-100' : ''}
                />
              </div>

              <div>
                <Label htmlFor="shelf">Prateleira *</Label>
                <Select 
                  value={formData.shelf} 
                  onValueChange={(value) => handleInputChange('shelf', value)}
                  disabled={isEditing}
                >
                  <SelectTrigger className={isEditing ? 'bg-gray-100' : ''}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {shelfOptions.map(shelf => (
                      <SelectItem key={shelf} value={shelf}>{shelf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="side">Lado *</Label>
                <Select 
                  value={formData.side} 
                  onValueChange={(value) => handleInputChange('side', value)}
                  disabled={isEditing}
                >
                  <SelectTrigger className={isEditing ? 'bg-gray-100' : ''}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {sideOptions.map(side => (
                      <SelectItem key={side} value={side}>{side}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position">Posição *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').padStart(2, '0');
                    handleInputChange('position', value);
                  }}
                  placeholder="01"
                  maxLength={2}
                  required
                  disabled={isEditing}
                  className={isEditing ? 'bg-gray-100' : ''}
                />
              </div>
            </div>

            {/* Endereço Completo Preview */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-blue-800 font-medium">Endereço Completo:</Label>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {getFullAddress()}
              </div>
            </div>

            {/* Capacidade e Ocupação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidade Total *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="occupied">Quantidade Ocupada</Label>
                <Input
                  id="occupied"
                  type="number"
                  value={formData.occupied}
                  onChange={(e) => handleInputChange('occupied', parseInt(e.target.value) || 0)}
                  min="0"
                  max={formData.capacity}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Localização Ativa</Label>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações sobre esta localização..."
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" className="gap-2" disabled={isSaving}>
                <Save className="w-4 h-4" />
                {isSaving ? 'Salvando...' : (location ? 'Atualizar' : 'Criar')} Localização
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}