import type Agent from "@tokenring-ai/agent/Agent";
import type {AgentCreationContext} from "@tokenring-ai/agent/types";
import type {TokenRingService} from "@tokenring-ai/app/types";
import deepMerge from "@tokenring-ai/utility/object/deepMerge";
import KeyedRegistry from "@tokenring-ai/utility/registry/KeyedRegistry";
import type {z} from "zod";
import {SocialMediaAgentConfigSchema, type SocialMediaConfigSchema,} from "./schema.ts";
import type {
  CreateSocialMediaPostData,
  SocialMediaAccount,
  SocialMediaPost,
  SocialMediaPostFilterOptions,
  SocialMediaProvider,
} from "./SocialMediaProvider.ts";
import {SocialMediaState} from "./state/SocialMediaState.ts";

export default class SocialMediaService implements TokenRingService {
  readonly name = "SocialMediaService";
  description =
    "Abstract interface for authenticated social media account operations";

  private providers = new KeyedRegistry<SocialMediaProvider>();

  registerSocialMediaProvider = this.providers.register;
  getAvailableProviders = this.providers.getAllItemNames;

  constructor(readonly options: z.output<typeof SocialMediaConfigSchema>) {
  }

  attach(agent: Agent, creationContext: AgentCreationContext): void {
    const agentConfig = deepMerge(
      this.options.agentDefaults,
      agent.getAgentConfigSlice("social", SocialMediaAgentConfigSchema),
    );
    const initialState = agent.initializeState(SocialMediaState, agentConfig);
    for (const provider of this.providers.getAllItemValues()) {
      provider.attach?.(agent, creationContext);
    }
    creationContext.items.push(
      `Selected social provider: ${initialState.activeProvider ?? "(none)"}`,
    );
  }

  requireActiveProvider(agent: Agent): SocialMediaProvider {
    const activeProvider = agent.getState(SocialMediaState).activeProvider;
    if (!activeProvider)
      throw new Error("No social media provider is currently selected");
    return this.providers.requireItemByName(activeProvider);
  }

  setActiveProvider(name: string, agent: Agent): void {
    agent.mutateState(SocialMediaState, (state) => {
      state.activeProvider = name;
    });
  }

  async getCurrentAccount(agent: Agent): Promise<SocialMediaAccount> {
    return await this.requireActiveProvider(agent).getAccount(agent);
  }

  async getRecentPosts(
    filter: SocialMediaPostFilterOptions,
    agent: Agent,
  ): Promise<SocialMediaPost[]> {
    return await this.requireActiveProvider(agent).getRecentPosts(
      filter,
      agent,
    );
  }

  async getPostById(id: string, agent: Agent): Promise<SocialMediaPost> {
    return await this.requireActiveProvider(agent).getPostById(id, agent);
  }

  async selectPostById(id: string, agent: Agent): Promise<SocialMediaPost> {
    const post = await this.getPostById(id, agent);
    agent.mutateState(SocialMediaState, (state) => {
      state.currentPost = post;
    });
    return post;
  }

  async createPost(
    data: CreateSocialMediaPostData,
    agent: Agent,
  ): Promise<SocialMediaPost> {
    const post = await this.requireActiveProvider(agent).createPost(
      data,
      agent,
    );
    agent.mutateState(SocialMediaState, (state) => {
      state.currentPost = post;
    });
    return post;
  }

  getCurrentPost(agent: Agent): SocialMediaPost | null {
    return agent.getState(SocialMediaState).currentPost;
  }

  clearCurrentPost(agent: Agent): void {
    agent.mutateState(SocialMediaState, (state) => {
      state.currentPost = null;
    });
  }

  async deleteCurrentPost(agent: Agent): Promise<void> {
    const provider = this.requireActiveProvider(agent);
    if (!provider.deletePost) {
      throw new Error(
        "The active social media provider does not support deleting posts",
      );
    }
    const currentPost = this.getCurrentPost(agent);
    if (!currentPost)
      throw new Error("No social media post is currently selected");
    await provider.deletePost(currentPost.id, agent);
    await this.clearCurrentPost(agent);
  }
}
