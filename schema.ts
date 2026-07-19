import type { ConfigFieldMeta } from "@tokenring-ai/app/config/metadata";
import { z } from "zod";

export const SocialMediaPostMetadataSchema = z.record(z.string(), z.unknown());
export type SocialMediaPostMetadata = z.infer<typeof SocialMediaPostMetadataSchema>;

export const SocialMediaAgentConfigSchema = z
  .object({
    provider: z.string().exactOptional(),
  })
  .default({});

export const SocialMediaConfigSchema = z
  .object({
    agentDefaults: SocialMediaAgentConfigSchema.prefault({}).meta({
      label: "Agent Defaults",
    } satisfies ConfigFieldMeta),
  })
  .meta({ label: "Social", description: "Social media publishing settings" } satisfies ConfigFieldMeta);
