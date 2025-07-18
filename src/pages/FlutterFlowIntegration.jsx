
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Copy, 
  ExternalLink, 
  Smartphone, 
  Code, 
  Database, 
  Globe, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Bell,
  BarChart3
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/api/entities';

export default function FlutterFlowIntegration() {
  const [currentUser, setCurrentUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [integrationConfig, setIntegrationConfig] = useState({
    enabled: false,
    api_base_url: '',
    webhook_secret: '',
    allowed_domains: [],
    rate_limit: 1000,
    auth_method: 'api_key'
  });

  useEffect(() => {
    loadCurrentUser();
    loadIntegrationData();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadIntegrationData = async () => {
    // Aqui você carregaria as configurações de integração do backend
    // Por ora, usando dados mockados
    setApiKeys([
      {
        id: 1,
        name: 'FlutterFlow App',
        key: 'ff_key_' + Math.random().toString(36).substr(2, 16),
        permissions: ['read', 'write'],
        created_at: new Date().toISOString(),
        last_used: null
      }
    ]);
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: 'FlutterFlow App ' + (apiKeys.length + 1),
      key: 'ff_key_' + Math.random().toString(36).substr(2, 24),
      permissions: ['read', 'write'],
      created_at: new Date().toISOString(),
      last_used: null
    };
    setApiKeys([...apiKeys, newKey]);
    toast({
      title: "API Key gerada!",
      description: "Nova chave de API criada com sucesso."
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`
    });
  };

  const flutterFlowCode = `
// FlutterFlow - Integração FIRSTDOCY GED AI
// Adicione este código nas suas Custom Actions

import 'dart:convert';
import 'package:http/http.dart' as http;

class FirstdocyAPI {
  static const String baseUrl = 'https://sua-instancia.firstdocy.com/api';
  static const String apiKey = 'SUA_API_KEY_AQUI';
  
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer \$apiKey',
    'X-FlutterFlow-Integration': 'true'
  };

  // Listar documentos
  static Future<List<dynamic>> getDocuments({
    String? companyId,
    String? departmentId,
    int limit = 20
  }) async {
    final url = '\$baseUrl/documents';
    final queryParams = <String, String>{
      'limit': limit.toString(),
      if (companyId != null) 'company_id': companyId,
      if (departmentId != null) 'department_id': departmentId,
    };
    
    final uri = Uri.parse(url).replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: headers);
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar documentos: \${response.statusCode}');
    }
  }

  // Upload de documento
  static Future<Map<String, dynamic>> uploadDocument({
    required String title,
    required String filePath,
    required String companyId,
    required String departmentId,
    required String directoryId,
    String category = 'outros'
  }) async {
    final uri = Uri.parse('\$baseUrl/documents/upload');
    final request = http.MultipartRequest('POST', uri);
    
    request.headers.addAll(headers);
    request.fields.addAll({
      'title': title,
      'company_id': companyId,
      'department_id': departmentId,
      'directory_id': directoryId,
      'category': category,
    });
    
    request.files.add(await http.MultipartFile.fromPath('file', filePath));
    
    final response = await request.send();
    final responseBody = await response.stream.bytesToString();
    
    if (response.statusCode == 200) {
      return json.decode(responseBody);
    } else {
      throw Exception('Erro no upload: \${response.statusCode}');
    }
  }

  // Criar proposta
  static Future<Map<String, dynamic>> createProposal({
    required String title,
    required String clientName,
    required String clientEmail,
    required String companyId,
    required double totalValue,
    String category = 'servicos'
  }) async {
    final url = '\$baseUrl/proposals';
    final body = json.encode({
      'title': title,
      'client_name': clientName,
      'client_email': clientEmail,
      'company_id': companyId,
      'total_value': totalValue,
      'category': category,
      'status': 'rascunho'
    });
    
    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: body
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao criar proposta: \${response.statusCode}');
    }
  }

  // Listar usuários da empresa
  static Future<List<dynamic>> getCompanyUsers(String companyId) async {
    final url = '\$baseUrl/users?company_id=\$companyId';
    final response = await http.get(Uri.parse(url), headers: headers);
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar usuários: \${response.statusCode}');
    }
  }

  // Criar usuário
  static Future<Map<String, dynamic>> inviteUser({
    required String email,
    required String fullName,
    required String companyId,
    String role = 'user'
  }) async {
    final url = '\$baseUrl/users/invite';
    final body = json.encode({
      'email': email,
      'full_name': fullName,
      'company_id': companyId,
      'role': role
    });
    
    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: body
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao convidar usuário: \${response.statusCode}');
    }
  }
}

