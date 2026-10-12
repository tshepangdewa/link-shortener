# Link Shortener

A high-performance, minimalist URL shortener. No accounts, no logins, no tracking. Instant edge/server redirection.

## Features

- **No Authentication Required**: Drop a link, click shorten, copy the result.
- **Minimalist Aesthetic**: Sharp 90-degree edges, zero gradients, zero rounded corners, Sora typography, and high-contrast color scheme (`#112A46` and `#F8F9FA`).
- **Instant Server-Side Redirects**: Fast HTTP 307 redirects powered by Next.js Server Components.
- **Local History**: Recent links persist in `localStorage` for quick re-copying without any server-side account management.
- **Vercel & Supabase Ready**: Seamless deployment on Vercel with a single Postgres table on Supabase.

---

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run:

```sql
-- Create urls table
create table public.urls (
  id uuid default gen_random_uuid() primary key,
  original_url text not null,
  short_code text not null unique,
  clicks bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index short_code for fast redirection lookups
create index idx_urls_short_code on public.urls (short_code);

-- Enable Row Level Security (RLS)
alter table public.urls enable row level security;

-- Allow public read access
create policy "Allow public read"
  on public.urls for select
  using (true);

-- Allow public inserts
create policy "Allow public insert"
  on public.urls for insert
  with check (true);

-- Click counter function
create or replace function increment_clicks(code text)
returns void as $$
begin
  update public.urls
  set clicks = clicks + 1
  where short_code = code;
end;
$$ language plpgsql security definer;
```

---

## 2. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 3. Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Deploy to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import this repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
