import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";

const inputSchema = {
  args: {},
  positionals: [
    {
      name: "name",
      description: "The provider name to set",
      required: true,
    },
  ],
} as const satisfies AgentCommandInputSchema;

async function execute({positionals, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const socialService = agent.requireServiceByType(SocialMediaService);
  const providerName = positionals.name;
  if (!providerName) throw new CommandFailedError("Usage: /social provider set <name>");

  const available = socialService.getAvailableProviders();
  if (available.includes(providerName)) {
    socialService.setActiveProvider(providerName, agent);
    return `Active provider set to: ${providerName}`;
  }

  return `Provider "${providerName}" not found. Available providers: ${available.join(", ")}`;
}

export default {
  name: "social provider set",
  description: "Set the active social media provider by name",
  inputSchema,
  execute,
  help: `Set the active social media provider by name.

## Example

/social provider set x`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
