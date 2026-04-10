import {AgentCommandService} from "@tokenring-ai/agent";
import type {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {RpcService} from "@tokenring-ai/rpc";
import {ScriptingService} from "@tokenring-ai/scripting";
import type {ScriptingThis} from "@tokenring-ai/scripting/ScriptingService";
import {z} from "zod";
import commands from "./commands.ts";
import {SocialMediaConfigSchema} from "./index.ts";
import packageJSON from "./package.json" with {type: "json"};
import socialRPC from "./rpc/social.ts";
import SocialMediaService from "./SocialMediaService.ts";
import tools from "./tools.ts";

const packageConfigSchema = z.object({
  social: SocialMediaConfigSchema.prefault({}),
});

export default {
  name: packageJSON.name,
  displayName: "Social Media Abstraction",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    const service = new SocialMediaService(config.social);
    app.services.register(service);

    app.services.waitForItemByType(
      ScriptingService,
      (scriptingService: ScriptingService) => {
        scriptingService.registerFunction("getSocialAccount", {
          type: "native",
          params: [],
          async execute(this: ScriptingThis): Promise<string> {
            return JSON.stringify(
              await this.agent
                .requireServiceByType(SocialMediaService)
                .getCurrentAccount(this.agent),
            );
          },
        });

        scriptingService.registerFunction("getRecentSocialPosts", {
          type: "native",
          params: ["limit"],
          async execute(this: ScriptingThis, limit?: string): Promise<string> {
            const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
            const posts = await this.agent
              .requireServiceByType(SocialMediaService)
              .getRecentPosts(
                {
                  limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
                  includeReplies: false,
                  includeReshares: false,
                },
                this.agent,
              );
            return JSON.stringify(posts);
          },
        });

        scriptingService.registerFunction("createSocialPost", {
          type: "native",
          params: ["content", "title", "replyToPostId", "metadataJson"],
          async execute(
            this: ScriptingThis,
            content: string,
            title?: string,
            replyToPostId?: string,
            metadataJson?: string,
          ): Promise<string> {
            const metadata = metadataJson
              ? JSON.parse(metadataJson)
              : undefined;
            const post = await this.agent
              .requireServiceByType(SocialMediaService)
              .createPost(
                {
                  content,
                  title,
                  replyToPostId,
                  metadata,
                },
                this.agent,
              );
            return JSON.stringify(post);
          },
        });

        scriptingService.registerFunction("getCurrentSocialPost", {
          type: "native",
          params: [],
          execute(this: ScriptingThis): string {
            const post = this.agent
              .requireServiceByType(SocialMediaService)
              .getCurrentPost(this.agent);
            return post
              ? JSON.stringify(post)
              : "No social media post selected";
          },
        });
      },
    );

    app.waitForService(ChatService, (chatService) =>
      chatService.addTools(tools),
    );
    app.waitForService(AgentCommandService, (agentCommandService) =>
      agentCommandService.addAgentCommands(commands),
    );
    app.waitForService(RpcService, (rpcService) => {
      rpcService.registerEndpoint(socialRPC);
    });
  },
  config: packageConfigSchema,
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
