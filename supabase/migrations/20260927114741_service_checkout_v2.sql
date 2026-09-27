-- BlazeByte v2 checkout lives alongside the legacy customer_requests table.
-- Existing requests and completed payments are not altered by this migration.

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  reference_number text not null unique,
  request_token_hash text not null check (request_token_hash ~ '^[0-9a-f]{64}$'),
  service_category text not null check (service_category in ('website', 'marketing', 'ai', 'app')),
  plan_id text not null,
  plan_name text not null,
  checkout_mode text not null check (checkout_mode in ('advance', 'quote')),
  billing_period text not null check (billing_period in ('one_time', 'month', 'custom')),
  full_amount_paise bigint,
  advance_amount_paise bigint,
  balance_amount_paise bigint,
  currency text not null default 'INR' check (currency = 'INR'),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  company text,
  project_type text,
  project_details text,
  privacy_consent_at timestamptz not null,
  balance_eligible_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint amount_split_valid check (
    (checkout_mode = 'quote' and full_amount_paise is null and advance_amount_paise is null and balance_amount_paise is null)
    or
    (checkout_mode = 'advance' and full_amount_paise > 0 and advance_amount_paise > 0
      and balance_amount_paise > 0 and advance_amount_paise + balance_amount_paise = full_amount_paise)
  )
);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete restrict,
  payment_stage text not null check (payment_stage in ('advance', 'balance')),
  amount_paise bigint not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  status text not null check (status in ('creating', 'pending', 'processing', 'paid', 'failed', 'cancelled')),
  payment_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  unique (request_id, payment_stage)
);

create index if not exists service_requests_created_at_idx on public.service_requests(created_at desc);
create index if not exists service_requests_email_idx on public.service_requests(lower(email));
create index if not exists payment_attempts_status_idx on public.payment_attempts(status, updated_at desc);

alter table public.service_requests enable row level security;
alter table public.payment_attempts enable row level security;

-- There are intentionally no anon/authenticated policies. Browser access goes
-- through Edge Functions that verify a per-request ownership token.
revoke all on public.service_requests from anon, authenticated;
revoke all on public.payment_attempts from anon, authenticated;
grant select, insert, update on public.service_requests to service_role;
grant select, insert, update on public.payment_attempts to service_role;
