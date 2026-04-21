import { AgentNotFoundSchema } from "@tokenring-ai/agent/schema";
import type { RPCSchema } from "@tokenring-ai/rpc/types";
import { z } from "zod";

const SocialMediaAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().exactOptional(),
  url: z.string().exactOptional(),
  description: z.string().exactOptional(),
  avatarUrl: z.string().exactOptional(),
  metadata: z.record(z.string(), z.unknown()).exactOptional(),
});

const SocialMediaAuthorSchema = z.object({
  id: z.string().exactOptional(),
  username: z.string(),
  displayName: z.string().exactOptional(),
  url: z.string().exactOptional(),
  avatarUrl: z.string().exactOptional(),
});

const SocialMediaMetricsSchema = z.object({
  likes: z.number().exactOptional(),
  comments: z.number().exactOptional(),
  shares: z.number().exactOptional(),
  quotes: z.number().exactOptional(),
  impressions: z.number().exactOptional(),
  score: z.number().exactOptional(),
});

const SocialMediaAttachmentSchema = z.object({
  type: z.enum(["image", "video", "link", "unknown"]),
  url: z.string().exactOptional(),
  previewUrl: z.string().exactOptional(),
  altText: z.string().exactOptional(),
});

const SocialMediaPostSchema = z.object({
  id: z.string(),
  platform: z.string(),
  title: z.string().exactOptional(),
  content: z.string(),
  status: z.enum(["published", "draft"]),
  url: z.string().exactOptional(),
  author: SocialMediaAuthorSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().exactOptional(),
  publishedAt: z.coerce.date().exactOptional(),
  replyToPostId: z.string().exactOptional(),
  attachments: z.array(SocialMediaAttachmentSchema).exactOptional(),
  metrics: SocialMediaMetricsSchema.exactOptional(),
  metadata: z.record(z.string(), z.unknown()).exactOptional(),
});

export default {
  name: "Social RPC",
  path: "/rpc/social",
  methods: {
    getCurrentAccount: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          account: SocialMediaAccountSchema,
        }),
        AgentNotFoundSchema,
      ]),
    },
    getCurrentPost: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          post: SocialMediaPostSchema.nullable(),
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
    getRecentPosts: {
      type: "query",
      input: z.object({
        agentId: z.string(),
        limit: z.number().int().positive().default(10).exactOptional(),
        includeReplies: z.boolean().default(false).exactOptional(),
        includeReshares: z.boolean().default(false).exactOptional(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          posts: z.array(SocialMediaPostSchema),
          count: z.number(),
          currentlySelected: z.string().nullable(),
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
    createPost: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        content: z.string(),
        title: z.string().exactOptional(),
        replyToPostId: z.string().exactOptional(),
        metadata: z.record(z.string(), z.unknown()).exactOptional(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          post: SocialMediaPostSchema,
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
    selectPostById: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        id: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          post: SocialMediaPostSchema,
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
    clearCurrentPost: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          success: z.boolean(),
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
    getActiveProvider: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          provider: z.string().nullable(),
          availableProviders: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
    setActiveProvider: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        name: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          success: z.boolean(),
          message: z.string(),
        }),
        AgentNotFoundSchema,
      ]),
    },
  },
} satisfies RPCSchema;
