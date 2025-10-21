import { z } from "zod";

function normalizeOptionalPositiveInt(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.trim())
        : Number.NaN;

  if (!Number.isFinite(numeric)) {
    return value;
  }

  if (!Number.isInteger(numeric)) {
    return value;
  }

  if (numeric <= 0) {
    return undefined;
  }

  return numeric;
}

export const optionalPageParam = z.preprocess(
  normalizeOptionalPositiveInt,
  z.number().int().min(1).optional(),
);

export const optionalLimitParam = z.preprocess(
  normalizeOptionalPositiveInt,
  z.number().int().min(1).max(200).optional(),
);

