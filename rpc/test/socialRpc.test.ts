import {Agent, AgentManager} from "@tokenring-ai/agent";
import createTestingAgent from "@tokenring-ai/agent/test/createTestingAgent";
import TokenRingApp from "@tokenring-ai/app";
import createTestingApp from "@tokenring-ai/app/test/createTestingApp";
import {beforeEach, describe, expect, it} from "vitest";
import {SocialMediaState} from "../../state/SocialMediaState.ts";
import socialRPC from "../social.ts";
import createTestSocialService from "./createTestSocialService.ts";

describe("Social RPC Endpoints", () => {
  let app: TokenRingApp;
  let agentManager: AgentManager;
  let agent: Agent;

  beforeEach(() => {
    app = createTestingApp();
    agent = createTestingAgent(app);
    agentManager = app.requireService(AgentManager);
    app.addServices(agentManager);

    const {socialService} = createTestSocialService(app);
    socialService.attach(agent, {items: []});

    agent.mutateState(SocialMediaState, state => {
      state.activeProvider = "test";
    });
  });

  it("gets the current account", async () => {
    const result = await socialRPC.methods.getCurrentAccount.execute({agentId: agent.id}, app);
    expect(result.account.username).toBe("tester");
  });

  it("returns null when no post is selected", async () => {
    const result = await socialRPC.methods.getCurrentPost.execute({agentId: agent.id}, app);
    expect(result.post).toBeNull();
    expect(result.message).toContain("No social media post");
  });

  it("lists recent posts", async () => {
    const result = await socialRPC.methods.getRecentPosts.execute({agentId: agent.id, limit: 1}, app);
    expect(result.posts).toHaveLength(1);
    expect(result.count).toBe(1);
  });

  it("creates a post", async () => {
    const result = await socialRPC.methods.createPost.execute({
      agentId: agent.id,
      content: "Hello world",
      title: "Greeting",
    }, app);

    expect(result.post.id).toBeTruthy();
    expect(result.post.content).toBe("Hello world");
    expect(result.message).toContain("Social post created");
  });

  it("selects a post by ID", async () => {
    const result = await socialRPC.methods.selectPostById.execute({
      agentId: agent.id,
      id: "post-2",
    }, app);

    expect(result.post.id).toBe("post-2");
    expect(agent.getState(SocialMediaState).currentPost?.id).toBe("post-2");
  });

  it("clears the current post", async () => {
    await socialRPC.methods.selectPostById.execute({agentId: agent.id, id: "post-1"}, app);
    const result = await socialRPC.methods.clearCurrentPost.execute({agentId: agent.id}, app);

    expect(result.success).toBe(true);
    expect(agent.getState(SocialMediaState).currentPost).toBeNull();
  });

  it("gets the active provider", async () => {
    const result = await socialRPC.methods.getActiveProvider.execute({agentId: agent.id}, app);
    expect(result.provider).toBe("test");
    expect(result.availableProviders).toContain("test");
  });

  it("sets the active provider", async () => {
    const result = await socialRPC.methods.setActiveProvider.execute({
      agentId: agent.id,
      name: "test",
    }, app);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Active provider set");
  });

  it("throws when agent is missing", async () => {
    await expect(
      socialRPC.methods.getCurrentAccount.execute({agentId: "missing"}, app),
    ).rejects.toThrow("Agent not found");
  });
});
