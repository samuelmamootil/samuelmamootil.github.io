---
layout: layouts/post.njk
title: "How to Design a Secure VPC Architecture on AWS (2026)"
description: "How to design a secure Virtual Private Cloud (VPC) architecture on AWS. Covers subnets, route tables, security groups, NACLs, VPC endpoints, NAT Gateway, and a production-ready Terraform example."
date: 2026-04-14
tags: [Cloud, AWS, Security, Architecture]
permalink: /writing/secure-vpc-architecture/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#what-is-vpc">What is a VPC?</a></li>
    <li><a href="#subnet-design">Subnet Design</a></li>
    <li><a href="#routing">Routing and Gateways</a></li>
    <li><a href="#security-groups">Security Groups vs NACLs</a></li>
    <li><a href="#vpc-endpoints">VPC Endpoints</a></li>
    <li><a href="#production-design">Production VPC Design</a></li>
    <li><a href="#terraform">Terraform Implementation</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Design a Secure VPC Architecture on AWS (2026)",
  "description": "How to design a secure Virtual Private Cloud (VPC) architecture on AWS. Covers subnets, route tables, security groups, NACLs, VPC endpoints, NAT Gateway, and Terraform.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-14",
  "dateModified": "2026-04-14",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/secure-vpc-architecture/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a VPC in AWS?",
      "acceptedAnswer": { "@type": "Answer", "text": "A Virtual Private Cloud (VPC) is a logically isolated section of the AWS cloud where you launch resources in a virtual network you define. You control IP address ranges, subnets, route tables, and network gateways." }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a security group and a NACL?",
      "acceptedAnswer": { "@type": "Answer", "text": "Security groups are stateful firewalls at the instance level — return traffic is automatically allowed. NACLs (Network Access Control Lists) are stateless firewalls at the subnet level — you must explicitly allow both inbound and outbound traffic." }
    },
    {
      "@type": "Question",
      "name": "What is a VPC endpoint and why should I use it?",
      "acceptedAnswer": { "@type": "Answer", "text": "A VPC endpoint lets your instances communicate with AWS services (S3, DynamoDB, Secrets Manager) without traffic leaving the AWS network. This improves security (no internet exposure), reduces latency, and eliminates NAT Gateway data processing charges for that traffic." }
    }
  ]
}
</script>

---

## What is a VPC? {% raw %}{#{% endraw %}what-is-vpc}

A Virtual Private Cloud (VPC) is your own isolated network within AWS. Think of it as your private data centre inside AWS — you define the IP ranges, subnets, routing, and access controls.

Every AWS account gets a default VPC. **Never use the default VPC for production.** It puts everything in public subnets with permissive defaults.

---

## Subnet Design {% raw %}{#{% endraw %}subnet-design}

The golden rule: **resources should only be as accessible as they need to be.**

```
  VPC: 10.0.0.0/16  (65,536 IP addresses)
  │
  ├── PUBLIC SUBNETS (10.0.1.0/24, 10.0.2.0/24)
  │   Direct route to Internet Gateway
  │   Only load balancers and NAT Gateways live here
  │
  ├── PRIVATE SUBNETS (10.0.11.0/24, 10.0.12.0/24)
  │   Route to internet via NAT Gateway only
  │   Application servers, ECS tasks, Lambda (VPC-attached)
  │
  └── ISOLATED SUBNETS (10.0.21.0/24, 10.0.22.0/24)
      No route to internet at all
      RDS databases, ElastiCache, internal services
```

Spread subnets across **at least 2 Availability Zones** for high availability.

---

## Routing and Gateways {% raw %}{#{% endraw %}routing}

```
  INTERNET
      │
      ▼
  ┌─────────────────────────────────────────────────────┐
  │  Internet Gateway (IGW)                              │
  │  Allows bidirectional internet traffic               │
  └──────────────────────┬──────────────────────────────┘
                         │
  ┌──────────────────────▼──────────────────────────────┐
  │  PUBLIC SUBNET                                       │
  │  Route: 0.0.0.0/0 → IGW                             │
  │                                                      │
  │  ┌─────────────┐    ┌─────────────────────────┐     │
  │  │    ALB      │    │     NAT Gateway          │     │
  │  │ (port 443)  │    │ (outbound for private)   │     │
  │  └──────┬──────┘    └────────────┬────────────┘     │
  └─────────┼───────────────────────┼───────────────────┘
            │                       │
  ┌─────────▼───────────────────────▼───────────────────┐
  │  PRIVATE SUBNET                                      │
  │  Route: 0.0.0.0/0 → NAT Gateway                     │
  │                                                      │
  │  ┌─────────────┐    ┌─────────────────────────┐     │
  │  │  App Server │    │     ECS Tasks            │     │
  │  │  (port 8080)│    │     Lambda functions     │     │
  │  └──────┬──────┘    └────────────┬────────────┘     │
  └─────────┼───────────────────────┼───────────────────┘
            │                       │
  ┌─────────▼───────────────────────▼───────────────────┐
  │  ISOLATED SUBNET                                     │
  │  No route to internet                                │
  │                                                      │
  │  ┌─────────────┐    ┌─────────────────────────┐     │
  │  │  RDS (5432) │    │     ElastiCache (6379)   │     │
  │  └─────────────┘    └─────────────────────────┘     │
  └─────────────────────────────────────────────────────┘
```

---

