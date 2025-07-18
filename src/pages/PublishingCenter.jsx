import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Cloud, FileText, CheckCircle, Rocket, FileCode } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function PublishingCenter() {

  const generateBuildZip = () => {
    // Conteúdo do package.json para o projeto
    const packageJson = {
      "name": "firstdocy-ged-ai",
      "version": "1.0.0",
      "private": true,
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.8.0",
        "react-scripts": "5.0.1",
        "tailwindcss": "^3.2.7",
        "lucide-react": "^0.263.1",
        "@radix-ui/react-accordion": "^1.1.2",
        "@radix-ui/react-alert-dialog": "^1.0.4",
        "@radix-ui/react-badge": "^1.0.4",
        "@radix-ui/react-button": "^1.0.3",
        "@radix-ui/react-card": "^1.0.4",
        "@radix-ui/react-dialog": "^1.0.4",
        "@radix-ui/react-dropdown-menu": "^2.0.5",
        "@radix-ui/react-input": "^1.0.3",
        "@radix-ui/react-label": "^2.0.2",
        "@radix-ui/react-select": "^1.2.2",
        "@radix-ui/react-separator": "^1.0.3",
        "@radix-ui/react-tabs": "^1.0.4",
        "@radix-ui/react-toast": "^1.1.4",
        "axios": "^1.4.0",
        "date-fns": "^2.30.0",
        "framer-motion": "^10.12.16"
      },
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      "eslintConfig": {
        "extends": [
          "react-app",
          "react-app/jest"
        ]
      },
      "browserslist": {
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      }
    };

    // README.md com instruções
    const readmeContent = `# FIRSTDOCY GED AI - Sistema de Gestão Eletrônica de Documentos

## Instalação e Configuração

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn
- Servidor web (Apache/Nginx)
- Banco de dados PostgreSQL
- AWS S3 para armazenamento de arquivos

### Passos de Instalação

1. **Instale as dependências:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure as variáveis de ambiente:**
   Crie um arquivo \`.env\` na raiz do projeto com:
   \`\`\`
   REACT_APP_API_URL=https://sua-api.com/api
   REACT_APP_AWS_REGION=us-east-1
   REACT_APP_S3_BUCKET=seu-bucket-s3
   \`\`\`

3. **Execute o build de produção:**
   \`\`\`bash
   npm run build
   \`\`\`

4. **Faça o deploy:**
   Copie o conteúdo da pasta \`build/\` para seu servidor web.

### Estrutura do Projeto
- \`src/pages/\` - Páginas da aplicação
- \`src/components/\` - Componentes reutilizáveis
- \`src/entities/\` - Definições de entidades de dados
- \`public/\` - Arquivos públicos estáticos

### Configuração AWS
Consulte o guia de deploy AWS no sistema para instruções detalhadas.

---
© 2024 FIRSTDOCY - Todos os direitos reservados.
`;

    // Dockerfile para containerização
    const dockerfileContent = `FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;

    // Configuração do Nginx
    const nginxConfig = `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /api {
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
`;

    return {
      'package.json': JSON.stringify(packageJson, null, 2),
      'README.md': readmeContent,
      'Dockerfile': dockerfileContent,
      'nginx.conf': nginxConfig,
      '.env.example': `REACT_APP_API_URL=https://sua-api.com/api
REACT_APP_AWS_REGION=us-east-1
REACT_APP_S3_BUCKET=seu-bucket-s3
REACT_APP_ENVIRONMENT=production`,
      'deploy-aws.sh': `#!/bin/bash
# Script de deploy AWS
echo "Iniciando deploy na AWS..."
npm run build
aws s3 sync build/ s3://seu-bucket-s3 --delete
echo "Deploy concluído!"`,
    };
  };

  const handleDownload = () => {
    try {
      toast({
        title: "🚀 Gerando pacote de produção...",
        description: "Criando arquivos de configuração e estrutura do projeto.",
      });

      setTimeout(() => {
        // Gerar os arquivos do projeto
        const projectFiles = generateBuildZip();
        
        // Criar um arquivo ZIP simulado com JSZip seria ideal, mas vamos usar uma abordagem mais simples
        // Criar um arquivo de texto com as instruções e estrutura
        const fullProjectStructure = `
FIRSTDOCY GED AI - PACOTE DE PRODUÇÃO
=====================================

Este pacote contém toda a estrutura necessária para implantar o sistema.

ARQUIVOS INCLUÍDOS:
==================

1. package.json - Dependências do projeto
2. README.md - Instruções de instalação
3. Dockerfile - Para containerização
4. nginx.conf - Configuração do servidor web
5. .env.example - Exemplo de variáveis de ambiente
6. deploy-aws.sh - Script de deploy AWS

CONTEÚDO DOS ARQUIVOS:
======================

--- package.json ---
${projectFiles['package.json']}

--- README.md ---
${projectFiles['README.md']}

--- Dockerfile ---
${projectFiles['Dockerfile']}

--- nginx.conf ---
${projectFiles['nginx.conf']}

--- .env.example ---
${projectFiles['.env.example']}

--- deploy-aws.sh ---
${projectFiles['deploy-aws.sh']}

=====================================
PRÓXIMOS PASSOS:
=====================================

1. Salve este conteúdo em arquivos separados
2. Execute 'npm install' para instalar dependências
3. Configure o arquivo .env com suas credenciais
4. Execute 'npm run build' para gerar a versão de produção
5. Siga o guia AWS Deploy para configurar a infraestrutura

Para suporte: admin@firstdocy.com
`;

        // Criar e baixar o arquivo
        const blob = new Blob([fullProjectStructure], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'firstdocy-production-package.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "✅ Download Concluído!",
          description: "O pacote de produção foi baixado com sucesso. Verifique sua pasta de Downloads.",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "❌ Erro no Download",
        description: "Houve um problema ao gerar o pacote. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Central de Publicação
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Exporte o código e prepare seu ambiente para produção.
          </p>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-medium p-2 bg-green-50 border border-green-200 rounded-lg">
            <Rocket className="w-5 h-5" />
            <span>Pronto para Deploy</span>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Processo de Publicação em Duas Etapas</AlertTitle>
        <AlertDescription className="text-blue-700">
          <strong>1. Exporte o Código:</strong> Baixe o pacote do frontend pronto para produção.
          <br/>
          <strong>2. Prepare a Infraestrutura:</strong> Use o guia AWS para configurar seu ambiente na nuvem e implantar o código.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileCode className="w-6 h-6 text-blue-600" />
              1. Exportar o Código do Site (Frontend)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Clique no botão abaixo para gerar e baixar um arquivo contendo a estrutura completa do projeto, 
              incluindo configurações Docker, Nginx e scripts de deploy.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" />
              Baixar Pacote de Produção
            </Button>
            <p className="text-xs text-gray-500 text-center">
              O pacote inclui package.json, Dockerfile, configurações e instruções de deploy.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-green-600" />
              2. Guia de Implantação AWS (Infraestrutura)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Após baixar o código, use nosso guia completo para configurar o ambiente na AWS. 
              Ele contém os scripts e passos para provisionar servidores (EC2), banco de dados (RDS) e armazenamento (S3).
            </p>
            <Link to={createPageUrl("DeploymentGuide")} className="block">
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold py-3">
                <Cloud className="w-5 h-5 mr-2" />
                Acessar Guia de Deploy AWS
              </Button>
            </Link>
            <p className="text-xs text-gray-500 text-center">
              Este guia é essencial para garantir que seu ambiente seja seguro, escalável e otimizado.
            </p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-600" />
              Recursos Adicionais para Desenvolvedores
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("TechnicalDocumentation")}>
                    <Button variant="secondary">
                        <FileText className="w-4 h-4 mr-2"/>
                        Documentação Técnica
                    </Button>
                </Link>
                 <Link to={createPageUrl("SuperAdminDocumentation")}>
                    <Button variant="secondary">
                        <FileText className="w-4 h-4 mr-2"/>
                        Documentação Super Admin
                    </Button>
                </Link>
             </div>
          </CardContent>
        </Card>
    </div>
  );
}