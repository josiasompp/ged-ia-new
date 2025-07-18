
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/components/ui/use-toast";
import {
  ShieldCheck,
  Search,
  Loader2,
  FileWarning
} from 'lucide-react';
import { SignatureWorkflow } from '@/api/entities';
import SignatureAuditTrail from '../components/signatures/SignatureAuditTrail'; // Será criado a seguir

export default function PublicVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setWorkflow(null);

    try {
      const results = await SignatureWorkflow.filter({ verification_code: verificationCode });
      if (results.length > 0) {
        // Em um app real, a senha seria validada no backend.
        // Aqui simulamos uma verificação simples.
        if(password === 'firstdocy') {
          setWorkflow(results[0]);
        } else {
          setError('Senha inválida.');
        }
      } else {
        setError('Nenhum documento encontrado com este código de verificação.');
      }
    } catch (err) {
      console.error("Erro na verificação:", err);
      setError('Ocorreu um erro ao tentar verificar o documento.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Para fins de demonstração, preenche o código de verificação
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setVerificationCode(code);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center items-center gap-3 mb-6">
          <ShieldCheck className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Portal de Verificação de Documentos</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verificar Autenticidade</CardTitle>
          </CardHeader>
          <CardContent>
            {!workflow ? (
              <form onSubmit={handleVerification} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Insira o código de verificação e a senha encontrados na página de autenticação do seu documento PDF.
                </p>
                <div>
                  <Label htmlFor="verificationCode">Código de Verificação</Label>
                  <Input 
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Erro na Verificação</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><Search className="w-4 h-4 mr-2"/>Verificar Documento</>}
                </Button>
              </form>
            ) : (
              <div>
                <Alert variant="success" className="mb-6">
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>Documento Verificado com Sucesso!</AlertTitle>
                  <AlertDescription>
                    Abaixo estão os detalhes de autenticidade e o histórico de ações para o documento.
                  </AlertDescription>
                </Alert>
                <SignatureAuditTrail workflow={workflow} />
              </div>
            )}
          </CardContent>
        </Card>
         <p className="text-center text-xs text-gray-500 mt-4">
            A integridade e autenticidade deste documento são garantidas nos termos do Artigo 10, § 1º, da MP nº 2.200-2, de 24 de agosto de 2001.
        </p>
      </div>
    </div>
  );
}
