import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand,} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";
import {SocialMediaState} from "../../../state/SocialMediaState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({
                   agent,
                 }: AgentCommandInputType<typeof inputSchema>): string {
  const initialProvider =
    agent.getState(SocialMediaState).initialConfig.provider;
  if (!initialProvider)
    throw new CommandFailedError("No initial social provider configured");
  agent
    .requireServiceByType(SocialMediaService)
    .setActiveProvider(initialProvider, agent);
  return `Provider reset to ${initialProvider}`;
}

export default {
  name: "social provider reset",
  description:
    "Reset the social media provider to the initial configured value",
  inputSchema,
  execute,
  help: `Reset the active social media provider to the initial configured value.

## Example

/social provider reset`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
