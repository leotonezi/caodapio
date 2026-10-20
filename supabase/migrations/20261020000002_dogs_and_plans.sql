create table dogs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  name text not null,
  breed text,
  birth_date date,
  created_at timestamptz not null default now()
);

create table plans (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references dogs (id) on delete cascade,
  version int not null,
  valid_from date not null,
  valid_to date not null,
  vet_name text not null,
  document jsonb not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

alter table dogs enable row level security;
alter table plans enable row level security;

create function dog_household_id(target_dog_id uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select household_id from dogs where id = target_dog_id
$$;

create policy "members can select their household's dogs"
  on dogs for select
  using (is_household_member(household_id));

create policy "members can insert dogs for their household"
  on dogs for insert
  with check (is_household_member(household_id));

create policy "members can update their household's dogs"
  on dogs for update
  using (is_household_member(household_id));

create policy "members can select plans for their household's dogs"
  on plans for select
  using (is_household_member(dog_household_id(dog_id)));

create policy "members can insert plans for their household's dogs"
  on plans for insert
  with check (is_household_member(dog_household_id(dog_id)));

create policy "members can update plans for their household's dogs"
  on plans for update
  using (is_household_member(dog_household_id(dog_id)));
