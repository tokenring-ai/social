import {AgentManager} from "@tokenring-ai/agent";
import type TokenRingApp from "@tokenring-ai/app";
import {createRPCEndpoint} from "@tokenring-ai/rpc/createRPCEndpoint";
import SocialMediaService from "../SocialMediaService.ts";
import {SocialMediaState} from "../state/SocialMediaState.ts";
import SocialRpcSchema from "./schema.ts";

export default createRPCEndpoint(SocialRpcSchema, {
  async getCurrentAccount(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);

    return {
      account: await socialService.getCurrentAccount(agent),
    };
  },

  getCurrentPost(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const post = socialService.getCurrentPost(agent);

    if (!post) {
      return {
        post: null,
        message: "No social media post is currently selected",
      };
    }

    return {
      post,
      message: `Currently selected social post: ${post.id}`,
    };
  },

  async getRecentPosts(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const posts = await socialService.getRecentPosts(
      {
        limit: args.limit,
        includeReplies: args.includeReplies,
        includeReshares: args.includeReshares,
      },
      agent,
    );
    const currentPost = socialService.getCurrentPost(agent);

    return {
      posts,
      count: posts.length,
      currentlySelected: currentPost?.id ?? null,
      message: `Found ${posts.length} social posts`,
    };
  },

  async createPost(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const post = await socialService.createPost(
      {
        content: args.content,
        title: args.title,
        replyToPostId: args.replyToPostId,
        metadata: args.metadata,
      },
      agent,
    );

    return {
      post,
      message: `Social post created with ID: ${post.id}`,
    };
  },

  async selectPostById(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const post = await socialService.selectPostById(args.id, agent);

    return {
      post,
      message: `Selected social post: ${post.id}`,
    };
  },

  clearCurrentPost(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    socialService.clearCurrentPost(agent);

    return {
      success: true,
      message:
        "Post selection cleared. No social media post is currently selected.",
    };
  },

  getActiveProvider(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const availableProviders = socialService.getAvailableProviders();
    const provider = agent.getState(SocialMediaState).activeProvider ?? null;

    return {
      provider,
      availableProviders,
    };
  },

  setActiveProvider(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const socialService = app.requireService(SocialMediaService);
    const availableProviders = socialService.getAvailableProviders();

    if (!availableProviders.includes(args.name)) {
      return {
        success: false,
        message: `Provider "${args.name}" not found. Available providers: ${availableProviders.join(", ")}`,
      };
    }

    socialService.setActiveProvider(args.name, agent);
    return {
      success: true,
      message: `Active provider set to: ${args.name}`,
    };
  },
});
