 Eldrow

Eldrow is a Wordle-inspired Farcaster mini app that combines a daily word puzzle with on-chain streak tracking, Neynar authentication, and wallet-aware gameplay. The project ships with a fully configured Next.js 15 application, reusable UI primitives, and integration helpers for building richer Farcaster experiences.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Available Scripts](#available-scripts)
6. [Project Structure](#project-structure)
7. [Authentication & Neynar Flow](#authentication--neynar-flow)
8. [Smart Contract & Streak Tracking](#smart-contract--streak-tracking)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [License](#license)

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

