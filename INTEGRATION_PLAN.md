# Integration Plan — Agentic AI APIs × Ricky's Portfolio

This document maps the highest-leverage Apify actors from this catalog onto each active project in Ricky's stack, with exact integration points, credentials needed, and priority levels. Skip dream442 — owner's request.

> **Prerequisite for everything below:** Apify MCP is not yet in the super stack. Add it once and every actor in this catalog becomes callable from Claude Code, n8n, and all agent projects.
>
> - **Apify MCP endpoint:** `https://mcp.apify.com`
> - **Token:** create at https://console.apify.com/settings/integrations
> - **Add via CLI:** `claude mcp add apify -- npx -y @apify/actors-mcp-server --token=<APIFY_TOKEN>`
> - **Alternate (HTTP):** register `https://mcp.apify.com` with the token as an Authorization header
>
> Once connected, every actor below can be invoked by name without wrapping code.

---

## Priority Key

- **P0** — Cross-cutting foundation, do first
- **P1** — Live revenue projects, ship this sprint
- **P2** — Pre-launch projects, ship before their milestones
- **P3** — Secondary / nice-to-have

---

## P0 — Cross-cutting foundations

These pay dividends across the whole portfolio. Wire them once and multiple projects benefit.

### Enterprise MCP Gateway — 26 AI Data Servers in One Endpoint
- **URL:** https://apify.com/nexgendata/enterprise-mcp-gateway
- **What it gives you:** Single MCP endpoint exposing finance, real estate, news, legal, e-commerce, maps, jobs, weather, sports data sources
- **Touches:** astra-finance, primehaul-leads, magna-park, football-analyzer, rick-ai
- **Integration:** add as second MCP server alongside Apify MCP; route queries that need structured third-party data
- **Credentials:** NexGenData API key + Apify token

### AI Brand Visibility
- **URL:** https://apify.com/adityalingwal/ai-brand-visibility
- **What it gives you:** Tracks how ChatGPT, Gemini, Perplexity recommend brands vs competitors — the GEO layer of `/seo-autopilot`
- **Touches:** astra-removals, magna-park, primehaul, rick-ai (all brands), movescan
- **Integration:** scheduled weekly run per brand, write results to a central dashboard (Supabase table `brand_visibility_snapshots`)
- **Credentials:** Apify token

### AI Code Review Agent + AI Codebase Analyst
- **URL:** https://apify.com/fiery_dream/ai-code-review-agent
- **URL:** https://apify.com/akash9078/ai-codebase-analyst
- **What they give you:** Automated PR review + repo intelligence / Q&A / dependency analysis
- **Touches:** enhances `/audit` and `/crosscheck` skills across every project
- **Integration:** wire into a GitHub Actions step on PR open, or call from `/crosscheck` skill
- **Credentials:** Apify token + GitHub token

### AGENTS.md Generator + Agent Skills Generator
- **URL:** https://apify.com/veridian-synthetics/agents-md-generator
- **URL:** https://apify.com/wheat_tourist/agent-skill-generator
- **What they give you:** Auto-generate `AGENTS.md` for every repo; generate production-ready skill definitions from goals
- **Touches:** complements `/bootstrap`, `/new-project`, `/skill-create`
- **Integration:** add to `/bootstrap` as a post-scaffold step so every new project ships with AGENTS.md

---

## P1 — Live revenue projects

### primehaul-leads (`~/primehaul-leads`)
Lead gen, free public estimates, £15/lead. **LIVE.**

