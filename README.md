## Simplicate MCP Server (xmcp HTTP)

### Quick start

1) Install deps
```bash
npm install
```

2) Set env vars (local)
- Create a `.env.local` file with:
  - `SIMPLICATE_API_BASE_URL=https://act.simplicate.com/api/v2`
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
- `SIMPLICATE_API_SECRET=...`

4) Redeploy and use the Production URL `https://<project>.vercel.app` globally.

### Tools
- Hours: `list-hours`, `get-hour-by-id`, `create-hour-entry`
- CRM: `list-organizations`, `list-contacts`
- Projects: `list-projects`, `list-activities`, `get-project`, `get-activity`, `list-project-phases`, `list-project-tasks`, `list-project-budgets`
- HRM: `list-employees`
- Info: `calendar-status`
- Analytics: `estimate-builder`, `historic-estimation-helper`, `skill-demand-forecast`, `total-project-hours`, `total-employee-hours`, `pending-approval-hours`, `project-hours-vs-budget`, `project-overview`, `project-risk-summary`, `organization-summary`, `employee-profile`, `hours-by-month`, `resource-capacity-check`

### Passing API credentials at runtime
- Clients may include their Simplicate API key via the `Authentication-Key` header to override the default key; otherwise the server uses `SIMPLICATE_API_KEY`.

### References
- xmcp docs: [xmcp.dev](https://xmcp.dev/)
- Vercel Node runtimes: [docs](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)


# Simplicate_mcp

### Server token auth (recommended)

- Set a server-wide token via environment variable:
  - `MCP_SERVER_TOKEN=...`
- For HTTP requests, the server REQUIRES `MCP_SERVER_TOKEN` and a matching `x-mcp-token` header. Missing config yields a 500; missing/mismatched header yields a 401.
- For local stdio transport, the token is not required.

Example HTTP request header:

```http
GET /tools/hours/list-hours HTTP/1.1
Host: <your-host>
Authorization: Bearer <your-own-client-auth-if-any>
x-mcp-token: <MCP_SERVER_TOKEN>
```

### Simplicate API key handling

- Default key: configure `SIMPLICATE_API_KEY` (recommended for server-side use).
- Per-request override header `Authentication-Key` is disabled by default. To enable, set:
  - `ALLOW_KEY_OVERRIDE=true`
- When override is disabled and no `SIMPLICATE_API_KEY` is configured, requests will fail.

### Error redaction

- Error bodies redact common PII/secret fields (e.g., `email`, `phone`, `iban`, `token`, `secret`, `authentication-key`).
