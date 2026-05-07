-- Admetos Database Schema
-- Run this in your Supabase SQL editor

-- ──────────────────────────────────────────────
-- Extensions
-- ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────
-- Profiles (one per Clerk user)
-- ──────────────────────────────────────────────
create table if not exists profiles (
  id                   uuid primary key default uuid_generate_v4(),
  clerk_user_id        text unique not null,
  username             text unique not null,
  display_name         text not null,
  bio                  text,
  avatar_url           text,
  wallet_address       text unique not null,
  encrypted_private_key text not null,
  is_business          boolean not null default false,
  onboarding_complete  boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_profiles_clerk_user_id on profiles(clerk_user_id);
create index if not exists idx_profiles_username on profiles(username);
create index if not exists idx_profiles_wallet_address on profiles(wallet_address);

-- ──────────────────────────────────────────────
-- Business Accounts
-- ──────────────────────────────────────────────
create table if not exists business_accounts (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  business_name text not null,
  description   text,
  category      text not null default 'general',
  website       text,
  username      text unique not null,
  logo_url      text,
  banner_url    text,
  verified      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_business_profile_id on business_accounts(profile_id);
create index if not exists idx_business_username on business_accounts(username);
create index if not exists idx_business_category on business_accounts(category);

-- ──────────────────────────────────────────────
-- Products / Services
-- ──────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references business_accounts(id) on delete cascade,
  name        text not null,
  description text,
  price       numeric(18, 6) not null check (price >= 0),
  currency    text not null default 'pathUSD',
  image_url   text,
  available   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_products_business_id on products(business_id);
create index if not exists idx_products_available on products(available);

-- ──────────────────────────────────────────────
-- Transactions
-- ──────────────────────────────────────────────
create table if not exists transactions (
  id               uuid primary key default uuid_generate_v4(),
  from_profile_id  uuid references profiles(id) on delete set null,
  to_profile_id    uuid references profiles(id) on delete set null,
  from_address     text not null,
  to_address       text not null,
  amount           numeric(18, 6) not null check (amount > 0),
  currency         text not null default 'pathUSD',
  memo             text,
  tx_hash          text unique,
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'failed')),
  is_external      boolean not null default false,
  block_number     bigint,
  created_at       timestamptz not null default now(),
  confirmed_at     timestamptz
);

create index if not exists idx_tx_from_profile on transactions(from_profile_id);
create index if not exists idx_tx_to_profile on transactions(to_profile_id);
create index if not exists idx_tx_status on transactions(status);
create index if not exists idx_tx_created_at on transactions(created_at desc);
create index if not exists idx_tx_hash on transactions(tx_hash);
-- Composite for conversation-style queries
create index if not exists idx_tx_conversation on transactions(from_profile_id, to_profile_id, created_at desc);

-- ──────────────────────────────────────────────
-- Payment Requests
-- ──────────────────────────────────────────────
create table if not exists payment_requests (
  id              uuid primary key default uuid_generate_v4(),
  from_profile_id uuid not null references profiles(id) on delete cascade,
  to_profile_id   uuid not null references profiles(id) on delete cascade,
  amount          numeric(18, 6) not null check (amount > 0),
  currency        text not null default 'pathUSD',
  memo            text,
  status          text not null default 'pending'
                    check (status in ('pending', 'paid', 'declined', 'cancelled')),
  transaction_id  uuid references transactions(id) on delete set null,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_requests_from on payment_requests(from_profile_id);
create index if not exists idx_requests_to on payment_requests(to_profile_id);
create index if not exists idx_requests_status on payment_requests(status);
create index if not exists idx_requests_created on payment_requests(created_at desc);

-- ──────────────────────────────────────────────
-- Notifications
-- ──────────────────────────────────────────────
create table if not exists notifications (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid not null references profiles(id) on delete cascade,
  type                     text not null
                             check (type in ('payment_received','payment_request','request_paid','request_declined','system')),
  title                    text not null,
  message                  text not null,
  read                     boolean not null default false,
  related_transaction_id   uuid references transactions(id) on delete set null,
  related_request_id       uuid references payment_requests(id) on delete set null,
  created_at               timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications(user_id, read, created_at desc);

-- ──────────────────────────────────────────────
-- Updated-at trigger function
-- ──────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger trg_business_updated_at
  before update on business_accounts
  for each row execute function update_updated_at();

create trigger trg_products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger trg_requests_updated_at
  before update on payment_requests
  for each row execute function update_updated_at();

-- ──────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────

-- Profiles: public read, owner write
alter table profiles enable row level security;
create policy "profiles_public_read"  on profiles for select using (true);
create policy "profiles_owner_insert" on profiles for insert with check (auth.uid()::text = clerk_user_id);
create policy "profiles_owner_update" on profiles for update using (auth.uid()::text = clerk_user_id);

-- Business accounts: public read, owner write
alter table business_accounts enable row level security;
create policy "business_public_read"  on business_accounts for select using (true);
create policy "business_owner_write"  on business_accounts for insert
  with check (profile_id in (select id from profiles where clerk_user_id = auth.uid()::text));
create policy "business_owner_update" on business_accounts for update
  using (profile_id in (select id from profiles where clerk_user_id = auth.uid()::text));

-- Products: public read, business owner write
alter table products enable row level security;
create policy "products_public_read"  on products for select using (true);
create policy "products_owner_write"  on products for insert
  with check (business_id in (
    select ba.id from business_accounts ba
    join profiles p on p.id = ba.profile_id
    where p.clerk_user_id = auth.uid()::text
  ));
create policy "products_owner_update" on products for update
  using (business_id in (
    select ba.id from business_accounts ba
    join profiles p on p.id = ba.profile_id
    where p.clerk_user_id = auth.uid()::text
  ));

-- Transactions: parties can read their own, service role inserts
alter table transactions enable row level security;
create policy "tx_read_own" on transactions for select
  using (
    from_profile_id in (select id from profiles where clerk_user_id = auth.uid()::text)
    or
    to_profile_id   in (select id from profiles where clerk_user_id = auth.uid()::text)
  );

-- Payment requests: parties can read/write their own
alter table payment_requests enable row level security;
create policy "req_read_own" on payment_requests for select
  using (
    from_profile_id in (select id from profiles where clerk_user_id = auth.uid()::text)
    or
    to_profile_id   in (select id from profiles where clerk_user_id = auth.uid()::text)
  );
create policy "req_insert_own" on payment_requests for insert
  with check (from_profile_id in (select id from profiles where clerk_user_id = auth.uid()::text));
create policy "req_update_own" on payment_requests for update
  using (
    from_profile_id in (select id from profiles where clerk_user_id = auth.uid()::text)
    or
    to_profile_id   in (select id from profiles where clerk_user_id = auth.uid()::text)
  );

-- Notifications: owner only
alter table notifications enable row level security;
create policy "notif_read_own" on notifications for select
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));
create policy "notif_update_own" on notifications for update
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));
