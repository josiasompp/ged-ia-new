
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Shield, Lock, SlidersHorizontal, FileBox, MessageSquare, Bot } from 'lucide-react';
import ModuleAccessManager from '../components/settings/ModuleAccessManager';
import SystemVersion from '../components/security/SystemVersion';
import MasterCdocManager from '../components/settings/MasterCdocManager'; // Changed from CdocStructureManager
import ChecklistSetupManager from '../components/settings/ChecklistSetupManager';

export default function Settings() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold">
                        <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
                            Configurações do Sistema
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Configure parâmetros globais do FIRSTDOCY GED AI
                    </p>
                </div>
            </div>

            <Tabs defaultValue="access" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="general" className="gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="access" className="gap-2">
                        <Lock className="w-4 h-4" />
                        Módulos
                    </TabsTrigger>
                    <TabsTrigger value="checklist" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Checklist
                    </TabsTrigger>
                    <TabsTrigger value="support" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Suporte
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-2">
                        <Bot className="w-4 h-4" />
                        IA
                    </TabsTrigger>
                    <TabsTrigger value="cdoc" className="gap-2">
                        <FileBox className="w-4 h-4" />
                        CDOC Master {/* Changed label */}
                    </TabsTrigger>
                    <TabsTrigger value="version" className="gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        Versão
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações Gerais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2">🔒 Segurança Aprimorada</h4>
                                    <p className="text-sm text-blue-700">
                                        Sistema agora requer pré-cadastro de usuários. Apenas emails autorizados podem acessar a plataforma.
                                    </p>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-800 mb-2">🤖 Suporte com IA</h4>
                                    <p className="text-sm text-green-700">
                                        Novo sistema de suporte ao cliente integrado com inteligência artificial para respostas contextuais.
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h4 className="font-medium text-purple-800 mb-2">☁️ Deploy AWS Otimizado</h4>
                                    <p className="text-sm text-purple-700">
                                        Scripts de implantação na AWS atualizados com as melhores práticas de segurança e performance.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="access">
                    <ModuleAccessManager />
                </TabsContent>

                <TabsContent value="checklist">
                    <ChecklistSetupManager />
                </TabsContent>
                
                <TabsContent value="support">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Suporte ao Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                                    <h3 className="font-semibold text-lg mb-4">🎯 Sistema de Suporte Inteligente</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                                <span><strong>Chat em Tempo Real:</strong> Comunicação direta cliente-gestor</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-green-600" />
                                                <span><strong>IA Contextual:</strong> Respostas baseadas no perfil do usuário</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-red-600" />
                                                <span><strong>Acesso Seguro:</strong> Apenas gestores podem responder</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-purple-600" />
                                                <span><strong>Dados Protegidos:</strong> Respostas baseadas em permissões</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileBox className="w-4 h-4 text-orange-600" />
                                                <span><strong>Base de Conhecimento:</strong> Sistema FIRSTDOCY completo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">⚙️ Configuração Automática</h4>
                                    <p className="text-sm text-yellow-700">
                                        O sistema de suporte está ativo automaticamente. Clientes podem acessar via "Meu Suporte" 
                                        e gestores via "Suporte ao Cliente" no menu principal.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Inteligência Artificial</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
                                    <h3 className="font-semibold text-lg mb-4">🧠 IA Integrada ao Sistema</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-purple-800">Funcionalidades Ativas:</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Classificação automática de documentos</li>
                                                <li>• Busca semântica avançada</li>
                                                <li>• Suporte ao cliente contextual</li>
                                                <li>• Análise de conteúdo de propostas</li>
                                                <li>• Extração de dados de documentos</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-blue-800">Segurança da IA:</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Respostas baseadas em permissões</li>
                                                <li>• Dados da empresa protegidos</li>
                                                <li>• Contexto limitado ao usuário</li>
                                                <li>• Auditoria de todas as interações</li>
                                                <li>• Escalação para humanos quando necessário</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-medium text-red-800 mb-2">🛡️ Proteção de Dados</h4>
                                    <p className="text-sm text-red-700">
                                        A IA nunca expõe dados confidenciais ou informações de outras empresas. 
                                        Cada resposta é contextualizada apenas com dados que o usuário tem permissão para ver.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cdoc">
                    <MasterCdocManager /> {/* Changed component */}
                </TabsContent>

                <TabsContent value="version">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações da Versão</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SystemVersion showDetails={true} />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Novidades desta Versão v1.2.0</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-800 mb-2">🔒 Segurança Aprimorada</h4>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• Pré-cadastro obrigatório de usuários</li>
                                        <li>• Validação de acesso por empresa</li>
                                        <li>• Tela de acesso negado para não autorizados</li>
                                        <li>• Log de tentativas de acesso não autorizado</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2">🤖 Suporte com IA</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Chat em tempo real cliente-gestor</li>
                                        <li>• IA contextual para respostas automáticas</li>
                                        <li>• Base de conhecimento específica do sistema</li>
                                        <li>• Escalação inteligente para humanos</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h4 className="font-medium text-purple-800 mb-2">☁️ Deploy AWS</h4>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        <li>• Scripts de implantação atualizados</li>
                                        <li>• Configurações de segurança aprimoradas</li>
                                        <li>• Monitoramento e logs melhorados</li>
                                        <li>• Backup automático configurado</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h4 className="font-medium text-orange-800 mb-2">📚 Documentação</h4>
                                    <ul className="text-sm text-orange-700 space-y-1">
                                        <li>• Guias de uso atualizados</li>
                                        <li>• Documentação técnica expandida</li>
                                        <li>• Exemplos práticos adicionados</li>
                                        <li>• FAQ do suporte implementado</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
