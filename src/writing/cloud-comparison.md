---
layout: layouts/post.njk
title: "AWS vs Azure vs GCP: An engineer's honest comparison"
description: "After 7 years deploying production workloads on all three clouds for clients like H&M, Siemens, and Nokia — here's my honest take on when to use which."
date: 2026-03-10
image: /images/posts/cloud-comparison.jpg
tags: [AWS, Azure, GCP, Cloud, Architecture]
permalink: /writing/cloud-comparison/
---

I've shipped production infrastructure on AWS, Azure, and GCP. Not tutorials — real enterprise workloads for H&M, Siemens, Nokia, and Alight Solutions. Here's my honest, opinionated comparison based on what I've actually experienced.

## The honest summary upfront

- **AWS** — biggest service catalogue, best documentation, most mature ecosystem
- **Azure** — best for Microsoft-heavy enterprises, best Active Directory integration
- **GCP** — best data and ML tooling, most developer-friendly APIs

None of them is universally better. The right choice depends on your workload, your team, and your existing vendor relationships.

## Developer experience

**AWS** has the most services but also the most footguns. IAM alone has a learning curve that takes months to master. The console is dense and overwhelming for newcomers. But the documentation is exceptional — the AWS whitepapers are some of the best technical writing in the industry.

**Azure** has improved dramatically since 2020. The portal is cleaner than it used to be. The Azure CLI is genuinely good. But the naming conventions are inconsistent (`Resource Groups` vs `Subscriptions` vs `Management Groups`) and the permission model between Azure AD roles and Azure RBAC confuses even experienced engineers.

**GCP** has the cleanest APIs and the best CLI ergonomics. `gcloud` is a joy to use. The console is uncluttered. But the service catalogue is smaller and some services feel less production-ready than their AWS or Azure equivalents.

## Networking

**AWS** networking is powerful but complex. VPCs, subnets, route tables, NACLs, security groups, Transit Gateways, PrivateLink — there are many layers and they interact in non-obvious ways. Once you understand it, it's extremely flexible.

**Azure** networking is more approachable. Hub-and-spoke with VNet peering is well-documented and the tooling around it (Azure Firewall, Private Link, Application Gateway) is solid. For the H&M migration, Azure networking was a strength — setting up 100+ server landing zones was faster than equivalent AWS work would have been.

**GCP** networking is genuinely different — global VPCs that span regions without peering. This simplifies some things dramatically but requires a mental model shift from AWS/Azure engineers.

## Containers and Kubernetes

All three have managed Kubernetes — EKS, AKS, GKE. In my experience:

| | EKS | AKS | GKE |
|---|---|---|---|
| Control plane cost | $0.10/hr | Free | Free (Autopilot costs differ) |
| Upgrade experience | Manual, painful | Getting better | Best in class |
| IAM integration | Complex but powerful | Azure AD native | Workload Identity clean |
| Ecosystem maturity | Highest | Good | Good |

GKE is technically the most polished Kubernetes experience. AKS is the right choice if you're already in Azure. EKS has the most community resources and integrations.

## AI and ML infrastructure

This is where the gap is most pronounced in 2026.

**AWS** has the broadest AI service portfolio — Bedrock for foundation models, SageMaker for ML pipelines, Textract, Rekognition, Comprehend, Polly, Translate. The breadth is unmatched. Building ReRhythm on Bedrock was a great experience — the API is clean and the model selection is excellent.

**Azure** has the best enterprise AI story through Azure OpenAI Service — the same GPT-4 models available in ChatGPT, but with enterprise data privacy guarantees and Private Link support. For enterprises that need AI but can't send data to a public API, Azure OpenAI is the answer.

**GCP** has Vertex AI, which is powerful but has a steeper learning curve. BigQuery ML is excellent for data teams who want to train models without leaving SQL. The Gemini integration across GCP services is improving quickly.

## Cost

Nobody wins on cost — it depends entirely on workload. But some observations:

- **AWS** data egress costs are high. Moving data out of AWS is expensive.
- **Azure** dev/test pricing is genuinely good for Microsoft shop customers with EA agreements.
- **GCP** sustained use discounts apply automatically — no commitment required. This surprised me on the Südzucker project.

## My actual recommendation

**Choose AWS if:** you're greenfield, your team is cloud-agnostic, or you need the widest service selection.

**Choose Azure if:** you're a Microsoft shop (Office 365, Active Directory, .NET), you need Azure OpenAI, or you have an EA agreement.

**Choose GCP if:** your primary workload is data engineering, ML, or analytics, or your team values developer experience above all else.

**Choose all three if:** you're me, and clients keep asking.

---

*Working through a cloud provider decision? [I'm happy to talk through it on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
