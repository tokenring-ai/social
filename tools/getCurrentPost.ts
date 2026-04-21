import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { z } from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_getCurrentPost";
const displayName = "Social/getCurrentPost";

function execute(_args: z.output<typeof inputSchema>, agent: Agent): TokenRingToolResult {
  const currentPost = agent.requireServiceByType(SocialMediaService).getCurrentPost(agent);
  if (!currentPost) {
    throw new Error("No social media post currently selected");
  }

  return JSON.stringify({
    success: true,
    post: currentPost,
  });
}

const inputSchema = z.object({});

export default {
  name,
  displayName,
  description: "Get the currently selected social media post",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
