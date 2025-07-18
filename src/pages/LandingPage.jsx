import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  FileText, 
  Shield, 
  Clock,
  Building2,
  Zap,
  Globe,
  Smartphone,
  Bot,
  Mail,
  Phone,
  MapPin,
  Play,
  Award,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Gestão Eletrônica de Documentos com Inteligência Artificial";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem Enviada!",
        description: "Entraremos em contato em breve. Obrigado!",
      });
      
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'R$ 340',
      period: '/mês',
      description: 'Ideal para pequenas empresas que estão começando',
      features: [
        'Até 2 usuários',
        'GED básico (2 Departamentos – 50 Diretórios)',
        'CDOC (20 endereços físicos)',
        'Propostas básicas',
        'Assinatura em 10 documentos',
        'Suporte via chat',
        '2GB de armazenamento'
      ],
      highlight: false,
      cta: 'Começar Agora'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'R$ 700',
      period: '/mês',
      description: 'A escolha mais popular para empresas em crescimento',
      features: [
        'Até 10 usuários',
        'GED completo (10 Departamentos – 100 Diretórios)',
        'CDOC completo (50 endereços físicos)',
        'Propostas interativas + IA',
        'CRM completo',
        'RH básico',
        'Ordens de serviço',
        'Assinatura em 50 documentos',
        'Suporte prioritário',
        '10GB de armazenamento',
        'Branding personalizado'
      ],
      highlight: true,
      cta: 'Mais Popular',
      badge: 'Recomendado'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Consulte',
      period: '/mês',
      description: 'Solução completa para grandes empresas',
      features: [
        'Usuários ilimitados',
        'Todos os módulos inclusos',
        'Assinatura em documentos ilimitada',
        'Gestão de exames periódicos - ASOs',
        'Integração Gupy',
        'Multi-empresas',
        'API personalizada',
        'Relatórios avançados',
        'Suporte 24/7',
        'Armazenamento ilimitado',
        'Treinamento incluso',
      ],
      highlight: false,
      cta: 'Falar com Vendas'
    }
  ];

  const stats = [
    { number: '340+', label: 'Empresas Atendidas', icon: Building2 },
    { number: '25.000+', label: 'Documentos Gerenciados de Funcionarios', icon: FileText },
    { number: '99.9%', label: 'Uptime Garantido', icon: Shield },
    { number: '24 horas', label: 'Tempo de Setup', icon: Clock }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "Tech Solutions Ltda",
      role: "CEO",
      content: "O FIRSTDOCY revolucionou nossa gestão documental. A IA realmente faz a diferença na organização e busca de documentos.",
      rating: 5
    },
    {
      name: "Maria Santos",
      company: "Construção & Engenharia",
      role: "Gerente de Projetos",
      content: "A integração com nossa estrutura física (CDOC) foi perfeita. Agora sabemos exatamente onde cada documento está localizado.",
      rating: 5
    },
    {
      name: "João Oliveira",
      company: "Consultoria Empresarial",
      role: "Diretor Comercial",
      content: "As propostas interativas aumentaram nossa taxa de conversão em 40%. O sistema de branding personalizado impressiona nossos clientes.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "GED Inteligente",
      description: "Gestão eletrônica de documentos com IA para classificação automática e busca semântica."
    },
    {
      icon: Building2,
      title: "CDOC Físico",
      description: "Controle de documentos físicos com endereçamento inteligente e rastreamento completo."
    },
    {
      icon: Bot,
      title: "IA Integrada",
      description: "Inteligência artificial para análise de conteúdo, classificação e suporte ao cliente."
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Criptografia de ponta a ponta, backups automáticos e conformidade com LGPD."
    },
    {
      icon: Globe,
      title: "Multi-empresas",
      description: "Gerencie múltiplas empresas em uma única plataforma com isolamento total de dados."
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Acesse seus documentos de qualquer lugar com nossos apps móveis nativos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
                🚀 Nova versão com IA avançada disponível
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                FIRSTDOCY
                <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  GED AI
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                A primeira plataforma de gestão documental com 
                <span className="text-white font-semibold"> Inteligência Artificial integrada</span> do Brasil.
                Transforme sua gestão de documentos físicos e digitais.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-xl">
                  Teste Grátis por 14 Dias
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
                  <Play className="mr-2 w-5 h-5" />
                  Assistir Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Tudo que sua empresa precisa para gerenciar documentos
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Uma plataforma completa que une gestão eletrônica e física de documentos 
              com o poder da inteligência artificial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Planos que crescem com sua empresa
            </h2>
            <p className="text-xl text-slate-600">
              Escolha o plano ideal para suas necessidades. Todos incluem suporte especializado.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.highlight ? 'border-blue-500 scale-105' : 'border-slate-200'}`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-1 text-sm font-medium">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 font-semibold ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-slate-600">
              Empresas de todos os tamanhos confiam no FIRSTDOCY para suas operações críticas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600">{testimonial.role}</div>
                    <div className="text-blue-600 font-medium">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">
                Pronto para transformar sua gestão documental?
              </h2>
              <p className="text-xl text-slate-300">
                Entre em contato conosco e descubra como o FIRSTDOCY pode revolucionar sua empresa.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Fale Conosco</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Telefone</div>
                      <div className="text-slate-300">+55 (11) 99999-9999</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Email</div>
                      <div className="text-slate-300">contato@firstdocy.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Endereço</div>
                      <div className="text-slate-300">São Paulo, SP - Brasil</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Seu email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Nome da empresa"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Como podemos ajudar?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">FIRSTDOCY</h3>
              <p className="text-slate-300 mb-4">
                A plataforma mais avançada de gestão documental com IA do Brasil.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-300">
                <li>GED Inteligente</li>
                <li>CDOC Físico</li>
                <li>Propostas IA</li>
                <li>CRM Integrado</li>
                <li>RH Completo</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Sobre Nós</li>
                <li>Carreiras</li>
                <li>Blog</li>
                <li>Parceiros</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>API</li>
                <li>Status do Sistema</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-300">
            <p>&copy; 2024 FIRSTDOCY. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}