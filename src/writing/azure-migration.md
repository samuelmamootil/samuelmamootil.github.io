---
layout: layouts/post.njk
title: "How I migrated 100+ servers to Azure for H&M without a weekend outage"
description: "Lessons from leading the H&M Azure migration at IBM — phased planning, Terraform landing zones, blue-green DNS, and what I'd do differently."
date: 2026-02-15
image: /images/posts/azure-migration.jpg
tags: [Azure, Terraform, Migration, DevOps, IBM]
permalink: /writing/azure-migration/
---

When IBM tasked my team with migrating over 100 application servers for H&M to Azure, the hardest part wasn't writing Terraform — it was the sequencing. One wrong move and a retail giant's operations go dark on a Monday morning.

Here's exactly how we did it, what nearly broke us, and what I'd do differently today.

## The constraint that changed everything

H&M's engineering teams operate across time zones. Any outage during business hours — even 10 minutes — meant escalations, revenue impact, and very unhappy stakeholders. The mandate was clear: **zero weekend work, zero business-hour outages**.

That single constraint shaped every technical decision we made.

## Phase 1 — Assess before you touch anything

Before a single Terraform file was written, we spent three weeks in discovery:

- Catalogued every server: OS, app runtime, dependencies, network rules
- Identified "chattiness" — which servers talked to each other constantly
- Mapped external dependencies: on-prem databases, third-party APIs, VPN tunnels
- Flagged stateful apps that needed special handling (session stores, file mounts)

The output was a migration wave plan — groups of servers that could move together without breaking dependencies. Wave 1 was the smallest, lowest-risk group. Wave 5 was the scary stuff.

## Phase 2 — Build the landing zone first

We never migrated a single server until the Azure landing zone was rock solid. This included:

- Hub-and-spoke VNet topology with peering to on-prem via ExpressRoute
- Private endpoints for all PaaS services — no public IPs on anything backend
- Azure Policy assignments to enforce tagging, region locks, and SKU constraints
- Log Analytics workspace wired to every resource from day one
- IAM roles scoped to least-privilege — no contributor-level service principals

The Terraform for this was modular. One module per resource type, versioned in a private registry. Every environment (dev, staging, prod) was a composition of the same modules with different variable files.

```hcl
module "vnet" {
  source  = "internal-registry/vnet/azure"
  version = "2.1.0"

  name                = "hm-prod-vnet"
  address_space       = ["10.10.0.0/16"]
  resource_group_name = module.rg.name
  location            = var.location
}
```

## Phase 3 — The migration pipeline

Each wave followed the same pattern:

1. **Replicate** — Azure Migrate replicates the VM continuously, no cutover yet
2. **Test cutover** — spin up the replica in an isolated VNet, run smoke tests
3. **Approve** — wave lead signs off on test results
4. **Production cutover** — flip DNS, monitor for 30 minutes, declare success
5. **Decommission** — original server stays warm for 72 hours, then deleted

The DNS flip was the magic. Instead of changing IPs in application configs (risky, slow), we updated Azure Private DNS zones. Cutover time per server: under 2 minutes. Rollback time: under 2 minutes. That's the number that let us sleep at night.

## What nearly broke us

**Undocumented dependencies.** Three servers in wave 3 had a hardcoded IP reference to an on-prem NFS share that nobody knew about. We caught it in the test cutover when file writes started failing silently. The fix took 4 hours; catching it in prod would have taken 4 days.

**Lesson:** run your smoke tests against real workloads, not just ping checks. We added a synthetic transaction test to every wave after that.

## Monitoring from day one

We instrumented before migration, not after. Every replicated VM had the Azure Monitor agent installed during replication. By the time we did the DNS flip, we had 2 weeks of baseline metrics to compare against.

Alerts were set to page if CPU, memory, or error rates deviated more than 20% from baseline within the first hour post-cutover.

## Results

- 100+ servers migrated across 5 waves
- Zero business-hour outages
- Zero weekend work after wave 1
- Mean cutover time: 8 minutes per server
- One rollback in wave 2 (caught and resolved in 11 minutes)

## What I'd do differently

**Start instrumentation earlier.** By wave 3 we wanted application-level traces that hadn't been set up yet. Azure Application Insights should be day-one infrastructure, not an afterthought.

**Automate the dependency scan.** We did this manually in discovery. Tools like Azure Migrate's dependency analysis or Turbonomic can do this automatically and catch the undocumented links before they bite you in a test cutover.

**Involve app teams earlier.** The engineers who built the apps knew things the architecture diagrams didn't show. A 30-minute call with each app team in week one would have saved us days of discovery work.

---

*Have questions about your own migration? Connect with me on [LinkedIn](https://linkedin.com/in/samuel-mamootil).*
