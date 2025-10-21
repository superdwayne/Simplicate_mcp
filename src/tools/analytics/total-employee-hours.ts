import { z } from "zod";
import {
  type InferSchema,
  type ToolMetadata,
  type ToolExtraArguments,
} from "xmcp";
import { assertClientAuthorized } from "../../lib/auth";
import { fetchHours, extractHours, isApproved } from "../../lib/hoursUtils";
import { asToolError } from "../../lib/simplicateClient";

export const schema = {
  employee_id: z.string(),
  include_unapproved: z.boolean().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
};

export const metadata: ToolMetadata = {
  name: "total-employee-hours",
  description: "Calculate total hours recorded for an employee",
};

export default async function totalEmployeeHours(
  {
    employee_id,
    include_unapproved,
    from_date,
    to_date,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const params: Record<string, unknown> = { employee_id };
    if (from_date) params.date_start = from_date;
    if (to_date) params.date_end = to_date;

    const entries = await fetchHours(extra, params, 10);

    const total = entries
      .filter((entry) => (include_unapproved ? true : isApproved(entry)))
      .reduce((sum, entry) => sum + extractHours(entry), 0);

    return {
      content: [
        {
          type: "text",
          text: `Total ${include_unapproved ? "recorded" : "approved"} hours for employee ${employee_id}: ${total.toFixed(2)}`,
        },
      ],
      _meta: {
        employeeId: employee_id,
        hours: total,
        entryCount: entries.length,
        includeUnapproved: Boolean(include_unapproved),
        fromDate: from_date,
        toDate: to_date,
      },
    };
  } catch (e) {
    return asToolError(e);
  }
}

