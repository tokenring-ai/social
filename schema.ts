import { z } from "zod";

export const SocialMediaAgentConfigSchema = z
  .object({
    provider: z.string().exactOptional(),
  })
  .default({});

export const SocialMediaConfigSchema = z.object({
  agentDefaults: SocialMediaAgentConfigSchema.prefault({}),
});
