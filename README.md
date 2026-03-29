# @tokenring-ai/social

`@tokenring-ai/social` provides a provider-based abstraction for authenticated social media account operations.

It follows the same pattern as `@tokenring-ai/blog`:

- `SocialMediaService` owns provider selection and current post state
- concrete packages implement `SocialMediaProvider`
- provider packages register themselves in their own `plugin.ts`

## Capabilities

- read the authenticated account profile
- list recent posts from the authenticated account
- select a current post in agent state
- create a new post through the active provider

## Configuration

```ts
{
  social: {
    agentDefaults: {
      provider: "x"
    },
    providers: {
      x: {
        type: "x",
        bearerToken: process.env.X_BEARER_TOKEN
      }
    }
  }
}
```

Provider-specific packages are responsible for parsing and registering entries from `social.providers`.