// Exemplo de uso em uma tela FlutterFlow
class DocumentsScreen extends StatefulWidget {
  @override
  _DocumentsScreenState createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  List<dynamic> documents = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadDocuments();
  }

  Future<void> loadDocuments() async {
    try {
      final docs = await FirstdocyAPI.getDocuments(
        companyId: FFAppState().currentCompanyId,
        limit: 50
      );
      setState(() {
        documents = docs;
        isLoading = false;
      });
    } catch (e) {
      print('Erro ao carregar documentos: \$e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Documentos')),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: documents.length,
              itemBuilder: (context, index) {
                final doc = documents[index];
                return ListTile(
                  title: Text(doc['title']),
                  subtitle: Text(doc['category']),
                  trailing: Icon(Icons.description),
                  onTap: () {
                    // Navegar para detalhes do documento
                  },
                );
              },
            ),
    );
  }
}
`;

  const webhookExample = `
// Webhook para receber notificações do FIRSTDOCY no FlutterFlow

// 1. Configure um Cloud Function no FlutterFlow:
import 'package:cloud_functions/cloud_functions.dart';

// 2. Endpoint para receber webhooks
@HttpFunction()
Future<void> firstdocyWebhook(HttpRequest request) async {
  if (request.method == 'POST') {
    final body = await request.body;
    final data = json.decode(body);
    
    // Verificar assinatura do webhook
    final signature = request.headers['x-firstdocy-signature'];
    if (!verifyWebhookSignature(body, signature)) {
      request.response.statusCode = 401;
      return;
    }
    
    // Processar evento
    switch (data['event_type']) {
      case 'document_uploaded':
        await handleDocumentUploaded(data);
        break;
      case 'proposal_accepted':
        await handleProposalAccepted(data);
        break;
      case 'user_invited':
        await handleUserInvited(data);
        break;
    }
    
    request.response.statusCode = 200;
    request.response.write('OK');
  }
}

