-- ============================================
-- DEAD AIR TECHNOLOGIES — Supabase Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  daily_submission_count int default 0,
  last_submission_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references public.profiles(id),
  
  -- User-provided fields (only name is required)
  name text not null,
  one_liner text,
  tech_stack text,
  url text,
  github_url text,
  why_stopped text,
  screenshot_url text,
  
  -- AI-generated fields
  ai_obituary text,
  ai_tagline text,
  ai_cause_of_death text,
  ai_emoji text default '💀',
  ai_flagged boolean default false,
  ai_flag_reason text,
  
  -- Status
  status text default 'published'
    check (status in ('published', 'flagged', 'removed')),
  
  -- Denormalized vote aggregates (updated by cast_vote function)
  vote_count int default 0,
  hot_count int default 0,
  not_count int default 0,
  hot_percentage numeric(5,2) default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Votes table
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  voter_fingerprint text not null,
  voter_user_id uuid references public.profiles(id),
  vote text not null check (vote in ('hot', 'not')),
  created_at timestamptz default now()
);

-- Vote sessions (tracks per-voter-per-project vote counts)
create table public.vote_sessions (
  id uuid primary key default gen_random_uuid(),
  voter_fingerprint text not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  vote_count int default 0,
  is_authenticated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(voter_fingerprint, project_id)
);


-- ============================================
-- 2. INDEXES
-- ============================================

-- Fast random selection of published projects
create index idx_projects_status on public.projects(status)
  where status = 'published';

-- Leaderboard sorting
create index idx_projects_ranking on public.projects(hot_percentage desc, vote_count desc)
  where status = 'published';

-- Vote lookups
create index idx_votes_project on public.votes(project_id);
create index idx_votes_fingerprint on public.votes(voter_fingerprint, project_id);

-- Vote session lookups
create index idx_vote_sessions_lookup on public.vote_sessions(voter_fingerprint, project_id);

-- User project lookups
create index idx_projects_submitted_by on public.projects(submitted_by);


-- ============================================
-- 3. VIEWS
-- ============================================

-- Leaderboard view (only projects with minimum 3 votes)
create or replace view public.leaderboard as
select
  p.id,
  p.name,
  p.ai_tagline,
  p.ai_emoji,
  p.ai_cause_of_death,
  p.ai_obituary,
  p.tech_stack,
  p.url,
  p.github_url,
  p.screenshot_url,
  p.vote_count,
  p.hot_count,
  p.not_count,
  p.hot_percentage,
  p.created_at,
  rank() over (
    order by p.hot_percentage desc, p.vote_count desc
  ) as rank
from public.projects p
where p.status = 'published'
  and p.vote_count >= 3
order by rank;


-- ============================================
-- 4. FUNCTIONS
-- ============================================

