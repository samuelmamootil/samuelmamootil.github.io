---
layout: layouts/post.njk
title: "CI/CD Explained: Continuous Integration vs Continuous Delivery (2026)"
description: "What is the difference between continuous integration and continuous delivery? A complete guide to CI/CD pipelines with GitHub Actions, Docker, Terraform, and real-world examples from AWS and Azure deployments."
date: 2026-04-18
tags: [DevOps, Cloud, AWS, Azure]
permalink: /writing/cicd-explained/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#what-is-cicd">What is CI/CD?</a></li>
    <li><a href="#ci">Continuous Integration</a></li>
    <li><a href="#cd-delivery">Continuous Delivery</a></li>
    <li><a href="#cd-deployment">Continuous Deployment</a></li>
    <li><a href="#pipeline">Building a CI/CD Pipeline</a></li>
    <li><a href="#github-actions">GitHub Actions Example</a></li>
    <li><a href="#deployment-strategies">Deployment Strategies</a></li>
    <li><a href="#iac-cicd">Infrastructure CI/CD with Terraform</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "CI/CD Explained: Continuous Integration vs Continuous Delivery (2026)",
  "description": "What is the difference between continuous integration and continuous delivery? A complete guide to CI/CD pipelines with GitHub Actions, Docker, and Terraform.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-18",
  "dateModified": "2026-04-18",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/cicd-explained/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between continuous integration and continuous delivery?",
      "acceptedAnswer": { "@type": "Answer", "text": "Continuous Integration (CI) automatically builds and tests code on every commit. Continuous Delivery (CD) extends CI by automatically deploying to staging environments, with a manual approval gate before production. Continuous Deployment goes further — every passing commit deploys to production automatically with no manual step." }
    },
    {
      "@type": "Question",
      "name": "What is the best CI/CD tool in 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "GitHub Actions is the most widely adopted for teams already on GitHub — tight integration, generous free tier, and a huge marketplace of actions. GitLab CI/CD is excellent for self-hosted or GitLab-native teams. Jenkins is still common in enterprises but requires significant maintenance overhead." }
    },
    {
      "@type": "Question",
      "name": "What is a deployment pipeline?",
      "acceptedAnswer": { "@type": "Answer", "text": "A deployment pipeline is an automated sequence of stages that code passes through from commit to production: build, test, security scan, package, deploy to staging, integration test, deploy to production. Each stage acts as a quality gate — failure stops the pipeline." }
    }
  ]
}
</script>

---

## What is CI/CD? {% raw %}{#{% endraw %}what-is-cicd}

CI/CD is the practice of automating the build, test, and deployment of software. Instead of manually building and deploying code, every commit triggers an automated pipeline that validates and ships the change.

```
  WITHOUT CI/CD:
  Developer writes code → manually builds → manually tests →
  manually deploys → hopes nothing breaks → fixes production at 2am

  WITH CI/CD:
  Developer pushes commit → pipeline runs automatically →
  tests pass → deploys to staging → approved → deploys to production
  (all in 10 minutes, while developer works on the next feature)
```

The three terms are often used interchangeably but mean different things:

| Term | What it automates | Manual step? |
|------|------------------|-------------|
| **CI** (Continuous Integration) | Build + test on every commit | None |
| **CD** (Continuous Delivery) | CI + deploy to staging | Manual approval to production |
| **CD** (Continuous Deployment) | CI + deploy to production | None — fully automated |

---

## Continuous Integration {% raw %}{#{% endraw %}ci}

CI means every developer commit triggers an automated build and test run. The goal: catch bugs within minutes, not days.

```
  Developer pushes to feature branch
          │
          ▼
  ┌───────────────────────────────────────────────────┐
  │              CI PIPELINE                           │
  │                                                    │
  │  1. Checkout code                                  │
  │  2. Install dependencies                           │
  │  3. Run linter (code style)                        │
  │  4. Run unit tests                                 │
  │  5. Run integration tests                          │
  │  6. Security scan (SAST, dependency audit)         │
  │  7. Build Docker image                             │
  │  8. Run container tests                            │
  │                                                    │
  │  ✅ All pass → PR can be merged                    │
  │  ❌ Any fail → PR blocked, developer notified      │
  └───────────────────────────────────────────────────┘
```

**CI best practices:**
- Every commit triggers the pipeline — no exceptions
- Pipeline must complete in under 10 minutes (fast feedback)
- Tests must be deterministic — no flaky tests
- Fail fast — run the quickest checks first
- Never merge a failing pipeline

---

## Continuous Delivery {% raw %}{#{% endraw %}cd-delivery}

Continuous Delivery extends CI by automatically deploying every passing build to a staging environment. Production deployment requires a manual approval.

```
  CI passes
      │
      ▼
  Deploy to STAGING (automatic)
      │
      ▼
  Run smoke tests on staging
      │
      ▼
  ┌─────────────────────────┐
  │  Manual approval gate   │  ← Human reviews staging
  │  (product owner / QA)   │
  └────────────┬────────────┘
               │ Approved
               ▼
  Deploy to PRODUCTION (automatic after approval)
```

---

## Continuous Deployment {% raw %}{#{% endraw %}cd-deployment}

