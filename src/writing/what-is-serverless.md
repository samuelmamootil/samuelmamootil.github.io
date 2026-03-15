---
layout: layouts/post.njk
title: "What is Serverless Computing and When Should You Use It? (2026)"
description: "What is serverless computing, how does it work, and when should you use it? Covers AWS Lambda, Azure Functions, cold starts, event-driven architecture, and real-world use cases with code examples."
date: 2026-04-13
tags: [Cloud, AWS, Azure, Architecture, serverless]
permalink: /writing/what-is-serverless/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#what-is-serverless">What is Serverless?</a></li>
    <li><a href="#how-it-works">How Serverless Works</a></li>
    <li><a href="#aws-lambda">AWS Lambda Deep Dive</a></li>
    <li><a href="#azure-functions">Azure Functions</a></li>
    <li><a href="#cold-starts">Cold Starts Explained</a></li>
    <li><a href="#event-driven">Event-Driven Architecture</a></li>
    <li><a href="#when-to-use">When to Use (and Not Use) Serverless</a></li>
    <li><a href="#cost">Serverless Cost Model</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What is Serverless Computing and When Should You Use It? (2026)",
  "description": "What is serverless computing, how does it work, and when should you use it? Covers AWS Lambda, Azure Functions, cold starts, event-driven architecture, and real-world use cases.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-13",
  "dateModified": "2026-04-13",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/what-is-serverless/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is serverless computing?",
      "acceptedAnswer": { "@type": "Answer", "text": "Serverless computing is a cloud execution model where the provider dynamically manages server allocation. You write functions, deploy them, and pay only for the compute time consumed during execution. There are still servers — you just don't manage them." }
    },
    {
      "@type": "Question",
      "name": "What is a cold start in serverless?",
      "acceptedAnswer": { "@type": "Answer", "text": "A cold start occurs when a serverless function is invoked after being idle. The cloud provider must initialise a new execution environment, which adds latency (typically 100ms–2s). Warm starts reuse existing environments and have near-zero overhead." }
    },
    {
      "@type": "Question",
      "name": "When should you NOT use serverless?",
      "acceptedAnswer": { "@type": "Answer", "text": "Avoid serverless for: long-running processes (Lambda max 15 minutes), latency-sensitive applications where cold starts are unacceptable, workloads with consistent high throughput (containers are cheaper), and applications requiring persistent connections like WebSockets or database connection pools." }
    },
    {
      "@type": "Question",
      "name": "Is serverless cheaper than containers?",
      "acceptedAnswer": { "@type": "Answer", "text": "It depends on traffic patterns. Serverless is cheaper for sporadic or low-volume workloads — you pay nothing when idle. For high-throughput consistent workloads, containers (ECS, EKS) are typically cheaper because you're not paying per-invocation overhead." }
    }
  ]
}
</script>

---

## What is Serverless? {% raw %}{#{% endraw %}what-is-serverless}

Serverless computing is a cloud execution model where you deploy code (functions) and the cloud provider handles all infrastructure — provisioning, scaling, patching, and capacity planning. You pay only for the milliseconds your code actually runs.

The name is misleading: there are still servers. You just don't see, manage, or pay for idle ones.

```
  TRADITIONAL SERVER          SERVERLESS
  ─────────────────           ──────────
  Server running 24/7         Function sleeps when idle
  Pay whether idle or not     Pay only during execution
  You manage OS, patches      Provider manages everything
  Manual scaling              Automatic scaling to zero
  Fixed capacity              Scales to millions instantly
```

---

## How Serverless Works {% raw %}{#{% endraw %}how-it-works}

```
  EVENT SOURCE          SERVERLESS PLATFORM        YOUR CODE
  ────────────          ───────────────────        ─────────

  HTTP Request    ──►   ┌─────────────────┐   ──►  function()
  S3 file upload  ──►   │  Event Router   │   ──►  function()
  Database change ──►   │                 │   ──►  function()
  Schedule (cron) ──►   │  Auto-scales    │   ──►  function()
  Queue message   ──►   │  0 → N instances│   ──►  function()
                        └─────────────────┘
                               │
                        Execution environment
                        spun up in milliseconds
                        destroyed after completion
```

**Execution lifecycle:**

