import { z } from "zod";
import {
  type InferSchema,
  type ToolMetadata,
  type ToolExtraArguments,
} from "xmcp";
import { simplicate, asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";

export const schema = {
  employee_id: z.string().optional(),
  status: z.string().optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
};

export const metadata: ToolMetadata = {
  name: "list-leave",
  description: "List leave requests",
};

export default async function listLeave(
  {
    employee_id,
    status,
    date_start,
    date_end,
  }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);

    const params: Record<string, unknown> = {};
    if (employee_id) params.employee_id = employee_id;
    if (status) params.status = status;
    if (date_start) params.date_start = date_start;
    if (date_end) params.date_end = date_end;

    const res = await simplicate(extra).get("/hrm/leave", { params });
    return res.data;
  } catch (e) {
    return asToolError(e);
  }
}

