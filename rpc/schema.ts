import type {RPCSchema} from "@tokenring-ai/rpc/types";
import {z} from "zod";
import {AgentNotFoundSchema} from "@tokenring-ai/agent/schema";

const SocialMediaAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const SocialMediaAuthorSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  displayName: z.string().optional(),
  url: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const SocialMediaMetricsSchema = z.object({
  likes: z.number().optional(),
  comments: z.number().optional(),
  shares: z.number().optional(),
  quotes: z.number().optional(),
  impressions: z.number().optional(),
  score: z.number().optional(),
});

const SocialMediaAttachmentSchema = z.object({
  type: z.enum(["image", "video", "link", "unknown"]),
  url: z.string().optional(),
  previewUrl: z.string().optional(),
  altText: z.string().optional(),
});

const SocialMediaPostSchema = z.object({
  id: z.string(),
  platform: z.string(),
  title: z.string().optional(),
  content: z.string(),
  status: z.enum(["published", "draft"]),
  url: z.string().optional(),
  author: SocialMediaAuthorSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  publishedAt: z.coerce.date().optional(),
  replyToPostId: z.string().optional(),
  attachments: z.array(SocialMediaAttachmentSchema).optional(),
  metrics: SocialMediaMetricsSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
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
          status: z.literal('success'),
          account: SocialMediaAccountSchema,
        }),
        AgentNotFoundSchema
      ]),
    },
    getCurrentPost: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal('success'),
          post: SocialMediaPostSchema.nullable(),
          message: z.string(),
        }),
        AgentNotFoundSchema
      ]),
    },
    getRecentPosts: {
      type: "query",
      input: z.object({
        agentId: z.string(),
        limit: z.number().int().positive().default(10).optional(),
        includeReplies: z.boolean().default(false).optional(),
        includeReshares: z.boolean().default(false).optional(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal('success'),
          posts: z.array(SocialMediaPostSchema),
          count: z.number(),
          currentlySelected: z.string().nullable(),
          message: z.string(),
        }),
        AgentNotFoundSchema
      ]),
    },
    createPost: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        content: z.string(),
        title: z.string().optional(),
        replyToPostId: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal('success'),
          post: SocialMediaPostSchema,
          message: z.string(),
        }),
        AgentNotFoundSchema
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
          status: z.literal('success'),
          post: SocialMediaPostSchema,
          message: z.string(),
        }),
        AgentNotFoundSchema
      ]),
    },
    clearCurrentPost: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal('success'),
          success: z.boolean(),
          message: z.string(),
        }),
        AgentNotFoundSchema
      ]),
    },
    getActiveProvider: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal('success'),
          provider: z.string().nullable(),
          availableProviders: z.array(z.string()),
        }),
        AgentNotFoundSchema
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
          status: z.literal('success'),
          success: z.boolean(),
          message: z.string(),
        }),
        AgentNotFoundSchema
      ]),
    },
  },
} satisfies RPCSchema;
