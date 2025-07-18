
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  Image,
  DollarSign,
  Calendar,
  Play,
  Eye
} from "lucide-react";

const sectionTypeIcons = {
  text: FileText,
  video: Video,
  image: Image,
  pricing: DollarSign,
  timeline: Calendar
};

const VideoEmbed = ({ url }) => {
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <iframe
        src={getEmbedUrl(url)}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Preview"
      />
    </div>
  );
};

const SectionPreview = ({ section }) => {
  const Icon = sectionTypeIcons[section.type] || FileText;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-blue-600" />
          {section.title}
          {section.is_required && (
            <Badge variant="secondary" className="text-xs">Obrigatória</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {section.type === 'video' && section.video_url ? (
          <VideoEmbed url={section.video_url} />
        ) : section.type === 'image' ? (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Área de Imagem</p>
            </div>
          </div>
        ) : section.type === 'pricing' ? (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Investimento</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          </div>
        ) : section.type === 'timeline' ? (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Cronograma</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <p className="text-gray-700">{section.content}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function TemplatePreview({ template, onClose }) {
  if (!template) return null;

  const sortedSections = template.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Preview: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header da Proposta */}
          <Card className="bg-gradient-to-r from-[#212153] to-[#146FE0] text-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
              <p className="text-white/80 text-lg">{template.description}</p>
              <Badge className="mt-4 bg-white/20 text-white border-white/30">
                {template.category}
              </Badge>
            </CardContent>
          </Card>

          {/* Seções do Template */}
          <div className="space-y-4">
            {sortedSections.length > 0 ? (
              sortedSections.map((section) => (
                <SectionPreview key={section.id} section={section} />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Template sem seções
                  </h3>
                  <p className="text-gray-500">
                    Adicione seções para criar o conteúdo da proposta.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">
                Esta é uma pré-visualização do template. 
                Os valores e conteúdos específicos serão preenchidos na criação da proposta.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
