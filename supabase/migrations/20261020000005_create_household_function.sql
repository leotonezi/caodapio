-- Both functions are SECURITY DEFINER: household/membership rows are never
-- inserted directly by clients (see households.sql), only through here,
-- running as the function owner (bypasses RLS, since the owner is also the
-- table owner). Each function still checks auth.uid() itself.

create function create_household(
  household_name text,
  member_display_name text,
  dog_name text,
  plan_document jsonb,
  plan_valid_from date,
  plan_valid_to date,
  plan_vet_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
  new_dog_id uuid;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated to create a household';
  end if;

  insert into households (name) values (household_name)
    returning id into new_household_id;

  insert into household_members (household_id, user_id, display_name)
    values (new_household_id, auth.uid(), member_display_name);

  insert into settings (household_id) values (new_household_id);

  insert into dogs (household_id, name) values (new_household_id, dog_name)
    returning id into new_dog_id;

  insert into plans (dog_id, version, valid_from, valid_to, vet_name, document, created_by)
    values (new_dog_id, 1, plan_valid_from, plan_valid_to, plan_vet_name, plan_document, auth.uid());

  return new_household_id;
end;
$$;

create function join_household_with_invite(
  invite_code text,
  member_display_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite household_invites;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated to join a household';
  end if;

  select * into invite from household_invites
    where code = invite_code
    for update;

  if invite is null then
    raise exception 'invalid invite code';
  end if;

  if invite.used_by is not null then
    raise exception 'invite code already used';
  end if;

  if invite.expires_at <= now() then
    raise exception 'invite code expired';
  end if;

  update household_invites set used_by = auth.uid() where id = invite.id;

  insert into household_members (household_id, user_id, display_name)
    values (invite.household_id, auth.uid(), member_display_name);

  return invite.household_id;
end;
$$;
