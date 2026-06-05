# JamSesh

Real-time worship/jam session app. Run two terminals — one for the server, one for the React frontend.

---

## Prerequisites (install these once)

1. **Node.js** — download the LTS version from https://nodejs.org  
   During install, check "Add to PATH". Restart your PC after.

2. **VS Code** (recommended) — https://code.visualstudio.com

---

## Project structure

```
jamsesh/
  src/               ← React frontend
    screens/         ← one file per screen
    components/      ← shared UI pieces
    hooks/           ← useSocket (real-time)
    lib/             ← supabase client, sample data
    types/           ← TypeScript types
    styles/          ← global.css
  server/
    server.js        ← Socket.io + Express backend
    package.json
  package.json       ← frontend deps
  vite.config.ts
```

---

## Running locally (first time)

### 1 — Install frontend dependencies
Open a terminal in the `jamsesh/` root folder:
```
npm install
```

### 2 — Install server dependencies
```
cd server
npm install
cd ..
```

### 3 — Set up environment files
```
copy .env.example .env
cd server
copy .env.example .env
cd ..
```
The defaults work for local dev — you don't need to change anything yet.

### 4 — Start the server (Terminal 1)
```
cd server
npm run dev
```
You should see:  `🎸  JamSesh server running on http://localhost:4000`

### 5 — Start the frontend (Terminal 2, back in the root folder)
```
npm run dev
```
Open your browser to **http://localhost:3000**

---

## Optional: Connect Supabase (cloud storage + auth)

Supabase gives you user accounts, room history, and chart storage for free.

1. Go to https://supabase.com and create a free project.
2. In your project: **Settings → API** — copy the Project URL and anon key.
3. Paste them into your `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. In Supabase: go to **SQL Editor** and run this to create the tables:

```sql
-- Rooms
create table rooms (
  id           uuid primary key default gen_random_uuid(),
  code         text unique not null,
  name         text not null,
  max_size     int  default 4,
  session_type text default 'worship',
  default_key  text default 'A',
  notes        text,
  created_at   timestamptz default now()
);

-- Players in a room
create table room_players (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid references rooms(id) on delete cascade,
  user_id      text not null,
  display_name text not null,
  instrument   text,
  subtype      text,
  role         text default 'player',
  joined_at    timestamptz default now()
);

-- Songs / chart library
create table songs (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid references rooms(id) on delete cascade,
  title      text not null,
  key        text,
  bpm        int,
  chart_type text default 'number',
  sections   jsonb,
  pdf_url    text,
  created_at timestamptz default now()
);
```

5. In Supabase: go to **Storage → New bucket**, name it `charts`, set it to public.

---

## Deploying (when you're ready to go live)

**Frontend → Vercel (free)**
1. Push the `jamsesh/` folder to a GitHub repo.
2. Go to https://vercel.com, import the repo.
3. Set the root directory to `/` (the frontend root).
4. Add your env variables in Vercel's dashboard.
5. Deploy.

**Server → Railway (free tier)**
1. Go to https://railway.app, create a new project.
2. Connect your GitHub repo, set the root to `/server`.
3. Railway auto-detects Node and runs `npm start`.
4. Copy the Railway URL and paste it into Vercel's `VITE_SERVER_URL` env var.

---

## What's wired up right now

| Feature | Status |
|---|---|
| Screen-by-screen navigation | ✅ working |
| Room setup (name, size, key, type) | ✅ working |
| Role / instrument / input selection | ✅ working |
| Lobby + invite code display | ✅ working |
| Session room with toolbar | ✅ working |
| Song list + chart viewer (num/chord/lyric) | ✅ working |
| MD controls (voice/auto/manual) | ✅ working (simulated) |
| Band view with volume meters | ✅ working (simulated) |
| Solo mode + metronome | ✅ working |
| Socket.io server (create/join/leave rooms) | ✅ written |
| Real-time number calling | ✅ written |
| Real-time song sync | ✅ written |
| Supabase auth + storage | 🔧 configured, needs keys |
| PDF chart upload + display | 🔧 UI ready, needs storage |
| NotePlay | 🚧 coming soon |
