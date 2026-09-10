-- ============================================================================
-- OFFHANDED BY RAVNEET — BOOKING FAILURE ROOT-CAUSE FIX (ONE-SHOT SCRIPT)
-- Paste this ENTIRE file into Supabase SQL Editor and run ONCE.
-- It outputs ONE combined JSON report (single result) — paste that back.
--
-- 1. Pre-repair diagnostics
-- 2. Backfill users_profile (ROOT CAUSE: new users had no profile row)
-- 3. handle_new_user() + trigger (permanent fix for future signups)
-- 4. Atomic confirm_workshop_booking() RPC (idempotent, race-safe)
-- 5. Repair the 3 lost Razorpay payments + reconcile slots
-- 6. Post-repair state
-- Safe to re-run.
-- ============================================================================

drop table if exists pg_temp.diag;
create temp table diag (seq serial primary key, payload jsonb);

-- ----------------------------------------------------------------------------
-- 1) PRE-REPAIR DIAGNOSTICS
-- ----------------------------------------------------------------------------
do $diag$
declare
  v jsonb;
begin
  begin
    select coalesce(jsonb_agg(jsonb_build_object(
             'schema', schemaname, 'table', tablename, 'policy', policyname,
             'roles', roles, 'cmd', cmd)), '[]'::jsonb) into v
    from pg_policies where schemaname = 'public';
    insert into diag(payload) values (jsonb_build_object('step','A1_policies','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A1_policies','error',sqlerrm));
  end;

  begin
    select coalesce(jsonb_agg(jsonb_build_object(
             'name', conname, 'def', pg_get_constraintdef(oid))), '[]'::jsonb) into v
    from pg_constraint
    where conrelid = 'public.bookings'::regclass and contype = 'f';
    insert into diag(payload) values (jsonb_build_object('step','A2_booking_fks','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A2_booking_fks','error',sqlerrm));
  end;

  begin
    select coalesce(jsonb_agg(jsonb_build_object(
             'name', tgname,
             'table', coalesce(c.relname, '<none>'),
             'fn', p.proname)), '[]'::jsonb) into v
    from pg_trigger t
    left join pg_class c on c.oid = t.tgrelid
    join pg_proc p on p.oid = t.tgfoid
    where not t.tgisinternal;
    insert into diag(payload) values (jsonb_build_object('step','A3_triggers','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A3_triggers','error',sqlerrm));
  end;

  begin
    select jsonb_build_object(
      'auth_users', (select count(*) from auth.users),
      'profiles', (select count(*) from public.users_profile),
      'missing_profiles', coalesce(jsonb_agg(jsonb_build_object(
        'id', u.id, 'email', u.email)) filter (where p.id is null), '[]'::jsonb)
    ) into v
    from auth.users u
    left join public.users_profile p on p.id = u.id;
    insert into diag(payload) values (jsonb_build_object('step','A4_profile_gap','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A4_profile_gap','error',sqlerrm));
  end;

  begin
    select coalesce(jsonb_agg(jsonb_build_object(
             'id', p.id, 'order_id', p.provider_order_id, 'payment_id', p.provider_payment_id,
             'amount', p.amount, 'status', p.status, 'purpose', p.purpose,
             'user_id', p.user_id, 'reference_id', p.reference_id,
             'has_booking', (exists (select 1 from public.bookings b where b.payment_id = p.id))
           )), '[]'::jsonb) into v
    from public.payments p
    where p.provider_order_id in (
      'order_TYc22ifb9kX1A6','order_TZRiVWjjQd5RMc','order_TZqVv7vCreHik8');
    insert into diag(payload) values (jsonb_build_object('step','A5_lost_payments','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A5_lost_payments','error',sqlerrm));
  end;

  begin
    insert into diag(payload) values (jsonb_build_object(
      'step','A6_decrement_fn','data', to_jsonb(pg_get_functiondef(
        to_regprocedure('public.decrement_workshop_slots(uuid,integer)')))));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A6_decrement_fn','error',sqlerrm));
  end;

  begin
    select to_jsonb(w) into v from public.workshops w where w.id = '9c458d73-7742-48aa-8327-16825a1cd802';
    insert into diag(payload) values (jsonb_build_object('step','A7_workshop','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A7_workshop','error',sqlerrm));
  end;

  begin
    select jsonb_build_object(
      'total', (select count(*) from public.bookings),
      'confirmed_tickets', (select coalesce(sum(tickets),0) from public.bookings where status = 'CONFIRMED' and workshop_id = '9c458d73-7742-48aa-8327-16825a1cd802')
    ) into v;
    insert into diag(payload) values (jsonb_build_object('step','A8_bookings','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A8_bookings','error',sqlerrm));
  end;

  begin
    select jsonb_build_object(
      'checks', coalesce((select jsonb_agg(jsonb_build_object('name', conname, 'def', pg_get_constraintdef(oid)))
        from pg_constraint where conrelid = 'public.payments'::regclass and contype = 'c'), '[]'::jsonb),
      'statuses', coalesce((select jsonb_agg(distinct status) from public.payments), '[]'::jsonb)
    ) into v;
    insert into diag(payload) values (jsonb_build_object('step','A9_payments_constraints','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','A9_payments_constraints','error',sqlerrm));
  end;
