# JudiX.in Frontend Sandbox

This repository is a Next.js-based sandbox for JudiX.in. It is used to prototype, test, and iterate on UI components, design tokens, and frontend patterns before promoting them to production apps.

This is a safe place to:
- Explore visual and interaction patterns.
- Build, refine, and QA UI components.
- Validate styling tokens and responsive behavior.

If you are an intern, start here to get familiar with the stack and conventions we use in production.

## Quick Start

- Node.js: 18.18+ or 20+ (LTS recommended)
- Package manager: npm (package-lock.json is present; don’t mix package managers)

Install dependencies and start the dev server:

```powershell
# From the repo root
npm install
npm run dev
```

The app runs at http://localhost:3000

To build and run a production bundle:

```powershell
npm run build
npm start
```

## Tech Stack

- Next.js 15 (App Router) with Turbopack
- React 19
- TypeScript 5
- Tailwind CSS v4 (via @tailwindcss/postcss)
- ESLint 9 (Next + TypeScript rules)
- CSS theme tokens via `@theme` in [globals.css](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/globals.css:0:0-0:0)

Key packages:
- `next@15.5.3`, `react@19.1.0`, `react-dom@19.1.0`
- `tailwindcss@^4`, `@tailwindcss/postcss@^4`
- `class-variance-authority`, `tailwind-merge`
- `judix-icon` (internal icon package)

## Scripts

