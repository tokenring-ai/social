import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand,} from "@tokenring-ai/agent/types";
import markdownTable from "@tokenring-ai/utility/string/markdownTable";
import SocialMediaService from "../../../SocialMediaService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function preview(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 80);
}

async function execute({
                         agent,
                       }: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const posts = await agent
    .requireServiceByType(SocialMediaService)
    .getRecentPosts(
      {
        limit: 10,
        includeReplies: false,
        includeReshares: false,
      },
      agent,
    );

  if (posts.length === 0)
    return "No recent social media posts were found for the active account.";

  return `
Here are the ${posts.length} most recent social media posts

${markdownTable(
    ["ID", "Created At", "Preview"],
    posts.map((post) => [
      post.id,
      post.createdAt.toISOString(),
      preview(post.title ? `${post.title} ${post.content}` : post.content),
    ]),
)}
  `.trim();
}

export default {
  name: "social post list",
  description: "List recent social media posts for the active account",
  inputSchema,
  execute,
  help: `List recent social media posts from the authenticated account on the active provider.

## Example

/social post list`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
