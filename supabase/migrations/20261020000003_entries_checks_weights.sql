create table entries (
  id uuid primary key,
  dog_id uuid not null references dogs (id) on delete cascade,
  plan_id uuid not null references plans (id),
  date date not null,
  item_id text not null,
  grams numeric not null check (grams >= 0),
  meal smallint not null check (meal in (1, 2, 3)),
  logged_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table supplement_checks (
  id uuid primary key,
  dog_id uuid not null references dogs (id) on delete cascade,
  date date not null,
  item_id text not null,
  checked_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table weights (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references dogs (id) on delete cascade,
  measured_at timestamptz not null,
  kg numeric not null check (kg > 0),
  note text,
  logged_by uuid not null references auth.users (id)
);

alter table entries enable row level security;
alter table supplement_checks enable row level security;
alter table weights enable row level security;

create policy "members can select entries for their household's dogs"
  on entries for select
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can insert entries for their household's dogs"
  on entries for insert
  with check (is_household_member(dog_household_id(dog_id)));

create policy "members can update entries for their household's dogs"
  on entries for update
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can select supplement checks for their household's dogs"
  on supplement_checks for select
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can insert supplement checks for their household's dogs"
  on supplement_checks for insert
  with check (is_household_member(dog_household_id(dog_id)));

create policy "members can update supplement checks for their household's dogs"
  on supplement_checks for update
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can select weights for their household's dogs"
  on weights for select
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can insert weights for their household's dogs"
  on weights for insert
  with check (is_household_member(dog_household_id(dog_id)));

create policy "members can update weights for their household's dogs"
  on weights for update
  using (is_household_member(dog_household_id(dog_id)));
