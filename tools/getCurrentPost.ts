import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import SocialMediaService from "../SocialMediaService.ts";

const name = "social_getCurrentPost";
const displayName = "Social/getCurrentPost";

function execute(_args: z.output<typeof inputSchema>, agent: Agent) {
  const currentPost = agent
    .requireServiceByType(SocialMediaService)
    .getCurrentPost(agent);
  if (!currentPost) {
    return {
      type: "json" as const,
      data: {
        success: false,
        error: "No social media post is currently selected",
        suggestion: "Select a post first using social_selectPost",
      },
    };
  }

  return {
    type: "json" as const,
    data: {
      success: true,
      post: currentPost,
    },
  };
}

const inputSchema = z.object({});

export default {
  name,
  displayName,
  description: "Get the currently selected social media post",
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