-- Cast a vote with rate limiting and gate logic
create or replace function public.cast_vote(
  p_project_id uuid,
  p_fingerprint text,
  p_vote text,
  p_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_count int;
  v_hot int;
  v_not int;
  v_total int;
  v_pct numeric;
begin
  -- Validate vote value
  if p_vote not in ('hot', 'not') then
    return jsonb_build_object(
      'success', false,
      'reason', 'invalid_vote',
      'message', 'Vote must be hot or not'
    );
  end if;

  -- Check if project exists and is published
  if not exists (
    select 1 from public.projects
    where id = p_project_id and status = 'published'
  ) then
    return jsonb_build_object(
      'success', false,
      'reason', 'project_not_found',
      'message', 'Project not found or not available for voting'
    );
  end if;

  -- Get current vote count for this voter on this project
  select vote_count into v_session_count
  from public.vote_sessions
  where voter_fingerprint = p_fingerprint
    and project_id = p_project_id;

  v_session_count := coalesce(v_session_count, 0);

  -- Gate: 5 anonymous votes max per project
  if v_session_count >= 5 and p_user_id is null then
    return jsonb_build_object(
      'success', false,
      'reason', 'vote_limit',
      'votes_cast', v_session_count,
      'message', 'The dead demand tribute. Sign up to keep voting.'
    );
  end if;

  -- Insert the vote
  insert into public.votes (project_id, voter_fingerprint, voter_user_id, vote)
  values (p_project_id, p_fingerprint, p_user_id, p_vote);

  -- Upsert vote session
  insert into public.vote_sessions (voter_fingerprint, project_id, vote_count, is_authenticated)
  values (p_fingerprint, p_project_id, 1, p_user_id is not null)
  on conflict (voter_fingerprint, project_id)
  do update set
    vote_count = vote_sessions.vote_count + 1,
    is_authenticated = coalesce(p_user_id is not null, vote_sessions.is_authenticated),
    updated_at = now();

  -- Recalculate project aggregates
  select
    count(*) filter (where vote = 'hot'),
    count(*) filter (where vote = 'not'),
    count(*)
  into v_hot, v_not, v_total
  from public.votes
  where project_id = p_project_id;

  v_pct := case
    when v_total > 0 then round((v_hot::numeric / v_total) * 100, 2)
    else 0
  end;

  update public.projects
  set
    vote_count = v_total,
    hot_count = v_hot,
    not_count = v_not,
    hot_percentage = v_pct,
    updated_at = now()
  where id = p_project_id;

  return jsonb_build_object(
    'success', true,
    'votes_remaining', greatest(0, 5 - (v_session_count + 1)),
    'vote_count', v_total,
    'hot_percentage', v_pct,
    'is_gated', (v_session_count + 1) >= 5 and p_user_id is null
  );
end;
$$;


-- Get random published projects for voting
-- Excludes projects the voter has already maxed out on
create or replace function public.get_random_projects(
  p_fingerprint text,
  p_limit int default 10
)
returns setof public.projects
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select p.*
  from public.projects p
  where p.status = 'published'
    and p.id not in (
      -- Exclude projects where voter has hit 5 votes (and is not authenticated)
      select vs.project_id
      from public.vote_sessions vs
      where vs.voter_fingerprint = p_fingerprint
        and vs.vote_count >= 5
        and vs.is_authenticated = false
    )
  order by random()
  limit p_limit;
end;
$$;


-- Check daily submission limit
create or replace function public.check_submission_limit(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_last_date date;
begin
  select daily_submission_count, last_submission_date
  into v_count, v_last_date
  from public.profiles
  where id = p_user_id;

  -- Reset count if new day
  if v_last_date is null or v_last_date < current_date then
    update public.profiles
    set daily_submission_count = 0, last_submission_date = current_date
    where id = p_user_id;
    v_count := 0;
  end if;

  if v_count >= 2 then
    return jsonb_build_object(
      'allowed', false,
      'submissions_today', v_count,
      'message', 'Max 2 submissions per day. Even the graveyard has visiting hours.'
    );
  end if;

  return jsonb_build_object(
    'allowed', true,
    'submissions_today', v_count,
    'remaining', 2 - v_count
  );
end;
$$;


-- Increment submission count after successful submission
create or replace function public.increment_submission_count(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    daily_submission_count = daily_submission_count + 1,
    last_submission_date = current_date,
    updated_at = now()
  where id = p_user_id;
end;
$$;


-- Auto-create profile when user signs up via auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger: create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.votes enable row level security;
alter table public.vote_sessions enable row level security;

-- PROFILES policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- PROJECTS policies
create policy "Anyone can view published projects"
  on public.projects for select
  using (status = 'published');

create policy "Authenticated users can view their own projects regardless of status"
  on public.projects for select
  using (auth.uid() = submitted_by);

create policy "Authenticated users can insert projects"
  on public.projects for insert
  with check (auth.uid() = submitted_by);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = submitted_by);

-- VOTES policies (public read, insert via function)
create policy "Anyone can view votes"
  on public.votes for select
  using (true);

create policy "Votes are inserted via server function"
  on public.votes for insert
  with check (true);

-- VOTE_SESSIONS policies
create policy "Anyone can view vote sessions"
  on public.vote_sessions for select
  using (true);

create policy "Vote sessions managed by server"
  on public.vote_sessions for insert
  with check (true);

create policy "Vote sessions updated by server"
  on public.vote_sessions for update
  using (true);


-- ============================================
-- 6. STORAGE (for project screenshots)
-- ============================================

-- Create storage bucket for project screenshots
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-screenshots',
  'project-screenshots',
  true,
  5242880,  -- 5MB limit
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Storage policies
create policy "Anyone can view screenshots"
  on storage.objects for select
  using (bucket_id = 'project-screenshots');

create policy "Authenticated users can upload screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'project-screenshots'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own screenshots"
  on storage.objects for update
  using (
    bucket_id = 'project-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================
-- 7. SEED DATA (Dead Tech classics for launch)
-- ============================================

-- These are the original Hot or Not items, now as proper projects
-- They won't have a submitted_by since they're editorial content

insert into public.projects (name, one_liner, tech_stack, ai_obituary, ai_tagline, ai_cause_of_death, ai_emoji, status, vote_count, hot_count, not_count, hot_percentage) values
(
  'Nikola Motors',
  'The truck that couldn''t.',
  'Gravity, Hills, Cameras',
  'Nikola Motors promised the future of hydrogen-powered trucking. Instead, their CEO filmed a truck rolling downhill and called it a working prototype. In the CEO''s defense, gravity IS a renewable resource. The SEC disagreed with this interpretation.',
  'The truck that couldn''t.',
  'CEO filmed a truck rolling downhill and called it a working prototype.',
  '🚛',
  'published', 0, 0, 0, 0
),
(
  'Fisker',
  'Died twice, beautifully.',
  'Gorgeous Design, Bad Timing, Bankruptcy x2',
  'Fisker built some of the most beautiful electric vehicles ever conceived. The problem was the "buying them" part. Went bankrupt, rose from the dead like a phoenix made of carbon fiber, then went bankrupt again. Some things are just born to be beautiful corpses.',
  'Died twice, beautifully.',
  'Built gorgeous EVs nobody could buy. Twice.',
  '⚡',
  'published', 0, 0, 0, 0
),
(
  'Apple Car (Project Titan)',
  'A decade of nothing.',
  'Secrecy, Billions of Dollars, Unreleased Everything',
  'Apple spent 10 years and an estimated $10 billion designing a car that never existed. Thousands of engineers hired. Multiple pivots between full autonomy and assisted driving. In the end, Apple did what Apple does best: killed it quietly and pretended it never happened. Even Apple''s trash can Mac is more real than this was.',
  'A decade of nothing.',
  'Apple got bored after spending $10 billion.',
  '🍎',
  'published', 0, 0, 0, 0
),
(
  'Theranos',
  'Blood, lies, and a black turtleneck.',
  'Fraud, Edison Machine, Deepened Voice',
  'Elizabeth Holmes convinced the world she could run 200+ medical tests from a single drop of blood. Walgreens believed her. Rupert Murdoch believed her. Henry Kissinger believed her. The blood did not cooperate. Now she''s in federal prison, which is one place you definitely can''t fake a blood test.',
  'Blood, lies, and a black turtleneck.',
  'The blood was fake but the fraud was very real.',
  '🩸',
  'published', 0, 0, 0, 0
),
(
  'Quibi',
  '$1.75B for 10-minute videos nobody wanted.',
  'Hollywood Money, Short-Form Video, Hubris',
  'Jeffrey Katzenberg raised $1.75 billion on the thesis that people would pay for short-form premium video content on their phones. TikTok was free. YouTube was free. Quibi lasted 6 months and burned through cash faster than a gender reveal party in a dry forest. The app''s signature feature was that videos rotated when you turned your phone. Revolutionary.',
  '$1.75B for 10-minute videos nobody wanted.',
  'TikTok was free.',
  '📱',
  'published', 0, 0, 0, 0
),
(
  'Google+',
  'Google''s loneliest party.',
  'Forced Adoption, Circles, Tumbleweeds',
  'Google tried to build a social network by forcing every Gmail user to join. It''s like throwing a massive party where attendance is mandatory but nobody talks to each other, the DJ is playing spreadsheet music, and the host keeps asking if you want to organize your friends into Circles. 90 million "users." Zero conversations.',
  'Google''s loneliest party.',
  'Google threw a mandatory party. Nobody showed up.',
  '👻',
  'published', 0, 0, 0, 0
),
(
  'Juicero',
  'The $400 bag squeezer.',
  'WiFi, Juice Bags, QR Codes, Hubris',
  'A $400 WiFi-connected juicer that squeezed proprietary juice bags you could only buy on subscription. Then Bloomberg discovered you could just squeeze the bags with your hands and get the same result. $120 million in VC funding, defeated by human fingers. The machine had more computing power than the Apollo missions, and its only job was to squeeze a bag.',
  'The $400 bag squeezer.',
  '$120M in funding, defeated by fingers.',
  '🧃',
  'published', 0, 0, 0, 0
),
(
  'Vine',
  'Died so TikTok could live.',
  'Six Seconds, Creativity, Twitter Neglect',
  'Vine was six-second chaos and it was perfect. An entire generation of comedians, musicians, and creators were born in those loops. Twitter bought it, starved it of resources, and killed it in 2017. Two years later, TikTok ate the world. Every TikTok creator owes Vine a royalty check and a moment of silence.',
  'Died so TikTok could live.',
  'Twitter bought it, starved it, killed it.',
  '🌿',
  'published', 0, 0, 0, 0
),
(
  'Clippy',
  'Microsoft''s most aggressive coworker.',
  'Office 97, Bayesian Inference, Pure Chaos',
  'A sentient paperclip that interrupted your work to ask if you needed help writing a letter. Nobody asked for Clippy. Nobody wanted Clippy. Yet Clippy persisted, popping up at the worst possible moments with unsolicited advice and an expression that said "I know you hate me and I don''t care." Chaotic neutral energy personified as office supplies.',
  'Microsoft''s most aggressive coworker.',
  'Nobody asked for this. Everyone remembers it.',
  '📎',
  'published', 0, 0, 0, 0
),
(
  'Zune',
  'The iPod''s sadder cousin.',
  'Brown Plastic, WiFi Sharing, Microsoft Marketing',
  'Microsoft''s music player was actually decent hardware. It had WiFi sharing before anyone else. The software subscription model predated Spotify by years. But "actually decent" doesn''t beat cultural dominance. The Zune brought a feature comparison spreadsheet to a thermonuclear branding war. The brown one is now a collector''s item, which is tech''s way of saying "we feel bad for you."',
  'The iPod''s sadder cousin.',
  'Brought a knife to a thermonuclear war.',
  '🎵',
  'published', 0, 0, 0, 0
),
(
  'MoviePass',
  'Unlimited movies, limited math.',
  'Subscription Model, Negative Unit Economics, Prayer',
  'MoviePass offered unlimited movie tickets for $9.95 per month. A single ticket cost $15. They lost money on every single customer. The business model was essentially "step 1: lose money on every transaction, step 2: ???, step 3: profit." The CEO said they''d make it up on data. They did not make it up on data.',
  'Unlimited movies, limited math.',
  'The business model was "pray." Prayers were not answered.',
  '🎬',
  'published', 0, 0, 0, 0
),
(
  'Google Reader',
  'The one that still hurts.',
  'RSS, Clean UI, Millions of Loyal Users',
  'Google killed the best RSS reader ever made because it didn''t fit their Google+ social strategy. The same Google+ that also died. So Google killed a beloved product to feed a product that also died. It''s the ouroboros of product mismanagement. A decade later, people are still mad. Rightfully. Some wounds don''t heal.',
  'The one that still hurts.',
  'Killed to feed Google+, which also died.',
  '📰',
  'published', 0, 0, 0, 0
),
(
  'Segway',
  'Was supposed to replace walking.',
  'Gyroscopes, Hype, Mall Cop Energy',
  'Before launch, Steve Jobs said it would be bigger than the PC. Venture capitalists predicted it would reshape cities. Instead, the Segway became the official vehicle of mall security guards and guided tours in matching helmets. It wasn''t really a failure. It was just a very expensive, very slow way to avoid walking that found its true calling in tourism and Paul Blart cosplay.',
  'Was supposed to replace walking.',
  'Became the official vehicle of mall cops.',
  '🛴',
  'published', 0, 0, 0, 0
),
(
  'Faraday Future',
  'The EV that was always "almost ready."',
  'Vaporware, Concept Cars, Broken Promises',
  'Faraday Future spent nearly a decade promising a revolutionary luxury EV. They built a factory. They held press conferences. They showed concept cars that looked like they were designed by someone who only knew cars from sci-fi movies. They delivered approximately nothing. The ultimate vaporware on wheels. The car was always "almost ready," which in startup speak means "never."',
  'The EV that was always "almost ready."',
  'Spent a decade promising. Delivered nothing.',
  '🔮',
  'published', 0, 0, 0, 0
),
(
  'Lordstown Motors',
  'Fraud with a pickup truck.',
  'Fake Pre-orders, SEC Investigation, Empty Factory',
  'Lordstown Motors faked pre-orders, misled investors about demand, and built an electric truck that barely existed outside of press releases. They bought a GM factory, filled it with promises instead of vehicles, and called it innovation. The Fyre Festival of electric vehicles, except at least Fyre Festival had a beach.',
  'Fraud with a pickup truck.',
  'Faked pre-orders. The Fyre Festival of EVs.',
  '🏭',
  'published', 0, 0, 0, 0
);


-- ============================================
-- DONE. Your graveyard is ready for visitors.
-- ============================================
