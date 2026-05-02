# AL-Sebaei Asset Hub

Production-ready real estate asset management dashboard.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (dark cyberpunk theme)
- Supabase (PostgreSQL backend)

## Setup

```bash
git clone https://github.com/Darkman257/AL-Sebaei-asset-hub.git
cd AL-Sebaei-asset-hub
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Run Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy — Vercel auto-detects Vite

Or via CLI:

```bash
npx vercel --prod
```