end
$diag$;

-- ----------------------------------------------------------------------------
-- 2) BACKFILL MISSING PROFILES (root cause) + PERMANENT SIGNUP TRIGGER
-- ----------------------------------------------------------------------------
-- Defensive: ensure audit columns exist (idempotent; matches
-- supabase-migration-razorpay.sql in case it was never applied).
alter table public.payments add column if not exists provider_signature text;
do $fix$
begin
  insert into public.users_profile (id, email, full_name)
  select u.id, u.email,
         coalesce(nullif(u.raw_user_meta_data::jsonb->>'full_name', ''),
                  split_part(u.email, '@', 1), 'Creative Friend')
  from auth.users u
  where not exists (select 1 from public.users_profile p where p.id = u.id)
  on conflict (id) do nothing;
end
$fix$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (id, email, full_name)
  values (new.id, new.email,
          coalesce(nullif(new.raw_user_meta_data::jsonb->>'full_name', ''),
                   split_part(new.email, '@', 1), 'Creative Friend'))
  on conflict (id) do nothing;
  return new;
exception
  when others then
    return new;  -- never block signup
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3) ATOMIC CONFIRM RPC (used by /api/payment/verify for WORKSHOP purpose)
-- ----------------------------------------------------------------------------
-- Earlier runs may have published broken overloads (6-arg writes that got
-- replaced, etc). Drop EVERY overload by name so resolution can never pick a
-- stale signature, then create the authoritative 8-arg version.
do $drop$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'confirm_workshop_booking'
  loop
    execute 'drop function if exists ' || r.sig;
  end loop;
