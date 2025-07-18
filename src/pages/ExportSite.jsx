import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/components/ui/use-toast";
import {
  Copy,
  FileText,
  BookUser,
  Download,
  HelpCircle,
  FolderArchive,
} from 'lucide-react';

const CodeBlock = ({ code, language, onCopy, title }) => {
  return (
    <div className="relative group mt-4">
      {title && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-medium rounded-t-lg">
          {title}
        </div>
      )}
      <pre className={`p-6 bg-gray-900 text-white ${title ? 'rounded-t-none' : ''} rounded-lg text-sm overflow-auto max-h-[60vh]`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity"
        onClick={onCopy}
        title="Copiar código"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function ExportSite() {
  const { toast } = useToast();

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copiado com sucesso!",
      description: `O código da seção "${section}" foi copiado para a área de transferência.`,
    });
  };

  const fullHtmlCode = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIRSTDOCY GED AI - Gestão Eletrônica de Documentos com Inteligência Artificial</title>
    <meta name="description" content="A primeira plataforma de gestão documental com Inteligência Artificial integrada do Brasil. Transforme sua gestão de documentos físicos e digitais.">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --slate-50: #f8fafc;
            --slate-300: #cbd5e1;
            --slate-600: #475569;
            --slate-700: #334155;
            --slate-800: #1e293b;
            --slate-900: #0f172a;
            --blue-50: #eff6ff;
            --blue-100: #dbeafe;
            --blue-400: #60a5fa;
            --blue-500: #3b82f6;
            --blue-600: #2563eb;
            --blue-700: #1d4ed8;
            --blue-800: #1e40af;
            --blue-900: #1e3a8a;
            --green-400: #4ade80;
            --green-500: #22c55e;
            --green-600: #16a34a;
            --green-700: #15803d;
            --yellow-400: #facc15;
            --white: #ffffff;
            --toast-bg: #111827;
            --toast-color: #f9fafb;
        }

        /* Base & Resets */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background-color: var(--slate-50); color: var(--slate-800); -webkit-font-smoothing: antialiased; }
        .container { max-width: 1280px; margin-left: auto; margin-right: auto; padding: 0 1rem; }
        
        /* Typography */
        h1, h2, h3, h4, p, span, div, button, input, textarea { font-family: 'Inter', sans-serif; }
        h1 { font-size: 3.75rem; line-height: 1; font-weight: 700; color: var(--white); margin-bottom: 1.5rem; }
        h2 { font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; color: var(--slate-900); margin-bottom: 1.5rem; }
        h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; color: var(--slate-900); margin-bottom: 1rem; }
        
        /* Gradients & Backgrounds */
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--slate-50), var(--blue-50)); }
        .hero-bg { background-image: linear-gradient(to bottom right, var(--slate-900), var(--blue-900), var(--slate-900)); }
        .bg-grid { background-image: linear-gradient(var(--white) 1px, transparent 1px), linear-gradient(to right, var(--white) 1px, transparent 1px); background-size: 60px 60px; opacity: 0.05; position: absolute; inset: 0; }
        .text-gradient { background-image: linear-gradient(to right, var(--blue-400), var(--green-400)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .button-gradient { background-image: linear-gradient(to right, var(--blue-600), var(--green-600)); }
        .button-gradient:hover { background-image: linear-gradient(to right, var(--blue-700), var(--green-700)); }

        /* Buttons & Badges */
        .btn { border: none; cursor: pointer; padding: 1rem 2rem; font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; border-radius: 0.5rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease-in-out; }
        .btn-primary { color: var(--white); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
        .btn-outline { background-color: transparent; border: 1px solid var(--white); color: var(--white); }
        .btn-outline:hover { background-color: var(--white); color: var(--slate-900); }
        .btn-icon { margin-left: 0.5rem; width: 1.25rem; height: 1.25rem; }
        .badge { display: inline-block; margin-bottom: 1.5rem; background-color: var(--blue-100); color: var(--blue-800); padding: 0.5rem 1rem; font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; border-radius: 9999px; }

        /* Card */
        .card { background-color: var(--white); border-radius: 0.75rem; border: 1px solid transparent; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
        .card-content { padding: 2rem; }
        .card:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }

        /* Sections */
        .section { padding: 5rem 0; }
        .section-hero { position: relative; overflow: hidden; }
        .section-hero-content { position: relative; z-index: 1; padding: 5rem 0; }
        .section-stats { background-color: var(--white); }
        .section-features { background-color: var(--slate-50); }
        .section-pricing { background-color: var(--white); }
        .section-testimonials { background-color: var(--slate-50); }
        .section-contact { background-color: var(--slate-900); }
        .section-footer { background-color: var(--slate-800); color: var(--white); padding: 3rem 0; }
        
        /* Layouts */
        .text-center { text-align: center; }
        .max-w-4xl { max-width: 56rem; margin-left: auto; margin-right: auto; }
        .max-w-3xl { max-width: 48rem; margin-left: auto; margin-right: auto; }
        .max-w-6xl { max-width: 72rem; margin-left: auto; margin-right: auto; }
        .grid { display: grid; gap: 2rem; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .gap-12 { gap: 3rem; }

        /* Form */
        .form-input, .form-textarea { width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; }
        .form-input:focus, .form-textarea:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: var(--blue-500); box-shadow: 0 0 0 2px var(--blue-500); }
        .space-y-6 > * + * { margin-top: 1.5rem; }

        /* Specific Component Styles */
        .stats-icon-wrapper { width: 4rem; height: 4rem; background-image: linear-gradient(to bottom right, var(--blue-500), var(--green-500)); border-radius: 1rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); margin-bottom: 1rem; }
        .stats-icon { width: 2rem; height: 2rem; color: var(--white); }
        .feature-icon-wrapper { width: 4rem; height: 4rem; background-image: linear-gradient(to bottom right, var(--blue-500), var(--green-500)); border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: transform 0.3s ease; }
        .card:hover .feature-icon-wrapper { transform: scale(1.1); }
        .feature-icon { width: 2rem; height: 2rem; color: var(--white); }
        .pricing-card { position: relative; border-width: 2px; }
        .pricing-card-highlight { border-color: var(--blue-500); transform: scale(1.05); }
        .pricing-badge { position: absolute; top: -1rem; left: 50%; transform: translateX(-50%); background-image: linear-gradient(to right, var(--blue-600), var(--green-600)); color: var(--white); padding: 0.25rem 1rem; font-size: 0.875rem; font-weight: 500; border-radius: 9999px; }
        .testimonial-stars { display: flex; margin-bottom: 1rem; }
        .star-icon { width: 1.25rem; height: 1.25rem; color: var(--yellow-400); }
        
        /* Footer & Contact info */
        .footer-grid h4, .contact-info h3 { font-weight: 600; margin-bottom: 1rem; color: var(--white); }
        .footer-grid ul { list-style: none; }
        .footer-grid li { margin-bottom: 0.5rem; }
        .footer-grid a { color: var(--slate-300); text-decoration: none; transition: color 0.2s; }
        .footer-grid a:hover { color: var(--white); }
        .footer-bottom { border-top: 1px solid var(--slate-700); margin-top: 3rem; padding-top: 2rem; text-align: center; color: var(--slate-300); }
        .contact-info-item { display: flex; align-items: center; }
        .contact-icon-wrapper { width: 3rem; height: 3rem; background-color: var(--blue-600); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-right: 1rem; }
        .contact-icon { width: 1.5rem; height: 1.5rem; color: var(--white); }

        /* Responsive */
        @media (max-width: 1024px) {
            .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .grid-cols-2, .grid-cols-3 { grid-template-columns: 1fr; }
            .hero-buttons { flex-direction: column; }
            .footer-grid { grid-template-columns: repeat(2, 1fr); }
            .pricing-card-highlight { transform: scale(1); }
        }
        @media (max-width: 480px) {
            .footer-grid { grid-template-columns: 1fr; }
        }
        
    </style>
</head>
<body class="bg-gradient-to-br">

    <!-- Hero Section -->
    <section class="section-hero">
        <div class="hero-bg">
            <div class="bg-grid"></div>
            <div class="section-hero-content container">
                <div class="text-center max-w-4xl">
                    <span class="badge">🚀 Nova versão com IA avançada disponível</span>
                    <h1>FIRSTDOCY <span class="text-gradient">GED AI</span></h1>
                    <p style="font-size: 1.25rem; color: var(--slate-300); margin-bottom: 2rem; line-height: 1.6;">
                        A primeira plataforma de gestão documental com 
                        <span style="color: var(--white); font-weight: 600;">Inteligência Artificial integrada</span> do Brasil.
                        Transforme sua gestão de documentos físicos e digitais.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
                        <button class="btn btn-primary button-gradient">
                            Teste Grátis por 14 Dias
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                        <button class="btn btn-outline">
                            <svg class="btn-icon" style="margin-left: 0; margin-right: 0.5rem;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Assistir Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="section section-stats">
        <div class="container">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="text-center">
                    <div class="flex justify-center"><div class="stats-icon-wrapper"><svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="20" width="20" height="4" rx="2"/><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M12 12v8"/></svg></div></div>
                    <div style="font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.5rem;">340+</div>
                    <div style="color: var(--slate-600); font-weight: 500;">Empresas Atendidas</div>
                </div>
                <div class="text-center">
                    <div class="flex justify-center"><div class="stats-icon-wrapper"><svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg></div></div>
                    <div style="font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.5rem;">25.000+</div>
                    <div style="color: var(--slate-600); font-weight: 500;">Documentos Gerenciados</div>
                </div>
                <div class="text-center">
                    <div class="flex justify-center"><div class="stats-icon-wrapper"><svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
                    <div style="font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.5rem;">99.9%</div>
                    <div style="color: var(--slate-600); font-weight: 500;">Uptime Garantido</div>
                </div>
                <div class="text-center">
                    <div class="flex justify-center"><div class="stats-icon-wrapper"><svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div></div>
                    <div style="font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.5rem;">24 horas</div>
                    <div style="color: var(--slate-600); font-weight: 500;">Tempo de Setup</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="section section-features">
        <div class="container">
            <div class="text-center max-w-3xl">
                <h2>Tudo que sua empresa precisa para gerenciar documentos</h2>
                <p style="font-size: 1.25rem; line-height: 1.75rem; color: var(--slate-600); line-height: 1.6;">
                    Uma plataforma completa que une gestão eletrônica e física de documentos 
                    com o poder da inteligência artificial.
                </p>
            </div>
            <div style="margin-top: 4rem;" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg></div>
                        <h3>GED Inteligente</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Gestão eletrônica de documentos com IA para classificação automática e busca semântica.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="20" width="20" height="4" rx="2"/><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M12 12v8"/></svg></div>
                        <h3>CDOC Físico</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Controle de documentos físicos com endereçamento inteligente e rastreamento completo.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M20 12v4h-4"/><path d="m15 19-2-2-2 2"/><path d="M9 10.5h.01"/></svg></div>
                        <h3>IA Integrada</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Inteligência artificial para análise de conteúdo, classificação e suporte ao cliente.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                        <h3>Segurança Máxima</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Criptografia de ponta a ponta, backups automáticos e conformidade com LGPD.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="22" x2="18" y1="12" y2="12" /><line x1="6" x2="2" y1="12" y2="12" /><line x1="12" x2="12" y1="6" y2="2" /><line x1="12" x2="12" y1="22" y2="18" /></svg></div>
                        <h3>Multi-empresas</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Gerencie múltiplas empresas em uma única plataforma com isolamento total de dados.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="feature-icon-wrapper"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg></div>
                        <h3>Mobile Ready</h3>
                        <p style="color: var(--slate-600); line-height: 1.6;">Acesse seus documentos de qualquer lugar com nossos apps móveis nativos.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="section section-pricing">
        <div class="container">
            <div class="text-center max-w-3xl">
                <h2>Planos que crescem com sua empresa</h2>
                <p style="font-size: 1.25rem; color: var(--slate-600);">
                    Escolha o plano ideal para suas necessidades. Todos incluem suporte especializado.
                </p>
            </div>
            <div style="margin-top: 4rem;" class="grid md:grid-cols-3 gap-8 max-w-6xl">
                <div class="card pricing-card">
                    <div class="card-content">
                        <h3 class="text-center">Starter</h3>
                        <div class="text-center" style="margin-bottom: 1rem;">
                            <span style="font-size: 2.25rem; font-weight: 700; color: var(--slate-900);">R$ 340</span>
                            <span style="color: var(--slate-600); margin-left: 0.5rem;">/mês</span>
                        </div>
                        <p class="text-center" style="color: var(--slate-600); min-height: 48px;">Ideal para pequenas empresas que estão começando.</p>
                        <ul style="list-style: none; margin: 2rem 0; space-y-4">
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Até 2 usuários</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>GED básico (2 Departamentos)</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>CDOC (20 endereços)</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Assinatura em 10 docs</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>2GB de armazenamento</li>
                        </ul>
                        <button class="btn" style="width: 100%; background-color: var(--slate-900); color: var(--white);">Começar Agora</button>
                    </div>
                </div>
                 <div class="card pricing-card pricing-card-highlight">
                    <div class="pricing-badge">Recomendado</div>
                    <div class="card-content">
                        <h3 class="text-center">Professional</h3>
                        <div class="text-center" style="margin-bottom: 1rem;">
                            <span style="font-size: 2.25rem; font-weight: 700; color: var(--slate-900);">R$ 700</span>
                            <span style="color: var(--slate-600); margin-left: 0.5rem;">/mês</span>
                        </div>
                        <p class="text-center" style="color: var(--slate-600); min-height: 48px;">A escolha mais popular para empresas em crescimento.</p>
                        <ul style="list-style: none; margin: 2rem 0; space-y-4">
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Até 10 usuários</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>GED e CDOC completos</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>CRM completo e RH básico</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Branding personalizado</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>10GB de armazenamento</li>
                        </ul>
                        <button class="btn button-gradient" style="width: 100%; color: var(--white);">Mais Popular</button>
                    </div>
                </div>
                 <div class="card pricing-card">
                    <div class="card-content">
                        <h3 class="text-center">Enterprise</h3>
                        <div class="text-center" style="margin-bottom: 1rem;">
                            <span style="font-size: 2.25rem; font-weight: 700; color: var(--slate-900);">Consulte</span>
                            <span style="color: var(--slate-600); margin-left: 0.5rem;"></span>
                        </div>
                        <p class="text-center" style="color: var(--slate-600); min-height: 48px;">Solução completa para grandes empresas.</p>
                        <ul style="list-style: none; margin: 2rem 0; space-y-4">
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Usuários ilimitados</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Todos os módulos inclusos</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Integração Gupy e Multi-empresa</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Suporte 24/7 e API</li>
                            <li class="flex items-center"><svg class="star-icon" style="color: var(--green-500); margin-right: 0.75rem; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Armazenamento ilimitado</li>
                        </ul>
                        <button class="btn" style="width: 100%; background-color: var(--slate-900); color: var(--white);">Falar com Vendas</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section section-testimonials">
        <div class="container">
            <div class="text-center max-w-3xl">
                <h2>O que nossos clientes dizem</h2>
                <p style="font-size: 1.25rem; color: var(--slate-600);">
                    Empresas de todos os tamanhos confiam no FIRSTDOCY para suas operações críticas.
                </p>
            </div>
            <div style="margin-top: 4rem;" class="grid md:grid-cols-3 gap-8">
                <div class="card">
                    <div class="card-content">
                        <div class="testimonial-stars">
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p style="color: var(--slate-700); margin-bottom: 1.5rem; line-height: 1.6;">"O FIRSTDOCY revolucionou nossa gestão documental. A IA realmente faz a diferença na organização e busca de documentos."</p>
                        <div>
                            <div style="font-weight: 600; color: var(--slate-900);">Carlos Silva</div>
                            <div style="color: var(--slate-600);">CEO, Tech Solutions Ltda</div>
                        </div>
                    </div>
                </div>
                 <div class="card">
                    <div class="card-content">
                        <div class="testimonial-stars">
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p style="color: var(--slate-700); margin-bottom: 1.5rem; line-height: 1.6;">"A integração com nossa estrutura física (CDOC) foi perfeita. Agora sabemos exatamente onde cada documento está localizado."</p>
                        <div>
                            <div style="font-weight: 600; color: var(--slate-900);">Maria Santos</div>
                            <div style="color: var(--slate-600);">Gerente de Projetos, Construção & Engenharia</div>
                        </div>
                    </div>
                </div>
                 <div class="card">
                    <div class="card-content">
                        <div class="testimonial-stars">
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p style="color: var(--slate-700); margin-bottom: 1.5rem; line-height: 1.6;">"As propostas interativas aumentaram nossa taxa de conversão em 40%. O sistema de branding personalizado impressiona."</p>
                        <div>
                            <div style="font-weight: 600; color: var(--slate-900);">João Oliveira</div>
                            <div style="color: var(--slate-600);">Diretor Comercial, Consultoria Empresarial</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section section-contact">
        <div class="container">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-16">
                    <h2 style="color: var(--white);">Pronto para transformar sua gestão documental?</h2>
                    <p style="font-size: 1.25rem; color: var(--slate-300);">
                        Entre em contato conosco e descubra como o FIRSTDOCY pode revolucionar sua empresa.
                    </p>
                </div>
                <div class="grid md:grid-cols-2 gap-12">
                    <div class="contact-info">
                        <h3>Fale Conosco</h3>
                        <div class="space-y-6">
                            <div class="contact-info-item">
                                <div class="contact-icon-wrapper"><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                                <div>
                                    <div style="color: var(--white); font-weight: 500;">Telefone</div>
                                    <div style="color: var(--slate-300);">+55 (11) 99999-9999</div>
                                </div>
                            </div>
                            <div class="contact-info-item">
                                <div class="contact-icon-wrapper"><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
                                <div>
                                    <div style="color: var(--white); font-weight: 500;">Email</div>
                                    <div style="color: var(--slate-300);">contato@firstdocy.com</div>
                                </div>
                            </div>
                             <div class="contact-info-item">
                                <div class="contact-icon-wrapper"><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                                <div>
                                    <div style="color: var(--white); font-weight: 500;">Endereço</div>
                                    <div style="color: var(--slate-300);">São Paulo, SP - Brasil</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="background-color: var(--white);">
                        <div class="card-content">
                            <form id="contact-form" class="space-y-6">
                                <div><input class="form-input" name="name" placeholder="Seu nome" required /></div>
                                <div><input class="form-input" name="email" type="email" placeholder="Seu email" required /></div>
                                <div><input class="form-input" name="company" placeholder="Nome da empresa" required /></div>
                                <div><input class="form-input" name="phone" placeholder="Telefone" /></div>
                                <div><textarea class="form-textarea" name="message" placeholder="Como podemos ajudar?" rows="4"></textarea></div>
                                <button type="submit" class="btn button-gradient" style="width: 100%; color: var(--white);">Enviar Mensagem</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="section-footer">
        <div class="container">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3>FIRSTDOCY</h3>
                    <p style="color: var(--slate-300);">A plataforma mais avançada de gestão documental com IA do Brasil.</p>
                </div>
                <div>
                    <h4>Produto</h4>
                    <ul>
                        <li><a href="#">GED Inteligente</a></li>
                        <li><a href="#">CDOC Físico</a></li>
                        <li><a href="#">Propostas IA</a></li>
                        <li><a href="#">CRM Integrado</a></li>
                        <li><a href="#">RH Completo</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Empresa</h4>
                    <ul>
                        <li><a href="#">Sobre Nós</a></li>
                        <li><a href="#">Carreiras</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Parceiros</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Suporte</h4>
                    <ul>
                        <li><a href="#">Central de Ajuda</a></li>
                        <li><a href="#">Documentação</a></li>
                        <li><a href="#">API</a></li>
                        <li><a href="#">Status do Sistema</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 FIRSTDOCY. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contact-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const submitButton = form.querySelector('button[type="submit"]');
                    const originalText = submitButton.textContent;
                    submitButton.disabled = true;
                    submitButton.textContent = 'Enviando...';
                    
                    // Simular envio
                    setTimeout(() => {
                        alert('Mensagem Enviada! Entraremos em contato em breve. Obrigado!');
                        form.reset();
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 1000);
                });
            }
        });
    </script>
