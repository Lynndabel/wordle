 Eldrow which is Wordle spelt backward

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
- [Project Structure](#project-structure)
- [Authentication \& Neynar Flow](#authentication--neynar-flow)
- [Smart Contract \& Streak Tracking](#smart-contract--streak-tracking)
- [Deployment](#deployment)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Manual Deployment](#manual-deployment)

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

## Project Structure

```
eldrow/
├── public/                # Static assets (icon, splash, OG image, etc.)
├── src/
│   ├── app/               # Next.js App Router entrypoints and providers
│   ├── components/        # UI components (Wordle game, leaderboard, tabs, buttons)
│   ├── hooks/             # Custom hooks (e.g., useNeynarUser)
│   ├── lib/               # Helpers (constants, Neynar client, streak contract)
│   └── app/api/           # Server routes for auth, Neynar APIs, notifications
├── scripts/               # Dev/deploy helper scripts
├── bin/                   # Scaffold initialization utilities
└── README.md
```

Key entry points:

- `src/app/page.tsx` – App shell and metadata.
- `src/components/App.tsx` – Mini app layout, navigation tabs, safe-area handling.
- `src/components/WordleGame.tsx` – Core gameplay loop and Base network interactions.
- `src/components/ui/NeynarAuthButton` – Auth flow UI for web and mini app contexts.
- `src/auth.ts` – NextAuth configuration for Sign-In with Neynar.

---

## Authentication & Neynar Flow

1. Users initiate sign-in via the Neynar Auth button.
2. Mini app contexts leverage `@neynar/react` to detect platform state and request signed nonces.
3. The button fetches/creates signer keys, polls for approvals, and persists sessions via NextAuth credentials provider.@src/components/ui/NeynarAuthButton/index.tsx#1-556 @src/auth.ts#217-365
4. Web contexts can store signer data in `localStorage`, while mini app contexts sync signers into the server session.
5. API routes under `src/app/api/auth/*` expose nonce generation, signer registration, and validation endpoints consumed during the flow.@src/app/api/auth/nonce/route.ts @src/app/api/auth/signer/route.ts (see directory)

To enable the full SIWN experience, provide `SEED_PHRASE`, `NEYNAR_API_KEY`, `NEYNAR_CLIENT_ID`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.

---

## Smart Contract & Streak Tracking

The Wordle streak contract lives on Base mainnet at `0x1bb2101D0eF3C81a892457C55C123A09602855A0`. Game actions:

1. On every guess, Eldrow checks `guessesLeft`, `hasWonToday`, and current streak values via read-only calls.
2. When the puzzle concludes, the client calls `guessToday` with the final result, updating the on-chain streak and emitting events.
3. `refreshStatus` refetches streak data after transactions settle to keep the UI in sync.@src/components/WordleGame.tsx#68-169 @src/lib/wordleStreakContract.ts#1-110

> You can substitute your own contract by updating `CONTRACT_ADDRESS` and ABI in `src/lib/wordleStreakContract.ts`.

---

## Deployment

### Vercel (Recommended)

1. Ensure production env vars are configured in Vercel (see [Environment Variables](#environment-variables)).
2. Run `npm run deploy:vercel` and follow the prompts. The script can sync `.env.local` values into `.env` and configure Vercel using `@vercel/sdk` utilities.@scripts/deploy.ts#15-810
3. Alternatively, push to a connected Git repository and let Vercel build automatically. Keep `NEXTAUTH_URL` in sync with the deployed domain.

### Manual Deployment

1. Build the app with `npm run build`.
2. Deploy the `.next/` output on any Node-capable platform (`npm start`).
3. Provide the same environment variables at runtime.

---

## Troubleshooting

- **Missing dependencies during build** – Ensure `npm install` completed. The repo targets React 19; some third-party warnings about React 18 peer dependencies can be ignored but watch for breaking changes.
- **`NEXT_PUBLIC_URL` undefined** – This value is required; Next.js will crash if it is missing because constants reference it directly.
- **Neynar API errors** – Confirm `NEYNAR_API_KEY`/`NEYNAR_CLIENT_ID` are valid and that the requesting user/app has correct permissions.
- **Signer registration failures** – The SIWN flow requires a valid custody account seed phrase. Double-check `SEED_PHRASE` and optional `SPONSOR_SIGNER` flag.
- **Wallet connection issues** – Users must have an injected EVM wallet (e.g., MetaMask). The UI alerts if no accounts are available.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
#
