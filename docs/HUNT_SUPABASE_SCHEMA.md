# Hunt progress – storage options

The hunt works **without any database**: progress is stored in the browser (localStorage) on this device. No env vars required.

To use **server-side persistence** (e.g. backup or future use), set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Then create the table below in a **new** Supabase project.

---

## Creating a new Supabase project (optional)

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account).
2. **New project** → pick org, name, database password, region.
3. After the project is ready: **Project Settings** → **API** → copy **Project URL** and **anon public** key.
4. In your app (e.g. Vercel env or `.env.local`):
   - `VITE_SUPABASE_URL` = Project URL  
   - `VITE_SUPABASE_ANON_KEY` = anon public key
5. In Supabase: **SQL Editor** → run the table and RLS SQL below.

---

## Supabase table and RLS

Use this in the Supabase SQL editor to create the table and policies for the QR hunt.

## Table

```sql
-- Single row per device. completed_slugs is the ordered list of stage slugs finished.
create table if not exists public.hunt_progress (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  completed_slugs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Index for fast lookup by device_id (unique already gives an index; this is for clarity)
create index if not exists hunt_progress_device_id on public.hunt_progress (device_id);
```

## Row Level Security (RLS)

The app uses the **anon** key and does not authenticate users. Progress is keyed by `device_id` (a UUID stored in the client’s `localStorage`). To keep data per-device and allow anonymous upserts:

```sql
alter table public.hunt_progress enable row level security;

-- Anyone can read their own row (by device_id). In practice we only ever select by device_id.
create policy "Users can read own hunt progress"
  on public.hunt_progress for select
  using (true);

-- Anyone can insert a new row (new device)
create policy "Users can insert own hunt progress"
  on public.hunt_progress for insert
  with check (true);

-- Anyone can update any row; the app only ever updates the row matching its device_id.
-- Tighter policy would require a custom claim or server-side check.
create policy "Users can update own hunt progress"
  on public.hunt_progress for update
  using (true)
  with check (true);
```

If you prefer to restrict **update** so that only the row with the matching `device_id` can be updated, you’d need to pass `device_id` in a way Supabase can see (e.g. via a Supabase Edge Function that reads the body and applies the filter). For a single-user romantic hunt, the policies above are usually acceptable.

## Optional: restrict to your app only

If your Supabase project is shared, restrict the table to your app’s domain by using a custom policy that checks `request.headers->>'origin'` or similar (e.g. in an Edge Function or Postgres via `current_setting('request.headers')` if available). For most setups, RLS as above is enough.
