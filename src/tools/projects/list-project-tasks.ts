import { type InferSchema, type ToolMetadata, type ToolExtraArguments } from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";
import { optionalLimitParam, optionalPageParam } from "../../lib/pagination";
import { z } from "zod";

export const schema = {
  page: optionalPageParam,
  limit: optionalLimitParam,
  project_id: z.string().optional(),
};

export const metadata: ToolMetadata = {
  name: "list-project-tasks",
  description: "List project tasks",
};

export default async function listProjectTasks(
  {
    page,
    limit,
    project_id,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const res = await simplicate(extra).get("/projects/projecttask", {
      params: { page, limit, project_id },
    });
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

