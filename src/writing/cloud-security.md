---
layout: layouts/post.njk
title: "7 Years of Cloud Engineering: Security Lessons Learned"
description: "Hard-won lessons on IAM, network design, secrets management, and the security mistakes I see on almost every cloud project."
date: 2026-03-08
image: /images/posts/security.jpg
tags: [Security, IAM, AWS, Azure, DevOps, Cloud]
permalink: /writing/cloud-security/
---

I've done security reviews on cloud environments at H&M, Siemens, Nokia, and Alight Solutions. The same mistakes show up everywhere, regardless of company size or cloud provider. Here's what I've learned — and what I look for immediately when joining a new project.

## Mistake 1 — Overprivileged IAM roles

This is the most common and most dangerous issue I encounter. A service that only needs to read from one S3 bucket has `AdministratorAccess`. A Lambda that sends emails has `iam:*` permissions.

The fix is least-privilege IAM, always:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::my-specific-bucket/*"
  }]
}
```

Not `s3:*`. Not `*`. Exactly the actions needed, on exactly the resources needed. When I built ReRhythm, the Textract service role could call Textract and read from one S3 prefix. Nothing else.

## Mistake 2 — Secrets in environment variables

Environment variables are not secrets storage. They show up in logs, crash dumps, and `docker inspect` output. I've seen database passwords in CloudWatch logs because an exception handler printed `os.environ`.

Use a secrets manager:
- **AWS:** Secrets Manager or Parameter Store (SecureString with KMS)
- **Azure:** Key Vault with managed identity access
- **GCP:** Secret Manager

Your app fetches the secret at runtime. The secret value never touches your codebase, your CI/CD logs, or your container image.

## Mistake 3 — Public subnets for everything

The default VPC in AWS puts everything in public subnets. I understand why — it's easy to get started. But production workloads should follow this rule: **if it doesn't need to accept inbound traffic from the internet, it shouldn't be in a public subnet.**

The architecture I apply to every project:
- **Public subnet:** Load balancers only
- **Private subnet:** Application servers, containers
- **Isolated subnet:** Databases, cache clusters

Outbound traffic from private subnets goes through a NAT Gateway. Inbound traffic to private subnets only comes from the load balancer security group.

## Mistake 4 — No VPC endpoints for AWS services

If your ECS task in a private subnet calls S3, where does that traffic go? Without a VPC endpoint — to the public internet, through the NAT Gateway, to S3's public IP range.

With a Gateway VPC endpoint for S3, that traffic stays entirely within AWS's network. It's faster, cheaper (no NAT Gateway data processing charge), and more secure.

I add VPC endpoints for S3, DynamoDB, ECR, Secrets Manager, and SSM on every AWS project as baseline infrastructure.

## Mistake 5 — Long-lived credentials in CI/CD

Storing AWS access keys in GitHub Secrets feels safe until a key leaks. Keys don't expire. A leaked key from 3 years ago is as dangerous as a fresh one.

The fix is OIDC federation. GitHub Actions can assume an AWS IAM role directly, with no credentials stored anywhere:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-deploy
    aws-region: us-east-1
```

The role has a trust policy that only allows assumption from your specific GitHub repo and branch. Credentials are short-lived (1 hour), automatically rotated, and never stored. This is how ReRhythm's deployment pipeline works.

## The security review checklist I use

When I join a new project, I check these first:

- [ ] No wildcard IAM permissions on service roles
- [ ] No secrets in environment variables, code, or git history
- [ ] Database not in public subnet
- [ ] VPC endpoints for AWS managed services
- [ ] No long-lived access keys in CI/CD
- [ ] CloudTrail enabled in all regions
- [ ] S3 buckets with public access blocked at account level
- [ ] Security groups with minimum required ports only
- [ ] MFA enforced on all IAM users
- [ ] No default VPC in production accounts

Finding even one of these missing is normal. Finding all ten is a bad day.

## The mindset shift that changed how I work

Early in my career I thought security was a phase — something you did before launch. Now I think of it as a default. Every resource I create is private until there's a reason to make it accessible. Every permission I grant is minimal until there's a reason to expand it.

The teams I've worked with that ship the fastest are also the most secure. Not because security slows you down — because building securely the first time is faster than cleaning up a breach.

---

*Doing a security review on your cloud environment? [Let's talk on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
