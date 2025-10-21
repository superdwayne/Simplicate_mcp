import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function main() {
  const baseUrl = new URL(
    process.env.MCP_HTTP_URL ?? "https://simplicate-2-0.vercel.app/api/mcp",
  );

  const token =
    process.env.MCP_CLIENT_TOKEN ??
    process.env.MCP_TOKEN ??
    process.env.MCP_SERVER_TOKEN;

  const headers =
    token?.trim().length
      ? {
          "x-mcp-token": token.trim(),
        }
      : undefined;

  const transport = new StreamableHTTPClientTransport(baseUrl, {
    requestInit: headers ? { headers } : undefined,
  });

  const client = new Client({
    name: "simplicate-remote-client",
    version: "1.0.0",
  });

  await client.connect(transport);

  const tools = await client.listTools();
  console.dir(tools, { depth: null });

  const targetTool = tools.tools.find(
    (tool) => tool.name === "list-organizations",
  );
  if (!targetTool) {
    throw new Error("Tool list-organizations not found in tool list.");
  }

  console.log("Invoking list-organizations");
  const result = await client.callTool({
    name: targetTool.name,
    arguments: {},
  });

  console.dir(result, { depth: null });

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
