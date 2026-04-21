import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { z } from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_selectPost";
const displayName = "Social/selectPost";

async function execute({ id }: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolResult> {
  const post = await agent.requireServiceByType(SocialMediaService).selectPostById(id, agent);
  return JSON.stringify({ success: true, post });
}

const inputSchema = z.object({
  id: z.string().describe("The unique identifier of the post to select"),
});

export default {
  name,
  displayName,
  description: "Select a social media post by ID for further operations",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