bool verifyWebhookSignature(String body, String signature) {
  // Implementar verificação de assinatura HMAC
  final secret = 'SEU_WEBHOOK_SECRET';
  final expectedSignature = generateHMAC(body, secret);
  return signature == expectedSignature;
}
`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Integração FlutterFlow
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Integre seu app FlutterFlow com o FIRSTDOCY GED AI
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile Ready
        </Badge>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Smartphone className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Integração Completa</AlertTitle>
        <AlertDescription className="text-blue-700">
          Conecte seu app FlutterFlow ao FIRSTDOCY através de APIs REST, webhooks e autenticação segura.
          Acesse documentos, propostas, usuários e todas as funcionalidades diretamente do seu app mobile.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="code">Código Flutter</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="examples">Exemplos</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Integração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="integration-enabled">Habilitar Integração FlutterFlow</Label>
                  <Switch
                    id="integration-enabled"
                    checked={integrationConfig.enabled}
                    onCheckedChange={(checked) => 
                      setIntegrationConfig(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-base-url">URL Base da API</Label>
                  <Input
                    id="api-base-url"
                    value={integrationConfig.api_base_url}
                    onChange={(e) => 
                      setIntegrationConfig(prev => ({ ...prev, api_base_url: e.target.value }))
                    }
                    placeholder="https://sua-instancia.firstdocy.com/api"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Limite de Requisições por Hora</Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={integrationConfig.rate_limit}
                    onChange={(e) => 
                      setIntegrationConfig(prev => ({ ...prev, rate_limit: parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-method">Método de Autenticação</Label>
                  <Select
                    value={integrationConfig.auth_method}
                    onValueChange={(value) => 
                      setIntegrationConfig(prev => ({ ...prev, auth_method: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="jwt">JWT Token</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Chaves de API</h3>
              <Button onClick={generateApiKey} className="gap-2">
                <Zap className="w-4 h-4" />
                Gerar Nova Chave
              </Button>
            </div>

            <div className="grid gap-4">
              {apiKeys.map((key) => (
                <Card key={key.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{key.name}</h4>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {key.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.key, 'API Key')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          {key.permissions.map((perm) => (
                            <Badge key={perm} variant="outline">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          Criada em: {new Date(key.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Revogar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Código Flutter para FlutterFlow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Copie e cole este código nas suas Custom Actions do FlutterFlow para integrar com o FIRSTDOCY.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="relative">
                    <pre className="p-4 bg-gray-900 text-white rounded-lg text-sm overflow-auto max-h-96">
                      <code>{flutterFlowCode}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-white hover:bg-gray-700"
                      onClick={() => copyToClipboard(flutterFlowCode, 'Código Flutter')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configuração de Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Configure webhooks para receber notificações em tempo real no seu app FlutterFlow.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL do Webhook FlutterFlow</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-flutterflow-app.com/webhook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Secret do Webhook</Label>
                    <Input
                      id="webhook-secret"
                      type="password"
                      placeholder="Chave secreta para verificação"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Eventos para Notificar</Label>
                      <div className="space-y-2">
                        {['document_uploaded', 'proposal_accepted', 'user_invited', 'task_completed'].map((event) => (
                          <div key={event} className="flex items-center space-x-2">
                            <input type="checkbox" id={event} />
                            <Label htmlFor={event} className="text-sm">{event}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Code className="h-4 w-4" />
                    <AlertTitle>Exemplo de Webhook Handler</AlertTitle>
                    <AlertDescription>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        <code>{webhookExample}</code>
                      </pre>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Upload de Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Permite que usuários do app mobile façam upload de documentos diretamente para o GED.
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800">✓ Suporte a múltiplos formatos</Badge>
                    <Badge className="bg-blue-100 text-blue-800">✓ Categorização automática</Badge>
                    <Badge className="bg-purple-100 text-purple-800">✓ Compressão de imagens</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    Sincronização Offline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Cache local de dados com sincronização automática quando online.
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-orange-100 text-orange-800">✓ Cache inteligente</Badge>
                    <Badge className="bg-red-100 text-red-800">✓ Sync em background</Badge>
                    <Badge className="bg-indigo-100 text-indigo-800">✓ Resolução de conflitos</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    Autenticação Segura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Integração com o sistema de autenticação do FIRSTDOCY via OAuth2 ou JWT.
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-red-100 text-red-800">✓ OAuth2 / JWT</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">✓ Biometria</Badge>
                    <Badge className="bg-gray-100 text-gray-800">✓ Session management</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Notificações push para eventos importantes como aprovações e novos documentos.
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-purple-100 text-purple-800">✓ Firebase FCM</Badge>
                    <Badge className="bg-teal-100 text-teal-800">✓ Notificações rich</Badge>
                    <Badge className="bg-pink-100 text-pink-800">✓ Deep linking</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recursos Disponíveis para Integração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">✓ Módulos Disponíveis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• GED (Gestão de Documentos)</li>
                      <li>• Propostas Comerciais</li>
                      <li>• CRM Integrado</li>
                      <li>• RH e Admissões</li>
                      <li>• Controle Físico (CDOC)</li>
                      <li>• Assinaturas Digitais</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">📱 Funcionalidades Mobile</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Upload via câmera</li>
                      <li>• Visualização offline</li>
                      <li>• Assinatura digital</li>
                      <li>• Chat com suporte</li>
                      <li>• Notificações push</li>
                      <li>• Sincronização automática</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">🔧 APIs Disponíveis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• REST API completa</li>
                      <li>• Webhooks em tempo real</li>
                      <li>• GraphQL (em breve)</li>
                      <li>• WebSocket para chat</li>
                      <li>• Endpoints especializados</li>
                      <li>• Rate limiting inteligente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
