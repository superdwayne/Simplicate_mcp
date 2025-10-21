import { type ToolMetadata, type ToolExtraArguments, type InferSchema } from "xmcp";
import { z } from "zod";
import { asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";

export const schema = {
  _token: z.string().optional(),
} as const;

export const metadata: ToolMetadata = {
  name: "calendar-status",
  description: "Report calendar and schedule data availability",
};

export default async function calendarStatus(
  { _token }: InferSchema<typeof schema>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra, _token);
    return {
      content: [
        {
          type: "text" as const,
          text: "Cannot access calendar/schedule data.",
        },
      ],
    };
  } catch (e) {
    return asToolError(e);
  }
}

