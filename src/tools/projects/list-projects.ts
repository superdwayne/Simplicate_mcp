import { type InferSchema, type ToolMetadata, type ToolExtraArguments } from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";
import { optionalLimitParam, optionalPageParam } from "../../lib/pagination";

export const schema = {
  page: optionalPageParam,
  limit: optionalLimitParam,
};

export const metadata: ToolMetadata = {
  name: "list-projects",
  description: "List projects",
};

export default async function listProjects(
  {
    page,
    limit,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const res = await simplicate(extra).get("/projects/project", {
      params: { page, limit },
    });
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