Continuous Deployment removes the manual gate — every commit that passes all tests deploys to production automatically.

```
  Commit → CI → Staging → Automated tests → PRODUCTION
                                            (no human approval)
```

This requires extremely high test coverage and confidence in your pipeline. Companies like Netflix, Amazon, and GitHub deploy to production hundreds of times per day using this model.

---

## Building a CI/CD Pipeline {% raw %}{#{% endraw %}pipeline}

```
  ┌─────────────────────────────────────────────────────────┐
  │                  FULL CI/CD PIPELINE                     │
  │                                                          │
  │  SOURCE          BUILD           TEST            DEPLOY  │
  │  ──────          ─────           ────            ──────  │
  │  Git push   →  Compile/    →  Unit tests   →  Staging   │
  │               Install         Integration      (auto)   │
  │               deps            E2E tests                  │
  │               Lint            Security scan              │
  │               Docker build    Performance                │
  │               Image scan      Contract tests             │
  │                                    │                     │
  │                               ┌────┴────┐               │
  │                               │Approval?│               │
  │                               └────┬────┘               │
  │                                    │ Yes                 │
  │                                    ▼                     │
  │                               Production                 │
  │                               (blue/green)               │
  └─────────────────────────────────────────────────────────┘
```

---

## GitHub Actions Example {% raw %}{#{% endraw %}github-actions}

A complete CI/CD pipeline for a containerised application deploying to AWS ECS:

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: my-app
  ECS_SERVICE: my-app-service
  ECS_CLUSTER: production

jobs:
  # ── CI: Build and Test ──────────────────────────────────
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: pip

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Lint
        run: ruff check .

      - name: Unit tests
        run: pytest tests/unit/ -v --cov=app --cov-report=xml

      - name: Security scan
        run: |
          pip install bandit safety
          bandit -r app/
          safety check

  # ── CD: Build image and deploy ──────────────────────────
  deploy:
    needs: ci
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials (OIDC — no stored keys)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions-deploy
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: task-definition.json
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```

---

## Deployment Strategies {% raw %}{#{% endraw %}deployment-strategies}

| Strategy | How it works | Downtime | Rollback speed | Risk |
|----------|-------------|----------|---------------|------|
| **Recreate** | Stop old, start new | Yes | Slow | High |
| **Rolling** | Replace instances one by one | No | Medium | Medium |
| **Blue/Green** | Run both versions, switch traffic | No | Instant | Low |
| **Canary** | Route 5% traffic to new version, monitor, increase | No | Instant | Very low |
| **Feature flags** | Deploy code, enable feature separately | No | Instant | Very low |

**Blue/Green with AWS CodeDeploy:**

```hcl
resource "aws_codedeploy_deployment_group" "app" {
  app_name               = aws_codedeploy_app.app.name
  deployment_group_name  = "production"
  service_role_arn       = aws_iam_role.codedeploy.arn
  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }
    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 5
    }
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route { listener_arns = [aws_lb_listener.https.arn] }
      target_group { name = aws_lb_target_group.blue.name }
      target_group { name = aws_lb_target_group.green.name }
    }
  }
}
```

---

## Infrastructure CI/CD with Terraform {% raw %}{#{% endraw %}iac-cicd}

Infrastructure changes should go through CI/CD too — not applied manually from a laptop.

```yaml
# .github/workflows/terraform.yml
name: Terraform CI/CD

on:
  pull_request:
    paths: ['terraform/**']
  push:
    branches: [main]
    paths: ['terraform/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.9.0

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/terraform-ci
          aws-region: us-east-1

      - name: Terraform Init
        run: terraform -chdir=terraform init

      - name: Terraform Validate
        run: terraform -chdir=terraform validate

      - name: Terraform Plan
        run: terraform -chdir=terraform plan -out=tfplan

      - name: Post plan to PR
        uses: actions/github-script@v7
        # Posts the plan output as a PR comment

  apply:
    needs: plan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production  # requires manual approval in GitHub
    steps:
      - name: Terraform Apply
        run: terraform -chdir=terraform apply tfplan
```

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is the difference between continuous integration and continuous delivery?**
CI automatically builds and tests every commit. Continuous Delivery extends CI by automatically deploying to staging, with a manual approval gate before production. Continuous Deployment removes the manual gate entirely.

**What is the best CI/CD tool in 2026?**
GitHub Actions for teams on GitHub — tight integration, generous free tier, huge marketplace. GitLab CI/CD for self-hosted or GitLab teams. Jenkins for enterprises with existing investment. Azure DevOps Pipelines for Microsoft-stack teams.

**What is a deployment pipeline?**
An automated sequence of stages — build, test, security scan, package, deploy to staging, integration test, deploy to production. Each stage is a quality gate. Failure stops the pipeline and notifies the team.

**How do you roll back a bad deployment?**
Blue/green: switch traffic back to the old version instantly. Canary: reduce traffic to new version to 0%. Feature flags: disable the feature without redeploying. Rolling: redeploy the previous image tag. The fastest rollback is always blue/green or feature flags.

---

*Building CI/CD pipelines on AWS or Azure? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
