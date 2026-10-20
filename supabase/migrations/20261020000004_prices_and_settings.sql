create table prices (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  item_id text not null,
  price_per_kg numeric not null check (price_per_kg >= 0),
  cooking_loss_pct numeric not null default 0 check (cooking_loss_pct >= 0 and cooking_loss_pct < 1),
  updated_at timestamptz not null default now(),
  unique (household_id, item_id)
);

create table settings (
  household_id uuid primary key references households (id) on delete cascade,
  food_dog_start_date date,
  protein_rule text not null default '1-or-2',
  over_target_threshold_pct numeric not null default 110
);

alter table prices enable row level security;
alter table settings enable row level security;

create policy "members can select prices for their household"
  on prices for select
  using (is_household_member(household_id));

create policy "members can insert prices for their household"
  on prices for insert
  with check (is_household_member(household_id));

create policy "members can update prices for their household"
  on prices for update
  using (is_household_member(household_id));

create policy "members can select settings for their household"
  on settings for select
  using (is_household_member(household_id));

create policy "members can insert settings for their household"
  on settings for insert
  with check (is_household_member(household_id));

create policy "members can update settings for their household"
  on settings for update
  using (is_household_member(household_id));
