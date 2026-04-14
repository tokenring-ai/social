import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({
                         agent,
                       }: AgentCommandInputType<typeof inputSchema>) {
  agent.requireServiceByType(SocialMediaService).clearCurrentPost(agent);
  return "Post cleared. No social media post is currently selected.";
}

export default {
  name: "social post clear",
  description: "Clear the current social media post selection",
  inputSchema,
  execute,
  help: `Clear the current social media post selection.

## Example

/social post clear`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