Defined in [package.json](cci:7://file:///e:/JudiX/v02/frontend/sandbox/package.json:0:0-0:0):

- `npm run dev`: Start dev server (Turbopack)
- `npm run build`: Production build (Turbopack)
- `npm start`: Run the production server
- `npm run lint`: Lint the project

You can change the dev port if needed:

```powershell
npm run dev -- -p 3001
```

## Project Structure

- `src/app/`
  - [layout.tsx](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/layout.tsx:0:0-0:0): App shell, fonts, and global wrappers
  - [page.tsx](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/page.tsx:0:0-0:0): Default route page
  - [globals.css](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/globals.css:0:0-0:0): Tailwind CSS import and design tokens (`@theme`)
  - `fonts/`: Local font assets (e.g., `Satoshi-Variable.woff2`)
- [src/components/ui/](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui:0:0-0:0): Reusable UI components (exported via [index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0))
- [src/utils/cn_tw_merger.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/utils/cn_tw_merger.ts:0:0-0:0): Utility to combine class names (aware of our custom text-size tokens)
- `public/`: Static assets
- [next.config.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/next.config.ts:0:0-0:0): Next.js configuration
- [eslint.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/eslint.config.mjs:0:0-0:0): ESLint flat config
- [postcss.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/postcss.config.mjs:0:0-0:0): Tailwind v4 PostCSS plugin hook
- [tsconfig.json](cci:7://file:///e:/JudiX/v02/frontend/sandbox/tsconfig.json:0:0-0:0): TypeScript config (with path alias `@/*` → `src/*`)

## Styling and Design System

- Tailwind v4 is activated in [postcss.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/postcss.config.mjs:0:0-0:0) via `@tailwindcss/postcss`.
- Global styles and design tokens live in [src/app/globals.css](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/globals.css:0:0-0:0).
  - The file uses `@import "tailwindcss";` and an `@theme` block to declare tokens.
  - Tokens include color scales, radii, shadows, font families, text sizes, line heights, and weights.

Examples (from [globals.css](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/globals.css:0:0-0:0)):
- Colors: `--color-primary-100..800`, `--color-accent-100..800`, `--color-neutral-100..900`, semantic colors like `--color-red-*`, `--color-blue-*`.
- Typography: `--font-manrope`, `--font-satoshi`; text sizes like `--text-h1`, `--text-body-md`, etc.
- Shadows and radii: `--shadow-*`, `--radius-*`.

Fonts:
- `Manrope` (Google, via `next/font/google`)
- `Satoshi` (local, via `next/font/local`)
- Both are injected as CSS variables on `<body>`: see [src/app/layout.tsx](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/layout.tsx:0:0-0:0).

Tip:
- Tailwind v4 leans on CSS variables for design tokens. Prefer tokens from `@theme` for consistency across components.

## UI Components

The UI library lives in [src/components/ui/](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui:0:0-0:0). Common components include:

- Badge
- Button
- Calendar
- Card
- Checkbox
- Dialog
- Dropdown
- FullScreenSpinner
- IconButton
- InputField
- MenuField
- NotificationTile
- Radio
- SearchInputField
- SlidingPanel
- Spinner
- Table
- ToggleButton
- Tooltip

Usage pattern:

```tsx
// Prefer path alias from tsconfig: "@/*" maps to "src/*"
import { Button } from "@/components/ui";

export default function Example() {
  return <Button>Click me</Button>;
}
```

Note:
- [src/components/ui/index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0) re-exports components for a flat import experience.
- If you add a new component, export it from [index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0) to make it available app-wide.

## Utility: Classname Merger

[src/utils/cn_tw_merger.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/utils/cn_tw_merger.ts:0:0-0:0) provides a [cn(...classes)](cci:1://file:///e:/JudiX/v02/frontend/sandbox/src/utils/cn_tw_merger.ts:24:0-26:1) helper that merges Tailwind classes and recognizes our custom text-size tokens:

```ts
import { cn } from "@/utils/cn_tw_merger";

<div className={cn("p-4", "text-body-md", condition && "opacity-50")} />
```

The merger is configured with a custom `font-size` class group so classes like `text-h1`, `text-body-md`, etc., don’t conflict when composed. Make sure any new design tokens you introduce are recognized in this merger if needed.

## Conventions and Guidelines

- Path alias: use `@/*` when importing from `src/*`.
- Keep components small, typed, and accessible.
- Co-locate small helper types/functions with components; extract shared logic to `src/utils/` when reused.
- Prefer CSS tokens from `@theme` for colors, radius, shadows, and typography.
- Name exports for components (re-export via [src/components/ui/index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0)).
- Env vars:
  - Browser-exposed vars must be prefixed with `NEXT_PUBLIC_`.
  - Place secrets in `.env.local` (do not commit).

## Linting and Type Safety

- Run `npm run lint` to check for issues.
- ESLint is configured with Next + TypeScript recommended rules via a flat config in [eslint.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/eslint.config.mjs:0:0-0:0).
- Strict TypeScript is enabled; keep code strongly typed.

## Building and Running

- `npm run build`: creates a production build (Turbopack).
- `npm start`: serves the production build.

If you deploy this sandbox (e.g., to a preview environment), ensure environment variables (if any) are set in that environment as well.

## Working With Icons

- `judix-icon` is installed and can be used for standardized icons.
- Follow the package’s README for usage patterns, sizing, and theming.

## Common Tasks

- Add a new component:
  1. Create `src/components/ui/MyComponent.tsx`.
  2. Export it from [src/components/ui/index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0).
  3. Add a usage example in [src/app/page.tsx](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/page.tsx:0:0-0:0) or a dedicated demo page.

- Use design tokens:
  - Reference the tokens defined in [globals.css](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/app/globals.css:0:0-0:0) (e.g., via Tailwind utility classes or CSS variables if needed).

## Troubleshooting

- Port already in use:
  - `npm run dev -- -p 3001`
- Node version errors:
  - Ensure Node 18.18+ or 20+; reinstall dependencies after switching Node versions.
- ESLint finds too many files or crashes:
  - Try `npm run lint -- --fix`. Ensure [eslint.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/eslint.config.mjs:0:0-0:0) ignores are intact.
- Missing component exports error:
  - If you see errors like “Module not found: './dateRange' or './textEditor'”
    - Check [src/components/ui/index.ts](cci:7://file:///e:/JudiX/v02/frontend/sandbox/src/components/ui/index.ts:0:0-0:0) and comment/remove exports for files that do not exist, or add the missing components.
- Tailwind classes not applying:
  - Ensure dependencies are installed and [postcss.config.mjs](cci:7://file:///e:/JudiX/v02/frontend/sandbox/postcss.config.mjs:0:0-0:0) contains `@tailwindcss/postcss`.



## Security and Secrets

- Do not commit `.env*` files or secrets.
- Any new API key intended for the browser must be prefixed with `NEXT_PUBLIC_` and considered public.
- Default sandbox has no server-side secrets configured.

## Roadmap Ideas

- Add Storybook or a lightweight component gallery route for visual regression and QA.
- Introduce unit tests (Jest/RTL or Vitest/RTL) for critical components.
- Add visual themes (light/dark/system) powered by token overrides.
- Hook up a deploy preview for PRs.

## Maintainers

- Frontend Team, JudiX.in
- Please add team email, Slack channel, and escalation path here.

## License

Copyright (c) JudiX.
All rights reserved. Internal use only.