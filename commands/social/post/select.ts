import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import type {TreeLeaf} from "@tokenring-ai/agent/question";
import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import SocialMediaService from "../../../SocialMediaService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function labelForPost(
  id: string,
  title: string | undefined,
  content: string,
  createdAt: Date,
): string {
  const preview =
    (title ? `${title}: ` : "") + content.replace(/\s+/g, " ").trim();
  return `${preview.slice(0, 80)} (${new Date(createdAt).toLocaleDateString()}) [${id}]`;
}

async function execute({
                         agent,
                       }: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const socialService = agent.requireServiceByType(SocialMediaService);

  try {
    const posts = await socialService.getRecentPosts(
      {
        limit: 25,
        includeReplies: false,
        includeReshares: false,
      },
      agent,
    );

    if (!posts.length) return "No recent social media posts were found.";

    const tree: TreeLeaf[] = posts.map((post) => ({
      name: labelForPost(post.id, post.title, post.content, post.createdAt),
      value: post.id,
    }));

    const selection = await agent.askQuestion({
      message: "Choose a social media post to work with",
      question: {
        type: "treeSelect",
        label: "Social Post Selection",
        key: "result",
        minimumSelections: 1,
        maximumSelections: 1,
        tree,
      },
    });

    if (!selection) return "Post selection cancelled.";

    const post = await socialService.selectPostById(selection[0], agent);
    return `Selected social media post: ${post.id}`;
  } catch (error: unknown) {
    throw new CommandFailedError(
      `Error during social post selection: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export default {
  name: "social post select",
  description: "Interactively select a recent social media post",
  inputSchema,
  execute,
  help: `Interactively select a recent social media post from the active account.

## Example

/social post select`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
