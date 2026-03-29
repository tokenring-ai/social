import {z} from "zod";

export const SocialMediaAgentConfigSchema = z.object({
  provider: z.string().optional(),
}).default({});

export const SocialMediaConfigSchema = z.object({
  providers: z.record(z.string(), z.any()).default({}),
  agentDefaults: SocialMediaAgentConfigSchema.prefault({}),
});
