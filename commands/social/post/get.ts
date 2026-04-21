import type { AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand } from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({ agent }: AgentCommandInputType<typeof inputSchema>): string {
  const post = agent.requireServiceByType(SocialMediaService).getCurrentPost(agent);
  return post ? `Current social post: ${post.id}` : "No social media post is currently selected.";
}

export default {
  name: "social post get",
  description: "Show the current social media post",
  inputSchema,
  execute,
  help: `Display the currently selected social media post ID.

## Example

/social post get`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