</body>
</html>
  `;

  const handleDownloadHtml = () => {
    const blob = new Blob([fullHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "✅ Download Iniciado",
      description: "O arquivo index.html está sendo baixado.",
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Exportar Site Institucional
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Guia e código para implantar o site em WordPress ou qualquer outro servidor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => copyToClipboard(fullHtmlCode, 'HTML Completo')}
            variant="outline"
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copiar Código
          </Button>
          <Button 
            onClick={handleDownloadHtml}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar index.html
          </Button>
        </div>
      </div>

      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Exportação Autônoma</AlertTitle>
        <AlertDescription>
          O código fornecido é um arquivo HTML único que contém todo o CSS e JavaScript necessários. 
          Ele é 100% independente e não possui nenhuma conexão com a plataforma base44.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookUser className="w-4 h-4" />
            📖 Guia de Implantação
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            📄 Código Fonte
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Implantação (WordPress ou Outros)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                <FolderArchive className="h-4 w-4" />
                <AlertTitle>Estrutura de Arquivos Recomendada</AlertTitle>
                <AlertDescription>
                  Para uma melhor organização, recomendamos a seguinte estrutura. Você pode criar um arquivo <strong>.zip</strong> com esta organização para facilitar o upload.
                  <pre className="mt-2 bg-blue-100 p-2 rounded text-sm">
                    {`meu-site/
