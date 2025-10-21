import { type InferSchema, type ToolMetadata, type ToolExtraArguments } from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";
import { optionalLimitParam, optionalPageParam } from "../../lib/pagination";

export const schema = {
  page: optionalPageParam,
  limit: optionalLimitParam,
};

export const metadata: ToolMetadata = {
  name: "list-hours",
  description: "List hour entries",
};

export default async function listHours(
  {
    page,
    limit,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const res = await simplicate(extra).get("/hours/hours", {
      params: { page, limit },
    });
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

