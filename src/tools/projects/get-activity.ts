import { z } from "zod";
import { type InferSchema, type ToolMetadata, type ToolExtraArguments } from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";

export const schema = {
  id: z.string(),
};

export const metadata: ToolMetadata = {
  name: "get-activity",
  description: "Get an activity by id",
};

export default async function getActivity(
  { id }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const res = await simplicate(extra).get(`/projects/activity/${id}`);
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