├── index.html       (faça o download deste arquivo)
└── assets/          (crie esta pasta)
    ├── logo.svg
    └── ...outras imagens`}
                  </pre>
                </AlertDescription>
              </Alert>

              <h3 className="mt-6">Opção 1: Servidor Web Genérico (Recomendado)</h3>
              <p>Esta é a forma mais simples de colocar o site no ar em qualquer serviço de hospedagem (Hostgator, GoDaddy, Vercel, etc.).</p>
              <ol>
                <li><strong>Baixe o Arquivo Principal:</strong> Clique no botão "Baixar index.html" para obter o arquivo principal do site.</li>
                <li><strong>Crie a Pasta de Ativos:</strong> Em seu computador, crie uma pasta chamada <code>assets</code>.</li>
                <li><strong>Adicione Suas Imagens:</strong> Coloque o logo da sua empresa e outros ícones ou imagens que desejar dentro da pasta <code>assets</code>.</li>
                <li><strong>Atualize o Código (Opcional):</strong> Se você usar nomes de arquivo diferentes de <code>assets/logo.svg</code>, lembre-se de atualizá-los no <code>index.html</code>.</li>
                <li><strong>Faça o Upload:</strong> Usando um cliente FTP (como FileZilla) ou o painel de controle da sua hospedagem, faça o upload do arquivo <code>index.html</code> e da pasta <code>assets</code> para o diretório raiz do seu site (geralmente <code>public_html</code> ou <code>www</code>).</li>
              </ol>

              <h3 className="mt-6">Opção 2: Adicionar ao WordPress</h3>
              <p>Este método permite adicionar o site como uma página dentro de uma instalação existente do WordPress.</p>
              <ol>
                <li><strong>Acesse o Painel do WordPress:</strong> Faça login no seu site WordPress.</li>
                <li><strong>Faça Upload das Imagens:</strong> Vá para a <strong>Biblioteca de Mídia</strong> do WordPress e faça o upload do seu logo e outras imagens. Copie a URL de cada imagem.</li>
                <li><strong>Copie o Código:</strong> Volte para esta página, vá para a aba "Código Fonte" e copie todo o conteúdo.</li>
                <li><strong>Edite o Código:</strong> Em um editor de texto, cole o código. Substitua os caminhos relativos das imagens (ex: <code>assets/logo.svg</code>) pelas URLs completas que você copiou da Biblioteca de Mídia.</li>
                <li><strong>Crie uma Nova Página:</strong> No menu lateral do WordPress, vá em <code>Páginas > Adicionar nova</code>.</li>
                <li><strong>Mude para o Editor de Código:</strong> No canto superior direito da tela de edição, clique nos três pontinhos (⋮) e selecione <strong>Editor de código</strong>. Isso é muito importante para que o WordPress não quebre o código.</li>
                <li><strong>Cole o Código Modificado:</strong> Cole o código HTML (já com as URLs das imagens atualizadas) na área de texto.</li>
                <li><strong>Template da Página:</strong> Na barra lateral de configurações da página, procure por "Atributos da página" ou "Modelo". Se o seu tema oferecer uma opção como <strong>"Página em branco"</strong>, <strong>"Canvas"</strong>, ou <strong>"Largura total sem cabeçalho/rodapé"</strong>, selecione-a para evitar conflitos de layout.</li>
                <li><strong>Publique:</strong> Clique em "Publicar" para colocar a página no ar.</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code" className="mt-4">
          <CodeBlock 
            code={fullHtmlCode} 
            language="html" 
            title="index.html"
            onCopy={() => copyToClipboard(fullHtmlCode, 'HTML Completo')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}