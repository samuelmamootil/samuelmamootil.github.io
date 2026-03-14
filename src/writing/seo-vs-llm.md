---
layout: layouts/post.njk
title: "Google SEO is dead. Long live LLM Optimization."
description: "How AI answer engines are replacing search results, what the data says, and exactly what you need to do differently to be found in 2026 and beyond."
date: 2026-03-15
tags: [SEO, AI, LLM, Cloud, DevOps]
permalink: /writing/seo-vs-llm/
---

For 25 years, getting found online meant one thing: rank on Google. Build backlinks, stuff keywords, chase PageRank. The rules were clear even if the game was dirty.

That era is ending. Not slowly — fast.

In 2024, Google launched AI Overviews. ChatGPT crossed 100 million weekly users. Perplexity grew 10x. People stopped clicking blue links and started asking questions and getting answers. The search engine is becoming an answer engine — and the optimization playbook has changed completely.

Here's what the data shows, what changed, and exactly what you need to do about it.

---

## The numbers that changed everything

### Google search click-through rates are collapsing

| Year | Average organic CTR (position 1) | Zero-click searches |
|------|----------------------------------|---------------------|
| 2019 | 28.5% | 49% |
| 2021 | 25.6% | 57% |
| 2023 | 22.1% | 65% |
| 2024 | 18.4% | 72% |
| 2025 | ~14% (est.) | ~79% (est.) |

*Sources: SparkToro (2024), Semrush Search Behaviour Report (2024), Rand Fishkin / SparkToro Zero-Click Study*

**What this means:** Even if you rank #1 on Google, nearly 4 in 5 searches now end without a click. Google answers the question itself — via featured snippets, AI Overviews, Knowledge Panels, and People Also Ask boxes.

---

### LLM usage is growing at a rate search never did

| Platform | Monthly active users (2024) | YoY growth |
|----------|----------------------------|------------|
| Google Search | 8.5 billion queries/day | +2% |
| ChatGPT | 100M+ weekly users | +300% |
| Perplexity | 10M+ monthly users | +900% |
| Microsoft Copilot (Bing AI) | 5B+ chats (cumulative) | N/A |
| Claude (Anthropic) | 30M+ monthly users | +400% |
| Gemini (Google) | Integrated into 1B+ devices | N/A |

*Sources: OpenAI blog (2024), Perplexity investor deck (2024), Microsoft Build keynote (2024), Anthropic usage reports*

---

### How people search has fundamentally changed

**2019 search behaviour:**
> User types: `azure terraform best practices`
> Gets: 10 blue links, clicks one, reads article

**2025 search behaviour:**
> User asks: *"What are the best practices for structuring Terraform modules in Azure for a multi-environment enterprise setup?"*
> Gets: A direct answer synthesised from 20 sources — with citations. May never click any of them.

The query length has grown from an average of **2.4 words in 2015** to **4.8 words in 2024** (Google internal data via Search Engine Land). People are asking questions, not typing keywords.

---

## Traditional SEO vs LLM Optimisation — side by side

| Factor | Traditional SEO (Google) | LLM Optimisation (AEO) |
|--------|--------------------------|------------------------|
| **Goal** | Rank on page 1 | Be cited as a source |
| **Signal** | Backlinks, domain authority | Semantic clarity, structured data |
| **Content format** | Keyword-dense, long-form | Clear, factual, well-structured |
| **Key file** | `sitemap.xml`, `robots.txt` | `llms.txt`, `robots.txt` with AI crawlers allowed |
| **Metadata** | Title tags, meta description | JSON-LD schema, `og:` tags |
| **Discovery** | Googlebot crawl | GPTBot, ClaudeBot, PerplexityBot crawl |
| **Update speed** | Days to weeks | Hours (with IndexNow) |
| **Trust signal** | PageRank, backlinks | Named entity recognition, structured facts |
| **Measurement** | Rankings, organic traffic | Citations in AI answers, brand mentions |
| **Optimise for** | Algorithm | Understanding |

---

## What changed in each era

### Era 1: PageRank (1998–2010)
Google's original insight was that links = votes. More links from authoritative sites = higher rank. SEO meant building backlinks, often artificially.

**Optimise for:** Quantity of inbound links

### Era 2: Content & Keywords (2010–2018)
Panda (2011) and Penguin (2012) killed link spam. Content quality started mattering. Keyword research became a discipline. Long-form content won.

