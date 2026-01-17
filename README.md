 Eldrow

Eldrow is a Wordle-inspired Farcaster mini app that combines a daily word puzzle with on-chain streak tracking, Neynar authentication, and wallet-aware gameplay. The project ships with a fully configured Next.js 15 application, reusable UI primitives, and integration helpers for building richer Farcaster experiences.

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Local Development](#local-development)
  - [Production Build Preview](#production-build-preview)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Features

- **Daily Wordle Gameplay** – Deterministic daily words with familiar guess feedback and shareable results.@src/components/WordleGame.tsx#1-264 @src/lib/dailyWord.ts#1-12
- **On-chain Streak Tracking** – Reads and writes streak data to a Base mainnet contract via ethers.js helpers.@src/components/WordleGame.tsx#68-169 @src/lib/wordleStreakContract.ts#1-110
- **Farcaster & Neynar Integration** – Supports Neynar sign-in, session management, and Farcaster mini app context (including cast actions and notifications).@src/components/App.tsx#1-118 @src/auth.ts#217-365 @src/components/ui/NeynarAuthButton/index.tsx#1-720
- **Wallet Awareness** – Detects injected wallets, guides users to connect, and ensures play happens on Base.@src/components/WordleGame.tsx#37-168 @src/lib/WalletContext.tsx#1-98
- **Mini App Scaffold** – Tabbed UI, Safe-area aware layout, and provider wrappers for Wagmi, Neynar, and AuthKit.@src/components/App.tsx#1-118 @src/app/app.tsx#1-15 @src/app/providers.tsx#1-39 @src/app/providers.NeynarAuth.tsx#1-44

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) with the App Router
- React 19 with TypeScript and modern ESLint configuration
- Tailwind CSS (via twin utilities) and Radix UI primitives
- Neynar React SDK, Farcaster Mini App SDK, and Auth Kit
- NextAuth credential-based flow for Sign-In with Neynar
- ethers.js + Wagmi for on-chain reads/writes
- Optional Upstash Redis for persisting mini app notification preferences

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.18 (Next.js 15 requirement). Node 20.x is recommended.
- **npm** (bundled with Node). Yarn or pnpm will work, but the repo ships with `package-lock.json`.

### Installation

```bash
git clone <your-fork-or-clone-url>
cd eldrow
npm install
```

### Local Development

1. Configure environment variables (see [Environment Variables](#environment-variables)).
2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in a browser. The dev script automatically loads `.env.local` and proxies the Next.js dev server.

### Production Build Preview

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root. The following values enable the full feature set:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_URL` | ✅ (all builds) | Base URL for the app. Use `http://localhost:3000` for local dev. Powers metadata and notification links.@src/lib/constants.ts#19-63 |
| `NEYNAR_API_KEY` | ✅ for Neynar features | Required to fetch user data, send notifications, and verify app keys via Neynar APIs.@src/app/api/users/route.ts#1-39 @src/lib/neynar.ts#1-76 |
| `NEYNAR_CLIENT_ID` | ✅ for Neynar features | Enables Neynar-managed webhooks and mini app notifications.@src/app/api/send-notification/route.ts#13-57 @src/app/api/webhook/route.ts#14-20 |
| `NEXTAUTH_SECRET` | ✅ when SIWN is enabled | Secret used by NextAuth for session encryption.@src/auth.ts#217-365 |
| `NEXTAUTH_URL` | ✅ in production | Fully qualified URL where NextAuth is hosted (e.g., `https://your-domain.com`).@src/auth.ts#272-311 |
| `SEED_PHRASE` | Optional (SIWN) | Custody account seed phrase to register and sponsor signers. Required for Sign-In with Neynar flow.@src/app/api/auth/signer/signed_key/route.ts#33-90 |
| `SPONSOR_SIGNER` | Optional (SIWN) | Set to `true` to sponsor signer creation through Neynar.@src/app/api/auth/signer/signed_key/route.ts#33-80 |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Optional | Configure Upstash Redis for storing notification preferences; falls back to in-memory storage if omitted.@src/lib/kv.ts#1-29 |
| `SOLANA_RPC_ENDPOINT` | Optional | Override the default public Solana RPC used by the Solana provider wrappers.@src/app/providers.tsx#17-37 |

> ℹ️ The project includes helper scripts (`scripts/dev.js`, `scripts/deploy.ts`) that load `.env.local` automatically when available.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the dev server with environment bootstrapping and port management.@package.json#15-23 |
| `npm run build` / `npm run build:raw` | Generates an optimized production build.@package.json#15-23 |
| `npm start` | Serves the production build locally via `next start`.@package.json#18 |
| `npm run lint` | Runs the configured ESLint rules (Next.js preset).@package.json#19 |
| `npm run deploy:vercel` | Interactive deploy helper that prepares env vars and triggers a Vercel deployment through the SDK.@package.json#20 @scripts/deploy.ts#15-810 |
| `npm run deploy:raw` | Shortcut to `vercel --prod` if you prefer manual control.@package.json#21 |
| `npm run cleanup` | Invokes the generated cleanup script to prune scaffold artifacts.@package.json#22 @scripts/cleanup.js#1-1264 |

---

