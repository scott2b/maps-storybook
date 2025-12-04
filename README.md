# Multi-Framework Component Library

A monorepo containing framework-agnostic design tokens and framework-specific component implementations for Svelte, React, and Web Components.

## Quick Start

### Prerequisites

- Node.js 20.16+, 22.19+, or 24+
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Run Storybook

**Option 1: Run all Storybooks with composition (recommended)**

```bash
pnpm storybook:all
```

This starts all framework Storybooks plus a composition view at http://localhost:6009 that combines them all.

**Option 2: Run individual Storybooks**

```bash
pnpm storybook:svelte    # http://localhost:6006
pnpm storybook:react     # http://localhost:6007
pnpm storybook:wc        # http://localhost:6008
```

**How it works**: We use [Storybook Composition](https://storybook.js.org/docs/sharing/storybook-composition) to combine three separate Storybook instances into one unified view. Each framework gets its own properly-configured Storybook, and the composition combines them seamlessly.

## Project Structure

```
packages/
├── ui-core/              # Design tokens (colors, spacing, etc.)
├── ui-svelte/            # Svelte 5 components
├── ui-react/             # React components
└── ui-webcomponents/     # Web Components (Lit)
```

## Packages

### @design/ui-core

Framework-agnostic design tokens used by all component packages.

```typescript
import { colors } from '@design/ui-core';

// Available tokens:
// colors.primary: #0f766e
// colors.surface: #020617
// colors.text: #e5e7eb
```

### @design/ui-svelte

Svelte 5 components using modern runes syntax. Stories appear in Storybook under "Svelte/".

```bash
cd packages/ui-svelte
pnpm test       # Run tests
```

### @design/ui-react

React components with TypeScript. Stories appear in Storybook under "React/".

```bash
cd packages/ui-react
pnpm test       # Run tests
```

### @design/ui-webcomponents

Framework-agnostic Web Components built with Lit. Stories appear in Storybook under "Web Components/".

```bash
cd packages/ui-webcomponents
pnpm test       # Run tests
```

## Development

### Code Quality

**Linting and formatting:**

```bash
pnpm lint           # Check code with ESLint
pnpm lint:fix       # Auto-fix ESLint issues
pnpm format         # Format code with Prettier
pnpm format:check   # Check formatting without changes
pnpm knip           # Check for unused dependencies
```

**Tools configured:**

- **ESLint**: Multi-framework support (React, Svelte, Web Components) with accessibility rules
- **Prettier**: Consistent formatting with Svelte plugin
- **Knip**: Monorepo-aware unused code detection

### Creating a New Component

Each framework has its own workflow documented in [CLAUDE.md](./CLAUDE.md#component-development-workflow).

**General pattern:**

1. Add design tokens to `@design/ui-core` if needed
2. Implement component in framework-specific package
3. Create TypeScript story file (`.stories.ts`) with appropriate title prefix ("Svelte/", "React/", or "Web Components/")
4. Run `pnpm storybook` from root to preview all frameworks

### Running Tests

**Run all tests (recommended):**

```bash
pnpm test
```

This runs 88 tests across all packages:

- **ui-core**: 34 unit tests (design tokens, types, utilities)
- **ui-svelte**: 17 UI tests
- **ui-react**: 18 UI tests
- **ui-webcomponents**: 19 UI tests

**Run specific package:**

```bash
cd packages/ui-core && pnpm test           # Unit tests
cd packages/ui-svelte && pnpm test         # Svelte UI tests
cd packages/ui-react && pnpm test          # React UI tests
cd packages/ui-webcomponents && pnpm test  # Web Components UI tests
```

**Testing Strategy:**

- **Unit tests** for `@design/ui-core`: Test shared logic (design tokens, types, utility functions)
- **UI tests** for framework packages: Test component rendering, variants, interactions, and accessibility

## Architecture

This monorepo uses **Storybook Composition** to combine three framework-specific Storybooks into one unified view.

**Benefits:**

- See all framework implementations in one place via composition
- Each framework gets proper tooling and rendering
- Compare consistency across frameworks instantly
- Single source of truth for design documentation
- Framework-specific features work correctly

**Important Limitation:**
Addons in composed Storybooks have limited functionality. For full addon features (like integrated testing), use individual framework Storybooks:

```bash
pnpm storybook:svelte    # Full addon support
pnpm storybook:react     # Full addon support
pnpm storybook:wc        # Full addon support
```

**Shared design tokens** from `@design/ui-core` ensure visual consistency across all implementations.

## Technology Stack

- **Package Manager:** pnpm with workspaces
- **Build Tool:** Vite 7
- **Testing:** Vitest 4 with Playwright browser mode
- **Documentation:** Storybook 10
- **Code Quality:** ESLint, Prettier, Knip
- **Frameworks:**
  - Svelte 5.45.4
  - React 19.2.0
  - Lit 3.2.1

## Contributing

1. Install dependencies: `pnpm install`
2. Make your changes in the appropriate package
3. Run linting: `pnpm lint` and `pnpm format`
4. Preview with unified Storybook: `pnpm storybook:all`
5. Run tests: `pnpm test`

## License

[Your license here]
