---
layout: layouts/casestudy.njk
title: "Wipro — Cloud Data Platform Engineering"
pageDescription: "How Samuel Mamootil led a 7-engineer team at Wipro to build reusable AWS infrastructure for Redshift, Glue, and S3 data workloads — enabling reliable, automated cloud data platform delivery for Alight Solutions."
company: Wipro
companyUrl: "https://www.wipro.com/"
role: "Tech Lead — Cloud & Data Platform Engineering"
period: "Feb 2024 – Apr 2025"
location: "Mumbai, India"
logoText: Wipro
logoColor: "#9b1c1c"
eyebrow: "AWS · Data Engineering · Infrastructure Automation"
headline: "Enabling a cloud data platform that gave a global benefits provider reliable, automated infrastructure for its data workloads."
context: "Alight Solutions, a global HR and benefits technology company, needed a stable, scalable cloud data platform on AWS to support growing data engineering workloads. The existing infrastructure had gaps in automation, consistency, and operational reliability — slowing down the data engineering team's ability to ship."
challenge: "The team needed reusable, production-grade AWS infrastructure that could support Redshift clusters, Glue ETL jobs, and S3-based data pipelines — without requiring manual provisioning for every new workload. Deployment processes were inconsistent, and there was limited visibility into infrastructure state."
approach: "Led a 7-engineer team to design and deliver reusable Terraform modules for core AWS resources. Standardised the provisioning of Redshift, Glue, S3, and supporting IAM and networking components. Introduced blue-green deployment patterns to reduce deployment risk and implemented secure automation practices across the platform."
tools:
  - AWS
  - Terraform
  - Amazon Redshift
  - AWS Glue
  - Amazon S3
  - IAM
  - VPC
  - GitHub Actions
  - Python
architecture: "Modular Terraform codebase with environment-specific variable files. Redshift clusters provisioned behind private subnets with IAM role-based access. Glue jobs triggered via EventBridge schedules with S3 as the data lake layer. Blue-green deployment strategy applied to infrastructure changes to minimise blast radius."
owned:
  - "Technical leadership of a 7-engineer cloud and data platform team"
  - "Terraform module design and reusability standards"
  - "AWS infrastructure provisioning for Redshift, Glue, and S3 workloads"
  - "Secure automation patterns and IAM governance"
  - "Blue-green deployment strategy for infrastructure changes"
outcomes:
  - "Delivered reusable Terraform modules that reduced provisioning time for new data workloads"
  - "Standardised infrastructure across environments, reducing configuration drift"
  - "Blue-green deployment approach reduced deployment-related incidents"
  - "Data engineering team gained reliable, self-service infrastructure for pipeline development"
lessons: "Reusability in IaC pays off fastest when the team agrees on module boundaries early. Investing in blue-green patterns for infrastructure — not just application deployments — meaningfully reduces operational risk."
tags:
  - AWS
  - Terraform
  - Redshift
  - Glue
  - S3
  - Data Platform
  - IaC
  - Blue-Green Deployment
---
<!-- case study -->
