import type { Agent } from "@tokenring-ai/agent";
import type { AgentCreationContext } from "@tokenring-ai/agent/types";
import type { MaybePromise } from "bun";
import { z } from "zod";

export const SocialMediaAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().exactOptional(),
  url: z.string().exactOptional(),
  description: z.string().exactOptional(),
  avatarUrl: z.string().exactOptional(),
  metadata: z.record(z.string(), z.unknown()).exactOptional(),
});

export const SocialMediaAuthorSchema = z.object({
  id: z.string().exactOptional(),
  username: z.string(),
  displayName: z.string().exactOptional(),
  url: z.string().exactOptional(),
  avatarUrl: z.string().exactOptional(),
});

export const SocialMediaMetricsSchema = z.object({
  likes: z.number().exactOptional(),
  comments: z.number().exactOptional(),
  shares: z.number().exactOptional(),
  quotes: z.number().exactOptional(),
  impressions: z.number().exactOptional(),
  score: z.number().exactOptional(),
});

export const SocialMediaAttachmentSchema = z.object({
  type: z.enum(["image", "video", "link", "unknown"]),
  url: z.string().exactOptional(),
  previewUrl: z.string().exactOptional(),
  altText: z.string().exactOptional(),
});

export const SocialMediaPostSchema = z.object({
  id: z.string(),
  platform: z.string(),
  title: z.string().exactOptional(),
  content: z.string(),
  status: z.enum(["published", "draft"]).default("published"),
  url: z.string().exactOptional(),
  author: SocialMediaAuthorSchema,
  createdAt: z.date(),
  updatedAt: z.date().exactOptional(),
  publishedAt: z.date().exactOptional(),
  replyToPostId: z.string().exactOptional(),
  attachments: z.array(SocialMediaAttachmentSchema).exactOptional(),
  metrics: SocialMediaMetricsSchema.exactOptional(),
  metadata: z.record(z.string(), z.unknown()).exactOptional(),
});

export type SocialMediaAccount = z.infer<typeof SocialMediaAccountSchema>;
export type SocialMediaAuthor = z.infer<typeof SocialMediaAuthorSchema>;
export type SocialMediaMetrics = z.infer<typeof SocialMediaMetricsSchema>;
export type SocialMediaAttachment = z.infer<typeof SocialMediaAttachmentSchema>;
export type SocialMediaPost = z.infer<typeof SocialMediaPostSchema>;

export interface SocialMediaPostFilterOptions {
  limit?: number | undefined;
  since?: Date | undefined;
  until?: Date | undefined;
  includeReplies?: boolean | undefined;
  includeReshares?: boolean | undefined;
}

export interface CreateSocialMediaPostData {
  title?: string | undefined;
  content: string;
  replyToPostId?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
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

  getRecentPosts(filter: SocialMediaPostFilterOptions, agent: Agent): MaybePromise<SocialMediaPost[]>;

  getPostById(id: string, agent: Agent): MaybePromise<SocialMediaPost>;

  createPost(data: CreateSocialMediaPostData, agent: Agent): MaybePromise<SocialMediaPost>;

  deletePost?(id: string, agent: Agent): MaybePromise<void>;
}
