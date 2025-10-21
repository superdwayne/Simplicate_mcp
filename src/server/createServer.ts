import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolMetadata, ToolSchema } from "xmcp";

import * as listHoursModule from "../tools/hours/list-hours";
import * as createHourEntryModule from "../tools/hours/create-hour-entry";
import * as getHourByIdModule from "../tools/hours/get-hour-by-id";
import * as listProjectsModule from "../tools/projects/list-projects";
import * as listActivitiesModule from "../tools/projects/list-activities";
import * as getProjectModule from "../tools/projects/get-project";
import * as getActivityModule from "../tools/projects/get-activity";
import * as listProjectPhasesModule from "../tools/projects/list-project-phases";
import * as listProjectTasksModule from "../tools/projects/list-project-tasks";
import * as listProjectBudgetsModule from "../tools/projects/list-project-budgets";
import * as listOrganizationsModule from "../tools/crm/list-organizations";
import * as listContactsModule from "../tools/crm/list-contacts";
import * as listEmployeesModule from "../tools/hrm/list-employees";
import * as listLeaveModule from "../tools/hrm/list-leave";
import * as calendarStatusModule from "../tools/info/calendar-status";
import * as hoursByMonthModule from "../tools/analytics/hours-by-month";
import * as totalProjectHoursModule from "../tools/analytics/total-project-hours";
import * as totalEmployeeHoursModule from "../tools/analytics/total-employee-hours";
import * as pendingApprovalHoursModule from "../tools/analytics/pending-approval-hours";

type ToolModule = {
  default: (...args: any[]) => unknown;
  metadata: ToolMetadata;
  schema?: ToolSchema;
};

const toolModules: ToolModule[] = [
  listHoursModule,
  createHourEntryModule,
  getHourByIdModule,
  listProjectsModule,
  listActivitiesModule,
  getProjectModule,
  getActivityModule,
  listProjectPhasesModule,
  listProjectTasksModule,
  listProjectBudgetsModule,
  listOrganizationsModule,
  listContactsModule,
  listEmployeesModule,
  listLeaveModule,
  calendarStatusModule,
  hoursByMonthModule,
  totalProjectHoursModule,
  totalEmployeeHoursModule,
  pendingApprovalHoursModule,
];

export function createServer() {
  const server = new McpServer({
    name: "simplicate-mcp",
    version: "1.0.0",
  });

  for (const mod of toolModules) {
    if (!mod?.metadata || !mod?.default) {
      console.warn("Skipping tool module due to missing exports", mod);
      continue;
    }

    const config: {
      title?: string;
      description?: string;
      inputSchema?: ToolSchema;
      annotations?: ToolMetadata["annotations"];
      _meta?: ToolMetadata["_meta"];
    } = {
      title: mod.metadata.annotations?.title,
      description: mod.metadata.description,
      annotations: mod.metadata.annotations,
      _meta: mod.metadata._meta,
    };

    if (mod.schema && Object.keys(mod.schema).length > 0) {
      config.inputSchema = mod.schema;
    }

    server.registerTool(mod.metadata.name, config, mod.default as any);
  }

  return server;
}
