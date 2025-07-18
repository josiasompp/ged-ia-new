import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Clock,
  DollarSign,
  Search,
  Filter
} from "lucide-react";
import { Service } from "@/api/entities";
import { useToast } from "@/components/ui/use-toast";

export default function ServiceManager({ services, currentUser, onRefresh, isLoading }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_minutes: 60,
    price: 0,
    currency: "BRL",
    category: "consulta",
    color: "#146FE0",
    buffer_time_before: 0,
    buffer_time_after: 15,
    max_advance_booking_days: 30,
    min_advance_booking_hours: 2,
    questions: [],
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration_minutes: 60,
      price: 0,
      currency: "BRL",
      category: "consulta",
      color: "#146FE0",
      buffer_time_before: 0,
      buffer_time_after: 15,
      max_advance_booking_days: 30,
      min_advance_booking_hours: 2,
      questions: [],
      is_active: true
    });
    setSelectedService(null);
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || "",
      description: service.description || "",
      duration_minutes: service.duration_minutes || 60,
      price: service.price || 0,
      currency: service.currency || "BRL",
      category: service.category || "consulta",
      color: service.color || "#146FE0",
      buffer_time_before: service.buffer_time_before || 0,
      buffer_time_after: service.buffer_time_after || 15,
      max_advance_booking_days: service.max_advance_booking_days || 30,
      min_advance_booking_hours: service.min_advance_booking_hours || 2,
      questions: service.questions || [],
      is_active: service.is_active !== false
    });
    setSelectedService(service);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const serviceData = {
        ...formData,
        company_id: currentUser?.company_id || "default_company",
        duration_minutes: parseInt(formData.duration_minutes),
        price: parseFloat(formData.price),
        buffer_time_before: parseInt(formData.buffer_time_before),
        buffer_time_after: parseInt(formData.buffer_time_after),
        max_advance_booking_days: parseInt(formData.max_advance_booking_days),
        min_advance_booking_hours: parseInt(formData.min_advance_booking_hours)
      };

      if (selectedService) {
        await Service.update(selectedService.id, serviceData);
        toast({ title: "Serviço atualizado com sucesso!" });
      } else {
        await Service.create(serviceData);
        toast({ title: "Serviço criado com sucesso!" });
      }

      setShowForm(false);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast({ 
        title: "Erro ao salvar serviço", 
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) {
      try {
        await Service.delete(service.id);
        toast({ title: "Serviço excluído com sucesso!" });
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        toast({ 
          title: "Erro ao excluir serviço", 
          description: "Verifique se não há agendamentos ativos para este serviço.",
          variant: "destructive"
        });
      }
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category) => {
    const categories = {
      'consulta': 'Consulta',
      'reuniao': 'Reunião',
      'atendimento': 'Atendimento',
      'servico_tecnico': 'Serviço Técnico',
      'treinamento': 'Treinamento',
      'outros': 'Outros'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'consulta': 'bg-blue-100 text-blue-800',
      'reuniao': 'bg-green-100 text-green-800',
      'atendimento': 'bg-purple-100 text-purple-800',
      'servico_tecnico': 'bg-orange-100 text-orange-800',
      'treinamento': 'bg-yellow-100 text-yellow-800',
      'outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Gerenciar Serviços ({services.length})
          </CardTitle>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="atendimento">Atendimento</SelectItem>
                <SelectItem value="servico_tecnico">Serviço Técnico</SelectItem>
                <SelectItem value="treinamento">Treinamento</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
                    <p className="text-gray-500 mb-4">Crie seu primeiro serviço para começar a receber agendamentos.</p>
                    <Button onClick={handleNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Serviço
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: service.color }}
                          ></div>
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {service.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(service.category)}>
                        {getCategoryLabel(service.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {service.duration_minutes}min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {service.price > 0 ? `${service.currency} ${service.price}` : 'Gratuito'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {service.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Service Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Consulta Médica, Reunião de Negócios"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="atendimento">Atendimento</SelectItem>
                    <SelectItem value="servico_tecnico">Serviço Técnico</SelectItem>
                    <SelectItem value="treinamento">Treinamento</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o que está incluído neste serviço..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  min="15"
                  step="15"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buffer_before">Buffer Antes (min)</Label>
                <Input
                  id="buffer_before"
                  type="number"
                  value={formData.buffer_time_before}
                  onChange={(e) => setFormData({ ...formData, buffer_time_before: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="buffer_after">Buffer Depois (min)</Label>
                <Input
                  id="buffer_after"
                  type="number"
                  value={formData.buffer_time_after}
                  onChange={(e) => setFormData({ ...formData, buffer_time_after: e.target.value })}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_advance">Máx. Antecedência (dias)</Label>
                <Input
                  id="max_advance"
                  type="number"
                  value={formData.max_advance_booking_days}
                  onChange={(e) => setFormData({ ...formData, max_advance_booking_days: e.target.value })}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="min_advance">Mín. Antecedência (horas)</Label>
                <Input
                  id="min_advance"
                  type="number"
                  value={formData.min_advance_booking_hours}
                  onChange={(e) => setFormData({ ...formData, min_advance_booking_hours: e.target.value })}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Serviço Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {selectedService ? "Atualizar" : "Criar"} Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}