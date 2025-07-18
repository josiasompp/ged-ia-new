import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  DollarSign, 
  Building2, 
  Folder,
  FileText,
  MapPin,
  Database,
  Users,
  FileSignature,
  PenTool,
  TrendingUp
} from 'lucide-react';

export default function UsageCalculator({ companies, departments, pricing }) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedTier, setSelectedTier] = useState('starter');
  const [usageInputs, setUsageInputs] = useState({
    documents: 0,
    directories: 0,
    cdoc_addresses: 0,
    storage_gb: 0,
    users: 0,
    proposals: 0,
    signatures: 0
  });

  const resourceTypes = [
    { key: 'documents', label: 'Documentos', icon: FileText, unit: 'documentos' },
    { key: 'directories', label: 'Diretórios', icon: Folder, unit: 'diretórios' },
    { key: 'cdoc_addresses', label: 'Endereços CDOC', icon: MapPin, unit: 'endereços' },
    { key: 'storage_gb', label: 'Armazenamento', icon: Database, unit: 'GB' },
    { key: 'users', label: 'Usuários', icon: Users, unit: 'usuários' },
    { key: 'proposals', label: 'Propostas', icon: FileSignature, unit: 'propostas' },
    { key: 'signatures', label: 'Assinaturas', icon: PenTool, unit: 'assinaturas' }
  ];

  const pricingTiers = [
    { value: 'starter', label: 'Starter' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const handleUsageChange = (resourceType, value) => {
    setUsageInputs({
      ...usageInputs,
      [resourceType]: parseFloat(value) || 0
    });
  };

  const calculateCosts = () => {
    let totalCost = 0;
    const breakdown = [];

    resourceTypes.forEach(resource => {
      const usage = usageInputs[resource.key];
      if (usage > 0) {
        // Buscar preço configurado para este recurso e tier
        const priceConfig = pricing.find(p => 
          p.resource_type === resource.key && 
          p.pricing_tier === selectedTier &&
          p.is_active
        );

        if (priceConfig) {
          const includedQuantity = priceConfig.included_quantity || 0;
          const unitPrice = priceConfig.unit_price || 0;
          
          const overageQuantity = Math.max(0, usage - includedQuantity);
          const overageCost = overageQuantity * unitPrice;
          
          totalCost += overageCost;
          
          breakdown.push({
            resource: resource.label,
            icon: resource.icon,
            usage,
            included: includedQuantity,
            overage: overageQuantity,
            unitPrice,
            cost: overageCost,
            unit: resource.unit
          });
        }
      }
    });

    return { totalCost, breakdown };
  };

  const { totalCost, breakdown } = calculateCosts();
  
  const filteredDepartments = departments.filter(dept => 
    selectedCompany === '' || dept.company_id === selectedCompany
  );

  return (
    <div className="space-y-6">
      {/* Configuração da Simulação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora de Custos por Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map(department => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tier">Tier de Preços</Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
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
          </div>

          <Separator className="my-6" />

          {/* Inputs de Uso */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceTypes.map(resource => {
              const IconComponent = resource.icon;
              return (
                <div key={resource.key}>
                  <Label htmlFor={resource.key} className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {resource.label}
                  </Label>
                  <Input
                    id={resource.key}
                    type="number"
                    min="0"
                    value={usageInputs[resource.key]}
                    onChange={(e) => handleUsageChange(resource.key, e.target.value)}
                    placeholder={`Quantidade de ${resource.unit}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Simulação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Resumo de Custos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="text-green-700 font-medium">Custo Total Estimado</span>
                <span className="text-2xl font-bold text-green-800">
                  R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {breakdown.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Detalhamento por Recurso</h4>
                  {breakdown.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">{item.resource}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            R$ {item.cost.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.overage} {item.unit} extras
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Análise de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.length > 0 ? (
                breakdown.map((item, index) => {
                  const IconComponent = item.icon;
                  const utilizationRate = item.included > 0 ? (item.usage / item.included) * 100 : 0;
                  
                  return (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{item.resource}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {utilizationRate.toFixed(0)}% utilização
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Uso atual:</span>
                          <span>{item.usage} {item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Incluído no plano:</span>
                          <span>{item.included} {item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Excesso:</span>
                          <span className={item.overage > 0 ? 'text-amber-600 font-medium' : ''}>
                            {item.overage} {item.unit}
                          </span>
                        </div>
                      </div>
                      
                      {/* Barra de Progresso */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              utilizationRate <= 100 ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, utilizationRate)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Insira valores de uso para ver a análise detalhada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}