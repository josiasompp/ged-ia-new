import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Settings,
  FileText,
  Folder,
  MapPin,
  Database,
  Users,
  FileSignature,
  PenTool
} from 'lucide-react';
import { FinancialPricing } from '@/api/entities';

export default function PricingConfiguration({ pricing, onRefresh, isLoading }) {
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState({
    resource_type: 'documents',
    pricing_tier: 'starter',
    included_quantity: 0,
    unit_price: 0,
    currency: 'BRL',
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0]
  });

  const resourceTypes = [
    { value: 'documents', label: 'Documentos', icon: FileText },
    { value: 'directories', label: 'Diretórios', icon: Folder },
    { value: 'cdoc_addresses', label: 'Endereços CDOC', icon: MapPin },
    { value: 'storage_gb', label: 'Armazenamento (GB)', icon: Database },
    { value: 'users', label: 'Usuários', icon: Users },
    { value: 'proposals', label: 'Propostas', icon: FileSignature },
    { value: 'signatures', label: 'Assinaturas', icon: PenTool }
  ];

  const pricingTiers = [
    { value: 'starter', label: 'Starter', color: 'bg-blue-100 text-blue-800' },
    { value: 'professional', label: 'Professional', color: 'bg-purple-100 text-purple-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-green-100 text-green-800' }
  ];

  const handleSavePrice = async () => {
    try {
      if (editingPrice) {
        await FinancialPricing.update(editingPrice.id, newPrice);
      } else {
        await FinancialPricing.create(newPrice);
      }
      
      setIsAddingPrice(false);
      setEditingPrice(null);
      setNewPrice({
        resource_type: 'documents',
        pricing_tier: 'starter',
        included_quantity: 0,
        unit_price: 0,
        currency: 'BRL',
        is_active: true,
        effective_date: new Date().toISOString().split('T')[0]
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
    }
  };

  const handleEditPrice = (price) => {
    setEditingPrice(price);
    setNewPrice(price);
    setIsAddingPrice(true);
  };

  const handleDeletePrice = async (priceId) => {
    if (confirm('Tem certeza que deseja excluir este preço?')) {
      try {
        await FinancialPricing.delete(priceId);
        onRefresh();
      } catch (error) {
        console.error('Erro ao excluir preço:', error);
      }
    }
  };

  const getResourceIcon = (resourceType) => {
    const resource = resourceTypes.find(r => r.value === resourceType);
    const IconComponent = resource?.icon || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getResourceLabel = (resourceType) => {
    const resource = resourceTypes.find(r => r.value === resourceType);
    return resource?.label || resourceType;
  };

  const getTierColor = (tier) => {
    const tierData = pricingTiers.find(t => t.value === tier);
    return tierData?.color || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração de Preços
            </div>
            <Button 
              onClick={() => setIsAddingPrice(true)}
              className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]"
            >
              <Plus className="w-4 h-4" />
              Novo Preço
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form para Adicionar/Editar Preço */}
      {isAddingPrice && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPrice ? 'Editar Preço' : 'Adicionar Novo Preço'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resource_type">Tipo de Recurso</Label>
                <Select 
                  value={newPrice.resource_type} 
                  onValueChange={(value) => setNewPrice({...newPrice, resource_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o recurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map(resource => (
                      <SelectItem key={resource.value} value={resource.value}>
                        <div className="flex items-center gap-2">
                          <resource.icon className="w-4 h-4" />
                          {resource.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricing_tier">Tier de Preços</Label>
                <Select 
                  value={newPrice.pricing_tier} 
                  onValueChange={(value) => setNewPrice({...newPrice, pricing_tier: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingTiers.map(tier => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="included_quantity">Quantidade Incluída</Label>
                <Input
                  id="included_quantity"
                  type="number"
                  value={newPrice.included_quantity}
                  onChange={(e) => setNewPrice({...newPrice, included_quantity: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={newPrice.unit_price}
                  onChange={(e) => setNewPrice({...newPrice, unit_price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="effective_date">Data de Vigência</Label>
                <Input
                  id="effective_date"
                  type="date"
                  value={newPrice.effective_date}
                  onChange={(e) => setNewPrice({...newPrice, effective_date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingPrice(false);
                  setEditingPrice(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSavePrice}>
                {editingPrice ? 'Atualizar' : 'Adicionar'} Preço
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Preços */}
      <Card>
        <CardHeader>
          <CardTitle>Preços Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Qtd. Incluída</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricing.map((price) => (
                  <TableRow key={price.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getResourceIcon(price.resource_type)}
                        {getResourceLabel(price.resource_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(price.pricing_tier)}>
                        {price.pricing_tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{price.included_quantity?.toLocaleString('pt-BR') || 0}</TableCell>
                    <TableCell className="font-semibold">
                      R$ {(price.unit_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{price.effective_date || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={price.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {price.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPrice(price)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeletePrice(price.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {pricing.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum preço configurado. Clique em "Novo Preço" para começar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}