```
  1. Event triggers function invocation
  2. Platform checks for warm execution environment
     ├── WARM: reuse existing container (~1ms overhead)
     └── COLD: provision new environment (100ms–2s)
  3. Function code executes
  4. Response returned to caller
  5. Environment kept warm briefly, then destroyed
  6. You are billed for: duration (ms) × memory (GB)
```

---

## AWS Lambda Deep Dive {% raw %}{#{% endraw %}aws-lambda}

Lambda is AWS's serverless compute service. Functions can run up to 15 minutes, use up to 10GB RAM, and scale to 1,000 concurrent executions by default (can be increased).

**Hello World Lambda in Python:**

```python
import json

def lambda_handler(event, context):
    name = event.get('name', 'World')
    return {
        'statusCode': 200,
        'body': json.dumps({'message': f'Hello, {name}!'})
    }
```

**Deploy with Terraform:**

```hcl
resource "aws_lambda_function" "api" {
  filename         = "function.zip"
  function_name    = "hello-api"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "main.lambda_handler"
  runtime          = "python3.12"
  memory_size      = 256
  timeout          = 30

  environment {
    variables = {
      ENVIRONMENT = "production"
    }
  }
}

resource "aws_lambda_function_url" "api_url" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.api_url.function_url
}
```

**Lambda with S3 trigger — process uploaded files:**

```python
import boto3
import json

s3 = boto3.client('s3')
textract = boto3.client('textract')

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key    = record['s3']['object']['key']

        # Extract text from uploaded PDF using Textract
        response = textract.detect_document_text(
            Document={'S3Object': {'Bucket': bucket, 'Name': key}}
        )

        text = ' '.join([
            block['Text']
            for block in response['Blocks']
            if block['BlockType'] == 'LINE'
        ])

        print(f"Extracted {len(text)} characters from {key}")
        return {'statusCode': 200, 'body': json.dumps({'chars': len(text)})}
```

---

## Azure Functions {% raw %}{#{% endraw %}azure-functions}

Azure Functions is Microsoft's serverless platform, tightly integrated with Azure services and the Microsoft ecosystem.

```python
import azure.functions as func
import logging

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="hello")
def hello(req: func.HttpRequest) -> func.HttpResponse:
    name = req.params.get('name') or 'World'
    logging.info(f'Processing request for {name}')
    return func.HttpResponse(f"Hello, {name}!", status_code=200)
```

**Azure Functions vs AWS Lambda:**

| Feature | AWS Lambda | Azure Functions |
|---------|-----------|----------------|
| Max timeout | 15 minutes | 10 minutes (Consumption), unlimited (Premium) |
| Max memory | 10 GB | 1.5 GB (Consumption), 14 GB (Premium) |
| Cold start | 100ms–1s | 200ms–2s |
| Pricing unit | 1ms increments | 100ms increments |
| Best trigger ecosystem | AWS services (S3, SQS, DynamoDB) | Azure services (Blob, Service Bus, Cosmos DB) |
| Local dev experience | SAM CLI, AWS Toolkit | Azure Functions Core Tools |

---

## Cold Starts Explained {% raw %}{#{% endraw %}cold-starts}

A cold start happens when your function hasn't been invoked recently and the platform must initialise a fresh execution environment.

```
  COLD START TIMELINE

  0ms      Request arrives
  │
  50ms     Platform allocates execution environment
  │
  200ms    Container/VM initialised
  │
  500ms    Runtime initialised (Python/Node/Java)
  │
  800ms    Dependencies loaded (your imports)
  │
  900ms    Your function init code runs
  │
  1000ms   Handler executes ← actual work starts here
  │
  1050ms   Response returned

  Total: ~1 second cold start
  vs ~5ms warm start
```

**Strategies to reduce cold starts:**

```python
# 1. Initialise clients OUTSIDE the handler (reused on warm invocations)
import boto3

# This runs once per container lifecycle, not per invocation
dynamodb = boto3.resource('dynamodb')
table    = dynamodb.Table('users')

def lambda_handler(event, context):
    # table is already initialised — no cold start overhead here
    response = table.get_item(Key={'userId': event['userId']})
    return response['Item']
```

```hcl
# 2. Provisioned Concurrency — keep N instances always warm
resource "aws_lambda_provisioned_concurrency_config" "api" {
  function_name                  = aws_lambda_function.api.function_name
  qualifier                      = aws_lambda_alias.live.name
  provisioned_concurrent_executions = 5  # 5 warm instances always ready
}
```

