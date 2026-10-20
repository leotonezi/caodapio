BEGIN;
SELECT plan(6);

-- Fixtures: alice is a member of household A (with a dog), bob is not.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

insert into households (id, name) values
  ('33333333-3333-3333-3333-333333333333', 'Família Teste');

insert into household_members (household_id, user_id, display_name) values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Alice');

insert into dogs (id, household_id, name) values
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Ares');

insert into plans (id, dog_id, version, valid_from, valid_to, vet_name, document, created_by) values
  ('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 1,
   '2026-09-21', '2026-11-21', 'Dra. Teste', '{}'::jsonb, '11111111-1111-1111-1111-111111111111');

insert into weights (id, dog_id, measured_at, kg, logged_by) values
  ('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', now(), 12.5,
   '11111111-1111-1111-1111-111111111111');

-- Alice (household member) can see the dog, its plan, and its weights.
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

select isnt_empty(
  $$ select 1 from dogs where id = '55555555-5555-5555-5555-555555555555' $$,
  'member can select the household''s dog'
);

select isnt_empty(
  $$ select 1 from plans where dog_id = '55555555-5555-5555-5555-555555555555' $$,
  'member can select the dog''s plan'
);

select isnt_empty(
  $$ select 1 from weights where dog_id = '55555555-5555-5555-5555-555555555555' $$,
  'member can select the dog''s weights'
);

reset role;
reset "request.jwt.claims";

-- Bob (non-member) cannot see or write anything for this dog.
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select is_empty(
  $$ select 1 from dogs where id = '55555555-5555-5555-5555-555555555555' $$,
  'non-member cannot select the dog'
);

select is_empty(
  $$ select 1 from weights where dog_id = '55555555-5555-5555-5555-555555555555' $$,
  'non-member cannot select the dog''s weights'
);

select throws_ok(
  $$ insert into weights (id, dog_id, measured_at, kg, logged_by)
     values ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555',
             now(), 13, '22222222-2222-2222-2222-222222222222') $$,
  'new row violates row-level security policy for table "weights"',
  'non-member cannot insert a weight for another household''s dog'
);

reset role;
reset "request.jwt.claims";

SELECT * FROM finish();
ROLLBACK;
