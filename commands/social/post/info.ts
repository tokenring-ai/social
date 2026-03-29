import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";
import {SocialMediaState} from "../../../state/SocialMediaState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function truncate(text: string, maxLength = 280): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}...`;
}

async function execute({agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const socialService = agent.requireServiceByType(SocialMediaService);
  const currentPost = socialService.getCurrentPost(agent);
  if (!currentPost) return "No social media post is currently selected.\nUse /social post select to choose a post.";

  const lines = [
    `Provider: ${agent.getState(SocialMediaState).activeProvider ?? "(none)"}`,
    `Platform: ${currentPost.platform}`,
    `Author: ${currentPost.author.username}`,
    `Post ID: ${currentPost.id}`,
    `Created: ${new Date(currentPost.createdAt).toLocaleString()}`,
    `Status: ${currentPost.status}`,
    `Content: ${truncate(currentPost.content)}`,
  ];

  if (currentPost.title) lines.push(`Title: ${currentPost.title}`);
  if (currentPost.publishedAt) lines.push(`Published: ${new Date(currentPost.publishedAt).toLocaleString()}`);
  if (currentPost.url) lines.push(`URL: ${currentPost.url}`);
  if (currentPost.metrics) {
    const metrics = Object.entries(currentPost.metrics)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ");
    if (metrics) lines.push(`Metrics: ${metrics}`);
  }

  return lines.join("\n");
}

export default {
  name: "social post info",
  description: "Show detailed information about the current social media post",
  inputSchema,
  execute,
  help: `Display detailed information about the currently selected social media post.

## Example

/social post info`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
