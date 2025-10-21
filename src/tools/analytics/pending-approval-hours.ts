import {
  type ToolMetadata,
  type ToolExtraArguments,
} from "xmcp";
import { asToolError } from "../../lib/simplicateClient";
import { assertClientAuthorized } from "../../lib/auth";
import { fetchHours, extractHours, isApproved } from "../../lib/hoursUtils";

export const metadata: ToolMetadata = {
  name: "pending-approval-hours",
  description: "Summarize hour entries awaiting approval",
};

export default async function pendingApprovalHours(
  _args: Record<string, never>,
  extra?: ToolExtraArguments,
) {
  try {
    assertClientAuthorized(extra);
    const entries = await fetchHours(extra, {}, 5);

    const pending = entries.filter((entry) => !isApproved(entry));
    const total = pending.reduce((sum, entry) => sum + extractHours(entry), 0);

    return {
      content: [
        {
          type: "text",
          text: `There are ${pending.length} hour entries awaiting approval totalling ${total.toFixed(2)} hours.`,
        },
      ],
      _meta: {
        total,
        entryCount: pending.length,
        entries: pending,
      },
    };
  } catch (e) {
    return asToolError(e);
  }
}

