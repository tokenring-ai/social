import {Agent} from "@tokenring-ai/agent";
import TokenRingApp from "@tokenring-ai/app";
import type {
  CreateSocialMediaPostData,
  SocialMediaAccount,
  SocialMediaPost,
  SocialMediaPostFilterOptions,
  SocialMediaProvider,
} from "../../SocialMediaProvider.ts";
import SocialMediaService from "../../SocialMediaService.ts";
import {SocialMediaConfigSchema} from "../../schema.ts";

class TestSocialProvider implements SocialMediaProvider {
  description = "Test social provider";
  posts: SocialMediaPost[] = [];

  attach(_agent: Agent): void {
    this.posts = [
      {
        id: "post-1",
        platform: "test",
        title: "First",
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
  }

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
    const post: SocialMediaPost = {
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
    this.posts.unshift(post);
    return post;
  }
}

export default function createTestSocialService(app: TokenRingApp) {
  let socialService = app.getService(SocialMediaService);
  if (!socialService) {
    socialService = new SocialMediaService(SocialMediaConfigSchema.parse({
      agentDefaults: {
        provider: "test",
      },
    }));

    app.addServices(socialService);
    socialService.registerSocialMediaProvider("test", new TestSocialProvider());
  }

  return {socialService};
}