| Agent | Integration point | Purpose |
|---|---|---|
| **Local Lead Generation Agent** (`apify.com/apify/local-lead-generation-agent`) | New background worker, hourly cron | Instagram-based local lead discovery with LLM scoring — complements current lead sources |
| **Google Maps Scraper + AI Lead Generation & Outreach** (`apify.com/buseta/google-maps-scraper`) | New edge function in Supabase project `dppgklqkmkoipihhyomc` | Scrape Google Maps businesses with emails + AI-written cold emails in one actor |
| **Lead Enrichment MCP Server** (`apify.com/alizarin_refrigerator-owner/lead-enrichment-mcp-server`) | MCP server in Ricky's stack | Natural-language prospecting workflows ("find 10 SaaS companies that recently raised Series A") |
| **Lead Search + Email** (`apify.com/rapidtech1898/lead-search-email`) | Cron-driven alternative data source | keyword+location → leads+emails, fills gaps when Google Maps source is rate-limited |
| **Competitive Intelligence Agent** (`apify.com/apify/competitive-intelligence-agent`) | Weekly scheduled run | Track UK removals competitors on Google Maps + social |

**Next action:** Subscribe to Google Maps actor (primary), deploy edge function in `primehaul-leads` Supabase project, write results into `leads` table with source=`gmaps_actor`.

### astra-removals (`~/astra-removals`)
Astra Removals website + booking + social + SEO. **LIVE.**

| Agent | Integration point | Purpose |
|---|---|---|
| **Employee-in-a-Box: SEO/AEO/GEO Auditor** (`apify.com/gmangabeira2/employee-in-a-box-seo-aeo-geo-auditor`) | Monthly audit job | Full SEO + Answer Engine + Generative Engine audit — direct fuel for `/seo-autopilot` |
| **Keyword Opportunity Finder** (`apify.com/trovevault/keyword-opportunity-finder`) | Content planning pipeline | People Also Ask scraping for Bournemouth / Dorset removals keywords |
| **Long-Tail Keyword Discovery** (`apify.com/powerai/long-tail-keyword-discovery`) | Content planning pipeline | Batch long-tail keyword discovery per service area |
| **AI Content Gap Agent** (`apify.com/apilab/ai-content-gap-agent`) | Content planning pipeline | Find gaps vs competitors (Kings Removals, Pickfords, etc.) |
| **AI Content Writer** (`apify.com/erinle_sam/ai-content-writer`) | Blog post generation | 12+ source research, multi-format output |
| **Comments Analyzer Agent** (`apify.com/apify/comments-analyzer-agent`) | Daily reputation monitor | Cross-platform sentiment alerts on Astra brand mentions |

**Next action:** Run SEO/AEO/GEO audit once to establish baseline, feed output into `/seo-autopilot`.

### rick-ai (`~/rick-ai`)
Portfolio + multi-brand social + AI video ad agent.

| Agent | Integration point | Purpose |
|---|---|---|
| **YouTube Autopilot: LangGraph Video Generation Agent** (`apify.com/wedo_software/wedo-ai-video`) | Core of video ad agent | End-to-end AI video creation — replaces chunks of current HeyGen+ElevenLabs pipeline |
| **Veo3 Video Generator** (`apify.com/powerai/veo3-video-generator`) | Fallback generation engine | Text-to-video via Google Veo3 — cheaper for short-form |
| **Video Script Generator** (`apify.com/powerai/video-script-generator`) | Pre-production stage | Generate scripts before handoff to voice/video generation |
| **Video Dubbing & Translation** (`apify.com/zhanji/video-dubbing-translation`) | Post-production stage | 32+ language dubbing with voice cloning — instant multilingual rollout per brand |
| **AI Video Meme Maker** (`apify.com/prodmarkllc/ai-video-maker`) | Reels/TikTok pipeline | Viral-style multi-scene short videos |
| **Advanced Social Media Agent** (`apify.com/fiery_dream/advanced-social-media-agent`) | Analytics layer | Production-grade social analysis — augments existing `social-media` MCP |
| **Influencer Discovery + Evaluation Agents** (`apify.com/hypebridge/influencer-discovery-agent-instagram-tiktok`, `apify.com/hypebridge/influencer-evaluation-agent-instagram-tiktok`) | New feature: influencer scouting | Scout + score collab candidates per brand |
| **Transcript to LinkedIn Posts Converter** (`apify.com/powerai/transcript-to-linkedin-posts-converter`) | Content repurposing | Turn video transcripts into 10 LinkedIn posts using Hook-Contrarian-Insight framework |
| **Meta Ad Library Scraper** (`apify.com/agenscrape/facebook-ad-library-scraper`) | Competitive intel | Ad-copy inspiration from competitor ads |
| **AI Brand Visibility** (covered in P0) | Cross-brand dashboard | Track AI mention share per brand |

