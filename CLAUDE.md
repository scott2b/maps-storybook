# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo for multi-framework component libraries with the following packages:

- `@design/ui-core`: Core design tokens and utilities (framework-agnostic)
- `@design/ui-svelte`: Svelte 5 component library with Storybook
- `@design/ui-react`: React component library with Storybook
- `@design/ui-webcomponents`: Framework-agnostic Web Components (Lit) with Storybook

## Multi-Framework Architecture

This repository uses **Storybook Composition** to combine three separate framework-specific Storybooks into one unified view. This is the official Storybook solution for multi-framework component libraries.

### How It Works

1. Each framework package has its own `.storybook` configuration:
   - `packages/ui-svelte/.storybook/` - Svelte-specific Storybook (port 6006)
   - `packages/ui-react/.storybook/` - React-specific Storybook (port 6007)
   - `packages/ui-webcomponents/.storybook/` - Web Components Storybook (port 6008)

2. The root `.storybook/` contains a composition configuration that references all three

3. Running `pnpm storybook:all` starts all four Storybooks simultaneously:
   - Three framework-specific instances with proper tooling
   - One composition instance (port 6009) that combines them all

### Benefits

- Each framework gets its own renderer and tooling (no conflicts!)
- All frameworks appear in one unified Storybook UI
- Makes cross-framework consistency immediately visible
- Framework-specific features work correctly (Svelte runes, React hooks, Web Component decorators)

### Important Limitation

**Storybook Composition Addon Constraint**: According to Storybook documentation, "addons in composed Storybooks will not work as they normally do in a non-composed Storybook."

This means:

- The testing widget and other interactive addons work better in individual Storybooks
- For full addon functionality, use `pnpm storybook:svelte`, `pnpm storybook:react`, or `pnpm storybook:wc`
- The composition view (port 6009) is best for browsing and comparing components

All components share design tokens from `@design/ui-core`.

## Development Commands

### Running Storybook

**Recommended: Run all Storybooks with composition**

```bash
pnpm storybook:all          # Start all Storybooks + composition view (port 6009)
```

**Or run individual Storybooks:**

```bash
pnpm storybook:svelte       # Svelte Storybook (port 6006)
pnpm storybook:react        # React Storybook (port 6007)
pnpm storybook:wc           # Web Components Storybook (port 6008)
pnpm storybook              # Composition Storybook only (port 6009)
```

### Building Storybook

```bash
pnpm build-storybook        # Build composition Storybook
```

Or build individual Storybooks:

```bash
cd packages/ui-svelte && pnpm build-storybook
cd packages/ui-react && pnpm build-storybook
cd packages/ui-webcomponents && pnpm build-storybook
```

### Code Quality

**Linting and formatting:**

```bash
pnpm lint                    # Check code with ESLint
pnpm lint:fix                # Auto-fix ESLint issues
pnpm format                  # Format all code with Prettier
pnpm format:check            # Check formatting without changes
pnpm knip                    # Check for unused dependencies
pnpm typecheck               # Type check all packages
```

**Configuration:**

- **ESLint** (`eslint.config.js`): Flat config with multi-framework support
  - React rules: jsx-a11y, react-hooks
  - Svelte rules: svelte-eslint-parser
  - TypeScript: typescript-eslint
  - Storybook-specific rules
- **Prettier** (`.prettierrc.json`): Consistent formatting with Svelte plugin
- **Knip** (`knip.json`): Monorepo-aware unused code detection

### Testing

**Run all tests from root:**

```bash
pnpm test                    # Run all 88 tests across all packages
pnpm test:watch              # Run tests in watch mode
```

**Run tests for individual packages:**

```bash
cd packages/ui-core && pnpm test           # 34 unit tests
cd packages/ui-svelte && pnpm test         # 17 UI tests
cd packages/ui-react && pnpm test          # 18 UI tests
cd packages/ui-webcomponents && pnpm test  # 19 UI tests
```

**Testing Strategy:**

- **Unit tests** (`ui-core`): Test shared design tokens, types, and utility functions (e.g., `getCardCSS()`)
- **UI tests** (framework packages): Test component rendering, variants, clickable behavior, and accessibility

**Technology:**

