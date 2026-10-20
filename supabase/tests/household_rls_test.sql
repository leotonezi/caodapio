BEGIN;
SELECT plan(10);

-- Fixtures: two users, one household, alice is a member, bob is not.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

insert into households (id, name) values
  ('33333333-3333-3333-3333-333333333333', 'Família Teste');

insert into household_members (household_id, user_id, display_name) values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Alice');

-- Alice (member) can see her household.
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

select isnt_empty(
  $$ select 1 from households where id = '33333333-3333-3333-3333-333333333333' $$,
  'member can select their household'
);

select isnt_empty(
  $$ select 1 from household_members where household_id = '33333333-3333-3333-3333-333333333333' $$,
  'member can select the member list of their household'
);

reset role;
reset "request.jwt.claims";

-- Bob (non-member) cannot see Alice's household or its members, and cannot
-- insert himself into it directly (no client-facing insert policy at all —
-- membership is only ever created by the create_household/
-- join_household_with_invite functions).
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select is_empty(
  $$ select 1 from households where id = '33333333-3333-3333-3333-333333333333' $$,
  'non-member cannot select the household'
);

select is_empty(
  $$ select 1 from household_members where household_id = '33333333-3333-3333-3333-333333333333' $$,
  'non-member cannot select the member list'
);

select throws_ok(
  $$ insert into household_members (household_id, user_id, display_name)
     values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Bob') $$,
  'new row violates row-level security policy for table "household_members"',
  'non-member cannot insert themselves into another household directly'
);

-- Bob cannot see or enumerate invites either; redemption is function-only.
reset role;
reset "request.jwt.claims";

set local role authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

insert into household_invites (id, household_id, code, expires_at) values
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'ABC123', now() + interval '1 day');

reset role;
reset "request.jwt.claims";

set local role authenticated;
set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select is_empty(
  $$ select 1 from household_invites where code = 'ABC123' $$,
  'non-member cannot select invites directly, even by exact code'
);

select throws_ok(
  $$ select join_household_with_invite('WRONGCODE', 'Bob') $$,
  'invalid invite code',
  'joining with a wrong code raises an error'
);

select lives_ok(
  $$ select join_household_with_invite('ABC123', 'Bob') $$,
  'joining with a valid, unused, unexpired code succeeds'
);

select isnt_empty(
  $$ select 1 from household_members
     where household_id = '33333333-3333-3333-3333-333333333333'
       and user_id = '22222222-2222-2222-2222-222222222222' $$,
  'bob is now a member after redeeming the invite'
);

select throws_ok(
  $$ select join_household_with_invite('ABC123', 'Bob again') $$,
  'invite code already used',
  'redeeming an already-used code raises an error'
);

reset role;
reset "request.jwt.claims";

SELECT * FROM finish();
ROLLBACK;
