import { z } from "zod";
import {
  type InferSchema,
  type ToolExtraArguments,
  type ToolMetadata,
} from "xmcp";
import { assertClientAuthorized } from "../../lib/auth";
import { fetchHours, extractHours, entryDate } from "../../lib/hoursUtils";
import { asToolError } from "../../lib/simplicateClient";

export const schema = {
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  project_id: z.string().optional(),
  employee_id: z.string().optional(),
};

export const metadata: ToolMetadata = {
  name: "hours-by-month",
  description: "Aggregate hours for a specific month",
};

export default async function hoursByMonth(
  {
    year,
    month,
    project_id,
    employee_id,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const params: Record<string, unknown> = {};
    if (project_id) params.project_id = project_id;
    if (employee_id) params.employee_id = employee_id;

    const entries = await fetchHours(extra, params, 10);

    const relevant = entries.filter((entry) => {
      const date = entryDate(entry);
      if (!date) return false;
      return date >= start && date <= end;
    });

    const total = relevant.reduce((sum, entry) => sum + extractHours(entry), 0);

    return {
      content: [
        {
          type: "text",
          text: `Total hours for ${year}-${String(month).padStart(2, "0")}: ${total.toFixed(2)}`,
        },
      ],
      _meta: {
        year,
        month,
        totalHours: total,
        entryCount: relevant.length,
        projectId: project_id,
        employeeId: employee_id,
      },
    };
  } catch (e) {
    return asToolError(e);
  }
}

