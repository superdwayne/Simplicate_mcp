import { z } from "zod";
import {
  type InferSchema,
  type ToolMetadata,
  type ToolExtraArguments,
} from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";
import { fetchHours, extractHours, isApproved } from "../../lib/hoursUtils";

export const schema = {
  project_id: z.string(),
  include_unapproved: z.boolean().optional(),
};

export const metadata: ToolMetadata = {
  name: "total-project-hours",
  description: "Calculate total hours recorded for a project",
};

export default async function totalProjectHours(
  {
    project_id,
    include_unapproved,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const entries = await fetchHours(extra, { project_id }, 10);

    const total = entries
      .filter((entry) => (include_unapproved ? true : isApproved(entry)))
      .reduce((sum, entry) => sum + extractHours(entry), 0);

    const project = await simplicate(extra)
      .get(`/projects/project/${project_id}`)
      .then((res) => res.data)
      .catch(() => null);

    return {
      content: [
        {
          type: "text",
          text: `Total ${include_unapproved ? "recorded" : "approved"} hours for project ${project_id}: ${total.toFixed(2)}`,
        },
      ],
      _meta: {
        projectId: project_id,
        hours: total,
        entryCount: entries.length,
        includeUnapproved: Boolean(include_unapproved),
        project,
      },
    };
  } catch (e) {
    return asToolError(e);
  }
}

