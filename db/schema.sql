-- InsForge Database Schema for JobPilot
-- All tables use RLS with auth.uid() for user data isolation

-- 1. profiles — one per user, references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text check (experience_level in ('junior', 'mid', 'senior', 'lead')),
  years_experience integer,
  skills text[] default '{}',
  industries text[] default '{}',
  work_experience jsonb default '[]'::jsonb,
  education jsonb default '{}'::jsonb,
  job_titles_seeking text[] default '{}',
  remote_preference text check (remote_preference in ('remote', 'onsite', 'hybrid', 'any')),
  preferred_locations text[] default '{}',
  salary_expectation text,
  cover_letter_tone text check (cover_letter_tone in ('formal', 'casual', 'enthusiastic')),
  linkedin_url text,
  portfolio_url text,
  work_authorization text check (work_authorization in ('citizen', 'permanent_resident', 'visa_required')),
  resume_pdf_url text,
  is_complete boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. agent_runs — tracks each job discovery run
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'running' check (status in ('running', 'completed', 'failed')),
  job_title_searched text,
  location_searched text,
  jobs_found integer default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

-- 3. jobs — discovered and matched job listings
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.agent_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null check (source in ('search', 'url')),
  source_url text,
  external_apply_url text,
  title text not null,
  company text not null,
  location text,
  salary text,
  job_type text check (job_type in ('fulltime', 'parttime', 'contract')),
  about_role text,
  responsibilities text[] default '{}',
  requirements text[] default '{}',
  nice_to_have text[] default '{}',
  benefits text[] default '{}',
  about_company text,
  match_score integer check (match_score >= 0 and match_score <= 100),
  match_reason text,
  matched_skills text[] default '{}',
  missing_skills text[] default '{}',
  company_research jsonb default '{}'::jsonb,
  found_at timestamptz not null default now()
);

-- 4. agent_logs — operational logs from agent runs
create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  level text not null check (level in ('info', 'success', 'warning', 'error')),
  job_id uuid references public.jobs(id) on delete set null,
  created_at timestamptz not null default now()
);

-- updated_at trigger for profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.agent_runs enable row level security;
alter table public.jobs enable row level security;
alter table public.agent_logs enable row level security;

-- RLS policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- RLS policies for agent_runs
create policy "Users can view own agent runs"
  on public.agent_runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own agent runs"
  on public.agent_runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own agent runs"
  on public.agent_runs for update
  using (auth.uid() = user_id);

create policy "Users can delete own agent runs"
  on public.agent_runs for delete
  using (auth.uid() = user_id);

-- RLS policies for jobs
create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);

-- RLS policies for agent_logs
create policy "Users can view own agent logs"
  on public.agent_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own agent logs"
  on public.agent_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own agent logs"
  on public.agent_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own agent logs"
  on public.agent_logs for delete
  using (auth.uid() = user_id);
