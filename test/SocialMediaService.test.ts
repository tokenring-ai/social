import {Agent} from "@tokenring-ai/agent";
import {beforeEach, describe, expect, it} from "vitest";
import createTestingAgent from "../../agent/test/createTestingAgent.ts";
import createTestingApp from "../../app/test/createTestingApp.ts";
import {SocialMediaConfigSchema} from "../schema.ts";
import type {
  CreateSocialMediaPostData,
  SocialMediaAccount,
  SocialMediaPost,
  SocialMediaPostFilterOptions,
  SocialMediaProvider,
} from "../SocialMediaProvider.ts";
import SocialMediaService from "../SocialMediaService.ts";
import {SocialMediaState} from "../state/SocialMediaState.ts";

class TestSocialProvider implements SocialMediaProvider {
  description = "Test social provider";

  private posts: SocialMediaPost[] = [
    {
      id: "post-1",
      platform: "test",
      content: "First post",
      status: "published",
      author: {id: "acct-1", username: "tester"},
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      id: "post-2",
      platform: "test",
      title: "Second",
      content: "Second post",
      status: "published",
      author: {id: "acct-1", username: "tester"},
      createdAt: new Date("2025-01-02T00:00:00.000Z"),
    },
  ];

  async getAccount(_agent: Agent): Promise<SocialMediaAccount> {
    return {
      id: "acct-1",
      username: "tester",
      displayName: "Test User",
      url: "https://example.com/tester",
    };
  }

  async getRecentPosts(filter: SocialMediaPostFilterOptions, _agent: Agent): Promise<SocialMediaPost[]> {
    return this.posts.slice(0, filter.limit ?? this.posts.length);
  }

  async getPostById(id: string, _agent: Agent): Promise<SocialMediaPost> {
    const post = this.posts.find(item => item.id === id);
    if (!post) throw new Error("Post not found");
    return post;
  }

  async createPost(data: CreateSocialMediaPostData, _agent: Agent): Promise<SocialMediaPost> {
    const created: SocialMediaPost = {
      id: `post-${this.posts.length + 1}`,
      platform: "test",
      title: data.title,
      content: data.content,
      status: "published",
      author: {id: "acct-1", username: "tester"},
      createdAt: new Date("2025-01-03T00:00:00.000Z"),
      replyToPostId: data.replyToPostId,
      metadata: data.metadata,
    };
    this.posts.unshift(created);
    return created;
  }
}

describe("SocialMediaService", () => {
  let app: ReturnType<typeof createTestingApp>;
  let agent: ReturnType<typeof createTestingAgent>;
  let service: SocialMediaService;

  beforeEach(() => {
    app = createTestingApp();
    agent = createTestingAgent(app);
    service = new SocialMediaService(SocialMediaConfigSchema.parse({
      agentDefaults: {
        provider: "test",
      },
    }));
    service.registerSocialMediaProvider("test", new TestSocialProvider());
    app.addServices(service);
    service.attach(agent, {items: []});
  });

  it("reads the active provider from agent state", () => {
    expect(agent.getState(SocialMediaState).activeProvider).toBe("test");
  });

  it("retrieves the authenticated account", async () => {
    const account = await service.getCurrentAccount(agent);
    expect(account.username).toBe("tester");
    expect(account.id).toBe("acct-1");
  });

  it("creates a post and stores it as the current post", async () => {
    const post = await service.createPost({content: "hello world"}, agent);
    expect(post.content).toBe("hello world");
    expect(service.getCurrentPost(agent)?.id).toBe(post.id);
  });

  it("selects an existing post by ID", async () => {
    const post = await service.selectPostById("post-2", agent);
    expect(post.id).toBe("post-2");
    expect(agent.getState(SocialMediaState).currentPost?.id).toBe("post-2");
  });

  it("clears the current post", async () => {
    await service.selectPostById("post-1", agent);
    await service.clearCurrentPost(agent);
    expect(service.getCurrentPost(agent)).toBeNull();
  });
});
