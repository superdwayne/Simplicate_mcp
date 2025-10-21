export function normalizeHeaderEntries(
  headers: unknown,
): Array<[string, string]> {
  if (!headers) return [];

  const entries: Array<[string, string]> = [];

  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    for (const [key, value] of headers.entries()) {
      entries.push([key, value]);
    }
    return entries;
  }

  if (Array.isArray(headers)) {
    for (const item of headers) {
      if (!item) continue;
      const [key, value] = item as [unknown, unknown];
      if (key == null || value == null) continue;
      entries.push([String(key), String(value)]);
    }
    return entries;
  }

  if (typeof headers === "object") {
    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        for (const part of value) {
          if (part == null) continue;
          entries.push([key, String(part)]);
        }
      } else {
        entries.push([key, String(value)]);
      }
    }
  }

  return entries;
}

