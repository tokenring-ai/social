import type {TreeLeaf} from "@tokenring-ai/agent/question";
import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand,} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";
import {SocialMediaState} from "../../../state/SocialMediaState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({
                         agent,
                       }: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const socialService = agent.requireServiceByType(SocialMediaService);
  const available = socialService.getAvailableProviders();
  if (available.length === 0)
    return "No social media providers are registered.";
  if (available.length === 1) {
    socialService.setActiveProvider(available[0], agent);
    return `Only one provider configured, auto-selecting: ${available[0]}`;
  }

  const activeProvider = agent.getState(SocialMediaState).activeProvider;
  const tree: TreeLeaf[] = available.map((name) => ({
    name: `${name}${name === activeProvider ? " (current)" : ""}`,
    value: name,
  }));

  const selection = await agent.askQuestion({
    message: "Select an active social media provider",
    question: {
      type: "treeSelect",
      label: "Social Provider Selection",
      key: "result",
      defaultValue: activeProvider ? [activeProvider] : undefined,
      minimumSelections: 1,
      maximumSelections: 1,
      tree,
    },
  });

  if (!selection) return "Provider selection cancelled.";

  socialService.setActiveProvider(selection[0], agent);
  return `Active provider set to: ${selection[0]}`;
}

export default {
  name: "social provider select",
  description: "Interactively select the active social media provider",
  inputSchema,
  execute,
  help: `Interactively select the active social media provider.

## Example

/social provider select`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
