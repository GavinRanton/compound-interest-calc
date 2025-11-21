# ARCHITECTURAL CONTEXT & TECH STACK

## 1. TECHNOLOGY STACK (DEFAULT)
Unless explicitly told otherwise for a specific module, adhere to this stack:
- **Frontend Framework:** Next.js 15 (App Router).
- **Language:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS (Mobile-first).
- **State Management:** React Server Components (server state) + Zustand (client state).
- **Database & Auth:** Supabase (PostgreSQL).
- **Payments:** Stripe.
- **Deployment:** Vercel.

## 2. CODING STANDARDS
- **Functional Paradigm:** Use functional components and hooks. Avoid class-based components.
- **Type Safety:** No `any`. Define interfaces in a shared `/types` folder.
- **Environment:** Never hardcode secrets. Use `.env.local` and access via `process.env`.
- **Structure:** Use standard Next.js App Router structure (`/app`, `/components`, `/lib`).

## 3. ERROR HANDLING STRATEGY
- **Server Actions:** Wrap all server actions/API calls in `try/catch` blocks.
- **Standard Response:** Return errors in this consistent format:
    type ActionResponse = {
      success: boolean;
      message?: string;
      data?: any;
      error?: string;
    }
- **Logging:** Log errors to the console in Development. Do not suppress errors silently.

## 4. DOCUMENTATION REQUIREMENTS (CRITICAL)
*Note: The Lead Architect is dyslexic. Visuals are mandatory.*

- **DB Schema:** When creating/modifying tables, generate a Mermaid.js ER Diagram in a file named `DOCS.md`.
- **Logic Flows:** When building complex logic (e.g., Auth flow), create a Sequence Diagram.
- **Comments:** Do not comment *what* the code is doing. Comment *why* it is doing it (intent).

## 5. AUTOMATION & TESTING
- **Unit Tests:** Use **Jest** for utility functions and complex calculations.
- **E2E Tests:** Use **Playwright** for critical user flows (Login, Checkout).
- **Test Strategy:** Write the test *before* the code (TDD) where possible.
- **CI/CD:** If requested, create a `.github/workflows/main.yml` to run tests on Pull Requests.

## 6. EXTERNAL LIBRARIES & DEPENDENCIES
- **Rule:** Do not install heavy libraries if a native solution exists.
- **Approved Libs:**
  - Icons: `lucide-react`
  - Validation: `zod`
  - Date handling: `date-fns`
  - Class merging: `clsx` and `tailwind-merge`

## 7. SCALING STRATEGY
- **Modularity:** If a file exceeds 150 lines, refactor logic into a hook or utility.
- **Components:** Keep components small and single-responsibility.
- **Performance:** Use Next.js `<Image />` for all assets. Use `lazy` loading for heavy components.