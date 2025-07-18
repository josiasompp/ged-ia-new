import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Package, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

export default function PhysicalDocumentForm({ document, locations = [], onSave, onClose, currentUser }) {
    const [currentDocument, setCurrentDocument] = React.useState(document || {
        client_name: "",
        company_name: "",
        department: "",
        physical_location_id: "",
        full_address: "",
        box_description: "",
        content_detail: "",
        entry_date: "",
        destruction_date: "",
        is_permanent: false,
        document_type: "outros",
        access_level: "restrito",
        status: "arquivado"
    });

    const [clients, setClients] = React.useState([
        "GKT DO BRASIL LTDA",
        "TECH SOLUTIONS CORP",
        "INOVAÇÃO SISTEMAS",
        "GLOBAL ENTERPRISES"
    ]);

    const [isGeneratingLocation, setIsGeneratingLocation] = React.useState(false);

    const handleInputChange = (field, value) => {
        setCurrentDocument({ ...currentDocument, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!currentDocument.client_name) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        
        if (!currentDocument.physical_location_id) {
            alert('Por favor, selecione uma localização física.');
            return;
        }
        
        if (!currentDocument.box_description) {
            alert('Por favor, preencha a descrição da caixa.');
            return;
        }
        
        onSave(currentDocument);
    };

    const handleGenerateRandomLocation = async () => {
        if (!Array.isArray(locations) || locations.length === 0) {
            alert('Nenhuma localização disponível.');
            return;
        }

        setIsGeneratingLocation(true);
        
        // Simular delay de geração
        setTimeout(() => {
            const availableLocations = locations.filter(loc => loc && loc.is_active);
            if (availableLocations.length > 0) {
                const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
                handleInputChange('physical_location_id', randomLocation.id);
                handleInputChange('full_address', randomLocation.full_address);
            }
            setIsGeneratingLocation(false);
        }, 1000);
    };

    const selectedClient = Array.isArray(clients) ? clients.find(client => client && client === currentDocument.client_name) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        {document ? 'Editar Documento Físico' : 'Novo Documento Físico'}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informações do Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="client_name">Cliente *</Label>
                                <Select 
                                    value={currentDocument.client_name || "none"} 
                                    onValueChange={(value) => handleInputChange('client_name', value === "none" ? "" : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" disabled>Selecione um cliente</SelectItem>
                                        {clients.map(client => (
                                            <SelectItem key={client} value={client}>
                                                {client}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="company_name">Nome da Empresa</Label>
                                <Input
                                    id="company_name"
                                    value={currentDocument.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    placeholder="Nome da empresa do documento"
                                />
                            </div>
                        </div>

                        {/* Departamento e Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="department">Departamento</Label>
                                <Input
                                    id="department"
                                    value={currentDocument.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    placeholder="ex: DIVISÃO SOLDA (4001)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="document_type">Tipo de Documento</Label>
                                <Select 
                                    value={currentDocument.document_type} 
                                    onValueChange={(value) => handleInputChange('document_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formulario">Formulário</SelectItem>
                                        <SelectItem value="relatorio">Relatório</SelectItem>
                                        <SelectItem value="contrato">Contrato</SelectItem>
                                        <SelectItem value="nota_fiscal">Nota Fiscal</SelectItem>
                                        <SelectItem value="certidao">Certidão</SelectItem>
                                        <SelectItem value="outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Localização Física */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="physical_location_id">Localização Física *</Label>
                                <div className="flex gap-2">
                                    <Select 
                                        value={currentDocument.physical_location_id || "none"} 
                                        onValueChange={(value) => handleInputChange('physical_location_id', value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Selecione uma localização" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" disabled>Selecione uma localização</SelectItem>
                                            {Array.isArray(locations) && locations.map(location => (
                                                <SelectItem key={location.id} value={location.id}>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{location.full_address || `${location.street || ''}${location.shelf || ''}${location.side || ''}${location.position || ''}`}</span>
                                                        {location.capacity !== undefined && location.occupied !== undefined && (
                                                            <span className="text-xs text-gray-500">({location.occupied}/{location.capacity})</span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleGenerateRandomLocation}
                                        disabled={isGeneratingLocation}
                                        title="Gerar localização aleatória"
                                    >
                                        {isGeneratingLocation ? (
                                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                        ) : (
                                            <Package className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="full_address">Endereço Completo</Label>
                                <Input
                                    id="full_address"
                                    value={currentDocument.full_address}
                                    onChange={(e) => handleInputChange('full_address', e.target.value)}
                                    placeholder="ex: JA1P2AEE01"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Descrição do conteúdo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="box_description">Descrição da Caixa *</Label>
                                <Textarea
                                    id="box_description"
                                    value={currentDocument.box_description}
                                    onChange={(e) => handleInputChange('box_description', e.target.value)}
                                    placeholder="Tipo de conteúdo/Descrição da caixa"
                                    className="h-24"
                                />
                            </div>
                            <div>
                                <Label htmlFor="content_detail">Detalhe do Conteúdo</Label>
                                <Textarea
                                    id="content_detail"
                                    value={currentDocument.content_detail}
                                    onChange={(e) => handleInputChange('content_detail', e.target.value)}
                                    placeholder="Detalhe do conteúdo do documento/item"
                                    className="h-24"
                                />
                            </div>
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="entry_date">Data de Entrada *</Label>
                                <Input
                                    id="entry_date"
                                    type="date"
                                    value={currentDocument.entry_date}
                                    onChange={(e) => handleInputChange('entry_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="destruction_date">Data de Destruição</Label>
                                <Input
                                    id="destruction_date"
                                    type="date"
                                    value={currentDocument.destruction_date}
                                    onChange={(e) => handleInputChange('destruction_date', e.target.value)}
                                    disabled={currentDocument.is_permanent}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Checkbox
                                    id="is_permanent"
                                    checked={currentDocument.is_permanent}
                                    onCheckedChange={(checked) => handleInputChange('is_permanent', checked)}
                                />
                                <Label htmlFor="is_permanent">Documento Permanente</Label>
                            </div>
                        </div>

                        {/* Status e Nível de Acesso */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select 
                                    value={currentDocument.status} 
                                    onValueChange={(value) => handleInputChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="arquivado">Arquivado</SelectItem>
                                        <SelectItem value="emprestado">Emprestado</SelectItem>
                                        <SelectItem value="em_transito">Em Trânsito</SelectItem>
                                        <SelectItem value="destruido">Destruído</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="access_level">Nível de Acesso</Label>
                                <Select 
                                    value={currentDocument.access_level} 
                                    onValueChange={(value) => handleInputChange('access_level', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="publico">Público</SelectItem>
                                        <SelectItem value="restrito">Restrito</SelectItem>
                                        <SelectItem value="confidencial">Confidencial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-[#212153] to-[#146FE0]">
                                {document ? 'Atualizar' : 'Criar'} Documento
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}