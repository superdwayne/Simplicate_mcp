import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "../src/server/createServer";

type VercelRequest = IncomingMessage & {
  body?: unknown;
};

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: ServerResponse) {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);

    await transport.handleRequest(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    sendJson(res, 200, {
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message,
        data: {
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      id: null,
    });
  }
}
