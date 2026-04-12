import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingToolDefinition, TokenRingToolResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_getRecentPosts";
const displayName = "Social/getRecentPosts";

async function execute(
  {limit, includeReplies, includeReshares}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<TokenRingToolResult> {
  const posts = await agent
    .requireServiceByType(SocialMediaService)
    .getRecentPosts(
      {
        limit,
        includeReplies,
        includeReshares,
      },
      agent,
    );

  return JSON.stringify({ success: true, posts});
}

const inputSchema = z.object({
  limit: z.number().int().positive().max(100).default(20).optional(),
  includeReplies: z.boolean().default(false).optional(),
  includeReshares: z.boolean().default(false).optional(),
});

export default {
  name,
  displayName,
  description: "Get recent social media posts from the authenticated account",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
