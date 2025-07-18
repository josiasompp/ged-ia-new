
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, Copy, ExternalLink, Server, Database, Shield, Zap, Globe, Code, FileText, Settings, DollarSign, Clock, Users, BarChart3, CloudRain, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PublishChecklist from '../components/deployment/PublishChecklist';

export default function DeploymentGuide() {
  const [copiedSection, setCopiedSection] = useState('');

  const awsSetupScriptContent = '#!/bin/bash\n' +
'# ==============================================================================\n' +
'# FIRSTDOCY GED AI - AWS Infrastructure Setup Script\n' +
'# ==============================================================================\n' +
'#\n' +
'# Copyright © 2024 FIRSTDOCY. Todos os direitos reservados.\n' +
'#\n' +
'# AVISO: Este script provisionará recursos na sua conta AWS que podem incorrer\n' +
'# em custos. Revise os recursos e seus custos associados antes de executar.\n' +
'#\n' +
'# Pré-requisitos:\n' +
'# 1. AWS CLI instalado e configurado com credenciais de administrador.\n' +
'# 2. Um par de chaves EC2 já criado na sua conta AWS.\n' +
'#\n' +
'# ==============================================================================\n' +
'\n' +
'# --- Configuração ---\n' +
'# Altere estas variáveis de acordo com suas necessidades.\n' +
'\n' +
'# Geral\n' +
'AWS_REGION="us-east-1"\n' +
'PROJECT_NAME="firstdocy"\n' +
'EC2_KEY_PAIR_NAME="SUA_CHAVE_EC2" # <-- IMPORTANTE: Substitua pelo nome do seu par de chaves\n' +
'\n' +
'# Rede\n' +
'VPC_CIDR="10.0.0.0/16"\n' +
'PUBLIC_SUBNET_CIDR="10.0.1.0/24"\n' +
'PRIVATE_SUBNET_CIDR="10.0.2.0/24"\n' +
'\n' +
'# EC2\n' +
'EC2_INSTANCE_TYPE="t3.small"\n' +
'# Amazon Linux 2 AMI (us-east-1) - Verifique o AMI ID mais recente para sua região\n' +
'EC2_AMI_ID="ami-0c55b159cbfafe1f0" \n' +
'\n' +
'# RDS\n' +
'DB_INSTANCE_CLASS="db.t3.micro"\n' +
'DB_ENGINE="postgres"\n' +
'DB_VERSION="14.9"\n' +
'DB_STORAGE="20"\n' +
'DB_USERNAME="firstdocy_admin"\n' +
'DB_PASSWORD="SUA_SENHA_FORTE_PARA_O_BANCO" # <-- IMPORTANTE: Substitua por uma senha segura\n' +
'\n' +
'# --- Fim da Configuração ---\n' +
'\n' +
'set -e\n' +
'echo "🚀 Iniciando a criação da infraestrutura para o FIRSTDOCY GED AI na região $AWS_REGION..."\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# 1. Rede (VPC, Subnets, Internet Gateway, Route Tables)\n' +
'echo "🌐 Etapa 1: Configurando a rede..."\n' +
'\n' +
'VPC_ID=$(aws ec2 create-vpc --cidr-block $VPC_CIDR --region $AWS_REGION --query \'Vpc.VpcId\' --output text)\n' +
'aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=${PROJECT_NAME}-vpc --region $AWS_REGION\n' +
'echo "  - VPC criada: $VPC_ID"\n' +
'\n' +
'PUBLIC_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $PUBLIC_SUBNET_CIDR --region $AWS_REGION --query \'Subnet.SubnetId\' --output text)\n' +
'aws ec2 create-tags --resources $PUBLIC_SUBNET_ID --tags Key=Name,Value=${PROJECT_NAME}-public-subnet --region $AWS_REGION\n' +
'echo "  - Subnet Pública criada: $PUBLIC_SUBNET_ID"\n' +
'\n' +
'PRIVATE_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $PRIVATE_SUBNET_CIDR --region $AWS_REGION --query \'Subnet.SubnetId\' --output text)\n' +
'aws ec2 create-tags --resources $PRIVATE_SUBNET_ID --tags Key=Name,Value=${PROJECT_NAME}-private-subnet --region $AWS_REGION\n' +
'echo "  - Subnet Privada criada: $PRIVATE_SUBNET_ID"\n' +
'\n' +
'IGW_ID=$(aws ec2 create-internet-gateway --region $AWS_REGION --query \'InternetGateway.InternetGatewayId\' --output text)\n' +
'aws ec2 create-tags --resources $IGW_ID --tags Key=Name,Value=${PROJECT_NAME}-igw --region $AWS_REGION\n' +
'aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID --region $AWS_REGION\n' +
'echo "  - Internet Gateway criado e anexado: $IGW_ID"\n' +
'\n' +
'ROUTE_TABLE_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --region $AWS_REGION --query \'RouteTable.RouteTableId\' --output text)\n' +
'aws ec2 create-tags --resources $ROUTE_TABLE_ID --tags Key=Name,Value=${PROJECT_NAME}-public-rt --region $AWS_REGION\n' +
'aws ec2 create-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region $AWS_REGION\n' +
'aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_ID --route-table-id $ROUTE_TABLE_ID --region $AWS_REGION\n' +
'echo "  - Tabela de Rotas Pública criada e associada: $ROUTE_TABLE_ID"\n' +
'\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# 2. Segurança (Security Groups)\n' +
'echo "🛡️ Etapa 2: Configurando os Grupos de Segurança..."\n' +
'\n' +
'WEB_SG_ID=$(aws ec2 create-security-group --group-name ${PROJECT_NAME}-web-sg --description "Allow HTTP, HTTPS, SSH" --vpc-id $VPC_ID --region $AWS_REGION --query \'GroupId\' --output text)\n' +
'aws ec2 authorize-security-group-ingress --group-id $WEB_SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $AWS_REGION\n' +
'aws ec2 authorize-security-group-ingress --group-id $WEB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $AWS_REGION\n' +
'aws ec2 authorize-security-group-ingress --group-id $WEB_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $AWS_REGION\n' +
'echo "  - Security Group para EC2 criado (permitindo SSH, HTTP, HTTPS): $WEB_SG_ID"\n' +
'\n' +
'DB_SG_ID=$(aws ec2 create-security-group --group-name ${PROJECT_NAME}-db-sg --description "Allow PostgreSQL access from Web SG" --vpc-id $VPC_ID --region $AWS_REGION --query \'GroupId\' --output text)\n' +
'aws ec2 authorize-security-group-ingress --group-id $DB_SG_ID --protocol tcp --port 5432 --source-group $WEB_SG_ID --region $AWS_REGION\n' +
'echo "  - Security Group para RDS criado (permitindo acesso do Web SG na porta 5432): $DB_SG_ID"\n' +
'\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# 3. Armazenamento (S3 Bucket)\n' +
'echo "📦 Etapa 3: Criando o Bucket S3 para arquivos..."\n' +
'BUCKET_NAME="${PROJECT_NAME}-files-$(date +%s)"\n' +
'aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION\n' +
'aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled --region $AWS_REGION\n' +
'aws s3api put-public-access-block \\\n' +
'    --bucket $BUCKET_NAME \\\n' +
'    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \\\n' +
'    --region $AWS_REGION\n' +
'echo "  - Bucket S3 criado com versionamento e acesso público bloqueado: s3://$BUCKET_NAME"\n' +
'\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# 4. Banco de Dados (RDS PostgreSQL)\n' +
'echo "🗄️ Etapa 4: Provisionando o Banco de Dados RDS PostgreSQL..."\n' +
'\n' +
'# Criar segunda subnet privada em AZ diferente (necessário para RDS)\n' +
'PRIVATE_SUBNET_2_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.3.0/24 --availability-zone ${AWS_REGION}b --region $AWS_REGION --query \'Subnet.SubnetId\' --output text)\n' +
'aws ec2 create-tags --resources $PRIVATE_SUBNET_2_ID --tags Key=Name,Value=${PROJECT_NAME}-private-subnet-2 --region $AWS_REGION\n' +
'echo "  - Segunda Subnet Privada criada: $PRIVATE_SUBNET_2_ID"\n' +
'\n' +
'DB_SUBNET_GROUP_NAME="${PROJECT_NAME}-db-subnet-group"\n' +
'aws rds create-db-subnet-group \\\n' +
'    --db-subnet-group-name $DB_SUBNET_GROUP_NAME \\\n' +
'    --db-subnet-group-description "Subnet group for ${PROJECT_NAME} RDS" \\\n' +
'    --subnet-ids $PRIVATE_SUBNET_ID $PRIVATE_SUBNET_2_ID \\\n' +
'    --region $AWS_REGION > /dev/null\n' +
'echo "  - DB Subnet Group criado: $DB_SUBNET_GROUP_NAME"\n' +
'\n' +
'aws rds create-db-instance \\\n' +
'    --db-instance-identifier ${PROJECT_NAME}-db-instance \\\n' +
'    --db-instance-class $DB_INSTANCE_CLASS \\\n' +
'    --engine $DB_ENGINE \\\n' +
'    --engine-version $DB_VERSION \\\n' +
'    --allocated-storage $DB_STORAGE \\\n' +
'    --master-username $DB_USERNAME \\\n' +
'    --master-user-password $DB_PASSWORD \\\n' +
'    --vpc-security-group-ids $DB_SG_ID \\\n' +
'    --db-subnet-group-name $DB_SUBNET_GROUP_NAME \\\n' +
'    --no-publicly-accessible \\\n' +
'    --backup-retention-period 7 \\\n' +
'    --region $AWS_REGION > /dev/null\n' +
'echo "  - Instância RDS PostgreSQL está sendo criada. Isso pode levar alguns minutos..."\n' +
'echo "  - Aguardando a instância do RDS ficar disponível..."\n' +
'aws rds wait db-instance-available --db-instance-identifier ${PROJECT_NAME}-db-instance --region $AWS_REGION\n' +
'DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier ${PROJECT_NAME}-db-instance --query \'DBInstances[0].Endpoint.Address\' --output text --region $AWS_REGION)\n' +
'echo "  - Instância RDS disponível no endpoint: $DB_ENDPOINT"\n' +
'\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# 5. Servidor de Aplicação (EC2 Instance)\n' +
'echo "🖥️ Etapa 5: Lançando a instância EC2..."\n' +
'\n' +
'EC2_INSTANCE_ID=$(aws ec2 run-instances \\\n' +
'    --image-id $EC2_AMI_ID \\\n' +
'    --instance-type $EC2_INSTANCE_TYPE \\\n' +
'    --key-name "$EC2_KEY_PAIR_NAME" \\\n' +
'    --security-group-ids $WEB_SG_ID \\\n' +
'    --subnet-id $PUBLIC_SUBNET_ID \\\n' +
'    --associate-public-ip-address \\\n' +
'    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROJECT_NAME}-app-server}]" \\\n' +
'    --region $AWS_REGION \\\n' +
'    --query \'Instances[0].InstanceId\' --output text)\n' +
'echo "  - Instância EC2 está sendo lançada..."\n' +
'echo "  - Aguardando a instância EC2 entrar em estado \'running\'..."\n' +
'aws ec2 wait instance-running --instance-ids $EC2_INSTANCE_ID --region $AWS_REGION\n' +
'EC2_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $EC2_INSTANCE_ID --query \'Reservations[0].Instances[0].PublicIpAddress\' --output text --region $AWS_REGION)\n' +
'echo "  - Instância EC2 está rodando no IP público: $EC2_PUBLIC_IP"\n' +
'\n' +
'echo "----------------------------------------------------------------"\n' +
'\n' +
'# --- Conclusão ---\n' +
'echo "✅ Infraestrutura do FIRSTDOCY GED AI criada com sucesso!"\n' +
'echo ""\n' +
'echo "Resumo dos Recursos:"\n' +
'echo "------------------------------------------------"\n' +
'echo "  - Região AWS:                $AWS_REGION"\n' +
'echo "  - VPC ID:                    $VPC_ID"\n' +
'echo "  - ID Instância EC2:          $EC2_INSTANCE_ID"\n' +
'echo "  - IP Público EC2:            $EC2_PUBLIC_IP"\n' +
'echo "  - Endpoint do Banco RDS:     $DB_ENDPOINT"\n' +
'echo "  - Bucket S3 para arquivos:   s3://$BUCKET_NAME"\n' +
'echo ""\n' +
'echo "Próximos Passos:"\n' +
'echo "1. Conecte-se à sua instância EC2 usando SSH:"\n' +
'echo "   ssh -i /caminho/para/${EC2_KEY_PAIR_NAME}.pem ec2-user@${EC2_PUBLIC_IP}"\n' +
'echo "2. Clone o repositório da aplicação, instale as dependências e configure as variáveis de ambiente."\n' +
'echo "3. Use o Endpoint do RDS e o nome do Bucket S3 nas suas configurações de ambiente."\n' +
'echo "================================================================================\n';

  const ec2SetupScriptContent = `#!/bin/bash
# ==============================================================================
# FIRSTDOCY GED AI - EC2 Instance Setup Script (User Data)
# ==============================================================================
#
# Copyright © 2024 FIRSTDOCY. Todos os direitos reservados.
#
# Este script é executado automaticamente na primeira inicialização da instância EC2.
# Ele instala o Docker, Docker Compose e prepara o ambiente para rodar a aplicação.
#
# ==============================================================================

# Redirecionar toda a saída para um arquivo de log para depuração
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "🚀 Iniciando o script de configuração da instância EC2..."

# Atualizar os pacotes do sistema
yum update -y
echo "✅ Pacotes do sistema atualizados."

# Instalar o Docker
yum install -y docker
service docker start
usermod -a -G docker ec2-user
echo "✅ Docker instalado e iniciado."

# Instalar o Git
yum install -y git
echo "✅ Git instalado."

# Instalar o Docker Compose
DOCKER_COMPOSE_VERSION="v2.27.0" # Verifique a versão mais recente se necessário
curl -L "https://github.com/docker/compose/releases/download/\${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
echo "✅ Docker Compose instalado."

# A aplicação será clonada e configurada manualmente via SSH.
# Este script apenas prepara o ambiente com as ferramentas necessárias.
echo "----------------------------------------------------------------"
echo "✅ Ambiente preparado com Docker e Docker Compose."
echo ""
echo "Próximos Passos (via SSH):"
echo "1. Conecte-se à instância: ssh -i /caminho/para/sua-chave.pem ec2-user@<IP_PUBLICO>"
echo "2. Clone o repositório da aplicação: git clone <URL_DO_REPOSITORIO>"
echo "3. Navegue para o diretório do projeto: cd <NOME_DO_PROJETO>"
echo "4. Crie e edite o arquivo de variáveis de ambiente: nano .env"
echo "   (Preencha com as credenciais do RDS, S3, etc.)"
echo "5. Inicie a aplicação: docker-compose up -d --build"
echo "----------------------------------------------------------------"

echo "Script de configuração finalizado com sucesso! ✅"
`;

  const copyToClipboard = (text, command) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(command);
    toast({
      title: "Comando copiado!",
      description: "O comando foi copiado para sua área de transferência.",
    });
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([awsSetupScriptContent], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'aws-setup.sh');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Script baixado!",
      description: "O arquivo aws-setup.sh foi baixado. Lembre-se de editar as configurações antes de executar.",
    });
  };

  const handleDownloadEC2Script = () => {
    const blob = new Blob([ec2SetupScriptContent], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'setup-script.sh');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Script baixado!",
      description: "O arquivo setup-script.sh foi baixado.",
    });
  };

  const awsServices = [
    {
      name: "Amazon EC2",
      description: "Servidores virtuais para aplicação",
      cost: "~$50-200/mês",
      icon: Server
    },
    {
      name: "Amazon RDS",
      description: "Banco de dados PostgreSQL gerenciado",
      cost: "~$30-100/mês",
      icon: Database
    },
    {
      name: "Amazon S3",
      description: "Armazenamento de arquivos e documentos",
      cost: "~$10-50/mês",
      icon: FileText
    },
    {
      name: "Amazon CloudFront",
      description: "CDN para performance global",
      cost: "~$5-20/mês",
      icon: Globe
    },
    {
      name: "AWS Certificate Manager",
      description: "Certificados SSL gratuitos",
      cost: "Gratuito",
      icon: Shield
    },
    {
      name: "Amazon Route 53",
      description: "DNS e gerenciamento de domínios",
      cost: "~$2-10/mês",
      icon: Globe
    },
    {
      name: "AWS Lambda",
      description: "Funções serverless para automações",
      cost: "~$0-20/mês",
      icon: Zap
    },
    {
      name: "Amazon SES",
      description: "Serviço de envio de emails",
      cost: "~$1-10/mês",
      icon: ExternalLink
    }
  ];

  const deploymentSteps = [
    {
      title: "1. Preparação da Infraestrutura",
      commands: [
        "# Criar VPC e redes",
        "aws ec2 create-vpc --cidr-block 10.0.0.0/16",
        "aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24",
        "aws ec2 create-internet-gateway",
        "aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx"
      ]
    },
    {
      title: "2. Configuração do RDS",
      commands: [
        "# Criar banco PostgreSQL",
        "aws rds create-db-instance \\",
        "  --db-instance-identifier firstdocy-db \\",
        "  --db-instance-class db.t3.micro \\",
        "  --engine postgres \\",
        "  --engine-version 14.9 \\",
        "  --allocated-storage 20 \\",
        "  --storage-type gp2 \\",
        "  --master-username firstdocy \\",
        "  --master-user-password 'SUA_SENHA_SEGURA' \\",
        "  --vpc-security-group-ids sg-xxx \\",
        "  --db-subnet-group-name firstdocy-subnet-group"
      ]
    },
    {
      title: "3. Setup do EC2",
      commands: [
        "# Lançar instância EC2",
        "aws ec2 run-instances \\",
        "  --image-id ami-0abcdef1234567890 \\",
        "  --instance-type t3.small \\",
        "  --key-name sua-chave \\",
        "  --security-group-ids sg-xxx \\",
        "  --subnet-id subnet-xxx \\",
        "  --user-data file://setup-script.sh"
      ]
    },
    {
      title: "4. Configuração do S3",
      commands: [
        "# Criar bucket S3 para arquivos",
        "aws s3 mb s3://firstdocy-files-$(date +%s)",
        "aws s3api put-bucket-versioning \\",
        "  --bucket firstdocy-files-xxx \\",
        "  --versioning-configuration Status=Enabled",
        "aws s3api put-bucket-encryption \\",
        "  --bucket firstdocy-files-xxx \\",
        "  --server-side-encryption-configuration \\",
        "  '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'"
      ]
    }
  ];

  const environmentVariables = [
    { key: "DATABASE_URL", value: "postgresql://user:password@firstdocy-db.xxx.rds.amazonaws.com:5432/firstdocy", description: "URL de conexão com PostgreSQL" },
    { key: "AWS_ACCESS_KEY_ID", value: "AKIA...", description: "Chave de acesso AWS" },
    { key: "AWS_SECRET_ACCESS_KEY", value: "xxx", description: "Chave secreta AWS" },
    { key: "AWS_REGION", value: "us-east-1", description: "Região AWS" },
    { key: "S3_BUCKET", value: "firstdocy-files-xxx", description: "Nome do bucket S3" },
    { key: "DOMAIN_NAME", value: "app.suaempresa.com", description: "Domínio personalizado" },
    { key: "SMTP_HOST", value: "email-smtp.us-east-1.amazonaws.com", description: "Servidor SMTP do SES" },
    { key: "SMTP_USERNAME", value: "AKIA...", description: "Usuário SMTP do SES" },
    { key: "SMTP_PASSWORD", value: "xxx", description: "Senha SMTP do SES" },
    { key: "JWT_SECRET", value: "sua-chave-jwt-super-secreta", description: "Chave para tokens JWT" },
    { key: "ENCRYPTION_KEY", value: "sua-chave-de-criptografia-32-chars", description: "Chave para criptografia de dados" }
  ];

  const deploymentChecklistData = [
    {
      title: 'Infraestrutura',
      icon: Server,
      items: [
        { id: 'infra-1', label: 'VPC e Subnets configuradas', critical: true },
        { id: 'infra-2', label: 'Internet Gateway e NAT Gateway operacionais', critical: true },
        { id: 'infra-3', label: 'Grupos de Segurança (Security Groups) restritivos', critical: true },
        { id: 'infra-4', label: 'Instâncias EC2 provisionadas com tamanho correto', critical: false },
        { id: 'infra-5', label: 'Auto Scaling Group configurado (opcional)', critical: false },
      ],
    },
    {
      title: 'Banco de Dados (RDS)',
      icon: Database,
      items: [
        { id: 'db-1', label: 'Instância RDS PostgreSQL criada e acessível', critical: true },
        { id: 'db-2', label: 'Criptografia de armazenamento habilitada', critical: true },
        { id: 'db-3', label: 'Backups automáticos configurados e testados', critical: true },
        { id: 'db-4', label: 'Réplica de leitura (Read Replica) para alta disponibilidade (opcional)', critical: false },
      ],
    },
    {
      title: 'Armazenamento (S3)',
      icon: FileText,
      items: [
        { id: 's3-1', label: 'Bucket S3 para arquivos criado com políticas restritivas', critical: true },
        { id: 's3-2', label: 'Criptografia do lado do servidor (SSE) habilitada', critical: true },
        { id: 's3-3', label: 'Versionamento do bucket habilitado', critical: true },
        { id: 's3-4', label: 'Política de ciclo de vida (Lifecycle Policy) configurada', critical: false },
      ],
    },
    {
      title: 'Segurança',
      icon: Shield,
      items: [
        { id: 'sec-1', label: 'Certificado SSL/TLS válido e configurado (ACM)', critical: true },
        { id: 'sec-2', label: 'Políticas de IAM com privilégio mínimo', critical: true },
        { id: 'sec-3', label: 'AWS WAF (Web Application Firewall) configurado', critical: false },
        { id: 'sec-4', label: 'Variáveis de ambiente e secrets gerenciados pelo AWS Secrets Manager', critical: true },
        { id: 'sec-5', label: 'Rotação de chaves e senhas implementada', critical: false },
      ],
    },
    {
      title: 'Aplicação',
      icon: Code,
      items: [
        { id: 'app-1', label: 'Código-fonte da versão de produção na branch principal', critical: true },
        { id: 'app-2', label: 'Variáveis de ambiente configuradas para produção', critical: true },
        { id: 'app-3', label: 'Dependências instaladas (npm install)', critical: true },
        { id: 'app-4', label: 'Build de produção gerado com sucesso (npm run build)', critical: true },
        { id: 'app-5', label: 'Aplicação servida por Nginx/Apache com headers de segurança', critical: false },
      ],
    },
    {
      title: 'Monitoramento & Logs',
      icon: BarChart3,
      items: [
        { id: 'mon-1', label: 'Agente do CloudWatch instalado nas instâncias EC2', critical: true },
        { id: 'mon-2', label: 'Dashboards do CloudWatch criados para métricas chave', critical: true },
        { id: 'mon-3', label: 'Alertas (Alarms) configurados para CPU, Memória, Disco e Erros', critical: true },
        { id: 'mon-4', label: 'Logs da aplicação centralizados no CloudWatch Logs', critical: true },
      ],
    },
    {
      title: 'Finalização',
      icon: CheckCircle,
      items: [
        { id: 'final-1', label: 'Configuração de DNS (Route 53) apontando para o ambiente de produção', critical: true },
        { id: 'final-2', label: 'CDN (CloudFront) configurada para servir assets e aplicação', critical: false },
        { id: 'final-3', label: 'Teste de ponta-a-ponta (smoke test) realizado em produção', critical: true },
        { id: 'final-4', label: 'Acesso SSH restrito a IPs específicos', critical: true },
        { id: 'final-5', label: 'Comunicação interna sobre a publicação realizada', critical: false },
      ],
    },
  ];

  const securityChecklist = [
    { item: "Configurar Security Groups restritivos", done: false },
    { item: "Habilitar criptografia no RDS", done: false },
    { item: "Configurar SSL/TLS com Certificate Manager", done: false },
    { item: "Implementar backup automático do RDS", done: false },
    { item: "Configurar CloudWatch para monitoramento", done: false },
    { item: "Habilitar logs de auditoria", done: false },
    { item: "Configurar WAF para proteção de aplicação", done: false },
    { item: "Implementar rotação de senhas", done: false }
  ];

  const dockerComposeContent = `version: '3.8'
services:
  firstdocy-app:
    image: firstdocy/ged-ai:latest
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - AWS_ACCESS_KEY_ID=\${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=\${AWS_SECRET_ACCESS_KEY}
      - S3_BUCKET=\${S3_BUCKET}
      - DOMAIN_NAME=\${DOMAIN_NAME}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Deploy AWS - FIRSTDOCY GED AI
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Guia completo para implantação na Amazon Web Services
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CloudRain className="w-4 h-4 mr-2" />
          AWS Ready
        </Badge>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Arquitetura de Produção</AlertTitle>
        <AlertDescription className="text-blue-700">
          Esta configuração AWS oferece alta disponibilidade, segurança empresarial e escalabilidade automática 
          para suportar de 50 a 5000+ usuários simultâneos.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços AWS</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="configuration">Configuração</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="checklist">Checklist Final</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Arquitetura AWS Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4">Componentes Principais:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-blue-600" />
                          <span><strong>Frontend:</strong> EC2 + CloudFront</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-green-600" />
                          <span><strong>Backend:</strong> EC2 + Load Balancer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <span><strong>Banco:</strong> RDS PostgreSQL</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-600" />
                          <span><strong>Arquivos:</strong> S3 + CloudFront</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-600" />
                          <span><strong>SSL:</strong> Certificate Manager</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <span><strong>Email:</strong> Amazon SES</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-800">Tempo de Deploy</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">2-4 horas</p>
                        <p className="text-sm text-green-700">Setup inicial completo</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-800">Custo Mensal</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">$150-400</p>
                        <p className="text-sm text-blue-700">Baseado no uso</p>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-800">Capacidade</h4>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">5000+</p>
                        <p className="text-sm text-purple-700">Usuários simultâneos</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold mb-4">Serviços AWS Utilizados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {awsServices.map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <service.icon className="w-8 h-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {service.cost}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deployment">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Passos do Deployment</h2>
            
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">Pré-requisitos</AlertTitle>
              <AlertDescription className="text-orange-700">
                Certifique-se de ter a AWS CLI instalada e configurada com suas credenciais antes de começar.
              </AlertDescription>
            </Alert>

            {deploymentSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {step.commands.join('\n')}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-green-400 hover:text-green-300"
                      onClick={() => copyToClipboard(step.commands.join('\n'), `step-${index}`)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedSection === `step-${index}` ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Script de Setup da Infraestrutura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4">
                  Use nosso script automatizado para configurar toda a infraestrutura na AWS (VPC, RDS, S3, EC2, etc.) de uma vez.
                  <br />
                  <strong className="text-orange-800">⚠️ Importante:</strong> Edite o script após o download para inserir seu par de chaves EC2 e uma senha segura para o banco de dados.
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl" 
                  onClick={handleDownloadScript}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Script de Infra (aws-setup.sh)
                </Button>
                <Alert className="mt-4 border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-800">Como usar o script</AlertTitle>
                  <AlertDescription className="text-orange-700 text-sm space-y-2">
                    <div className="space-y-2 mt-2">
                      <p><strong>1.</strong> Baixe o script e abra-o em um editor de texto.</p>
                      <p><strong>2.</strong> Substitua os valores de <code className="bg-orange-100 text-orange-800 px-1 rounded font-mono">SUA_CHAVE_EC2</code> e <code className="bg-orange-100 text-orange-800 px-1 rounded font-mono">SUA_SENHA_FORTE_PARA_O_BANCO</code>.</p>
                      <p><strong>3.</strong> Dê permissão de execução: <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded font-mono">chmod +x aws-setup.sh</code></p>
                      <p><strong>4.</strong> Execute o script: <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded font-mono">./aws-setup.sh</code></p>
                      <p><strong>5.</strong> O script criará toda a infraestrutura automaticamente!</p>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 O que o script faz:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Cria VPC, subnets e configurações de rede</li>
                    <li>• Configura Security Groups com regras de segurança</li>
                    <li>• Provisiona instância RDS PostgreSQL</li>
                    <li>• Cria bucket S3 para armazenamento</li>
                    <li>• Lança instância EC2 para a aplicação</li>
                    <li>• Exibe resumo completo dos recursos criados</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">💰 Estimativa de Custos (us-east-1):</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• EC2 t3.small: ~$15-20/mês</li>
                    <li>• RDS db.t3.micro: ~$12-15/mês</li>
                    <li>• S3 (primeiros 50GB): ~$1-2/mês</li>
                    <li>• Transferência de dados: ~$5-10/mês</li>
                    <li><strong>Total estimado: $33-47/mês</strong></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Script de Configuração do Servidor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  Este script (`setup-script.sh`) deve ser usado com o comando `aws ec2 run-instances` através da flag `--user-data`. Ele prepara o servidor EC2, instalando Docker e outras ferramentas necessárias para rodar a aplicação.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl" 
                  onClick={handleDownloadEC2Script}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Script de Configuração (setup-script.sh)
                </Button>
                <Alert className="mt-4 border-gray-200 bg-gray-50">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <AlertTitle className="text-gray-800">Exemplo de uso</AlertTitle>
                  <AlertDescription className="text-gray-700 text-sm space-y-2">
                    <pre className="bg-gray-200 text-gray-800 px-2 py-1 mt-2 rounded font-mono text-xs overflow-x-auto">
                      <code>
                        aws ec2 run-instances ... --user-data file://setup-script.sh
                      </code>
                    </pre>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Variáveis de Ambiente</h2>
            
            <Alert className="border-blue-200 bg-blue-50">
              <Settings className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Configuração Sensível</AlertTitle>
              <AlertDescription className="text-blue-700">
                Estas variáveis contêm informações sensíveis. Use AWS Secrets Manager para armazená-las com segurança.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Variáveis Obrigatórias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environmentVariables.map((env, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {env.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${env.key}=${env.value}`, env.key)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm">{env.description}</p>
                      <code className="bg-gray-50 p-2 rounded text-xs block mt-2 text-gray-500">
                        {env.value}
                      </code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Docker Compose para AWS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{dockerComposeContent}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-green-400 hover:text-green-300"
                    onClick={() => copyToClipboard(dockerComposeContent, 'docker-compose')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedSection === 'docker-compose' ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Checklist de Segurança</h2>
            
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Segurança Crítica</AlertTitle>
              <AlertDescription className="text-red-700">
                Complete todos os itens desta lista antes de colocar o sistema em produção.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Itens de Segurança Obrigatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityChecklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className={`w-5 h-5 ${item.done ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={item.done ? 'line-through text-gray-500' : ''}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Security Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Web Tier:</strong> 80, 443 (público)</p>
                    <p><strong>App Tier:</strong> 8000 (apenas web tier)</p>
                    <p><strong>DB Tier:</strong> 5432 (apenas app tier)</p>
                    <p><strong>SSH:</strong> 22 (apenas IPs autorizados)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Criptografia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>RDS:</strong> Encryption at rest habilitada</p>
                    <p><strong>S3:</strong> AES-256 server-side encryption</p>
                    <p><strong>EBS:</strong> Volumes criptografados</p>
                    <p><strong>SSL/TLS:</strong> Certificate Manager</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Monitoramento e Logs</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    CloudWatch Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• CPU e Memory utilization</li>
                    <li>• Database connections</li>
                    <li>• S3 requests e storage</li>
                    <li>• Application response time</li>
                    <li>• Error rate e 5xx responses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Log Aggregation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Application logs (CloudWatch Logs)</li>
                    <li>• Access logs (ALB + CloudFront)</li>
                    <li>• Database query logs</li>
                    <li>• Security audit logs</li>
                    <li>• Performance metrics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alertas Recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600">Críticos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• CPU &gt; 80% por 5min</li>
                      <li>• Memory &gt; 85% por 5min</li>
                      <li>• Disk space &gt; 90%</li>
                      <li>• Database connections &gt; 80%</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Warnings</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Response time &gt; 2s</li>
                      <li>• Error rate &gt; 1%</li>
                      <li>• Failed login attempts</li>
                      <li>• Backup failures</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Informativos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Daily usage reports</li>
                      <li>• Cost anomaly detection</li>
                      <li>• Security scan results</li>
                      <li>• Backup completion</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Dashboard URL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-2">
                  Após o deploy, acesse o dashboard de monitoramento em:
                </p>
                <code className="bg-white p-2 rounded border block">
                  https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=FirstdocyGEDAI
                </code>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="checklist">
          <PublishChecklist categories={deploymentChecklistData} title="Checklist Interativo de Publicação" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
