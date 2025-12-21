Title: Rename `curent-user.decorator.ts` to `current-user.decorator.ts`

Description
---
Fix file name spelling `curent-user.decorator.ts` → `current-user.decorator.ts` and update any imports across the codebase.

Rationale
---
- Correct naming improves clarity and avoids import confusion or typos in future code.

Files to update
---
- `src/auth/curent-user.decorator.ts` (rename)
- Files importing the decorator (search for `curent-user` or usage of `CurrentUser`)

Acceptance criteria / Steps
---
1. Rename file to `current-user.decorator.ts` and keep the exported symbol `CurrentUser`.
2. Update all import paths to the new filename.
3. Run TypeScript build to confirm no unresolved imports.

Suggested labels
---
- refactor
- cleanup
