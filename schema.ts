import { z } from "zod";

export const SocialMediaPostMetadataSchema = z.record(z.string(), z.unknown());
export type SocialMediaPostMetadata = z.infer<typeof SocialMediaPostMetadataSchema>;

export const SocialMediaAgentConfigSchema = z
  .object({
    provider: z.string().exactOptional(),
  })
  .default({});

export const SocialMediaConfigSchema = z.object({
  agentDefaults: SocialMediaAgentConfigSchema.prefault({}),
});
