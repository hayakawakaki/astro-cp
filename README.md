# AstroCP

A control panel for [rAthena](https://github.com/rathena/rathena), built on Typescript and Astro.

> **This project is no longer active.** It was superseded by another CP project of mine [go-racp](https://github.com/hayakawakaki/go-racp).

## Features

- **Item and monster databases** with pagination, live search and detail pages, built by merging rAthena's YAML databases with the client's `iteminfo.lua`
- **Server Telemetry** with port checks and online player counts with proper caching
- **OAuth sign-in** (Discord, Google) with `user`, `moderator` and `admin` roles
- **Master accounts**: one website login can own several in-game accounts
- **Themes**: pages import views from `~theme/...`, resolved to the active theme with a fallback to `base`. Theme components can be written in any frontend library Astro supports (Vue, React, Svelte, Preact, Solid)
- **Validated environment variables**: `.env` is parsed against a Zod schema at startup, and missing values fail fast with a list of what's absent
- **One config file** (`app-config.ts`) for server name, rates, navigation, theme and data sources

## Tech stack

| Area | Tools |
| :-- | :-- |
| Framework | Astro 5 (SSR, Node adapter) |
| UI | Vue 3, Alpine.js, VueUse |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |
| Database | MySQL with Drizzle ORM |
| Auth | Better Auth |
| Validation | Zod |
| Data parsing | `js-yaml`, `luaparse` |
| Testing | Vitest |
| Tooling | pnpm, ESLint, Husky, GitHub Actions |

## Getting started

Requires Node.js 22, pnpm 10 and a MySQL database with the rAthena schema.

```sh
git clone https://github.com/hayakawakaki/astro-cp.git
cd astro-cp
pnpm install
cp .env.example .env   # then fill in the values
mysql -u <user> -p <database> < sql-files/cp-tables.sql
pnpm dev
```

The site runs at `http://localhost:4321`.

## Commands

| Command | Action |
| :-- | :-- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the tests |
