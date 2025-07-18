
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Paperclip,
  Landmark,
  Upload,
  X,
  FileText // Added FileText import
} from "lucide-react";
import { format } from "date-fns";
import JobTitleSelector from "./JobTitleSelector";
import DocumentUploadSection from "./DocumentUploadSection"; // New import

// Configurações por país
const getCountryConfig = (country) => {
  const configs = {
    brasil: {
      documentFields: ['cpf', 'rg', 'carteira_trabalho', 'titulo_eleitor'],
      bankFields: ['bank_name', 'agency', 'account', 'pix_key'],
      addressFields: ['street', 'number', 'neighborhood', 'city', 'state', 'postal_code'],
      currency: 'BRL'
    },
    espanha: {
      documentFields: ['nie', 'nif', 'passport', 'social_security'],
      bankFields: ['bank_name', 'iban', 'swift'],
      addressFields: ['street', 'number', 'city', 'province', 'postal_code'],
      currency: 'EUR'
    },
    portugal: {
      documentFields: ['nif', 'passport', 'social_security', 'work_permit'],
      bankFields: ['bank_name', 'iban', 'swift'],
      addressFields: ['street', 'number', 'city', 'district', 'postal_code'],
      currency: 'EUR'
    }
  };
  return configs[country] || configs.brasil;
};

