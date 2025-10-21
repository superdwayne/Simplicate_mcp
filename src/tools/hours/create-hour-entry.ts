import { z } from "zod";
import { type InferSchema, type ToolMetadata, type ToolExtraArguments } from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";

export const schema = {
  payload: z.record(z.any()).describe("Body accepted by Simplicate /hours/hours"),
};

export const metadata: ToolMetadata = {
  name: "create-hour-entry",
  description: "Create a new hour entry",
};

export default async function createHourEntry(
  {
    payload,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const res = await simplicate(extra).post("/hours/hours", payload);
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

