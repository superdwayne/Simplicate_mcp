import axios, { AxiosError } from "axios";
import type { ToolExtraArguments } from "xmcp";
import { normalizeHeaderEntries } from "./headerUtils";

const baseURL = process.env.SIMPLICATE_API_BASE_URL;
const defaultKey = process.env.SIMPLICATE_API_KEY;
const secret = process.env.SIMPLICATE_API_SECRET;

function resolveKey(extra?: ToolExtraArguments) {
  const allowOverrideRaw = process.env.ALLOW_KEY_OVERRIDE ?? "false";
  const allowOverride = ["1", "true", "yes"].includes(allowOverrideRaw.toLowerCase());

  if (allowOverride) {
    const headerEntries = normalizeHeaderEntries(extra?.requestInfo?.headers);
    const entry = headerEntries.find(
      ([key]) => key.trim().toLowerCase() === "authentication-key",
    );
    const value = entry?.[1] ?? defaultKey;
    if (!value) {
      throw new Error("Missing Simplicate API key (SIMPLICATE_API_KEY or Authentication-Key header)");
    }
    return value.toString().trim();
  }

  if (!defaultKey) {
    throw new Error("Missing SIMPLICATE_API_KEY (override via header is disabled)");
  }
  return defaultKey.toString().trim();
}

export function simplicate(extra?: ToolExtraArguments) {
  if (!baseURL) {
    throw new Error("SIMPLICATE_API_BASE_URL is not configured. Set it in Vercel environment variables.");
  }

  if (!secret) {
    throw new Error("SIMPLICATE_API_SECRET is not configured. Set it in Vercel environment variables.");
  }

  const key = resolveKey(extra);

  const instance = axios.create({
    baseURL,
    headers: {
      "Authentication-Key": key,
      "Authentication-Secret": secret,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 15000,
  });

  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers["retry-after"]) || 1;
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return instance.request(error.config!);
    }
    throw error;
  });

  return instance;
}

function redactSensitiveFields(value: unknown): unknown {
  const sensitiveKeys = new Set([
    "email",
    "phone",
    "iban",
    "address",
    "ssn",
    "password",
    "token",
    "secret",
    "key",
    "api_key",
    "authentication-key",
    "authentication-secret",
  ]);

  if (value === null || value === undefined) return value;
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((v) => redactSensitiveFields(v));
  }

  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    const keyLower = k.toLowerCase();
    if (sensitiveKeys.has(keyLower)) {
      output[k] = "[redacted]";
    } else if (typeof v === "object" && v !== null) {
      output[k] = redactSensitiveFields(v);
    } else {
      output[k] = v;
    }
  }
  return output;
}

export function asToolError(e: unknown) {
  let body: unknown;

  if (axios.isAxiosError(e)) {
    const rawData = e.response?.data;
    body = {
      message: e.message,
      status: e.response?.status,
      data: typeof rawData === "object" ? redactSensitiveFields(rawData) : rawData,
    };
  } else {
    const maybeStatus = (e as any)?.status;
    const message = (e as Error)?.message ?? "Unknown error";
    body = typeof maybeStatus === "number"
      ? { message, status: maybeStatus }
      : { message };
  }

  const text =
    typeof body === "string" ? body : JSON.stringify(body, null, 2);

  return {
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
    isError: true as const,
  };
}
