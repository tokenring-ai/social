import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingToolDefinition, TokenRingToolResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_createPost";
const displayName = "Social/createPost";

async function execute(
  {title, content, replyToPostId, metadata}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<TokenRingToolResult> {
  const socialService = agent.requireServiceByType(SocialMediaService);
  const post = await socialService.createPost(
    {title, content, replyToPostId, metadata},
    agent,
  );
  agent.infoMessage(`[${name}] Post created with ID: ${post.id}`);
  return `Created social media post (PostId: ${post.id})`;
}

const inputSchema = z.object({
  title: z
    .string()
    .optional()
    .describe("Optional title used by providers that support titled posts"),
  content: z.string().describe("The text content of the social media post"),
  replyToPostId: z.string().optional().describe("Optional post ID to reply to"),
  metadata: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Provider-specific metadata such as subreddit or link URL"),
});

export default {
  name,
  displayName,
  description: "Create a new social media post on the active provider",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
