import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Copy,
  Server,
  Database,
  Globe,
  Shield
} from 'lucide-react';

export default function AWSDeploymentScript() {
  const [deploymentConfig, setDeploymentConfig] = useState({
    domainName: '',
    awsRegion: 'us-east-1',
    instanceType: 't3.small',
    dbInstanceClass: 'db.t3.micro',
    environment: 'production'
  });
  
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState([]);

  const generateDeploymentScript = () => {
    const { domainName, awsRegion, instanceType, dbInstanceClass, environment } = deploymentConfig;
    
    return `#!/bin/bash
# FIRSTDOCY GED AI - AWS Deployment Script
# Generated on: ${new Date().toISOString()}

set -e

# Configuration
DOMAIN_NAME="${domainName}"
AWS_REGION="${awsRegion}"
INSTANCE_TYPE="${instanceType}"
DB_INSTANCE_CLASS="${dbInstanceClass}"
ENVIRONMENT="${environment}"

echo "🚀 Starting FIRSTDOCY GED AI deployment to AWS..."
echo "Domain: $DOMAIN_NAME"
echo "Region: $AWS_REGION"
echo "Environment: $ENVIRONMENT"
echo ""

# Step 1: Create VPC and Networking
echo "📡 Creating VPC and networking components..."
VPC_ID=$(aws ec2 create-vpc \\
    --cidr-block 10.0.0.0/16 \\
    --region $AWS_REGION \\
    --query 'Vpc.VpcId' \\
    --output text)

aws ec2 create-tags \\
    --resources $VPC_ID \\
    --tags Key=Name,Value=firstdocy-vpc \\
    --region $AWS_REGION

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \\
    --region $AWS_REGION \\
    --query 'InternetGateway.InternetGatewayId' \\
    --output text)

aws ec2 attach-internet-gateway \\
    --internet-gateway-id $IGW_ID \\
    --vpc-id $VPC_ID \\
    --region $AWS_REGION

# Create Public Subnet
PUBLIC_SUBNET_ID=$(aws ec2 create-subnet \\
    --vpc-id $VPC_ID \\
    --cidr-block 10.0.1.0/24 \\
    --availability-zone \${AWS_REGION}a \\
    --region $AWS_REGION \\
    --query 'Subnet.SubnetId' \\
    --output text)

# Create Private Subnet
PRIVATE_SUBNET_ID=$(aws ec2 create-subnet \\
    --vpc-id $VPC_ID \\
    --cidr-block 10.0.2.0/24 \\
    --availability-zone \${AWS_REGION}b \\
    --region $AWS_REGION \\
    --query 'Subnet.SubnetId' \\
    --output text)

echo "✅ VPC created: $VPC_ID"

# Step 2: Create Security Groups
echo "🔒 Creating security groups..."

# Web Security Group
WEB_SG_ID=$(aws ec2 create-security-group \\
    --group-name firstdocy-web-sg \\
    --description "FIRSTDOCY Web Security Group" \\
    --vpc-id $VPC_ID \\
    --region $AWS_REGION \\
    --query 'GroupId' \\
    --output text)

aws ec2 authorize-security-group-ingress \\
    --group-id $WEB_SG_ID \\
    --protocol tcp \\
    --port 80 \\
    --cidr 0.0.0.0/0 \\
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \\
    --group-id $WEB_SG_ID \\
    --protocol tcp \\
    --port 443 \\
    --cidr 0.0.0.0/0 \\
    --region $AWS_REGION

# Database Security Group
DB_SG_ID=$(aws ec2 create-security-group \\
    --group-name firstdocy-db-sg \\
    --description "FIRSTDOCY Database Security Group" \\
    --vpc-id $VPC_ID \\
    --region $AWS_REGION \\
    --query 'GroupId' \\
    --output text)

aws ec2 authorize-security-group-ingress \\
    --group-id $DB_SG_ID \\
    --protocol tcp \\
    --port 5432 \\
    --source-group $WEB_SG_ID \\
    --region $AWS_REGION

echo "✅ Security groups created"

# Step 3: Create S3 Bucket
echo "📦 Creating S3 bucket for file storage..."
S3_BUCKET="firstdocy-files-$(date +%s)"
aws s3 mb s3://$S3_BUCKET --region $AWS_REGION

# Enable versioning
aws s3api put-bucket-versioning \\
    --bucket $S3_BUCKET \\
    --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \\
    --bucket $S3_BUCKET \\
    --server-side-encryption-configuration \\
    '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

echo "✅ S3 bucket created: $S3_BUCKET"

# Step 4: Create RDS Database
echo "🗄️ Creating RDS PostgreSQL database..."

# Create DB Subnet Group
aws rds create-db-subnet-group \\
    --db-subnet-group-name firstdocy-subnet-group \\
    --db-subnet-group-description "FIRSTDOCY DB Subnet Group" \\
    --subnet-ids $PUBLIC_SUBNET_ID $PRIVATE_SUBNET_ID \\
    --region $AWS_REGION

# Generate random password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Create RDS instance
aws rds create-db-instance \\
    --db-instance-identifier firstdocy-db \\
    --db-instance-class $DB_INSTANCE_CLASS \\
    --engine postgres \\
    --engine-version 14.9 \\
    --allocated-storage 20 \\
    --storage-type gp2 \\
    --master-username firstdocy \\
    --master-user-password "$DB_PASSWORD" \\
    --vpc-security-group-ids $DB_SG_ID \\
    --db-subnet-group-name firstdocy-subnet-group \\
    --region $AWS_REGION \\
    --backup-retention-period 7 \\
    --storage-encrypted

echo "✅ RDS database creation initiated"

# Step 5: Create EC2 Instance
echo "🖥️ Creating EC2 instance..."

# Create key pair
aws ec2 create-key-pair \\
    --key-name firstdocy-key \\
    --region $AWS_REGION \\
    --query 'KeyMaterial' \\
    --output text > firstdocy-key.pem

chmod 400 firstdocy-key.pem

# Launch EC2 instance
INSTANCE_ID=$(aws ec2 run-instances \\
    --image-id ami-0abcdef1234567890 \\
    --instance-type $INSTANCE_TYPE \\
    --key-name firstdocy-key \\
    --security-group-ids $WEB_SG_ID \\
    --subnet-id $PUBLIC_SUBNET_ID \\
    --associate-public-ip-address \\
    --region $AWS_REGION \\
    --user-data file://user-data.sh \\
    --query 'Instances[0].InstanceId' \\
    --output text)

echo "✅ EC2 instance created: $INSTANCE_ID"

# Step 6: Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
echo "This may take 10-15 minutes..."

# Wait for RDS
aws rds wait db-instance-available \\
    --db-instance-identifier firstdocy-db \\
    --region $AWS_REGION

# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \\
    --db-instance-identifier firstdocy-db \\
    --region $AWS_REGION \\
    --query 'DBInstances[0].Endpoint.Address' \\
    --output text)

# Wait for EC2
aws ec2 wait instance-running \\
    --instance-ids $INSTANCE_ID \\
    --region $AWS_REGION

# Get EC2 public IP
PUBLIC_IP=$(aws ec2 describe-instances \\
    --instance-ids $INSTANCE_ID \\
    --region $AWS_REGION \\
    --query 'Reservations[0].Instances[0].PublicIpAddress' \\
    --output text)

echo "✅ All services are ready!"

# Step 7: Generate environment configuration
echo "📝 Generating environment configuration..."

cat > .env.production << EOF
# FIRSTDOCY GED AI - Production Environment
DATABASE_URL=postgresql://firstdocy:$DB_PASSWORD@$DB_ENDPOINT:5432/firstdocy
AWS_REGION=$AWS_REGION
S3_BUCKET=$S3_BUCKET
DOMAIN_NAME=$DOMAIN_NAME
INSTANCE_ID=$INSTANCE_ID
VPC_ID=$VPC_ID
WEB_SG_ID=$WEB_SG_ID
DB_SG_ID=$DB_SG_ID
PUBLIC_IP=$PUBLIC_IP

# Email Configuration (Amazon SES)
SMTP_HOST=email-smtp.$AWS_REGION.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=true

# Security
JWT_SECRET=$(openssl rand -base64 64 | tr -d "\\n")
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d "\\n")
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "\\n")
EOF

echo "🎉 FIRSTDOCY GED AI deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  Domain: $DOMAIN_NAME"
echo "  Public IP: $PUBLIC_IP" 
echo "  Database: $DB_ENDPOINT"
echo "  S3 Bucket: $S3_BUCKET"
echo "  Instance: $INSTANCE_ID"
echo ""
echo "🔑 Next Steps:"
echo "  1. Configure your domain DNS to point to: $PUBLIC_IP"
echo "  2. Access your application at: http://$PUBLIC_IP"
echo "  3. Setup SSL certificate using AWS Certificate Manager"
echo "  4. Configure email settings in the admin panel"
echo ""
echo "💾 Configuration saved to: .env.production"
echo "🔐 SSH Key saved to: firstdocy-key.pem"
echo ""
echo "📚 Documentation: https://docs.firstdocy.com/aws-deployment"
echo "🆘 Support: suporte@firstdocy.com"
`;
  };

  const handleDownloadScript = () => {
    const script = generateDeploymentScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firstdocy-aws-deploy.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyScript = () => {
    const script = generateDeploymentScript();
    navigator.clipboard.writeText(script);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Gerador de Script de Deploy AWS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domainName">Nome do Domínio</Label>
              <Input
                id="domainName"
                placeholder="app.suaempresa.com"
                value={deploymentConfig.domainName}
                onChange={(e) => setDeploymentConfig(prev => ({
                  ...prev,
                  domainName: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="awsRegion">Região AWS</Label>
              <select
                id="awsRegion"
                className="w-full p-2 border rounded"
                value={deploymentConfig.awsRegion}
                onChange={(e) => setDeploymentConfig(prev => ({
                  ...prev,
                  awsRegion: e.target.value
                }))}
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="sa-east-1">South America (São Paulo)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="instanceType">Tipo de Instância EC2</Label>
              <select
                id="instanceType"
                className="w-full p-2 border rounded"
                value={deploymentConfig.instanceType}
                onChange={(e) => setDeploymentConfig(prev => ({
                  ...prev,
                  instanceType: e.target.value
                }))}
              >
                <option value="t3.micro">t3.micro (1 vCPU, 1GB RAM) - Teste</option>
                <option value="t3.small">t3.small (2 vCPU, 2GB RAM) - Pequeno</option>
                <option value="t3.medium">t3.medium (2 vCPU, 4GB RAM) - Médio</option>
                <option value="t3.large">t3.large (2 vCPU, 8GB RAM) - Grande</option>
              </select>
            </div>
            <div>
              <Label htmlFor="dbInstanceClass">Classe do Banco RDS</Label>
              <select
                id="dbInstanceClass"
                className="w-full p-2 border rounded"
                value={deploymentConfig.dbInstanceClass}
                onChange={(e) => setDeploymentConfig(prev => ({
                  ...prev,
                  dbInstanceClass: e.target.value
                }))}
              >
                <option value="db.t3.micro">db.t3.micro (1 vCPU, 1GB RAM)</option>
                <option value="db.t3.small">db.t3.small (2 vCPU, 2GB RAM)</option>
                <option value="db.t3.medium">db.t3.medium (2 vCPU, 4GB RAM)</option>
              </select>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Este script criará recursos na AWS que podem gerar custos. Revise a configuração antes de executar.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleDownloadScript} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Baixar Script
            </Button>
            <Button variant="outline" onClick={copyScript} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copiar Script
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">EC2 Instance</h3>
            <Badge variant="outline">{deploymentConfig.instanceType}</Badge>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">RDS PostgreSQL</h3>
            <Badge variant="outline">{deploymentConfig.dbInstanceClass}</Badge>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">S3 + CloudFront</h3>
            <Badge variant="outline">File Storage</Badge>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Security</h3>
            <Badge variant="outline">SSL + WAF</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}