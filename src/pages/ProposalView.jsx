
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Proposal } from "@/api/entities";
import { CompanyBranding } from "@/api/entities";
import { ProposalBranding } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Video,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Check,
  X,
  Clock,
  Link as LinkIcon
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const sectionTypeIcons = {
  text: FileText,
  video: Video,
  image: ImageIcon,
  pricing: DollarSign,
  timeline: Calendar
};

const VideoEmbed = ({ url }) => {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId;
    if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null; // Return null if URL is not recognized
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">URL de vídeo inválido ou não suportado.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video da Proposta"
      />
    </div>
  );
};

const SectionRenderer = ({ section }) => {
  const Icon = sectionTypeIcons[section.type] || FileText;

  return (
    <Card className="mb-6 border-0 shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {section.type === 'video' ? (
          <VideoEmbed url={section.video_url} />
        ) : (
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }} />
        )}
      </CardContent>
    </Card>
  );
};

export default function ProposalView() {
  const location = useLocation();
  const [proposal, setProposal] = useState(null);
  const [branding, setBranding] = useState({});
  const [proposalBranding, setProposalBranding] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const proposalId = params.get("id");

        if (!proposalId) {
          setIsLoading(false);
          return;
        }

        const proposalData = await Proposal.filter({ share_link: window.location.href });

        if (proposalData.length > 0) {
          const currentProposal = proposalData[0];
          setProposal(currentProposal);

          const propBrandingData = await ProposalBranding.filter({ proposal_id: currentProposal.id });
          if (propBrandingData.length > 0 && propBrandingData[0].is_active) {
            setProposalBranding(propBrandingData[0]);
          }

          if (currentProposal.company_id) {
            const brandingData = await CompanyBranding.filter({ 
              company_id: currentProposal.company_id, 
              is_active: true 
            });
            if (brandingData.length > 0) {
              setBranding(brandingData[0]);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar proposta:", error);
      }
      setIsLoading(false);
    };

    fetchProposal();
  }, [location]);
  
  const getBrandingStyle = () => {
    const activeBranding = (proposalBranding && proposalBranding.use_client_branding) ? proposalBranding : branding;
    
    return {
      '--brand-primary': activeBranding.primary_color || '#212153',
      '--brand-secondary': activeBranding.secondary_color || '#146FE0',
      '--brand-accent': activeBranding.accent_color || '#04BF7B',
      '--brand-background': activeBranding.background_color || '#F8FAFC',
      '--brand-text': activeBranding.text_color || '#1E293B',
      fontFamily: activeBranding.font_family || 'Sora, sans-serif'
    };
  };

  const getHeaderTitle = () => {
    if (proposalBranding?.custom_header_title) {
      return proposalBranding.custom_header_title;
    }
    return proposal?.title || "Proposta Comercial";
  };

  const getFooterText = () => {
    if (proposalBranding?.custom_footer_text) {
      return proposalBranding.custom_footer_text;
    }
    return `Desenvolvido especialmente para ${proposal?.client_name}`;
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold">Proposta não encontrada</h1>
        <p className="text-gray-600 mt-2">O link pode estar incorreto ou a proposta foi removida.</p>
      </div>
    );
  }

  const sortedSections = proposal.sections?.sort((a, b) => a.order - b.order) || [];
  
  const activeBrandingForCss = (proposalBranding && proposalBranding.use_client_branding) ? proposalBranding : branding;

  return (
    <div className="min-h-screen" style={getBrandingStyle()}>
      {(proposalBranding?.custom_css || activeBrandingForCss.custom_css) && (
        <style dangerouslySetInnerHTML={{
          __html: proposalBranding?.custom_css || activeBrandingForCss.custom_css
        }} />
      )}

      <div className="max-w-4xl mx-auto">
        <div 
          className="text-center py-16 px-8 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)` 
          }}
        >
          {proposalBranding?.background_pattern && proposalBranding.background_pattern !== 'none' && (
            <div className={`absolute inset-0 opacity-10 ${proposalBranding.background_pattern}-pattern`} />
          )}
          
          <div className="relative z-10">
            {proposalBranding?.client_logo_url && (
              <div className="mb-6">
                <img 
                  src={proposalBranding.client_logo_url} 
                  alt="Logo do Cliente" 
                  className="h-16 mx-auto object-contain"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getHeaderTitle()}
            </h1>
            
            <p className="text-xl text-white/90 mb-2">
              Para: {proposal?.client_company || proposal?.client_name}
            </p>
            
            {proposal?.expiry_date && (
              <p className="text-white/80">
                Válida até {format(new Date(proposal.expiry_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        <div className="px-8 py-12 space-y-8" style={{ backgroundColor: 'var(--brand-background)' }}>
          <div className="text-center mb-12" style={{color: 'var(--brand-text)'}}>
            <Badge variant="outline" className="mb-4" style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}>{proposal.category}</Badge>
            <h1 className="text-5xl font-extrabold" style={{color: 'var(--brand-text)'}}>{proposal.title}</h1>
            <p className="text-xl text-gray-600 mt-4">{proposal.description}</p>
            <div className="mt-6 flex justify-center items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4"/>
                  <span>Criada em: {format(new Date(proposal.created_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
              </div>
              {proposal.expiry_date && (
              <div className="flex items-center gap-2 font-medium text-amber-600">
                  <Clock className="w-4 h-4"/>
                  <span>Válida até: {format(new Date(proposal.expiry_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
              </div>
              )}
            </div>
          </div>

          <div>
            {sortedSections.map(section => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
          
          {(proposal.main_proposal_url || proposal.scope_document_url || proposal.presentation_url) && (
              <Card className="mt-8 border-0 shadow-lg">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl font-bold" style={{color: 'var(--brand-text)'}}>
                          <LinkIcon className="w-6 h-6 text-gray-600"/>
                          Documentos Anexos
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {proposal.main_proposal_url && <a href={proposal.main_proposal_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"><FileText className="w-5 h-5 text-blue-600"/><span>{proposal.main_proposal_filename || 'Documento Principal'}</span></a>}
                      {proposal.scope_document_url && <a href={proposal.scope_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"><FileText className="w-5 h-5 text-purple-600"/><span>{proposal.scope_document_filename || 'Documento de Escopo'}</span></a>}
                      {proposal.presentation_url && <a href={proposal.presentation_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"><ImageIcon className="w-5 h-5 text-amber-600"/><span>{proposal.presentation_filename || 'Apresentação'}</span></a>}
                  </CardContent>
              </Card>
          )}

          <div className="text-center py-8">
            <p className="text-lg font-bold" style={{color: 'var(--brand-text)'}}>Valor Total da Proposta:</p>
            <p className="text-4xl font-extrabold" style={{ color: 'var(--brand-accent)' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.total_value || 0)}
            </p>
          </div>
        </div>

        <div 
          className="text-center py-12 px-8 text-white"
          style={{ 
            background: `linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-accent) 100%)` 
          }}
        >
          <p className="text-lg mb-4">{getFooterText()}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              className="flex-1 bg-white hover:bg-gray-100 shadow-lg"
              style={{ 
                color: 'var(--brand-primary)',
                borderColor: 'var(--brand-primary)'
              }}
            >
              <Check className="w-5 h-5 mr-2" />
              Aceitar Proposta
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-white text-white hover:bg-white/10"
              style={{
                borderColor: 'var(--brand-primary)',
                color: 'var(--brand-primary)'
              }}
            >
              <X className="w-5 h-5 mr-2" />
              Declinar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
