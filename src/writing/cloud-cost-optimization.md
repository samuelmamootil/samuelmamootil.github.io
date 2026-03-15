---
layout: layouts/post.njk
title: "How to Optimize and Forecast Cloud Costs: A FinOps Guide (2026)"
description: "How to optimize and forecast cloud costs on AWS and Azure. Covers FinOps framework, rightsizing, reserved instances, spot instances, tagging strategy, cost anomaly detection, and forecasting with real Terraform and CLI examples."
date: 2026-04-12
tags: [Cloud, AWS, Azure, FinOps, Architecture]
permalink: /writing/cloud-cost-optimization/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#why-costs-spiral">Why Cloud Costs Spiral Out of Control</a></li>
    <li><a href="#finops">The FinOps Framework</a></li>
    <li><a href="#rightsizing">Rightsizing Compute</a></li>
    <li><a href="#pricing-models">Pricing Models: On-Demand vs Reserved vs Spot</a></li>
    <li><a href="#tagging">Tagging Strategy for Cost Allocation</a></li>
    <li><a href="#forecasting">Forecasting Cloud Costs</a></li>
    <li><a href="#anomaly">Cost Anomaly Detection</a></li>
    <li><a href="#tools">Tools Comparison</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize and Forecast Cloud Costs: A FinOps Guide (2026)",
  "description": "How to optimize and forecast cloud costs on AWS and Azure. Covers FinOps framework, rightsizing, reserved instances, spot instances, tagging strategy, and cost anomaly detection.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-12",
  "dateModified": "2026-04-12",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/cloud-cost-optimization/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you optimize cloud costs on AWS?",
      "acceptedAnswer": { "@type": "Answer", "text": "The highest-impact actions are: rightsize underutilised EC2 instances using AWS Compute Optimizer, purchase Reserved Instances or Savings Plans for steady-state workloads (saves 30-72%), use Spot Instances for fault-tolerant batch jobs, enforce resource tagging for cost allocation, and set up AWS Cost Anomaly Detection for alerts." }
    },
    {
      "@type": "Question",
      "name": "What is FinOps?",
      "acceptedAnswer": { "@type": "Answer", "text": "FinOps (Financial Operations) is a cloud financial management practice that brings together finance, engineering, and business teams to make data-driven decisions about cloud spending. The goal is not to minimise cost but to maximise business value per dollar spent." }
    },
    {
      "@type": "Question",
      "name": "How much can you save by rightsizing cloud instances?",
      "acceptedAnswer": { "@type": "Answer", "text": "Typically 20-40% of compute costs. Most cloud environments have instances running at under 20% CPU utilisation. Downsizing or switching to modern instance families (e.g. AWS Graviton) can cut compute bills significantly with no application changes." }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Reserved Instances and Savings Plans on AWS?",
      "acceptedAnswer": { "@type": "Answer", "text": "Reserved Instances commit to a specific instance type in a specific region for 1 or 3 years. Savings Plans are more flexible — you commit to a dollar amount of compute usage per hour, and the discount applies across instance types, regions, and even Lambda and Fargate." }
    }
  ]
}
</script>

---

## Why Cloud Costs Spiral Out of Control {% raw %}{#{% endraw %}why-costs-spiral}

Cloud's pay-as-you-go model is a double-edged sword. The same elasticity that lets you scale to millions of users also lets costs grow unchecked. I've seen this pattern on almost every enterprise cloud project:

```
  Month 1:  $5,000   — small team, controlled spend
  Month 6:  $28,000  — more services, more engineers
  Month 12: $95,000  — nobody knows what half of it is
  Month 18: $180,000 — "we need to do something about the cloud bill"
```

The root causes are almost always the same:

- **Overprovisioning** — instances sized for peak load running at 5% CPU 24/7
- **Zombie resources** — dev environments, test databases, old snapshots nobody deleted
- **No tagging** — can't attribute costs to teams or products
- **Wrong pricing model** — paying on-demand rates for workloads that run 24/7
- **Data transfer costs** — nobody budgeted for egress fees

---

## The FinOps Framework {% raw %}{#{% endraw %}finops}

FinOps is not a tool — it's a practice. The FinOps Foundation defines three phases:

```
  ┌─────────────────────────────────────────────────────────┐
  │                   FinOps Lifecycle                       │
  │                                                          │
  │    ┌──────────┐      ┌──────────┐      ┌──────────┐     │
  │    │  INFORM  │─────►│OPTIMISE  │─────►│ OPERATE  │     │
  │    └──────────┘      └──────────┘      └──────────┘     │
  │         │                 │                 │            │
  │   Visibility         Rightsizing       Budgets &         │
  │   Tagging            Reserved          Forecasts         │
  │   Allocation         Instances         Anomaly           │
  │   Dashboards         Spot usage        Detection         │
  │                      Waste removal     Showback          │
  └─────────────────────────────────────────────────────────┘
```

