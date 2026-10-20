create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table household_members (
  household_id uuid not null references households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null,
  used_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table households enable row level security;
alter table household_members enable row level security;
alter table household_invites enable row level security;

create function is_household_member(target_household_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from household_members
    where household_id = target_household_id
      and user_id = auth.uid()
  )
$$;

create policy "members can select their household"
  on households for select
  using (is_household_member(id));

create policy "members can update their household"
  on households for update
  using (is_household_member(id));

-- No client-facing insert policy on households: creation only happens
-- through the create_household() SECURITY DEFINER function (below), which
-- bypasses RLS as the function owner.

create policy "members can select household members"
  on household_members for select
  using (is_household_member(household_id));

-- No client-facing insert policy on household_members either: membership is
-- only ever created by create_household() (founding member) or
-- join_household_with_invite() (joiner), both SECURITY DEFINER. A direct
-- "user_id = auth.uid()" policy would let anyone join any household by id.

create policy "members can select invites for their household"
  on household_invites for select
  using (is_household_member(household_id));

create policy "members can create invites for their household"
  on household_invites for insert
  with check (is_household_member(household_id));

-- No client-facing select/update policy for redeeming an invite by code:
-- that would let any authenticated user enumerate every open invite code
-- across every household. Redemption happens only through
-- join_household_with_invite(), which looks up the row by exact code as
-- the function owner (bypassing RLS) and validates expiry/used_by itself.
