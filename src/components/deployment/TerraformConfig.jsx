import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Copy, Download } from 'lucide-react';

export default function TerraformConfig() {
  const terraformConfig = `# FIRSTDOCY GED AI - Terraform Configuration for AWS
# Version: 1.0
# Provider: AWS
# Maintained by: FIRSTDOCY Team

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

# VPC Configuration
resource "aws_vpc" "firstdocy_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "firstdocy-vpc"
    Environment = var.environment
    Project     = "FIRSTDOCY-GED-AI"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "firstdocy_igw" {
  vpc_id = aws_vpc.firstdocy_vpc.id

  tags = {
    Name        = "firstdocy-igw"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.firstdocy_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "\${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "firstdocy-public-subnet"
    Environment = var.environment
    Type        = "Public"
  }
}

# Private Subnet
resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.firstdocy_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "\${var.aws_region}b"

  tags = {
    Name        = "firstdocy-private-subnet"
    Environment = var.environment
    Type        = "Private"
  }
}

# Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.firstdocy_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.firstdocy_igw.id
  }

  tags = {
    Name        = "firstdocy-public-rt"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Security Groups
resource "aws_security_group" "web_sg" {
  name_prefix = "firstdocy-web-"
  vpc_id      = aws_vpc.firstdocy_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict this in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "firstdocy-web-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "db_sg" {
  name_prefix = "firstdocy-db-"
  vpc_id      = aws_vpc.firstdocy_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  tags = {
    Name        = "firstdocy-db-sg"
    Environment = var.environment
  }
}

# S3 Bucket for file storage
resource "aws_s3_bucket" "firstdocy_files" {
  bucket_prefix = "firstdocy-files-"

  tags = {
    Name        = "firstdocy-files"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "firstdocy_files_versioning" {
  bucket = aws_s3_bucket.firstdocy_files.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "firstdocy_files_encryption" {
  bucket = aws_s3_bucket.firstdocy_files.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "firstdocy_files_pab" {
  bucket = aws_s3_bucket.firstdocy_files.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# RDS Subnet Group
resource "aws_db_subnet_group" "firstdocy_db_subnet_group" {
  name       = "firstdocy-db-subnet-group"
  subnet_ids = [aws_subnet.public_subnet.id, aws_subnet.private_subnet.id]

  tags = {
    Name        = "firstdocy-db-subnet-group"
    Environment = var.environment
  }
}

# RDS Database
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "aws_db_instance" "firstdocy_db" {
  identifier     = "firstdocy-db"
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = "firstdocy"
  username = "firstdocy"
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.firstdocy_db_subnet_group.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "firstdocy-db-final-snapshot-\${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  tags = {
    Name        = "firstdocy-db"
    Environment = var.environment
  }
}

# Key Pair
resource "aws_key_pair" "firstdocy_key" {
  key_name   = "firstdocy-key"
  public_key = file("~/.ssh/id_rsa.pub") # Make sure you have this key
}

# EC2 Instance
resource "aws_instance" "firstdocy_app" {
  ami                    = "ami-0abcdef1234567890" # Update with latest Amazon Linux 2
  instance_type          = var.instance_type
  key_name              = aws_key_pair.firstdocy_key.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  subnet_id             = aws_subnet.public_subnet.id

  user_data = base64encode(templatefile("user-data.sh", {
    db_endpoint = aws_db_instance.firstdocy_db.endpoint
    db_password = random_password.db_password.result
    s3_bucket   = aws_s3_bucket.firstdocy_files.bucket
    aws_region  = var.aws_region
  }))

  tags = {
    Name        = "firstdocy-app"
    Environment = var.environment
  }
}

# Outputs
output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.firstdocy_app.public_ip
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.firstdocy_db.endpoint
  sensitive   = true
}

output "database_password" {
  description = "Database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.firstdocy_files.bucket
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.firstdocy_vpc.id
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "firstdocy_logs" {
  name              = "/aws/ec2/firstdocy"
  retention_in_days = 30

  tags = {
    Name        = "firstdocy-logs"
    Environment = var.environment
  }
}

# IAM Role for EC2
resource "aws_iam_role" "firstdocy_ec2_role" {
  name = "firstdocy-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "firstdocy_ec2_policy" {
  name = "firstdocy-ec2-policy"
  role = aws_iam_role.firstdocy_ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.firstdocy_files.arn,
          "\${aws_s3_bucket.firstdocy_files.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "firstdocy_profile" {
  name = "firstdocy-profile"
  role = aws_iam_role.firstdocy_ec2_role.name
}`;

  const handleDownload = () => {
    const blob = new Blob([terraformConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(terraformConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Configuração Terraform
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Use esta configuração Terraform para deploy automatizado e versionado da infraestrutura AWS.
        </p>
        
        <div className="flex gap-2 mb-4">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar main.tf
          </Button>
          <Button variant="outline" onClick={copyConfig} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copiar Código
          </Button>
        </div>

        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{terraformConfig}</pre>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Como usar:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Baixe o arquivo main.tf</li>
            <li>Configure suas credenciais AWS</li>
            <li>Execute: <code className="bg-blue-100 px-1 rounded">terraform init</code></li>
            <li>Execute: <code className="bg-blue-100 px-1 rounded">terraform plan</code></li>
            <li>Execute: <code className="bg-blue-100 px-1 rounded">terraform apply</code></li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}