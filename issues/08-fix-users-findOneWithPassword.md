Title: Fix `UsersService.findOneWithPassword` query builder usage

Description
---
`UsersService.findOneWithPassword` currently uses `createQueryBuilder().setFindOptions({ take: 1 }).whereInIds(id).addSelect('User.password').getOne()` which misuses aliasing and API.

Rationale
---
- Fixing the query ensures correct selection of password and avoids runtime errors.

Files to update
---
- `src/users/users.service.ts`

Acceptance criteria / Steps
---
1. Replace the query with a clear alias: `createQueryBuilder('user').where('user.id = :id', { id }).addSelect('user.password').getOne()` or use `findOne` with select.
2. Add unit test for `findOneWithPassword`.

Suggested labels
---
- bug
- backend