end
$drop$;
create or replace function public.confirm_workshop_booking(
  p_payment_id     uuid,
  p_ticket_count   int,
  p_attendee_name  text,
  p_attendee_email text,
  p_attendee_phone text,
  p_coupon_code    text,
  p_provider_payment_id text default null,
  p_provider_signature  text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $rpc$
declare
  pay            public.payments%rowtype;
  wk             public.workshops%rowtype;
  prof           public.users_profile%rowtype;
  v_tickets      int;
  v_base         numeric;
  v_discount     numeric := 0;
  v_expected     numeric;
  v_is_partial   boolean := false;
  v_booking_id   uuid;
  v_coupon_pct   numeric;
begin
  -- 0. Self-heal profile (belt and braces)
  insert into public.users_profile (id, email, full_name)
  select u.id, u.email,
         coalesce(nullif(u.raw_user_meta_data::jsonb->>'full_name', ''),
                  split_part(u.email, '@', 1), 'Creative Friend')
  from auth.users u
  where u.id = (select user_id from public.payments where id = p_payment_id)
  on conflict (id) do nothing;

  -- 1. Lock payment row
  select * into pay from public.payments where id = p_payment_id for update;
  if not found then
    return jsonb_build_object('success', false, 'code', 'PAYMENT_NOT_FOUND');
  end if;

  -- 2. Idempotency: booking already exists for this payment
  if exists (select 1 from public.bookings b where b.payment_id = pay.id) then
    select b.id into v_booking_id from public.bookings b where b.payment_id = pay.id limit 1;
    return jsonb_build_object('success', true, 'booking_id', v_booking_id,
                              'code', 'ALREADY_CONFIRMED');
  end if;

  -- 3. FAILED short-circuits. SUCCESS/PENDING WITHOUT a booking (step 2 would
  -- have caught an existing one) = lost/partially-repaired payment: do NOT
  -- short-circuit — fall through, create the booking, deduct the slot. The
  -- status write at the end is then a coalesce no-op.
  if pay.status = 'FAILED' then
    return jsonb_build_object('success', false, 'code', 'PAYMENT_FAILED');
  end if;

  -- 4. Purpose / workshop
  if pay.purpose <> 'WORKSHOP' then
    return jsonb_build_object('success', false, 'code', 'BAD_PURPOSE');
  end if;

  select * into wk from public.workshops where id = pay.reference_id::uuid;
  if not found then
    return jsonb_build_object('success', false, 'code', 'WORKSHOP_NOT_FOUND');
  end if;

  -- 5. Ticket guard
  v_tickets := coalesce(p_ticket_count, 1);
  if v_tickets < 1 or v_tickets > 10 then
    return jsonb_build_object('success', false, 'code', 'BAD_TICKETS');
  end if;

  -- 6. Expected amount (RUPEES) — matches createOfflineBooking math
  if coalesce(wk.price_for_two, 0) > 0 and v_tickets >= 2 then
    v_base := floor(v_tickets / 2) * wk.price_for_two + (v_tickets % 2) * wk.price;
  else
    v_base := wk.price * v_tickets;
  end if;

  if coalesce(p_coupon_code, '') <> '' and coalesce(wk.coupon_code, '') <> ''
     and lower(trim(p_coupon_code)) = lower(trim(wk.coupon_code)) then
    v_coupon_pct := coalesce(wk.coupon_discount_percent, 0);
    v_discount   := round(v_base * v_coupon_pct / 100);
    v_base       := greatest(v_base - v_discount, 0);
  end if;

  v_expected := v_base;
  v_is_partial := pay.amount < v_expected;

  -- 7. Slot check + race-safe deduction
  update public.workshops
     set available_slots = available_slots - v_tickets
   where id = wk.id
     and available_slots >= v_tickets;
  if not found then
    return jsonb_build_object('success', false, 'code', 'SOLD_OUT');
  end if;

  -- 8. Booking row (columns confirmed from lib/actions/bookings.ts)
  insert into public.bookings (user_id, workshop_id, payment_id, tickets,
                               attendee_name, attendee_email, attendee_phone,
                               status, coupon_code, coupon_discount_percent, discount_amount)
  values (pay.user_id, wk.id, pay.id, v_tickets,
          coalesce(p_attendee_name, 'Guest'),
          coalesce(p_attendee_email, ''),
          p_attendee_phone,
          'CONFIRMED',
          case when v_discount > 0 then wk.coupon_code else null end,
          case when v_discount > 0 then v_coupon_pct else null end,
          v_discount)
  returning id into v_booking_id;

  -- 9. Payment status. payments_status_check rejects 'CAPTURED' (proven by
  -- R1 error). Allowed set matches app history: CREATED / PENDING / SUCCESS /
  -- FAILED. Full payments -> SUCCESS; underpaid (partial) -> PENDING with the
  -- provider payment id recorded — identical to the deployed verify-route
  -- semantics (isPartial ? PENDING : SUCCESS).
  if v_is_partial then
    update public.payments
       set status = 'PENDING',
           provider_payment_id = coalesce(p_provider_payment_id, provider_payment_id),
           provider_signature    = coalesce(p_provider_signature, provider_signature)
     where id = pay.id;
  else
    update public.payments
       set status = 'SUCCESS',
           provider_payment_id = coalesce(p_provider_payment_id, provider_payment_id),
           provider_signature    = coalesce(p_provider_signature, provider_signature)
     where id = pay.id;
  end if;

  return jsonb_build_object('success', true, 'booking_id', v_booking_id,
                            'partial', v_is_partial);
exception
  when others then
    return jsonb_build_object('success', false, 'code', 'DB_ERROR', 'detail', sqlerrm);
end
$rpc$;

-- Compat wrapper: the CURRENTLY DEPLOYED verify route calls the 6-arg form.
-- Keep that name resolution working until the updated app is redeployed.
create or replace function public.confirm_workshop_booking(
  p_payment_id     uuid,
  p_ticket_count   int,
  p_attendee_name  text,
  p_attendee_email text,
  p_attendee_phone text,
  p_coupon_code    text
)
returns jsonb
language sql
security definer
set search_path = public
as $wrap$
  select public.confirm_workshop_booking(
    p_payment_id, p_ticket_count, p_attendee_name, p_attendee_email,
    p_attendee_phone, p_coupon_code, null, null);
$wrap$;

grant execute on function public.confirm_workshop_booking(uuid, int, text, text, text, text)
  to authenticated, anon, service_role;

grant execute on function public.confirm_workshop_booking(uuid, int, text, text, text, text, text, text)
  to authenticated, anon, service_role;
grant execute on function public.handle_new_user() to service_role;

-- ----------------------------------------------------------------------------
-- 4) REPAIR THE 3 LOST PAYMENTS (keyed by provider_order_id, idempotent)
-- ----------------------------------------------------------------------------