- Vitest 4 with browser mode (Playwright/Chromium) for framework tests
- Vitest with Node environment for ui-core unit tests
- Test files colocated with components

## Architecture

### Monorepo Structure

The project uses pnpm workspaces with packages defined in `pnpm-workspace.yaml`:

```
.storybook/               # Unified Storybook configuration (root level)
├── main.ts               # Configures Vite for all three frameworks
└── preview.ts            # Shared preview settings

packages/
├── ui-core/              # Core design system tokens (framework-agnostic)
│   └── src/
│       ├── index.ts      # Main export
│       ├── tokens/       # Design tokens (colors, spacing, etc.)
│       ├── types/        # Shared TypeScript types
│       └── styles/       # Shared style utilities
│
├── ui-svelte/            # Svelte 5 components
│   ├── src/              # Component source (.svelte files)
│   │   ├── index.ts      # Main export
│   │   ├── Button.svelte
│   │   └── Card.svelte
│   ├── stories/          # Stories (.stories.ts) and tests (.test.ts)
│   ├── svelte.config.js  # Svelte configuration
│   └── vitest.config.ts
│
├── ui-react/             # React components
│   ├── src/              # Component source (.tsx files)
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── stories/          # Stories (.stories.ts) and tests (.test.tsx)
│   └── vitest.config.ts
│
└── ui-webcomponents/     # Lit-based Web Components
    ├── src/              # Component source (.ts files using Lit)
    │   ├── index.ts      # Main export
    │   ├── button.ts
    │   └── card.ts
    ├── stories/          # Stories (.stories.ts) and tests (.test.ts)
    └── vitest.config.ts
```

### Package Dependencies

All framework packages depend on `@design/ui-core` via workspace protocol (`workspace:*`):

- `@design/ui-svelte` → `@design/ui-core`
- `@design/ui-react` → `@design/ui-core`
- `@design/ui-webcomponents` → `@design/ui-core`

All packages use ES modules (`"type": "module"`)

### Design Tokens

Design tokens are centralized in `@design/ui-core/src/tokens/colors.ts`:

- `primary`: #0f766e (teal)
- `surface`: #020617 (dark slate)
- `text`: #e5e7eb (light gray)

Import design tokens in all components:

```typescript
import { colors } from '@design/ui-core';
```

### Storybook Configuration

The repository uses a **unified Storybook** configured at the root level (`.storybook/`):

- **Base framework**: `@storybook/react-vite`
- **Multi-framework support**: Vite configured to handle React, Svelte, and Web Components simultaneously
- **Story organization**: All stories from `packages/*/stories/**/*.stories.@(js|jsx|ts|tsx|svelte)`
- **Framework identification**: Stories use title prefixes ("Svelte/", "React/", "Web Components/")

Key addons:

- `@storybook/addon-vitest` - Testing integration
- `@storybook/addon-a11y` - Accessibility checks
- `@storybook/addon-docs` - Documentation
- `@chromatic-com/storybook` - Visual testing

The Vite configuration includes:

- `@vitejs/plugin-react` for React components
- `@sveltejs/vite-plugin-svelte` for Svelte 5 components
- Lit support (works natively with Vite, no plugin needed)

### Testing Setup

All packages use Vitest configured with:

- Browser mode using Playwright (Chromium)
- Storybook test plugin (`@storybook/addon-vitest`) for running story-based tests
- Headless browser execution

Tests are integrated into individual Storybooks via `@storybook/addon-vitest`:

- Run `pnpm storybook:svelte`, `pnpm storybook:react`, or `pnpm storybook:wc` to access the test panel
- The test widget appears in the Storybook sidebar for running and viewing test results
- Note: The test addon has limited functionality in the composed Storybook view (port 6009)

**Play Functions for Interactive Testing:**
Stories can include `play` functions that run after the story renders to test interactions.

**Storybook 10 Play Function Syntax:**

```typescript
import { within, expect } from 'storybook/test'; // Note: 'storybook/test', not '@storybook/test'

export const Clickable: Story = {
  args: { clickable: true },
  play: async ({ canvasElement, userEvent }) => {
    // userEvent is a parameter, not imported
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('.card');

    // Test accessibility attributes (always await expect calls)
    await expect(card).toHaveAttribute('role', 'button');
    await expect(card).toHaveAttribute('tabindex', '0');

    // Test keyboard interaction
    card?.focus();
    await expect(document.activeElement).toBe(card);
  },
};
```

