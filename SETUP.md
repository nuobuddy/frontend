# NuoBuddy Frontend - Setup Complete

## What Has Been Configured

### 1. TailwindCSS v4 Installation ✅

- Installed `tailwindcss@4.2.1`, `@tailwindcss/vite`, `postcss`, and `autoprefixer`
- Configured Vite to use TailwindCSS plugin
- Created `src/assets/index.css` with TailwindCSS imports
- Updated `src/main.ts` to import global styles

### 2. shadcn-vue Setup ✅

- Installed shadcn-vue and dependencies:
  - `shadcn-vue` - Main library
  - `radix-vue` - Headless UI components
  - `class-variance-authority` - Component variants
  - `clsx` & `tailwind-merge` - Class name utilities
  - `@radix-icons/vue` & `lucide-vue-next` - Icon libraries
- Created `components.json` configuration file
- Created `src/lib/utils.ts` with `cn()` utility function
- Set up directory structure for UI components

### 3. ESLint Configuration ✅

Configured ESLint with the following rules:

- **Max line length**: 144 characters
- **Semicolons**: Always required
- **Comma dangle**: Always for multiline objects/arrays
- Integration with Vue, TypeScript, Oxlint, and Prettier

File: `eslint.config.ts`

### 4. Husky Pre-commit Hooks ✅

Installed and configured:

- **husky** - Git hooks manager
- **lint-staged** - Run linters on staged files
- **@commitlint/cli** - Commit message linter
- **@commitlint/config-conventional** - Conventional commit rules

#### Pre-commit Hook (`.husky/pre-commit`)

Runs before each commit:
1. TypeScript type checking
2. ESLint + Oxlint linting
3. Staged files formatting

If any check fails, the commit is blocked with a descriptive error message.

#### Commit Message Hook (`.husky/commit-msg`)

Validates commit messages follow conventional commit format:
- Format: `<type>: <subject>`
- Allows merge commits (starting with "Merge")
- Shows helpful error messages on failure

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 5. Copilot Instructions ✅

Created `.github/copilot-instructions.md` with comprehensive guidelines:

- Project overview and tech stack
- Code style guidelines
- Component structure patterns
- Git commit conventions
- Pre-commit checks documentation
- Best practices and common patterns
- Development workflow

## Project Structure

```
.
├── .github/
│   └── copilot-instructions.md    # AI coding guidelines
├── .husky/
│   ├── pre-commit                 # Pre-commit checks
│   └── commit-msg                 # Commit message validation
├── src/
│   ├── assets/
│   │   └── index.css              # TailwindCSS imports
│   ├── components/
│   │   └── ui/                    # shadcn-vue components
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn)
│   ├── router/
│   ├── stores/
│   └── main.ts
├── .lintstagedrc.json             # Lint-staged config
├── commitlint.config.js           # Commitlint rules
├── components.json                # shadcn-vue config
├── eslint.config.ts               # ESLint configuration
├── vite.config.ts                 # Vite + TailwindCSS
└── package.json
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm type-check       # Run TypeScript type checking
pnpm lint             # Run all linters (oxlint + eslint)
pnpm lint:oxlint      # Run oxlint only
pnpm lint:eslint      # Run eslint only
pnpm format           # Format code with Prettier

# Git Hooks
pnpm prepare          # Setup husky hooks (runs automatically)
```

## Getting Started

### 1. Install Dependencies (if not already done)

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Add shadcn-vue Components (when needed)

```bash
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add card
# Add any component you need
```

### 4. Development Workflow

1. Create/edit files following the guidelines in `.github/copilot-instructions.md`
2. Write code with proper TypeScript types
3. Use shadcn-vue components from `@/components/ui`
4. Stage your changes: `git add .`
5. Commit with conventional format: `git commit -m "feat: add new feature"`
6. Pre-commit hooks will automatically run

## Example: Creating a New Component

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  variant?: 'default' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const count = ref(0);
const displayText = computed(() => `${props.title}: ${count.value}`);

function handleClick(event: MouseEvent) {
  count.value++;
  emit('click', event);
}
</script>

<template>
  <div :class="cn('p-4 rounded-lg', variant === 'outline' && 'border')">
    <h2 class="text-lg font-semibold">{{ displayText }}</h2>
    <Button @click="handleClick">Click me</Button>
  </div>
</template>
```

## Commit Message Examples

```bash
# Feature
git commit -m "feat: add user authentication"

# Bug fix
git commit -m "fix: resolve dashboard loading issue"

# Documentation
git commit -m "docs: update API integration guide"

# Refactoring
git commit -m "refactor: simplify user profile logic"

# Style changes
git commit -m "style: format code according to new rules"
```

## Pre-commit Hook Behavior

When you commit, the hook will:

1. **Type Check**: Verify no TypeScript errors exist
   - ❌ Fails: "ERROR: TypeScript type check failed. Please fix type errors before committing."

2. **Lint**: Run oxlint and eslint with auto-fix
   - ❌ Fails: "ERROR: Linting failed. Please fix lint errors before committing."

3. **Format Staged Files**: Run prettier on staged files
   - Auto-formats and stages the changes

4. **Validate Commit Message**: Check conventional commit format
   - ❌ Fails: "ERROR: Commit message does not follow conventional commit format."
   - ✅ Pass: Merge commits are allowed (e.g., "Merge branch 'feature'")

## Next Steps

Now you can start building your AI Agent Chatbot frontend:

1. **Design the UI**: Use shadcn-vue components
2. **Create Pages**: Add views in `src/views/`
3. **Add Routes**: Configure routes in `src/router/`
4. **State Management**: Create stores in `src/stores/`
5. **API Integration**: Create API client and composables
6. **Build Features**: Chat interface, admin dashboard, etc.

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [TailwindCSS v4 Docs](https://tailwindcss.com/)
- [shadcn-vue Docs](https://www.shadcn-vue.com/)
- [Radix Vue Docs](https://www.radix-vue.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Setup completed successfully!** All configuration files are in place and tested. You can now start development. 🚀