**The three teams that must collaborate:**

| Team | Responsibility | Common failure mode |
|------|---------------|-------------------|
| **Engineering** | Implement cost-efficient architecture | "That's a finance problem" |
| **Finance** | Budget, forecast, chargeback | No visibility into cloud spend |
| **Business** | Define value metrics | No connection between cost and outcome |

---

## Rightsizing Compute {% raw %}{#{% endraw %}rightsizing}

Rightsizing means matching instance size to actual workload requirements — not what you think you might need.

**AWS Compute Optimizer** analyses CloudWatch metrics and recommends optimal instance types:

```bash
# Get rightsizing recommendations via AWS CLI
aws compute-optimizer get-ec2-instance-recommendations \
  --region us-east-1 \
  --query 'instanceRecommendations[*].{
    Instance:instanceArn,
    CurrentType:currentInstanceType,
    RecommendedType:recommendationOptions[0].instanceType,
    MonthlySavings:recommendationOptions[0].estimatedMonthlySavings.value
  }' \
  --output table
```

**Typical findings:**

```
  Instance          Current    Recommended   Monthly Saving
  ─────────────────────────────────────────────────────────
  prod-api-01       m5.2xlarge m5.large      $180/month
  prod-worker-02    c5.4xlarge c5.xlarge     $320/month
  staging-db-01     r5.2xlarge r5.large      $210/month
  ─────────────────────────────────────────────────────────
  Total potential saving: $710/month = $8,520/year
```

**Switch to AWS Graviton (ARM) for up to 40% savings:**

```hcl
# Terraform — switch EC2 to Graviton
resource "aws_instance" "api_server" {
  ami           = "ami-0c02fb55956c7d316"  # Amazon Linux 2023 ARM64
  instance_type = "m7g.large"              # Graviton3 — 40% cheaper than m5.large
  # Same vCPU and memory, lower cost, better performance
}
```

---

## Pricing Models: On-Demand vs Reserved vs Spot {% raw %}{#{% endraw %}pricing-models}

```
  COST COMPARISON — m5.large (2 vCPU, 8GB RAM) — us-east-1

  On-Demand:          $0.096/hr  = $69.12/month   (baseline)
  1yr Reserved (No Upfront): $0.061/hr = $43.92/month  (-36%)
  1yr Reserved (All Upfront): $0.056/hr = $40.32/month  (-42%)
  3yr Reserved (All Upfront): $0.038/hr = $27.36/month  (-60%)
  Spot Instance:      $0.029/hr  = ~$20.88/month   (-70%, interruptible)
  Savings Plan (1yr): $0.059/hr  = $42.48/month   (-39%, flexible)
```

**Decision framework:**

```
  Is this workload running > 70% of the time?
    │
    ├── YES ──► Buy Reserved Instance or Savings Plan
    │           (1yr = ~36% saving, 3yr = ~60% saving)
    │
    └── NO ───► Is it fault-tolerant / can restart?
                    │
                    ├── YES ──► Use Spot Instances
                    │           (up to 90% saving)
                    │
                    └── NO ───► On-Demand
                                (dev/test, unpredictable)
```

**Spot Instance example — batch ML training job:**

```python
import boto3

ec2 = boto3.client('ec2', region_name='us-east-1')

response = ec2.request_spot_instances(
    SpotPrice='0.05',           # Max price willing to pay
    InstanceCount=1,
    Type='one-time',
    LaunchSpecification={
        'ImageId': 'ami-0c02fb55956c7d316',
        'InstanceType': 'c5.2xlarge',
        'KeyName': 'my-key',
        'IamInstanceProfile': {'Name': 'ml-training-role'},
        'UserData': open('train_script.sh', 'rb').read(),
    }
)
print("Spot request ID:", response['SpotInstanceRequests'][0]['SpotInstanceRequestId'])
```

---

## Tagging Strategy for Cost Allocation {% raw %}{#{% endraw %}tagging}

Without tags, you cannot answer: "How much does the payments service cost?" Tags are the foundation of cost allocation.

**Mandatory tag schema (enforce via AWS Config or Azure Policy):**

```hcl
# Terraform — enforce tags on all resources
locals {
  mandatory_tags = {
    Environment = var.environment      # prod / staging / dev
    Team        = var.team             # platform / payments / data
    Product     = var.product          # checkout / analytics / auth
    CostCentre  = var.cost_centre      # CC-1234
    Owner       = var.owner_email      # team-lead@company.com
    ManagedBy   = "terraform"
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.medium"
  tags          = local.mandatory_tags
}
```

**Enforce tagging compliance with AWS Config:**

```bash
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "required-tags",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "REQUIRED_TAGS"
  },
  "InputParameters": "{\"tag1Key\":\"Environment\",\"tag2Key\":\"Team\",\"tag3Key\":\"CostCentre\"}"
}'
```

---

