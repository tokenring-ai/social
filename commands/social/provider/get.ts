import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand,} from "@tokenring-ai/agent/types";
import {SocialMediaState} from "../../../state/SocialMediaState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({
                   agent,
                 }: AgentCommandInputType<typeof inputSchema>): string {
  return `Current provider: ${agent.getState(SocialMediaState).activeProvider ?? "(none)"}`;
}

export default {
  name: "social provider get",
  description: "Show the active social media provider",
  inputSchema,
  execute,
  help: `Display the currently active social media provider.

## Example

/social provider get`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
