import type { AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand } from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";
import { SocialMediaState } from "../../../state/SocialMediaState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({ agent }: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const account = await agent.requireServiceByType(SocialMediaService).getCurrentAccount(agent);
  const lines = [`Provider: ${agent.getState(SocialMediaState).activeProvider ?? "(none)"}`, `Username: ${account.username}`, `Account ID: ${account.id}`];
  if (account.displayName) lines.push(`Display Name: ${account.displayName}`);
  if (account.description) lines.push(`Description: ${account.description}`);
  if (account.url) lines.push(`URL: ${account.url}`);
  return lines.join("\n");
}

export default {
  name: "social account get",
  description: "Show the authenticated social media account",
  inputSchema,
  execute,
  help: `Display the currently authenticated social media account for the active provider.

## Example

/social account get`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