**Optimise for:** Keyword relevance + content depth

### Era 3: E-E-A-T & Structured Data (2018–2023)
Google's Quality Rater Guidelines introduced Experience, Expertise, Authoritativeness, Trustworthiness. Schema markup (JSON-LD) let sites communicate structured facts directly to Google.

**Optimise for:** Author credibility + structured data

### Era 4: Answer Engines & LLMs (2024–present)
AI Overviews, ChatGPT, Perplexity, Claude. The answer is generated, not linked. Your content either gets synthesised into the answer or it doesn't exist.

**Optimise for:** Being understood and cited by AI

---

## The new technical checklist

### What still matters from traditional SEO
- ✅ `sitemap.xml` — LLM crawlers use it too
- ✅ Fast page load — still a ranking signal
- ✅ Mobile-friendly — non-negotiable
- ✅ HTTPS — baseline trust signal
- ✅ Clean URL structure
- ✅ Meta description — shown in some AI citations

### What's new for LLM optimisation
- ✅ `llms.txt` — new standard at llmstxt.org, read by Claude, Perplexity, and others
- ✅ `robots.txt` — explicitly allow GPTBot, ClaudeBot, Google-Extended, PerplexityBot
- ✅ JSON-LD structured data — `Person`, `Article`, `WebSite`, `BreadcrumbList` schemas
- ✅ IndexNow — push URLs to Bing/Yandex instantly on publish
- ✅ Semantic HTML — use `<article>`, `<section>`, `<time>`, `<address>` correctly
- ✅ Named entity clarity — state who you are, what you do, where you are, explicitly
- ✅ Factual, citable content — LLMs cite sources that state facts clearly
- ✅ Author schema — link content to a real person with credentials

### What no longer works
- ❌ Keyword stuffing
- ❌ Thin content optimised for one keyword
- ❌ Blocking AI crawlers (you disappear from AI answers)
- ❌ Chasing backlinks without substance
- ❌ Optimising only for click-through — zero-click is the new normal

---

## Why this matters for engineers and technical professionals

If you're a cloud engineer, DevOps specialist, or AI infrastructure professional, this shift is especially relevant. Recruiters, hiring managers, and clients increasingly use AI tools to find candidates and vendors.

A search like *"cloud engineer with Terraform and Kubernetes experience in Texas"* used to return LinkedIn profiles and job boards. In 2025, it returns an AI-synthesised answer — and if your site has clear structured data, an `llms.txt`, and factual content about your skills, **you can be in that answer**.

This is exactly why I've optimised this site with:
- Full JSON-LD `Person` schema with skills, certifications, and employer history
- `llms.txt` with complete professional profile in plain text
- `robots.txt` explicitly allowing all major AI crawlers
- IndexNow integration that pings search engines on every deploy
- Semantic HTML throughout

The engineers who understand this shift now will have a significant visibility advantage over those still playing the 2015 SEO game.

---

## The citation economy

Traditional SEO was a **ranking economy** — position 1 gets 28% of clicks, position 10 gets 2%.

LLM optimisation is a **citation economy** — either your content is used to generate the answer, or it isn't. There's no position 2.

The way to win citations:
1. **State facts clearly** — LLMs extract factual sentences. "Samuel Mamootil is a Senior Cloud Engineer with 7 years of experience across AWS, Azure, and GCP" is more citable than "I've been doing cloud stuff for a while."
2. **Use structured data** — JSON-LD tells crawlers exactly what type of thing you are
3. **Be consistent across the web** — your LinkedIn, GitHub, and website should all describe you the same way
4. **Publish original insights** — LLMs prefer primary sources over aggregators
5. **Update content** — stale content gets deprioritised by both Google and LLMs

---

## What to do this week

If you have a personal site or portfolio, here's the minimum viable LLM optimisation:

1. Add `llms.txt` to your root — plain text description of who you are and what you do
2. Update `robots.txt` to allow GPTBot, ClaudeBot, Google-Extended, PerplexityBot
3. Add JSON-LD `Person` schema to your homepage
4. Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools
5. Set up IndexNow for instant indexing on publish

None of this takes more than a few hours. The engineers who do it now will be findable by AI in ways their peers won't be for years.

---

The web isn't broken. It's being rebuilt around understanding instead of ranking. The question isn't whether to adapt — it's whether you do it before or after everyone else.

---

*Building your own LLM-optimised presence? [Let's talk on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