**Key differences in Storybook 10:**

- Import from `'storybook/test'` (no @ symbol)
- `userEvent` is passed as a parameter, not imported
- Always `await` expect calls for proper logging in the Interactions panel

Play functions are visible in Storybook's Interactions panel and run automatically in the test suite.

## Component Development Workflow

The unified Storybook allows you to see all framework implementations simultaneously. The workflow is:

### For Svelte Components

1. Create component in `packages/ui-svelte/src/ComponentName.svelte`
   - Use Svelte 5 syntax with `$props()` runes
   - Import design tokens: `import { colors } from '@design/ui-core'`
2. Create story file in `packages/ui-svelte/stories/ComponentName.stories.ts` with `title: 'Svelte/ComponentName'`
3. Export component in `packages/ui-svelte/src/index.ts`
4. Run Storybook: `pnpm storybook:all` (from root)

**Important**: Use TypeScript CSF format (`.stories.ts`), not Svelte CSF (`.stories.svelte`)

### For React Components

1. Create component in `packages/ui-react/src/ComponentName.tsx`
   - Export TypeScript interface for props
   - Import design tokens: `import { colors } from '@design/ui-core'`
2. Create story file: `packages/ui-react/stories/ComponentName.stories.ts` with `title: 'React/ComponentName'`
3. Run Storybook: `pnpm storybook` (from root)

### For Web Components

1. Create component in `packages/ui-webcomponents/src/component-name.ts`
   - Use Lit with `@customElement` decorator
   - Use kebab-case for custom element names (e.g., `design-button`)
   - Import design tokens: `import { colors } from '@design/ui-core'`
2. Create story file: `packages/ui-webcomponents/stories/ComponentName.stories.ts` with `title: 'Web Components/ComponentName'`
3. Run Storybook: `pnpm storybook` (from root)

### General Guidelines

- Always import design tokens from `@design/ui-core`
- Use TypeScript CSF format for all story files (`.stories.ts` or `.stories.tsx`)
- Use consistent title prefixes: "Svelte/", "React/", or "Web Components/"
- Keep component logic framework-specific but styles consistent
- Tests run automatically against stories via Vitest
- The unified Storybook makes cross-framework consistency immediately visible

## Best Practices

### Design Tokens

**REQUIRED**: All components MUST use design tokens from `@design/ui-core` instead of hardcoded values.

**Why?** This ensures a single source of truth. Changing colors in one place updates all frameworks.

**Implementation by framework:**

**React:**

```tsx
import { colors } from '@design/ui-core';

// Inject CSS custom properties via inline styles
<div style={{
  '--primary-color': colors.primary,
  '--surface-color': colors.surface,
  '--text-color': colors.text
} as React.CSSProperties}>
```

Then in CSS files, use `var()`:

```css
.card {
  background-color: var(--surface-color, #020617);
  color: var(--text-color, #e5e7eb);
}
```

**Svelte:**

```svelte
<script lang="ts">
  import { colors } from '@design/ui-core';
</script>

<div style="--primary-color: {colors.primary}; --text-color: {colors.text}">
```

Then in `<style>` blocks, use `var()`:

```css
.card {
  background-color: var(--surface-color, #020617);
  color: var(--text-color, #e5e7eb);
}
```

**Web Components (Lit):**

```typescript
import { css, unsafeCSS } from 'lit';
import { colors } from '@design/ui-core';

static styles = css`
  .card {
    background-color: ${unsafeCSS(colors.surface)};
    color: ${unsafeCSS(colors.text)};
  }
`;
```

### Accessibility Requirements

**Clickable Components:**

All clickable components (e.g., cards with `clickable` prop) MUST implement:

1. **ARIA role**: `role="button"` for clickable elements
2. **Keyboard accessibility**: `tabindex="0"` to make focusable
3. **Keyboard event handlers**: Support both `Enter` and `Space` keys
4. **Prevent default behavior**: Call `e.preventDefault()` on Space key to prevent scrolling