## Security Groups vs NACLs {% raw %}{#{% endraw %}security-groups}

| Feature | Security Group | NACL |
|---------|---------------|------|
| Level | Instance / ENI | Subnet |
| Stateful? | Yes — return traffic auto-allowed | No — must allow both directions |
| Rules | Allow only | Allow and Deny |
| Evaluation | All rules evaluated | Rules evaluated in order (lowest number first) |
| Default | Deny all inbound, allow all outbound | Allow all inbound and outbound |

**Security group for an application server:**

```hcl
resource "aws_security_group" "app" {
  name   = "app-server"
  vpc_id = aws_vpc.main.id

  # Only accept traffic from the load balancer
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Allow all outbound (to reach RDS, S3, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name   = "rds-postgres"
  vpc_id = aws_vpc.main.id

  # Only accept connections from app servers
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}
```

---

## VPC Endpoints {% raw %}{#{% endraw %}vpc-endpoints}

Without VPC endpoints, traffic from your private subnet to S3 or DynamoDB travels through the NAT Gateway — costing money and leaving the AWS network.

```
  WITHOUT VPC ENDPOINT:
  Private Subnet → NAT Gateway → Internet → S3
  Cost: NAT Gateway data processing ($0.045/GB)

  WITH VPC ENDPOINT:
  Private Subnet → VPC Endpoint → S3 (stays in AWS network)
  Cost: Free for Gateway endpoints (S3, DynamoDB)
```

```hcl
# Gateway endpoint for S3 (free)
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id]
}

# Interface endpoint for Secrets Manager (hourly charge applies)
resource "aws_vpc_endpoint" "secrets_manager" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.secretsmanager"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
}
```

I add S3, DynamoDB, ECR, Secrets Manager, and SSM endpoints on every AWS project as baseline infrastructure.

---

## Production VPC Design {% raw %}{#{% endraw %}production-design}

```
  REGION: us-east-1
  VPC CIDR: 10.0.0.0/16

  AZ-1 (us-east-1a)          AZ-2 (us-east-1b)
  ─────────────────           ─────────────────
  Public:  10.0.1.0/24        Public:  10.0.2.0/24
  Private: 10.0.11.0/24       Private: 10.0.12.0/24
  Isolated:10.0.21.0/24       Isolated:10.0.22.0/24

  PUBLIC TIER:
  ├── ALB (HTTPS 443 → HTTP 8080)
  ├── NAT Gateway AZ-1
  └── NAT Gateway AZ-2 (HA)

  PRIVATE TIER:
  ├── ECS Fargate tasks (app)
  ├── Lambda functions
  └── Internal ALB (microservices)

  ISOLATED TIER:
  ├── RDS PostgreSQL (Multi-AZ)
  ├── ElastiCache Redis (cluster mode)
  └── OpenSearch domain

  VPC ENDPOINTS:
  ├── S3 (Gateway — free)
  ├── DynamoDB (Gateway — free)
  ├── ECR API + DKR (Interface)
  ├── Secrets Manager (Interface)
  └── SSM + SSM Messages (Interface)
```

---

## Terraform Implementation {% raw %}{#{% endraw %}terraform}

```hcl
locals {
  azs             = ["us-east-1a", "us-east-1b"]
  public_cidrs    = ["10.0.1.0/24",  "10.0.2.0/24"]
  private_cidrs   = ["10.0.11.0/24", "10.0.12.0/24"]
  isolated_cidrs  = ["10.0.21.0/24", "10.0.22.0/24"]
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "production-vpc" }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.public_cidrs[count.index]
  availability_zone = local.azs[count.index]
  tags = { Name = "public-${local.azs[count.index]}", Tier = "public" }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_cidrs[count.index]
  availability_zone = local.azs[count.index]
  tags = { Name = "private-${local.azs[count.index]}", Tier = "private" }
}

resource "aws_subnet" "isolated" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.isolated_cidrs[count.index]
  availability_zone = local.azs[count.index]
  tags = { Name = "isolated-${local.azs[count.index]}", Tier = "isolated" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_eip" "nat" {
  count  = 2
  domain = "vpc"
}

resource "aws_nat_gateway" "main" {
  count         = 2
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  depends_on    = [aws_internet_gateway.main]
}

resource "aws_route_table" "private" {
  count  = 2
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
```

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is a VPC in AWS?**
A VPC is a logically isolated virtual network in AWS where you launch resources. You control IP ranges, subnets, routing, and access controls — like your own private data centre inside AWS.

**What is the difference between a security group and a NACL?**
Security groups are stateful instance-level firewalls — return traffic is automatically allowed. NACLs are stateless subnet-level firewalls — you must explicitly allow both inbound and outbound traffic. Use security groups as your primary control; NACLs for subnet-level defence in depth.

**What is a VPC endpoint and why should I use it?**
A VPC endpoint lets your instances reach AWS services (S3, DynamoDB, Secrets Manager) without traffic leaving the AWS network. Improves security, reduces latency, and eliminates NAT Gateway charges for that traffic. S3 and DynamoDB Gateway endpoints are free.

**Should I use one VPC or multiple VPCs?**
For most organisations: one VPC per environment (prod, staging, dev) in the same account, or one VPC per account using AWS Organizations. Use VPC peering or AWS Transit Gateway to connect them when needed.

---

*Designing a production VPC architecture? [Let's talk on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
