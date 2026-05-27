-- Supabase schema for MLPKD
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null unique,
  full_name text,
  sex text check (sex in ('male','female','other')),
  address text,
  password_hash text,
  role text not null check (role in ('doctor','nurse','lab_tech','patient')),
  doctor_notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists sex text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists password_hash text;
alter table public.profiles drop constraint if exists profiles_sex_check;
alter table public.profiles add constraint profiles_sex_check check (sex in ('male','female','other'));

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  risk_score numeric not null,
  diagnosis text not null check (diagnosis in ('CKD','Not CKD')),
  inputs jsonb not null,
  recommendation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vitals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  entered_by uuid not null references public.profiles(id) on delete cascade,
  source text not null check (source in ('nurse','lab')),
  age numeric not null,
  bp numeric not null,
  sg numeric not null,
  al numeric not null,
  su numeric not null,
  rbc text not null check (rbc in ('normal','abnormal')),
  pc text not null check (pc in ('normal','abnormal')),
  pcc text not null check (pcc in ('present','notpresent')),
  ba text not null check (ba in ('present','notpresent')),
  bgr numeric not null,
  bu numeric not null,
  sc numeric not null,
  sod numeric not null,
  pot numeric not null,
  hemo numeric not null,
  pcv numeric not null,
  wc numeric not null,
  rc numeric not null,
  htn text not null check (htn in ('yes','no')),
  dm text not null check (dm in ('yes','no')),
  cad text not null check (cad in ('yes','no')),
  appet text not null check (appet in ('good','poor')),
  pe text not null check (pe in ('yes','no')),
  ane text not null check (ane in ('yes','no')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.predictions enable row level security;
alter table public.vitals enable row level security;

create or replace function public.is_care_team_member(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('doctor','nurse','lab_tech')
  );
$$;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles care team patient read" on public.profiles;
drop policy if exists "profiles self write" on public.profiles;
drop policy if exists "predictions doctor read" on public.predictions;
drop policy if exists "predictions doctor insert" on public.predictions;
drop policy if exists "vitals role read" on public.vitals;
drop policy if exists "vitals nurse lab insert" on public.vitals;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles care team patient read" on public.profiles for select using (
  role = 'patient' and public.is_care_team_member(auth.uid())
);
create policy "profiles self write" on public.profiles for update using (auth.uid() = id);

create policy "predictions doctor read" on public.predictions for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'doctor')
  or patient_id = auth.uid()
);

create policy "predictions doctor insert" on public.predictions for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'doctor') and doctor_id = auth.uid()
);

create policy "vitals role read" on public.vitals for select using (
  patient_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('nurse','lab_tech','doctor'))
);

create policy "vitals nurse lab insert" on public.vitals for insert with check (
  entered_by = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('nurse','lab_tech'))
);

-- =========================================================
-- Default users seed (profiles table)
-- IMPORTANT:
-- 1) Supabase Auth sign-in uses auth.users, not profiles.password_hash.
-- 2) Create auth users first in Supabase Auth with these emails:
--    doctor@mlpkd.local, nurse@mlpkd.local, lab@mlpkd.local, patient@mlpkd.local
-- 3) This seed maps profiles.id from auth.users.id by email (no FK error).
-- 4) This block is idempotent (safe to re-run).
-- =========================================================

with seed(email, username, full_name, sex, address, plain_password, role) as (
  values
    ('doctor@mlpkd.local', 'doctor_joe', 'Jhon Joe', 'male', 'Main Clinic, Floor 2', 'Doctor@123', 'doctor'),
    ('nurse@mlpkd.local', 'nurse_jane', 'Jane Doe', 'female', 'Ward B, Station 4', 'Nurse@123', 'nurse'),
    ('lab@mlpkd.local', 'lab_default', 'Default Lab Tech', 'other', 'Diagnostics Unit', 'Lab@123', 'lab_tech'),
    ('patient@mlpkd.local', 'patient_default', 'Default Patient', 'female', 'Community Zone 1', 'Patient@123', 'patient')
)
insert into public.profiles (
  id, email, username, full_name, sex, address, password_hash, role
)
select
  u.id,
  s.email,
  s.username,
  s.full_name,
  s.sex,
  s.address,
  crypt(s.plain_password, gen_salt('bf')),
  s.role
from seed s
join auth.users u on lower(u.email) = lower(s.email)
on conflict (id) do update
set
  email = excluded.email,
  username = excluded.username,
  full_name = excluded.full_name,
  sex = excluded.sex,
  address = excluded.address,
  password_hash = excluded.password_hash,
  role = excluded.role;
