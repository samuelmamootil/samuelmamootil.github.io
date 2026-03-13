---
layout: layouts/post.njk
title: "How I migrated 100+ servers to Azure without a single weekend outage"
description: "Lessons from leading the H&M Azure migration at IBM — planning, Terraform landing zones, and what I'd do differently."
date: 2026-03-01
image: /images/posts/azure-migration.jpg
tags: [Azure, Terraform, Migration, DevOps]
permalink: /writing/azure-migration/
---

When IBM tasked my team with migrating over 100 application servers for H&M to Azure,
the hardest part wasn't the Terraform code — it was the sequencing.

## The approach

We used a phased migration model: assess → land zone → pilot → wave → cutover.
Every wave was gated by smoke tests running in GitHub Actions before DNS cutoff.

## What worked

- **Reusable Terraform modules** — one module per service, versioned in a private registry
- **Private endpoints everywhere** — no public IP exposure for any backend service  
- **Blue-green DNS switchover** — instant rollback if a wave failed

## What I'd do differently

Start instrumentation earlier. By the time we were in wave 3, we wanted application-level
metrics that hadn't been instrumented yet.

---

*This is a template post — replace with your own story.*
