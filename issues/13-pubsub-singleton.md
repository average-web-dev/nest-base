Title: Provide singleton `PubSub` provider instead of per-module instances

Description
---
Replace ad-hoc `new PubSub()` instances in resolvers with a single DI-provided `PubSub` instance so subscription events are centrally published and consumed.

Rationale
---
- Multiple `PubSub` instances fragment events and can lead to missed subscription messages.

Files to update
---
- `src/users/users.resolver.ts` (remove `const pubSub = new PubSub();`)
- Add `src/pubsub/pubsub.module.ts` or similar provider and register globally

Acceptance criteria / Steps
---
1. Add a `PubSub` provider that returns a single instance.
2. Inject the provider into resolvers via constructor.
3. Update code to use injected `pubSub`.

Suggested labels
---
- refactor
- graphql