-- ROOT CAUSE (proven by A9): payments_status_check = CREATED/SUCCESS/FAILED
-- only, but the app has ALWAYS written PENDING (verify-route partials,
-- createOfflineBooking, markPaymentAsDone leftovers). Every PENDING write has
-- been throwing this check violation — which is exactly how paid bookings got
-- lost. Widen the constraint to match app semantics (idempotent).
alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments
  add constraint payments_status_check
  check (status in ('CREATED','PENDING','SUCCESS','FAILED'));

do $check$
begin
  insert into diag(payload) values (jsonb_build_object('step','A10_payment_check_widened','data',
    (select coalesce(jsonb_agg(jsonb_build_object('name', conname, 'def', pg_get_constraintdef(oid))), '[]'::jsonb)
     from pg_constraint where conrelid = 'public.payments'::regclass and contype = 'c')));
end
$check$;
do $repair$
declare
  r record;
  v_booking_id uuid;
  v_partial boolean;
  v_name text;
begin
  -- Fix payment status/provider ids for ALL 3 orders (idempotent; FAILED rows
  -- are never resurrected). payments_status_check rejects 'CAPTURED' (proven
  -- by R1 error last run). Full payments -> SUCCESS; the 839 payment (60% of
  -- 1399) -> PENDING, matching the deployed verify route's partial semantics.
  update public.payments set status = 'PENDING', provider_payment_id = 'pay_TYc29gJWIfK6RL',
         provider_signature = 'repair-2026-09-11'
   where provider_order_id = 'order_TYc22ifb9kX1A6' and status <> 'FAILED';
  update public.payments set status = 'SUCCESS', provider_payment_id = 'pay_TZRicZdNVXpDKb',
         provider_signature = 'repair-2026-09-11'
   where provider_order_id = 'order_TZRiVWjjQd5RMc' and status <> 'FAILED';
  update public.payments set status = 'SUCCESS', provider_payment_id = 'pay_TZqW4iHrRPrvbv',
         provider_signature = 'repair-2026-09-11'
   where provider_order_id = 'order_TZqVv7vCreHik8' and status <> 'FAILED';
  insert into diag(payload) values (jsonb_build_object('step','R0_payment_status_fixed','detail', (
    select coalesce(jsonb_agg(jsonb_build_object('order', provider_order_id, 'status', status)), '[]'::jsonb)
    from public.payments where provider_order_id in (
      'order_TYc22ifb9kX1A6','order_TZRiVWjjQd5RMc','order_TZqVv7vCreHik8'))));

  for r in
    select p.*, w.price, w.price_for_two, w.coupon_code, w.coupon_discount_percent
    from public.payments p
    join public.workshops w on w.id = p.reference_id::uuid
    where p.provider_order_id in (
      'order_TYc22ifb9kX1A6','order_TZRiVWjjQd5RMc','order_TZqVv7vCreHik8')
      and p.purpose = 'WORKSHOP'
  loop
    -- skip if booking already exists (re-run safety)
    if exists (select 1 from public.bookings b where b.payment_id = r.id) then
      continue;
    end if;

    -- never resurrect failed payments; anything else (CREATED, or SUCCESS/
    -- PENDING just set by R0) without a booking row yet must be repaired
    if r.status = 'FAILED' then
      continue;
    end if;

    -- coupon / expected amount math (identical to RPC)
    declare
      b numeric;
      d numeric := 0;
      pct numeric;
      expected numeric;
    begin
      -- all 3 lost orders were single-ticket (confirmed via Razorpay API)
      if coalesce(r.price_for_two, 0) > 0 then
        b := r.price;              -- never hit: 1 ticket
      else
        b := r.price * 1;
      end if;
      -- the 3 lost orders had no coupon
      expected := greatest(b, 0);
      v_partial := r.amount < expected;
    end;

    -- race-safe slot deduction
    update public.workshops
       set available_slots = available_slots - 1
     where id = r.reference_id::uuid
       and available_slots >= 1;
    if not found then
      insert into diag(payload) values (jsonb_build_object(
        'step','R1_repair','order', r.provider_order_id,
        'result','SKIPPED_SOLD_OUT'));
      continue;
    end if;

    -- attendee name synthesized from auth.users (Razorpay name was null)
    select coalesce(
             nullif((select p.full_name from public.users_profile p where p.id = r.user_id), ''),
             split_part((select u.email from auth.users u where u.id = r.user_id), '@', 1),
             'Creative Friend')
      into v_name;

    insert into public.bookings (user_id, workshop_id, payment_id, tickets,
                                 attendee_name, attendee_email, attendee_phone,
                                 status, coupon_code, coupon_discount_percent, discount_amount)
    select r.user_id, r.reference_id::uuid, r.id, 1,
           coalesce(v_name, 'Guest'), coalesce(prof.email, ''), null,
           'CONFIRMED', null, null, 0
      from public.payments p2
      left join public.users_profile prof on prof.id = r.user_id
     where p2.id = r.id
    returning id into v_booking_id;

    -- provider_payment_id normally already set by R0; defensive re-set in
    -- case R0 skipped this row (e.g. it was FAILED at R0 time).
    update public.payments
       set provider_payment_id = coalesce(provider_payment_id, case
             when r.provider_order_id = 'order_TYc22ifb9kX1A6' then 'pay_TYc29gJWIfK6RL'
             when r.provider_order_id = 'order_TZRiVWjjQd5RMc' then 'pay_TZRicZdNVXpDKb'
             when r.provider_order_id = 'order_TZqVv7vCreHik8' then 'pay_TZqW4iHrRPrvbv'
             else provider_payment_id end)
     where id = r.id;

    insert into diag(payload) values (jsonb_build_object(
      'step','R1_repair','order', r.provider_order_id,
      'booking_id', v_booking_id, 'partial', v_partial));
  end loop;