**React example:**

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    onClick();
  }
};

<div
  role={clickable ? 'button' : 'article'}
  tabIndex={clickable ? 0 : undefined}
  onClick={onClick}
  onKeyDown={handleKeyDown}
>
```

**Svelte example:**

```svelte
<script lang="ts">
  function handleKeyDown(e: KeyboardEvent) {
    if (clickable && onclick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick();
    }
  }
</script>

<div
  role={clickable ? 'button' : 'article'}
  tabindex={clickable ? 0 : undefined}
  {onclick}
  onkeydown={handleKeyDown}
>
```

**Web Components example:**

```typescript
private _handleKeyDown(e: KeyboardEvent) {
  if (this.clickable && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    this.click();
  }
}

html`
  <div
    role=${this.clickable ? 'button' : 'article'}
    tabindex=${this.clickable ? 0 : undefined}
    @keydown=${this._handleKeyDown}
  >
`
```

**Non-interactive Components:**

- Use semantic HTML roles like `role="article"` for content cards
- Do NOT use `tabindex="-1"` for non-interactive elements (use `undefined` or omit)
- `-1` makes elements programmatically focusable but not keyboard-navigable

### Web Components Event Handling

**REQUIRED**: Web Components MUST dispatch custom events for user interactions.

**Why?** Shadow DOM boundaries prevent standard events from bubbling. Custom events with `composed: true` pierce the shadow boundary.

**Button example:**

```typescript
private _handleClick() {
  this.dispatchEvent(new CustomEvent('design-click', {
    bubbles: true,
    composed: true, // Allows event to cross shadow DOM boundary
  }));
}

render() {
  return html`<button @click=${this._handleClick}>${this.label}</button>`;
}
```

**Usage:**

```html
<design-button label="Click me" @design-click="${handleClick}"></design-button>
```

### Component Checklist

When creating or reviewing components, verify:

- [ ] Uses design tokens from `@design/ui-core` (no hardcoded colors)
- [ ] Clickable elements have `role="button"`, `tabindex="0"`, and keyboard handlers
- [ ] Non-clickable content has semantic roles like `role="article"`
- [ ] Space key prevents default scrolling behavior (`e.preventDefault()`)
- [ ] Web Components dispatch custom events with `composed: true`
- [ ] Follows framework-specific patterns (React hooks, Svelte runes, Lit decorators)

## Package Management

This project uses pnpm. Always use pnpm commands:

- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add dependency to current package
- `pnpm add <package> -w` - Add dependency to workspace root
- `pnpm --filter <package-name> <command>` - Run command in specific package

## Technology Stack

- **Storybook**: v10.1.4 (only use v10+ addons, no v8 addons)
- **Svelte**: v5.45.4
- **React**: v19.2.0
- **Lit**: v3.2.1
- **Vite**: v7.2.6
- **Vitest**: v4.0.15
- **Testing**: Vitest with Playwright browser provider
- **Code Quality**:
  - **ESLint**: Flat config (eslint.config.js) with typescript-eslint
  - **Prettier**: v3.7.4 with prettier-plugin-svelte
  - **Knip**: v5.71.0 for unused code detection

### Critical Compatibility Notes

- **Storybook 10** requires matching v10 addons - do not mix with v8 addons
- **Vite 7** is supported but requires framework-specific plugins:
  - Svelte: `@sveltejs/vite-plugin-svelte` (automatically configured by framework)
  - React: `@vitejs/plugin-react`
- **Svelte 5**: Use TypeScript CSF format (`.stories.ts`), not Svelte CSF (`.stories.svelte`)
  - `@storybook/addon-svelte-csf` has compatibility issues with Svelte 5
  - Use `$props()` runes in Svelte 5 components
- **Web Components**: Use Lit 3+ for modern Web Component development
  - Custom elements automatically register when imported
  - Use kebab-case for element names (e.g., `<design-button>`)
- **ESLint**: Uses flat config format (`eslint.config.js`)
  - Configured for multi-framework support (React, Svelte, Web Components)
  - Requires `svelte-eslint-parser` for Svelte file linting
  - Package uses `"type": "module"` for ES module support
