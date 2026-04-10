import type {Agent} from "@tokenring-ai/agent";
import {AgentStateSlice} from "@tokenring-ai/agent/types";
import {z} from "zod";
import type {SocialMediaAgentConfigSchema} from "../schema.ts";
import {type SocialMediaPost, SocialMediaPostSchema,} from "../SocialMediaProvider.ts";

const serializationSchema = z
  .object({
    activeProvider: z.string().nullable(),
    currentPost: SocialMediaPostSchema.nullable().optional(),
  })
  .prefault({activeProvider: null, currentPost: null});

export class SocialMediaState extends AgentStateSlice<
  typeof serializationSchema
> {
  activeProvider: string | null;
  currentPost: SocialMediaPost | null;

  constructor(
    readonly initialConfig: z.output<typeof SocialMediaAgentConfigSchema>,
  ) {
    super("SocialMediaState", serializationSchema);
    this.activeProvider = initialConfig.provider ?? null;
    this.currentPost = null;
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(SocialMediaState);
    this.activeProvider ??= parentState.activeProvider;
    this.currentPost ??= parentState.currentPost;
  }

  serialize(): z.output<typeof serializationSchema> {
    return {
      activeProvider: this.activeProvider,
      currentPost: this.currentPost,
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.activeProvider = data.activeProvider;
    this.currentPost = data.currentPost ?? null;
  }

  show(): string {
    return `Active Social Provider: ${this.activeProvider}
Current Social Post: ${this.currentPost?.id ?? "None"}`;
  }
}
