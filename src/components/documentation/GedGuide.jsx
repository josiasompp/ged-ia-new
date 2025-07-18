import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Folder, Upload, Search, ShieldCheck, Info, Lightbulb } from 'lucide-react';

export default function GedGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <FileText className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Módulo GED
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O módulo de Gestão Eletrônica de Documentos (GED) é o coração do sistema, projetado para organizar, proteger e facilitar o acesso a todos os arquivos da sua empresa.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-firstdocy-primary" />
            Principais Conceitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>O GED organiza seus arquivos em uma hierarquia simples e poderosa:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Departamentos:</strong> A primeira camada de organização, representando os centros de custo ou equipes da sua empresa (ex: Financeiro, RH, Jurídico).</li>
            <li><strong>Diretórios (Pastas):</strong> Dentro de cada departamento, você pode criar diretórios e subdiretórios para organizar projetos, tipos de documentos ou qualquer outra estrutura lógica.</li>
            <li><strong>Documentos:</strong> São os arquivos finais, que vivem dentro dos diretórios.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-firstdocy-green" />
            Guia Passo a Passo: Operações Essenciais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">1. Navegando pelos Arquivos</h3>
            <p>Utilize a aba "Navegador" para explorar a estrutura de pastas. Comece selecionando um Departamento e, em seguida, clique nos Diretórios para aprofundar até encontrar os documentos que procura. O "caminho de pão" (breadcrumbs) no topo sempre mostrará sua localização atual.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">2. Criando um Novo Diretório</h3>
            <p>Dentro de um departamento, clique no botão <strong>"Criar Diretório"</strong>. Dê um nome claro e uma descrição para a nova pasta. Isso ajuda a manter tudo organizado.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">3. Adicionando Novos Documentos</h3>
            <p>Ao navegar para o diretório desejado, clique em <strong>"Novo Documento"</strong>. Você terá duas opções:</p>
            <ul className="list-decimal list-inside space-y-2 pl-4 mt-2">
              <li><strong>Fazer Upload:</strong> Selecione arquivos do seu computador.</li>
              <li><strong>Link do Google Drive:</strong> Conecte um documento diretamente do Google Drive.</li>
            </ul>
            <p className="mt-2">Preencha os metadados do documento (título, categoria, datas). Isso é crucial para buscas futuras!</p>
             <Alert className="mt-4 border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Dica de IA!</AlertTitle>
              <AlertDescription className="text-blue-700">
                Ao fazer upload de um PDF, nosso sistema de IA tentará extrair automaticamente a data de criação e validade do documento para você.
              </AlertDescription>
            </Alert>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">4. Usando a Busca Inteligente</h3>
            <p>Vá para a aba <strong>"Busca Inteligente"</strong>. Em vez de procurar apenas pelo nome do arquivo, você pode pesquisar pelo conteúdo ou pela ideia do documento. Por exemplo, pesquise por <span className="italic">"relatório de vendas do último trimestre"</span> e a IA encontrará os documentos mais relevantes, mesmo que não tenham essas palavras exatas no título.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Boas Práticas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Seja Descritivo:</strong> Use títulos claros e descrições detalhadas para seus documentos e diretórios.</li>
            <li><strong>Use as Tags:</strong> Adicione tags relevantes aos seus documentos para criar uma camada extra de organização e facilitar a busca.</li>
            <li><strong>Controle o Acesso:</strong> Defina o "Nível de Acesso" corretamente ao fazer o upload para garantir que apenas as pessoas certas vejam informações sensíveis.</li>
            <li><strong>Mantenha a Estrutura:</strong> Incentive sua equipe a seguir a estrutura de pastas definida para evitar desorganização.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}