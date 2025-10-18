## Simplicate MCP Server (xmcp HTTP)

### Quick start

1) Install deps
```bash
npm install
```

2) Set env vars (local)
- Create a `.env.local` file with:
  - `SIMPLICATE_API_BASE_URL=https://act.simplicate.com/api/v2`
  - `SIMPLICATE_API_KEY=...`
  - `SIMPLICATE_API_SECRET=...`

3) Run locally
```bash
npm run dev
```

### Deploy to Vercel (fully remote)

1) Install Vercel CLI
```bash
npm i -g vercel
```

2) Deploy
```bash
vercel
```

3) In Vercel Project → Settings → Environment Variables, add:
- `SIMPLICATE_API_BASE_URL=https://act.simplicate.com/api/v2`
- `SIMPLICATE_API_KEY=...`
- `SIMPLICATE_API_SECRET=...`

4) Redeploy and use the Production URL `https://<project>.vercel.app` globally.

### Tools
- Hours: `list-hours`, `get-hour-by-id`, `create-hour-entry`
- CRM: `list-organizations`, `list-contacts`
- Projects: `list-projects`, `list-activities`

### References
- xmcp docs: [xmcp.dev](https://xmcp.dev/)
- Vercel Node runtimes: [docs](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)


# Simplicate_mcp
