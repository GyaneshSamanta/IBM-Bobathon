# Task 1: Project Scaffolding & PWA Setup

## Context
We are building **KAAVALU (ಕಾವಲು)** — an offline-first safe transit companion for women in Bengaluru for the IBM Bobathon (Theme 3: Safer Communities, Stronger Futures).
KAAVALU uses a 70% offline deterministic core (IndexedDB + client-side A* pathfinding + Web Audio SOS + native SMS) and a 30% online agentic AI copilot (IBM watsonx.ai Granite model).

## Objective
Initialize the project foundation using Vite, React, TypeScript, Tailwind CSS, and Service Worker PWA support with an IBM watsonx development proxy.

---

## Prompt to Give to IBM Bob

```markdown
You are building KAAVALU (ಕಾವಲು) — the offline-first safe transit companion for Bengaluru.
This is Phase 1: Project Foundation & PWA Scaffolding.

Please execute the following steps in the current workspace:

1. Scaffold a React + TypeScript project with Vite (or create the required configuration files in-place):
   - `package.json` with scripts for `dev`, `build`, `preview`.
   - Core dependencies: `react`, `react-dom`, `lucide-react`, `idb-keyval`, `clsx`, `tailwind-merge`.
   - Dev dependencies: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/react-dom`.

2. Configure Tailwind CSS:
   - Create `tailwind.config.js` with:
     - Dark mode enabled (`class`).
     - Custom palette: Night Dark (`#06090F`, `#0B0F17`, `#111827`), Emerald Safety (`#10B981`, `#059669`), Warning Caution (`#F59E0B`), Danger Alert (`#EF4444`).
     - Font family configured for Inter and monospace.
   - Create `postcss.config.js`.
   - Create `src/index.css` with Tailwind directives and base dark theme styling.

3. Configure Vite & watsonx Proxy (`vite.config.ts`):
   - Support React plugin.
   - Add proxy configuration for `/api/watsonx` forwarding to `https://us-south.ml.cloud.ibm.com` (and `/api/ibm-iam` to `https://iam.cloud.ibm.com`) so the client can communicate with IBM Cloud without browser CORS restrictions during development.

4. Setup Service Worker & PWA Manifest:
   - Create `public/manifest.json` configured for KAAVALU (display: standalone, theme_color: #06090F, background_color: #06090F, title: KAAVALU).
   - Create `public/sw.js` (Service Worker) implementing cache-first strategy for app shell and static assets to enable 100% offline Airplane Mode execution.
   - Register the Service Worker in `src/main.tsx`.

5. Environment Configuration:
   - Create `.env.example` with:
     ```env
     VITE_WATSONX_API_KEY=
     VITE_WATSONX_PROJECT_ID=
     VITE_WATSONX_SERVICE_URL=https://us-south.ml.cloud.ibm.com
     VITE_WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
     VITE_ENABLE_MOCK_FALLBACK=true
     ```

6. Smoke Test:
   - Create a clean `src/App.tsx` showing a minimal header "KAAVALU (ಕಾವಲು)" with an offline/online indicator badge and Tailwind dark background.
   - Ensure `npm run build` succeeds without TypeScript or bundler errors.
```

---

## Verification Criteria
- [ ] `npm run build` builds cleanly to `dist/`.
- [ ] `public/sw.js` and `public/manifest.json` exist.
- [ ] `vite.config.ts` includes proxy routes for `/api/watsonx` and `/api/ibm-iam`.
- [ ] Tailwind dark theme styles render properly on `npm run dev`.
