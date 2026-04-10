import type {Agent} from "@tokenring-ai/agent";
import type {AgentCreationContext} from "@tokenring-ai/agent/types";
import type {MaybePromise} from "bun";
import {z} from "zod";

export const SocialMediaAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const SocialMediaAuthorSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  displayName: z.string().optional(),
  url: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const SocialMediaMetricsSchema = z.object({
  likes: z.number().optional(),
  comments: z.number().optional(),
  shares: z.number().optional(),
  quotes: z.number().optional(),
  impressions: z.number().optional(),
  score: z.number().optional(),
});

export const SocialMediaAttachmentSchema = z.object({
  type: z.enum(["image", "video", "link", "unknown"]),
  url: z.string().optional(),
  previewUrl: z.string().optional(),
  altText: z.string().optional(),
});

export const SocialMediaPostSchema = z.object({
  id: z.string(),
  platform: z.string(),
  title: z.string().optional(),
  content: z.string(),
  status: z.enum(["published", "draft"]).default("published"),
  url: z.string().optional(),
  author: SocialMediaAuthorSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  publishedAt: z.date().optional(),
  replyToPostId: z.string().optional(),
  attachments: z.array(SocialMediaAttachmentSchema).optional(),
  metrics: SocialMediaMetricsSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SocialMediaAccount = z.infer<typeof SocialMediaAccountSchema>;
export type SocialMediaAuthor = z.infer<typeof SocialMediaAuthorSchema>;
export type SocialMediaMetrics = z.infer<typeof SocialMediaMetricsSchema>;
export type SocialMediaAttachment = z.infer<typeof SocialMediaAttachmentSchema>;
export type SocialMediaPost = z.infer<typeof SocialMediaPostSchema>;

export interface SocialMediaPostFilterOptions {
  limit?: number;
  since?: Date;
  until?: Date;
  includeReplies?: boolean;
  includeReshares?: boolean;
}

export interface CreateSocialMediaPostData {
  title?: string;
  content: string;
  replyToPostId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Social media providers expose the authenticated user's account and post history.
 *
 * NOTE: State management (activeProvider/currentPost) is handled by SocialMediaService.
 */
export interface SocialMediaProvider {
  description: string;

  attach?(agent: Agent, creationContext: AgentCreationContext): void;

  getAccount(agent: Agent): MaybePromise<SocialMediaAccount>;

  getRecentPosts(
    filter: SocialMediaPostFilterOptions,
    agent: Agent,
  ): MaybePromise<SocialMediaPost[]>;

  getPostById(id: string, agent: Agent): MaybePromise<SocialMediaPost>;

  createPost(
    data: CreateSocialMediaPostData,
    agent: Agent,
  ): MaybePromise<SocialMediaPost>;

  deletePost?(id: string, agent: Agent): MaybePromise<void>;
}
