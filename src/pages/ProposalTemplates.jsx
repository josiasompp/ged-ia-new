
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Eye,
  Edit,
  Copy,
  Trash2,
  Settings,
  Layout
} from "lucide-react";
import { ProposalTemplate } from "@/api/entities";
import { User } from "@/api/entities";

import TemplateList from "../components/templates/TemplateList";
import TemplateForm from "../components/templates/TemplateForm";
import TemplatePreview from "../components/templates/TemplatePreview";
import { cachedAPICall, apiCache } from "../components/utils/apiCache";
import { useToast } from "@/components/ui/use-toast";

export default function ProposalTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Usar cache para carregar templates
      const templateData = await cachedAPICall(ProposalTemplate, 'list', ["-created_date"]);
      
      // Templates de exemplo para demonstração
      const exampleTemplates = [
        {
          id: "template-1",
          name: "Proposta de Consultoria Completa",
          description: "Template completo para serviços de consultoria com vídeo de apresentação",
          category: "consultoria",
          company_id: "firstdocy_company",
          sections: [
            {
              id: "intro",
              title: "Apresentação da Empresa",
              type: "video",
              content: "Vídeo institucional apresentando nossa empresa e expertise.",
              video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              order: 1,
              is_required: true
            },
            {
              id: "problem",
              title: "Entendimento do Problema",
              type: "text",
              content: "Demonstramos aqui nossa compreensão sobre os desafios que sua empresa enfrenta...",
              order: 2,
              is_required: true
            },
            {
              id: "solution",
              title: "Nossa Solução",
              type: "text",
              content: "Apresentamos uma solução personalizada que atende suas necessidades específicas...",
              order: 3,
              is_required: true
            },
            {
              id: "pricing",
              title: "Investimento",
              type: "pricing",
              content: "Estrutura de preços transparente e competitiva",
              order: 4,
              is_required: true
            },
            {
              id: "timeline",
              title: "Cronograma de Execução",
              type: "timeline",
              content: "Etapas detalhadas do projeto com prazos definidos",
              order: 5,
              is_required: false
            }
          ],
          is_default: true,
          is_active: true,
          created_date: new Date().toISOString()
        },
        {
          id: "template-2",
          name: "Proposta Rápida de Produtos",
          description: "Template simplificado para venda de produtos",
          category: "produtos",
          company_id: "firstdocy_company",
          sections: [
            {
              id: "intro",
              title: "Nossos Produtos",
              type: "text",
              content: "Apresentação da linha de produtos...",
              order: 1,
              is_required: true
            },
            {
              id: "catalog",
              title: "Catálogo",
              type: "image",
              content: "Imagens dos produtos disponíveis",
              order: 2,
              is_required: true
            },
            {
              id: "pricing",
              title: "Preços",
              type: "pricing",
              content: "Tabela de preços atualizada",
              order: 3,
              is_required: true
            }
          ],
          is_default: false,
          is_active: true,
          created_date: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setTemplates([...templateData, ...exampleTemplates]);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      
      if (error.message.includes('Rate limit')) {
        toast({
          title: "Muitas requisições",
          description: "Aguarde um momento antes de tentar novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao carregar templates",
          description: "Não foi possível carregar os templates.",
          variant: "destructive"
        });
      }
    }
    setIsLoading(false);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setShowForm(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedTemplate) {
        await ProposalTemplate.update(selectedTemplate.id, data);
      } else {
        await ProposalTemplate.create({
          ...data,
          company_id: currentUser?.company_id
        });
      }
      
      // Invalidar cache de templates
      apiCache.invalidate('ProposalTemplate');
      
      setShowForm(false);
      loadTemplates();
      
      toast({
        title: "Template salvo com sucesso!",
        description: selectedTemplate ? "Template atualizado." : "Novo template criado."
      });
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async (template) => {
    try {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} - Cópia`,
        is_default: false
      };
      delete duplicatedTemplate.id;
      delete duplicatedTemplate.created_date;
      
      await ProposalTemplate.create({
        ...duplicatedTemplate,
        company_id: currentUser?.company_id
      });
      
      // Invalidar cache de templates
      apiCache.invalidate('ProposalTemplate');
      
      loadTemplates();
      
      toast({
        title: "Template duplicado!",
        description: "Uma cópia do template foi criada."
      });
    } catch (error) {
      console.error("Erro ao duplicar template:", error);
      toast({
        title: "Erro ao duplicar",
        description: "Não foi possível duplicar o template.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Templates de Propostas
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Crie e gerencie modelos reutilizáveis para suas propostas comerciais</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Templates</p>
                <div className="text-3xl font-bold text-gray-900 mt-1">{templates.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#146FE0] to-[#04BF7B] shadow-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates Ativos</p>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  {templates.filter(t => t.is_active).length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#04BF7B] to-[#146FE0] shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Vídeos</p>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  {templates.filter(t => t.sections?.some(s => s.type === 'video')).length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates Padrão</p>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  {templates.filter(t => t.is_default).length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates List */}
      <TemplateList 
        templates={templates}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onDuplicate={handleDuplicate}
        onRefresh={loadTemplates}
      />

      {/* Modals */}
      {showForm && (
        <TemplateForm
          template={selectedTemplate}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
          currentUser={currentUser}
        />
      )}

      {showPreview && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
