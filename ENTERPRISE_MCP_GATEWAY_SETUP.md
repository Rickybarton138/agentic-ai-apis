# Enterprise MCP Gateway — Setup Runbook

**Actor:** [nexgendata/enterprise-mcp-gateway](https://apify.com/nexgendata/enterprise-mcp-gateway)
**What it gives you:** Single MCP endpoint exposing 26 data sources (finance, real estate, news, legal, e-commerce, maps, jobs, weather, sports)
**Cross-cutting use:** astra-finance, primehaul-leads, magna-park, football-analyzer, rick-ai

---

## Prerequisites

Apify MCP must be added to the Claude Code stack first. If you haven't already:

```bash
# 1. Get Apify token: https://console.apify.com/settings/integrations
# 2. Add Apify MCP server
claude mcp add apify -- npx -y @apify/actors-mcp-server --token=<APIFY_TOKEN>
# 3. Restart Claude Code
```

Verify with `claude mcp list` — you should see `apify` listed.

---

## Step 1: Subscribe to the actor

1. Visit https://apify.com/nexgendata/enterprise-mcp-gateway
2. Click **Try for free** (or **Rent** if it uses rental pricing)
3. Note the actor ID — format: `nexgendata/enterprise-mcp-gateway` or `nexgendata~enterprise-mcp-gateway`

---

## Step 2: Validate the actor exists and check pricing

```bash
curl -sS "https://api.apify.com/v2/acts/nexgendata~enterprise-mcp-gateway" | jq '.data | {id, title, pricingInfos, exampleRunInput}'
```

Expected output: actor metadata including `pricingInfos` (likely PAY_PER_EVENT) and `exampleRunInput`.

---

## Step 3: Test run via Apify Run API

```bash
export APIFY_TOKEN=<your_token>

# Start a run
curl -sS -X POST "https://api.apify.com/v2/acts/nexgendata~enterprise-mcp-gateway/runs?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "weather in Bournemouth UK",
    "dataSource": "weather"
  }' | jq '.data.id'

# Note the run ID returned, then poll
curl -sS "https://api.apify.com/v2/actor-runs/<RUN_ID>?token=$APIFY_TOKEN" | jq '.data | {status, startedAt, finishedAt, defaultDatasetId}'

# Once status=SUCCEEDED, fetch the dataset
curl -sS "https://api.apify.com/v2/datasets/<DEFAULT_DATASET_ID>/items?token=$APIFY_TOKEN" | jq '.[0]'
```

Actual input fields depend on the actor — the input above is illustrative. Check the actor's README/input schema at its Apify page for real fields.

---

## Step 4: Add as MCP server in Claude Code

If the actor exposes a Standby MCP endpoint (most MCP-native actors do):

```bash
# Check for Standby URL
curl -sS "https://api.apify.com/v2/acts/nexgendata~enterprise-mcp-gateway" | jq '.data.standbyUrl'

# If standbyUrl is not null, add it as an MCP server:
claude mcp add enterprise-gateway --transport http <STANDBY_URL> --header "Authorization: Bearer $APIFY_TOKEN"
```

If the actor does not expose Standby, use the Apify MCP (already connected) and invoke the actor by name through it.

---

## Step 5: Per-project environment

Add to every project that will use the gateway:

```bash
# .env
APIFY_TOKEN=<token>
APIFY_NEXGEN_GATEWAY_ACTOR=nexgendata~enterprise-mcp-gateway
```

---

## Validation checklist

- [ ] Apify MCP connected and visible in `claude mcp list`
- [ ] Test run via curl succeeds (status=SUCCEEDED)
- [ ] Dataset returns structured data
- [ ] Standby URL (if available) added as second MCP server
- [ ] Token in projects' .env files
- [ ] First real query tested from one project (e.g. astra-finance news feed)

---

## Cost ceiling

Set a monthly cap in the Apify console before any project cron hits this in production:
- Console → Usage → Set usage limit → $20/mo to start

Scale up only after you've seen real traffic patterns.
