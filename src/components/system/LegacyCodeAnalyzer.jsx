import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Database, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Download,
  Zap
} from 'lucide-react';

export default function LegacyCodeAnalyzer() {
  const [inputCode, setInputCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    // Simular análise de código (na realidade seria enviado para o backend/IA)
    setTimeout(() => {
      const mockAnalysis = {
        detectedFramework: 'Laravel',
        entities: [
          {
            name: 'User',
            fields: ['name', 'email', 'role', 'company_id'],
            relationships: ['belongsTo Company'],
            validations: ['email required', 'role in admin,user'],
            businessRules: ['canAccessDocument based on company_id or admin role']
          },
          {
            name: 'Document',
            fields: ['title', 'category', 'file_path', 'company_id', 'uploaded_by'],
            relationships: ['belongsTo User', 'belongsTo Company'],
            validations: ['title required max:255', 'file mimes:pdf,doc,docx max:10240'],
            businessRules: ['category must be contract,invoice,report', 'auto-assign company_id from user']
          }
        ],
        permissions: [
          'Document access restricted by company_id',
          'Admin role has global access',
          'File upload size limit: 10MB'
        ],
        apis: [
          {
            endpoint: 'POST /documents',
            functionality: 'Upload document with validation and storage',
            requiredFields: ['title', 'file', 'category']
          }
        ],
        convertedEntities: {
          User: {
            "name": "User",
            "type": "object",
            "properties": {
              "company_id": {"type": "string", "description": "ID da empresa"},
              "department": {"type": "string", "description": "Departamento"},
              "position": {"type": "string", "description": "Cargo"},
              "phone": {"type": "string", "description": "Telefone"},
              "permissions": {"type": "array", "items": {"type": "string"}},
              "is_active": {"type": "string", "enum": ["ativo", "inativo", "pausado"], "default": "ativo"}
            }
          },
          Document: {
            "name": "Document",
            "type": "object", 
            "properties": {
              "company_id": {"type": "string", "description": "ID da empresa"},
              "title": {"type": "string", "description": "Título do documento"},
              "category": {"type": "string", "enum": ["contract", "invoice", "report"], "description": "Categoria"},
              "file_url": {"type": "string", "description": "URL do arquivo"},
              "file_size": {"type": "number", "description": "Tamanho em bytes"},
              "access_level": {"type": "string", "enum": ["publico", "departamento", "restrito"], "default": "departamento"}
            }
          }
        }
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Analisador de Código Legacy
        </h1>
        <p className="text-gray-600">
          Cole seu código Laravel, PHP, JavaScript ou outros frameworks para extrair regras de negócio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Código do Sistema Legacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Cole aqui o código do seu sistema Laravel, Controllers, Models, etc..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <Button 
              onClick={analyzeCode} 
              disabled={!inputCode || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analisando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analisar Código
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Resultado da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="text-center py-12 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Cole e analise o código para ver os resultados</p>
              </div>
            ) : (
              <Tabs defaultValue="entities" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="entities">Entidades</TabsTrigger>
                  <TabsTrigger value="rules">Regras</TabsTrigger>
                  <TabsTrigger value="apis">APIs</TabsTrigger>
                  <TabsTrigger value="conversion">Conversão</TabsTrigger>
                </TabsList>

                <TabsContent value="entities" className="space-y-4">
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      Framework detectado: <Badge>{analysisResult.detectedFramework}</Badge>
                    </AlertDescription>
                  </Alert>
                  
                  {analysisResult.entities.map((entity, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{entity.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Campos:</strong> {entity.fields.join(', ')}
                          </div>
                          <div>
                            <strong>Relacionamentos:</strong> {entity.relationships.join(', ')}
                          </div>
                          <div>
                            <strong>Validações:</strong> {entity.validations.join(', ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="rules" className="space-y-4">
                  <h4 className="font-semibold">Regras de Negócio Identificadas:</h4>
                  {analysisResult.permissions.map((rule, index) => (
                    <Alert key={index} className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {rule}
                      </AlertDescription>
                    </Alert>
                  ))}
                </TabsContent>

                <TabsContent value="apis" className="space-y-4">
                  {analysisResult.apis.map((api, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{api.endpoint}</Badge>
                        </div>
                        <p className="text-sm mb-2">{api.functionality}</p>
                        <div className="text-sm text-gray-600">
                          <strong>Campos obrigatórios:</strong> {api.requiredFields.join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="conversion" className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Entidades convertidas para o formato base44:
                    </AlertDescription>
                  </Alert>
                  
                  {Object.entries(analysisResult.convertedEntities).map(([name, schema]) => (
                    <Card key={name}>
                      <CardHeader>
                        <CardTitle className="text-lg">{name}.json</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto">
                          {JSON.stringify(schema, null, 2)}
                        </pre>
                        <Button 
                          className="mt-2" 
                          size="sm" 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(schema, null, 2))}
                        >
                          Copiar Schema
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Example Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Código Laravel para Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
{`<?php
// app/Models/User.php
class User extends Model {
    protected $fillable = ['name', 'email', 'role', 'company_id'];
    
    public function company() {
        return $this->belongsTo(Company::class);
    }
    
    public function canAccessDocument($document) {
        return $this->company_id === $document->company_id 
               || $this->role === 'admin';
    }
}

// app/Http/Controllers/DocumentController.php
class DocumentController extends Controller {
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|max:255',
            'file' => 'required|mimes:pdf,doc,docx|max:10240',
            'category' => 'required|in:contract,invoice,report'
        ]);
        
        $document = Document::create([
            'title' => $request->title,
            'category' => $request->category,
            'company_id' => auth()->user()->company_id
        ]);
        
        return response()->json($document);
    }
}`}
          </pre>
          <Button 
            className="mt-2" 
            variant="outline"
            onClick={() => setInputCode(`<?php
// app/Models/User.php
class User extends Model {
    protected $fillable = ['name', 'email', 'role', 'company_id'];
    
    public function company() {
        return $this->belongsTo(Company::class);
    }
    
    public function canAccessDocument($document) {
        return $this->company_id === $document->company_id 
               || $this->role === 'admin';
    }
}

// app/Http/Controllers/DocumentController.php
class DocumentController extends Controller {
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|max:255',
            'file' => 'required|mimes:pdf,doc,docx|max:10240',
            'category' => 'required|in:contract,invoice,report'
        ]);
        
        $document = Document::create([
            'title' => $request->title,
            'category' => $request->category,
            'company_id' => auth()->user()->company_id
        ]);
        
        return response()->json($document);
    }
}`)}
          >
            Usar Este Exemplo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}