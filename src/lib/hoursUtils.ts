import type { ToolExtraArguments } from "xmcp";
import { simplicate } from "./simplicateClient";

export type HourEntry = Record<string, unknown> & {
  id?: string;
};

export function extractHours(entry: HourEntry): number {
  const candidates = [
    entry.quantity,
    entry.hours,
    entry.duration,
    entry.minutes ? Number(entry.minutes) / 60 : undefined,
  ];

  for (const value of candidates) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
    if (typeof value === "string") {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) return numeric;
    }
  }

  return 0;
}

export function isApproved(entry: HourEntry): boolean {
  if (typeof entry.approved === "boolean") return entry.approved;
  if (typeof entry.status === "string") {
    const status = entry.status.toLowerCase();
    return ["approved", "final"].includes(status);
  }
  if (typeof entry.approval_status === "string") {
    const status = entry.approval_status.toLowerCase();
    return ["approved", "final"].includes(status);
  }
  return false;
}

export function entryDate(entry: HourEntry): Date | undefined {
  const keys = ["date", "day", "start_date", "work_date"];
  for (const key of keys) {
    const value = entry[key];
    if (typeof value === "string" && value) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.valueOf())) return parsed;
    }
  }
  return undefined;
}

export async function fetchHours(
  extra: ToolExtraArguments | undefined,
  params: Record<string, unknown>,
  maxPages = 5,
  limit = 200,
) {
  const results: HourEntry[] = [];
  let page = 1;

  while (page <= maxPages) {
    const res = await simplicate(extra).get("/hours/hours", {
      params: { ...params, page, limit },
    });
    const data: HourEntry[] = res.data?.data ?? [];
    results.push(...data);
    if (data.length < limit) break;
    page += 1;
  }

  return results;
}
