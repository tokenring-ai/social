import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_getCurrentAccount";
const displayName = "Social/getCurrentAccount";

async function execute(_args: z.output<typeof inputSchema>, agent: Agent) {
  const account = await agent
    .requireServiceByType(SocialMediaService)
    .getCurrentAccount(agent);
  return {type: "json" as const, data: account};
}

const inputSchema = z.object({});

export default {
  name,
  displayName,
  description:
    "Get the authenticated account for the active social media provider",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
