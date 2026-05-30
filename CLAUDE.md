# Developer Instructions & Guidelines (srikant-portfolio-next)

This guide outlines build, test, and style guidelines for developers and AI agents working on this project.

## Build and Test Commands

- **Local Development**: `npm run dev` (starts development server on port 3000)
- **Production Build**: `npm run build` (builds the Next.js production bundle)
- **Linting**: `npm run lint` (runs ESLint checks)
- **Type Checking**: `npm run typecheck` (runs TypeScript compiler checks)
- **Unit & Integration Tests**: `npm run test` (runs Vitest / Jest tests)
- **Storybook UI Development**: `npm run storybook` (starts Storybook server)
- **Storybook Build**: `npm run build-storybook` (builds Storybook static output)
- **E2E Testing**: `npm run test:e2e` or `npx playwright test` (runs Playwright E2E suites)

---

## Code Quality & Style Guidelines

### Core React & Next.js Guidelines
- **Framework & Router**: Next.js 15 App Router. Use React Server Components (RSC) by default for data fetching and layout structure. Use Client Components (`"use client"`) only when local state, interactivity, browser APIs, or custom context are strictly required.
- **Component Style**: Prefer arrow function declarations for components:
  ```ts
  const MyComponent = ({ prop1 }: MyComponentProps) => { ... }
  ```
- **File Structure**: Keep page logic inside `src/app/` and UI component files inside structured directories:
  - `src/components/ui/` for low-level design primitives (buttons, modals, glassmorphism cards).
  - `src/components/features/` for feature-specific layouts (e.g., custom audio player, credit filters).
- **Naming Conventions**:
  - Components: PascalCase (e.g. `AudioPlayer.tsx`).
  - Hooks: camelCase with `use` prefix (e.g. `useAudioStream.ts`).
  - Event Handlers: Must start with `handle*` (e.g., `handleClick`, `handleSubmit`, `handleAudioPlay`).

### Styling Rules
- **Tailwind CSS**: Use Tailwind classes for all styling. Custom CSS should be avoided.
- **Class Concatenation**: Use `clsx` or `tailwind-merge` to combine conditional and base Tailwind classes.
  - Avoid nested ternary operators inside class strings.
  - Prefer the `clsx` object format for conditional switches:
    ```ts
    import clsx from 'clsx';
    const className = clsx(
      'rounded-lg px-4 py-2 border transition-all duration-300',
      { 'bg-neutral-900 border-yellow-500/30 text-yellow-500': active },
      { 'opacity-50 pointer-events-none': disabled }
    );
    ```

### UX States & Reliability
Every asynchronous action or dynamic section must handle:
1. **Loading State**: Skeleton loading animations or spinners to avoid layout shift.
2. **Error State**: User-friendly, localized error display with a clear retry action.
3. **Empty State**: Clear fallback/empty messaging to guide the user when content list is empty.

### Testing Architecture
1. **Unit & Integration Tests**: Implement tests for helpers, state managers, hooks, and complex data transformations. Ensure tests focus on behavior rather than internal implementation.
2. **Storybook Components**: Document and test all visual elements, variants (gold, teal, glassmorphic), and interactive widgets in isolation. Write stories under `.stories.tsx` next to the component.
3. **Playwright E2E**: Test core user flows—specifically:
   - Landing page loading and visual state validation.
   - Dynamic portfolio/credit filtering interaction.
   - Audio showcase player playback control, track skipping, and volume changes.
   - Contact form input submission, validation errors, and success state validation (mocking the Supabase backend).

### Git & Commit Workflow
- Commit messages should be clear, concise, and follow conventional commits style (e.g., `feat: add custom audio waveform rendering`).
- Avoid mixing refactoring, features, or formatting in a single commit. Keep PRs small and focused.