```python
# 3. Use lightweight runtimes — Node.js and Python cold start faster than Java
# Node.js:  ~100ms cold start
# Python:   ~200ms cold start
# Java:     ~1-3s cold start (JVM initialisation)
# Use GraalVM native image for Java to reduce to ~100ms
```

---

## Event-Driven Architecture {% raw %}{#{% endraw %}event-driven}

Serverless shines in event-driven architectures where functions react to events rather than polling for work.

```
  ┌──────────┐    upload     ┌─────────┐   trigger   ┌──────────────┐
  │  User    │──────────────►│   S3    │────────────►│  Lambda:     │
  │  uploads │               │ Bucket  │             │  ProcessDoc  │
  │  PDF     │               └─────────┘             └──────┬───────┘
  └──────────┘                                              │
                                                            │ publish
                                                            ▼
  ┌──────────┐   notify    ┌──────────┐   consume   ┌──────────────┐
  │  User    │◄────────────│   SNS    │◄────────────│  Lambda:     │
  │  email   │             │  Topic   │             │  ExtractText │
  └──────────┘             └──────────┘             └──────┬───────┘
                                                            │
                                                            │ store
                                                            ▼
                                                     ┌──────────────┐
                                                     │  DynamoDB    │
                                                     │  Results     │
                                                     └──────────────┘
```

This is exactly the architecture I used in **ReRhythm** — S3 upload triggers Lambda, Lambda calls Textract, results stored in DynamoDB, SNS notifies the user. Zero servers to manage.

---

## When to Use (and Not Use) Serverless {% raw %}{#{% endraw %}when-to-use}

**Use serverless when:**

| Use case | Why serverless fits |
|----------|-------------------|
| API backends with variable traffic | Scales to zero, no idle cost |
| File processing (images, PDFs, CSVs) | Event-driven, short-lived tasks |
| Scheduled jobs (cron) | No server needed between runs |
| Webhooks and integrations | Sporadic invocations |
| Stream processing (Kinesis, SQS) | Per-record processing |
| Chatbots and voice assistants | Bursty, unpredictable load |

**Avoid serverless when:**

| Use case | Why serverless doesn't fit |
|----------|--------------------------|
| Long-running ML training | Lambda max 15 min — use SageMaker or ECS |
| WebSocket servers | Persistent connections — use ECS or EC2 |
| High-throughput APIs (>1M req/day) | Containers cheaper at scale |
| Database connection pooling | Lambda can exhaust DB connections — use RDS Proxy |
| Latency-critical paths (<10ms) | Cold starts unacceptable — use containers |

---

## Serverless Cost Model {% raw %}{#{% endraw %}cost}

AWS Lambda pricing (us-east-1):
- **Requests:** $0.20 per 1 million requests
- **Duration:** $0.0000166667 per GB-second

```
  Example: API handling 10M requests/month, avg 200ms, 256MB memory

  Request cost:  10M × $0.20/1M           = $2.00
  Duration cost: 10M × 0.2s × 0.25GB × $0.0000166667
               = 10M × 0.05 GB-s × $0.0000166667
               = $8.33

  Total Lambda cost: ~$10.33/month

  Equivalent EC2 (t3.small, 2 vCPU, 2GB):
  On-demand: $0.0208/hr × 730hr = $15.18/month
  (and that's just one instance — no auto-scaling)
```

Serverless wins at low-to-medium traffic. Containers win at sustained high throughput.

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is serverless computing?**
Serverless is a cloud model where you deploy functions and the provider manages all infrastructure. You pay only for execution time — nothing when idle. AWS Lambda and Azure Functions are the leading platforms.

**What is a cold start in serverless?**
A cold start is the latency added when a function is invoked after being idle — the platform must initialise a new execution environment. Typically 100ms–2s. Warm starts reuse existing environments and add near-zero overhead.

**When should you NOT use serverless?**
Avoid serverless for long-running processes (over 15 minutes), latency-critical paths where cold starts are unacceptable, high-throughput workloads where containers are cheaper, and applications needing persistent connections.

**Is serverless cheaper than containers?**
For sporadic or low-volume workloads, yes — you pay nothing when idle. For sustained high-throughput workloads, containers (ECS, EKS) are typically cheaper because per-invocation overhead adds up.

---

*Building a serverless architecture on AWS or Azure? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