**Next action:** ~~Replace current video generation with YouTube Autopilot in one test ad.~~ **BLOCKED (2026-04-14):** YouTube Autopilot actor (`wedo_software~wedo-ai-video`) is broken — maintainer's Google Cloud service account credentials have expired (`invalid_grant: Invalid JWT Signature`). Test run `pmH0i5xNZcmwZIi20` charged $1.90 but produced no video. Refund requested. Consider `powerai/veo3-video-generator` as alternative, or keep HeyGen as primary pipeline until the actor is fixed.

---

## P2 — Pre-launch projects

### transport-manager (`~/transport-manager`)
AI-powered transport compliance — walkaround checks, DVSA, Earned Recognition. **NEW PROJECT.**

| Agent | Integration point | Purpose |
|---|---|---|
| **ReguAction: AI Compliance & Regulation Analyst** (`apify.com/brazen_vanguard/reguaction-ai-compliance-regulation-analyst`) | Core compliance engine | Turn regulation URLs into cited checklists with requirements, penalties, deadlines (BYOK — use Claude API key) |
| **Policy to Checklist (AI) - SOC2/ISO Controls Generator** (`apify.com/macheta/policy-to-checklist`) | Earned Recognition module | Repurpose SOC2/ISO pattern for Earned Recognition audit controls |
| **Funding Intel** (`apify.com/fiery_dream/funding-intel`) | Regulatory watch module | Tracks regulatory compliance across 14+ UK gov data sources — surface DVSA updates automatically |

**Next action:** Run ReguAction against current DVSA walkaround check guidance URL, validate output format matches what transport-manager's compliance engine expects.

### astra-finance (`~/astra-finance`)
Financial command centre for Astra Removals. FastAPI + React + Supabase. **NEW PROJECT.**

| Agent | Integration point | Purpose |
|---|---|---|
| **Global Markets & Financial News AI** (`apify.com/visita/global-markets-intelligence`) | Dashboard news widget | Sentiment + impact scores for finance news feed |
| **Yahoo Finance Scraper Pro** (`apify.com/xtech/yahoo-finance-scraper-pro`) | Optional investment tracking module | Bulk ticker data if tracking business reserves |
| **Enterprise MCP Gateway** (covered in P0) | Data layer | Finance data without building individual integrations |

**Next action:** Add news widget to dashboard powered by Global Markets AI, filter to UK/removals/logistics sentiment.

### ai-trainer (`~/ai-trainer`)
AI-powered personal training for Kim. Flutter + Supabase + Claude. **ACTIVE PROJECT.**

| Agent | Integration point | Purpose |
|---|---|---|
| **Food Calorie Analyzer** (`apify.com/saadithya/food-calorie-analyzer`) | Meal tracking feature | Computer vision on meal photos → calories + macros |
| **Food Ingredient Analyzer** (`apify.com/saadithya/food-ingredient-analyzer`) | Shopping/label scanner | Photo of ingredient label → additives, allergens, healthiness score |
| **Health & Fitness Intelligence AI** (`apify.com/visita/health-fitness-intelligence`) | Content/programme feed | Structured wellness data (ingredients, body parts, gear) |
| **Learning Plan Coach (AI)** (`apify.com/macheta/learning-plan-coach`) | Training programme generator | Adapt study-plan pattern to training-plan generation with milestones |

**Next action:** Prototype meal tracking in Flutter — upload photo → Food Calorie Analyzer → display macros.

### coach-mentor (`~/coach-mentor`)
FA Coaching Education Platform. FA demo completed.

| Agent | Integration point | Purpose |
|---|---|---|
| **Academic Paper Scraper** (`apify.com/labrat011/academic-paper-scraper`) | RAG knowledge base expansion | Pull sports-science papers from Semantic Scholar + arXiv to extend the 585-chunk RAG |

