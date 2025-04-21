#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Standard ES module default import
import PrayTimes from './praytimes.js';

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "prayer_time",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available resources.
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: []
  };
});

/**
 * Handler for reading the contents of a resource.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, '');

  return {
    contents: [
    ]
  };
});

/**
 * Handler that lists available tools.
 * Exposes a single "create_note" tool that lets clients create new notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_daily_prayer_times",
        description: "Get daily prayer times for a specific location",
        inputSchema: {
          type: "object",
          properties: {
            latitude: {
              type: "number",
              description: "Latitude of the location"
            },
            longitude: {
              type: "number",
              description: "Longitude of the location"
            },
            date: {
              type: "string",
              description: "Date for which to get prayer times (YYYY-MM-DD)"
            }
          },
          required: ["latitude", "longitude", "date"]
        } 
      }
    ]
  };
});

/**
 * Handler for the create_note tool.
 * Creates a new note with the provided title and content, and returns success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_daily_prayer_times": {
      const latitude = Number(request.params.arguments?.latitude);
      const longitude = Number(request.params.arguments?.longitude);
      const dateStr = String(request.params.arguments?.date); // Expecting YYYY-MM-DD

      if (isNaN(latitude) || isNaN(longitude) || !dateStr) {
        throw new Error("Latitude, longitude, and date are required");
      }

      // Basic validation for YYYY-MM-DD format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
         throw new Error("Invalid date format. Please use YYYY-MM-DD.");
      }

      const dateParts = dateStr.split('-').map(Number);
      const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Month is 0-indexed

      if (isNaN(date.getTime())) {
          throw new Error("Invalid date provided.");
      }

      const prayTimes = new PrayTimes('Tehran');
      // praytimes.js expects [lat, lon], timezone, dst flag, format
      //const times = prayTimes.getTimes(date, [latitude, longitude], -7, false, '24h');
      const times = prayTimes.getTimes(date, [latitude, longitude], 'auto', 'auto', '24h');
      // Format the times into a user-friendly string
      const timesString = Object.entries(times)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      return {
        content: [{
          type: "text",
          text: `Prayer times for ${dateStr} at [${latitude}, ${longitude}]:\n${timesString}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Handler that lists available prompts.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
    ]
  };
});

/**
 * Handler for the prompt.
 * Returns a prompt that requests
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  return {
    messages: [
    ]
  };
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