exception
  when others then
    -- covers BOTH R0 status updates and the booking loop below; labelled
    -- R_repair so a failure here is never misread as only-booking-failure.
    insert into diag(payload) values (jsonb_build_object(
      'step','R_repair_error','detail', sqlerrm));
end
$repair$;

-- ----------------------------------------------------------------------------
-- 5) SLOT RECONCILIATION for the live workshop (invariant-based)
-- ----------------------------------------------------------------------------
do $recon$declare
  v_total int;
  v_confirmed int;
begin
  select total_slots into v_total
    from public.workshops where id = '9c458d73-7742-48aa-8327-16825a1cd802';

  select coalesce(sum(tickets), 0) into v_confirmed
    from public.bookings
   where workshop_id = '9c458d73-7742-48aa-8327-16825a1cd802'
     and status = 'CONFIRMED';

  update public.workshops
     set available_slots = v_total - v_confirmed
   where id = '9c458d73-7742-48aa-8327-16825a1cd802';

  insert into diag(payload) values (jsonb_build_object(
    'step','R2_slots','total', v_total, 'confirmed', v_confirmed,
    'available_after', v_total - v_confirmed));
exception
  when others then
    insert into diag(payload) values (jsonb_build_object(
      'step','R2_slots','error', sqlerrm));
end
$recon$;

-- ----------------------------------------------------------------------------
-- 6) POST-REPAIR STATE + SINGLE COMBINED OUTPUT
-- ----------------------------------------------------------------------------
do $post$
declare
  v jsonb;
begin
  begin
    select coalesce(jsonb_agg(jsonb_build_object(
             'order_id', p.provider_order_id, 'payment_id', p.provider_payment_id,
             'amount', p.amount, 'status', p.status,
             'booking_id', b.id, 'tickets', b.tickets,
             'attendee', b.attendee_name, 'email', b.attendee_email)), '[]'::jsonb)
      into v
      from public.payments p
      left join public.bookings b on b.payment_id = p.id
     where p.provider_order_id in (
       'order_TYc22ifb9kX1A6','order_TZRiVWjjQd5RMc','order_TZqVv7vCreHik8');

    insert into diag(payload) values (jsonb_build_object('step','D1_repaired_payments','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','D1_repaired_payments','error',sqlerrm));
  end;

  begin
    select to_jsonb(w) into v
      from public.workshops w
     where w.id = '9c458d73-7742-48aa-8327-16825a1cd802';
    insert into diag(payload) values (jsonb_build_object('step','D2_workshop_after','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','D2_workshop_after','error',sqlerrm));
  end;

  begin
    select jsonb_build_object(
      'total', (select count(*) from public.bookings),
      'profiles', (select count(*) from public.users_profile),
      'auth_users', (select count(*) from auth.users)
    ) into v;
    insert into diag(payload) values (jsonb_build_object('step','D3_final_counts','data',v));
  exception when others then
    insert into diag(payload) values (jsonb_build_object('step','D3_final_counts','error',sqlerrm));
  end;
end
$post$;

-- SINGLE COMBINED OUTPUT (one row, one column — paste this back)
select jsonb_pretty(jsonb_agg(payload order by seq)) as report
  from diag;