> **Learning Plan Coach dropped:** `macheta/learning-plan-coach` is deprecated on Apify. Curriculum generation will instead be built in-house with the existing Claude API using the expanded RAG — better architecture and no third-party dependency for the pedagogical core.

**Next action:** Set `APIFY_TOKEN` in `server/.env`, run `node scripts/ingest-apify-papers.js --batch` to ingest 8 preset coaching-science topics. Validate retrieval via coach chat. See `~/coach-mentor/tasks/agentic-integrations.md` for full runbook.

---

## P3 — Secondary

### primehaul-office (`~/primehaul-office`) — **BUILD NEXT**
- **Business Entity Search** (`apify.com/openactor/business-entity-search`) — UK/AU/CA/US registries for supplier/customer compliance
- **Lead Enrichment MCP Server** — reuse from primehaul-leads for customer enrichment
- **Policy to Checklist (AI)** — reuse from transport-manager for internal SOPs

### magna-park (`~/magna-park`) — **ACTIVE — SOCIALS SETUP**
- Reuse entire astra-removals SEO stack (Employee-in-a-Box auditor, Keyword Opportunity Finder, Content Writer)
- AI Brand Visibility (from P0) for Bournemouth self-storage visibility tracking
- Comments Analyzer Agent for reputation monitoring

### football-analyzer / Manager Mentor (`~/football-analyzer`)
- **Sports Intelligence Autopilot** (`apify.com/actor_researcher.48/sports-intelligence-autopilot`) — 38 leagues including Soccer, real-time stats, feeds cross-match tactical memory (pairs with RuVector)
- **Academic Paper Scraper** — sports-science research pipeline
- **Enterprise MCP Gateway** (from P0) — unified sports data

### vtfc-coaching (`~/vtfc-coaching`)
- **Sports Intelligence Autopilot** — real stats for Verwood Town opposition analysis
- **Academic Paper Scraper** — coaching literature for game model refinement
- Shares RAG with coach-mentor

### cellsynergy-cns (`~/cellsynergy-cns`)
- **Health & Fitness Intelligence AI** — wellness data pipeline for the biometric dashboard

### movescan (`~/movescan`) — **NEW — NEEDS DEPLOY + SOCIALS**
- Reuse astra-removals SEO stack post-deployment
- AI Brand Visibility from P0
- Advanced Social Media Agent from rick-ai stack

---

## Recommended implementation order

1. **Apify MCP connection** — one-time prerequisite, unlocks everything
2. **Enterprise MCP Gateway** — second most leverage, feeds 5+ projects
3. **primehaul-leads: Google Maps + AI Lead Gen** — direct revenue impact, LIVE project
4. **astra-removals: SEO/AEO/GEO Auditor** — quick win, establishes baseline
5. **transport-manager: ReguAction** — core compliance engine, unblocks main product
6. **rick-ai: YouTube Autopilot** — replaces expensive part of video pipeline
7. **ai-trainer: Food Calorie Analyzer** — visible feature for Kim
8. **Cross-cutting: AI Brand Visibility** weekly scheduled run across all brands
9. Everything else opportunistically

---

## Cost expectations

Apify actors typically run on pay-per-event or consumption pricing. Budget guidance:
- **Low cost (<$5/mo):** most generators, text processors, keyword tools
- **Medium cost ($5–50/mo):** scrapers with moderate volume (Google Maps, LinkedIn, lead gen)
- **Variable cost:** video generation (Veo3, YouTube Autopilot) — check per-run pricing before production use

Set per-actor monthly caps in the Apify console before wiring any actor into a production cron job.

---

## Credentials to add to each project's `.env`

```
APIFY_TOKEN=                  # all projects using any actor
APIFY_NEXGEN_GATEWAY_TOKEN=   # projects using Enterprise MCP Gateway
APIFY_ACTOR_CONCURRENCY=2     # sensible default for cron-driven usage
```

Add to `.env.example` in each project and reference via the shared `fastapi_toolkit` pattern.