## Forecasting Cloud Costs {% raw %}{#{% endraw %}forecasting}

**AWS Cost Explorer forecast:**

```bash
# Forecast next 3 months of EC2 costs
aws ce get-cost-forecast \
  --time-period Start=2026-05-01,End=2026-08-01 \
  --metric UNBLENDED_COST \
  --granularity MONTHLY \
  --filter '{"Dimensions":{"Key":"SERVICE","Values":["Amazon EC2"]}}' \
  --query 'ForecastResultsByTime[*].{Month:TimePeriod.Start,Mean:MeanValue,Upper:PredictionIntervalUpperBound}' \
  --output table
```

**Python — build your own cost forecast with linear regression:**

```python
import boto3
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

ce = boto3.client('ce', region_name='us-east-1')

# Pull last 12 months of costs
response = ce.get_cost_and_usage(
    TimePeriod={'Start': '2025-04-01', 'End': '2026-04-01'},
    Granularity='MONTHLY',
    Metrics=['UnblendedCost'],
)

costs = [float(r['Total']['UnblendedCost']['Amount'])
         for r in response['ResultsByTime']]

X = np.arange(len(costs)).reshape(-1, 1)
y = np.array(costs)

model = LinearRegression().fit(X, y)

# Forecast next 3 months
future = np.arange(len(costs), len(costs) + 3).reshape(-1, 1)
forecast = model.predict(future)

for i, cost in enumerate(forecast, 1):
    print(f"Month +{i}: ${cost:,.0f}")
```

---

## Cost Anomaly Detection {% raw %}{#{% endraw %}anomaly}

AWS Cost Anomaly Detection uses ML to identify unusual spend patterns and alert you before the bill arrives.

```bash
# Create an anomaly monitor for all AWS services
aws ce create-anomaly-monitor --anomaly-monitor '{
  "MonitorName": "AllServicesMonitor",
  "MonitorType": "DIMENSIONAL",
  "MonitorDimension": "SERVICE"
}'

# Create an alert subscription — email when anomaly > $100
aws ce create-anomaly-subscription --anomaly-subscription '{
  "SubscriptionName": "DailyAnomalyAlert",
  "MonitorArnList": ["arn:aws:ce::123456789:anomalymonitor/MONITOR_ID"],
  "Subscribers": [{"Address": "team@company.com", "Type": "EMAIL"}],
  "Threshold": 100,
  "Frequency": "DAILY"
}'
```

---

## Tools Comparison {% raw %}{#{% endraw %}tools}

| Tool | Best for | Cost | Strengths |
|------|----------|------|-----------|
| **AWS Cost Explorer** | AWS-only environments | Free | Native, deep AWS integration |
| **AWS Compute Optimizer** | EC2/Lambda rightsizing | Free | ML-based recommendations |
| **Azure Cost Management** | Azure environments | Free | Native Azure, budget alerts |
| **Infracost** | Pre-deployment cost estimates | Free/paid | Integrates with Terraform CI/CD |
| **CloudHealth (VMware)** | Multi-cloud enterprises | Paid | Cross-cloud visibility, governance |
| **Apptio Cloudability** | Large enterprises | Paid | FinOps reporting, showback |
| **Spot.io (NetApp)** | Spot instance automation | Paid | Automated spot management |

**Infracost in CI/CD — show cost impact of every Terraform PR:**

```yaml
# .github/workflows/infracost.yml
- name: Run Infracost
  uses: infracost/actions/setup@v3
  with:
    api-key: ${{ secrets.INFRACOST_API_KEY }}

- name: Generate cost estimate
  run: infracost breakdown --path=./terraform --format=json --out-file=/tmp/infracost.json

- name: Post PR comment
  uses: infracost/actions/comment@v3
  with:
    path: /tmp/infracost.json
    behavior: update
```

---

## FAQ {% raw %}{#{% endraw %}faq}

**How do you optimize cloud costs on AWS?**
Highest-impact actions: rightsize underutilised instances with Compute Optimizer, buy Reserved Instances or Savings Plans for steady workloads (saves 36–60%), use Spot for batch jobs (saves up to 90%), enforce tagging for cost allocation, and set up Cost Anomaly Detection.

**What is FinOps?**
FinOps is a cloud financial management practice that brings engineering, finance, and business together to maximise value per dollar spent on cloud. It's not about cutting costs — it's about making informed spending decisions.

**How much can you save by rightsizing?**
Typically 20–40% of compute costs. Most environments have instances running at under 20% CPU utilisation. Switching to Graviton (ARM) instances alone saves up to 40% with no code changes.

**What is the difference between Reserved Instances and Savings Plans?**
Reserved Instances commit to a specific instance type in a specific region. Savings Plans are more flexible — you commit to a spend rate per hour and the discount applies across instance types, regions, Lambda, and Fargate.

---

*Dealing with a runaway cloud bill? [Let's talk on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