// Componente para informações familiares
const FamilyInfoSection = ({ formData, handleChange }) => {
  const [showSpouseForm, setShowSpouseForm] = useState(false);
  const [showChildrenForm, setShowChildrenForm] = useState(false);

  const addChild = () => {
    const children = formData.family_info?.children || [];
    const newChild = {
      name: '',
      birth_date: '',
      gender: 'masculino',
      is_dependent: true
    };
    handleChange('family_info', {
      ...formData.family_info,
      children: [...children, newChild]
    });
    setShowChildrenForm(true);
  };

  const updateChild = (index, field, value) => {
    const children = [...(formData.family_info?.children || [])];
    children[index] = { ...children[index], [field]: value };
    handleChange('family_info', {
      ...formData.family_info,
      children
    });
  };

  const removeChild = (index) => {
    const children = [...(formData.family_info?.children || [])];
    children.splice(index, 1);
    handleChange('family_info', {
      ...formData.family_info,
      children
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Informações Familiares</h3>
      </div>

      {/* Cônjuge */}
      {(formData.marital_status === 'casado' || formData.marital_status === 'uniao_estavel') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Cônjuge
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSpouseForm(!showSpouseForm)}
              >
                {showSpouseForm ? 'Ocultar' : 'Mostrar'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showSpouseForm && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={formData.family_info?.spouse?.name || ''}
                    onChange={(e) => handleChange('family_info', {
                      ...formData.family_info,
                      spouse: { ...formData.family_info?.spouse, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input
                    value={formData.family_info?.spouse?.cpf || ''}
                    onChange={(e) => handleChange('family_info', {
                      ...formData.family_info,
                      spouse: { ...formData.family_info?.spouse, cpf: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.family_info?.spouse?.birth_date || ''}
                    onChange={(e) => handleChange('family_info', {
                      ...formData.family_info,
                      spouse: { ...formData.family_info?.spouse, birth_date: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Profissão</Label>
                  <Input
                    value={formData.family_info?.spouse?.profession || ''}
                    onChange={(e) => handleChange('family_info', {
                      ...formData.family_info,
                      spouse: { ...formData.family_info?.spouse, profession: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Filhos/Dependentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Filhos/Dependentes ({formData.family_info?.children?.length || 0})
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={addChild}>
                Adicionar Filho
              </Button>
              {(formData.family_info?.children?.length || 0) > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChildrenForm(!showChildrenForm)}
                >
                  {showChildrenForm ? 'Ocultar' : 'Mostrar'}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {showChildrenForm && (formData.family_info?.children?.length || 0) > 0 && (
          <CardContent className="space-y-4">
            {formData.family_info?.children?.map((child, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Filho {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeChild(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={child.name || ''}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={child.birth_date || ''}
                      onChange={(e) => updateChild(index, 'birth_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Gênero</Label>
                    <Select
                      value={child.gender || 'masculino'}
                      onValueChange={(v) => updateChild(index, 'gender', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id={`dependent-${index}`}
                      checked={child.is_dependent || false}
                      onChange={(e) => updateChild(index, 'is_dependent', e.target.checked)}
                    />
                    <Label htmlFor={`dependent-${index}`}>É dependente</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default function EmployeeForm({ employee, workSchedules, departments, employees, onSave, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || '',
    email: employee?.email || '',
    personal_email: employee?.personal_email || '',
    phone: employee?.phone || '',
    mobile_phone: employee?.mobile_phone || '',
    birth_date: employee?.birth_date || '',
    nationality: employee?.nationality || 'brasil',
    marital_status: employee?.marital_status || '',
    gender: employee?.gender || '',
    documents: employee?.documents || {},
    family_info: employee?.family_info || {},
    address: employee?.address || {},
    banking_info: employee?.banking_info || {},
    position: employee?.position || '',
    position_code: employee?.position_code || '',
    department_id: employee?.department_id || '',
    cost_center: employee?.cost_center || '',
    hire_date: employee?.hire_date || '',
    contract_type: employee?.contract_type || '',
    work_schedule: employee?.work_schedule || {},
    salary: employee?.salary || '',
    supervisor_id: employee?.supervisor_id || '',
    status: employee?.status || 'ativo',
    emergency_contact: employee?.emergency_contact || {},
    profile_photo: employee?.profile_photo || '',
    country_config: employee?.country_config || 'brasil',
    documents_uploaded: employee?.documents_uploaded || [], // Adicionar array de documentos
  });
  const [activeTab, setActiveTab] = useState("personal");

  const countryConfig = getCountryConfig(formData.country_config);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleDocumentSaved = (documentType, documentData) => {
    const existingDocs = formData.documents_uploaded || [];
    const updatedDocs = existingDocs.filter(doc => doc.document_type !== documentType);
    updatedDocs.push({
      document_type: documentType,
      ...documentData,
      upload_date: new Date().toISOString(),
      uploaded_by: currentUser?.email || 'system'
    });
    
    handleChange('documents_uploaded', updatedDocs);
  };

  const getDocumentByType = (type) => {
    return formData.documents_uploaded?.find(doc => doc.document_type === type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{employee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="grid w-full grid-cols-5 min-w-[600px]">
                <TabsTrigger value="personal"><User className="w-4 h-4 mr-1"/> Pessoal</TabsTrigger>
                <TabsTrigger value="contact"><Mail className="w-4 h-4 mr-1"/> Contato</TabsTrigger>
                <TabsTrigger value="documents"><Paperclip className="w-4 h-4 mr-1"/> Documentos</TabsTrigger>
                <TabsTrigger value="contract"><Briefcase className="w-4 h-4 mr-1"/> Contratual</TabsTrigger>
                <TabsTrigger value="bank"><Landmark className="w-4 h-4 mr-1"/> Bancário</TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="personal" className="space-y-4 pt-4">
              {/* Foto do Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Foto do Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {formData.profile_photo ? (
                        <img src={formData.profile_photo} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Fazer Upload
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">JPG ou PNG, máx. 2MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleChange("birth_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Gênero</Label>
                  <Select value={formData.gender || "nao_definido"} onValueChange={(v) => handleChange("gender", v === "nao_definido" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao_definido">Não definido</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="nao_informado">Não Informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado Civil</Label>
                  <Select value={formData.marital_status || "nao_definido"} onValueChange={(v) => handleChange("marital_status", v === "nao_definido" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao_definido">Não definido</SelectItem>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      <SelectItem value="uniao_estavel">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <FamilyInfoSection 
                formData={formData} 
                handleChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Corporativo *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Email Pessoal</Label>
                  <Input
                    type="email"
                    value={formData.personal_email}
                    onChange={(e) => handleChange("personal_email", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Celular</Label>
                  <Input
                    value={formData.mobile_phone}
                    onChange={(e) => handleChange("mobile_phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label>Logradouro</Label>
                      <Input
                        value={formData.address?.street || ''}
                        onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input
                        value={formData.address?.number || ''}
                        onChange={(e) => handleNestedChange("address", "number", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Complemento</Label>
                      <Input
                        value={formData.address?.complement || ''}
                        onChange={(e) => handleNestedChange("address", "complement", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Bairro/Distrito</Label>
                      <Input
                        value={formData.address?.neighborhood || ''}
                        onChange={(e) => handleNestedChange("address", "neighborhood", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={formData.address?.city || ''}
                        onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Estado/Província</Label>
                      <Input
                        value={formData.address?.state || ''}
                        onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>CEP/Código Postal</Label>
                      <Input
                        value={formData.address?.postal_code || ''}
                        onChange={(e) => handleNestedChange("address", "postal_code", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contato de Emergência */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contato de Emergência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={formData.emergency_contact?.name || ''}
                        onChange={(e) => handleNestedChange("emergency_contact", "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Parentesco</Label>
                      <Input
                        value={formData.emergency_contact?.relationship || ''}
                        onChange={(e) => handleNestedChange("emergency_contact", "relationship", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={formData.emergency_contact?.phone || ''}
                        onChange={(e) => handleNestedChange("emergency_contact", "phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.emergency_contact?.email || ''}
                        onChange={(e) => handleNestedChange("emergency_contact", "email", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Documentos do Funcionário</h3>
                  <p className="text-sm text-gray-600">
                    Faça upload dos documentos necessários. Nossa IA irá extrair automaticamente os dados dos documentos.
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* Documentos Básicos */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-base border-b pb-2">Documentos de Identificação</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUploadSection
                        documentType="cpf"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('cpf')}
                      />
                      <DocumentUploadSection
                        documentType="rg"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('rg')}
                      />
                    </div>
                  </div>

                  {/* Documentos Trabalhistas */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-base border-b pb-2">Documentos Trabalhistas</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUploadSection
                        documentType="carteira_trabalho"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('carteira_trabalho')}
                      />
                      <DocumentUploadSection
                        documentType="titulo_eleitor"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('titulo_eleitor')}
                      />
                    </div>
                  </div>

                  {/* Documentos Complementares */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-base border-b pb-2">Documentos Complementares</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUploadSection
                        documentType="comprovante_residencia"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('comprovante_residencia')}
                      />
                      <DocumentUploadSection
                        documentType="exame_medico"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('exame_medico')}
                      />
                    </div>
                  </div>

                  {/* Formação */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-base border-b pb-2">Formação e Certificações</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUploadSection
                        documentType="diploma"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('diploma')}
                      />
                      <DocumentUploadSection
                        documentType="certidao_nascimento"
                        onDocumentSaved={handleDocumentSaved}
                        existingDocument={getDocumentByType('certidao_nascimento')}
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo dos Documentos */}
                {formData.documents_uploaded && formData.documents_uploaded.length > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Documentos Enviados ({formData.documents_uploaded.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {formData.documents_uploaded.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="font-medium">
                                {doc.document_type?.replace(/_/g, ' ').toUpperCase()}
                              </span>
                            </div>
                            <Badge variant={doc.status === 'aprovado' ? 'default' : 'secondary'}>
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contract" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <JobTitleSelector
                    country={formData.country_config}
                    currentPositionTitle={formData.position}
                    currentPositionCode={formData.position_code}
                    onChangePositionTitle={(title) => handleChange("position", title)}
                    onChangePositionCode={(code) => handleChange("position_code", code)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Departamento</Label>
                    <Select value={formData.department_id || "nao_definido"} onValueChange={(v) => handleChange("department_id", v === "nao_definido" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao_definido">Não definido</SelectItem>
                        {departments?.filter(dept => dept && dept.id && dept.name).map(dept => 
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Data de Admissão *</Label>
                    <Input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => handleChange("hire_date", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Tipo de Contrato</Label>
                    <Select value={formData.contract_type || "nao_definido"} onValueChange={(v) => handleChange("contract_type", v === "nao_definido" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao_definido">Não definido</SelectItem>
                        <SelectItem value="clt">CLT</SelectItem>
                        <SelectItem value="pj">PJ</SelectItem>
                        <SelectItem value="estagio">Estágio</SelectItem>
                        <SelectItem value="terceirizado">Terceirizado</SelectItem>
                        <SelectItem value="temporario">Temporário</SelectItem>
                        <SelectItem value="autonomo">Autônomo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Salário ({countryConfig.currency})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => handleChange("salary", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Centro de Custo</Label>
                    <Input
                      value={formData.cost_center}
                      onChange={(e) => handleChange("cost_center", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Supervisor</Label>
                    <Select value={formData.supervisor_id || "nao_definido"} onValueChange={(v) => handleChange("supervisor_id", v === "nao_definido" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao_definido">Não definido</SelectItem>
                        {employees?.filter(emp => emp && emp.id && emp.full_name && emp.id !== employee?.id).map(emp => 
                          <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {countryConfig.bankFields.map(field => (
                  <div key={field}>
                    <Label className="capitalize">{field.replace('_', ' ')}</Label>
                    <Input
                      value={formData.banking_info?.[field] || ''}
                      onChange={(e) => handleNestedChange("banking_info", field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#212153] to-[#146FE0]">
              {employee ? 'Atualizar' : 'Criar'} Funcionário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
