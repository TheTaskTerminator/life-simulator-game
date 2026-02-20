# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Type check only
pnpm type-check

# Lint
pnpm lint

# Preview production build
pnpm preview
```

## Architecture Overview

This is a life simulator text game with AI-generated events. The codebase follows a layered architecture:

```
src/
├── components/     # Pure UI components (no business logic)
├── views/          # View layer with business logic hooks
│   ├── event/      # Event handling hooks
│   ├── career/     # Career system hooks
│   ├── education/  # Education system hooks
│   └── relationship/ # Relationship hooks
├── services/       # Business logic services
│   ├── aiService.ts      # AI event generation (SiliconFlow/OpenAI)
│   ├── eventService.ts   # Event processing with caching
│   ├── careerService.ts  # Career logic
│   └── stageService.ts   # Life stage transitions
├── engine/         # Game engines
│   ├── endingEngine.ts   # Ending conditions & evaluation
│   ├── turnEngine.ts     # Turn-based system
│   └── eventSelector.ts  # Event selection algorithm
├── hooks/          # Global hooks
│   ├── useGameState.ts   # Central state management
│   └── useGameEffects.ts # Side effects
├── store/          # Zustand store (optional, primarily using hooks)
├── schemas/        # Zod schemas for AI response validation
├── types/          # TypeScript type definitions
├── config/         # Configuration files
└── utils/          # Utility functions
```

### Key Patterns

1. **State Management**: Uses React hooks (`useGameState`) instead of global state library. State persisted to localStorage.

2. **Feature Hooks Pattern**: Each feature module (career, education, etc.) exports a `useXxxHandlers` hook containing all handlers for that domain.

3. **AI Integration**: `aiService.ts` generates events via SiliconFlow/OpenAI API. Responses validated with Zod schemas in `schemas/`.

4. **CSS Styling**: Uses inline `<style>` tags within components (CSS-in-JS without libraries). Design theme: midnight blue (`#0a0a1a`) + gold accents (`#d4af37`), Cinzel + Noto Sans SC fonts.

5. **Event Flow**:
   - `eventService.triggerEvent()` → AI generation → `EventModal` display → player choice → `aiService.generateChoiceConsequence()` → state update

### Environment Configuration

Create `.env.local` for AI service:
```bash
VITE_AI_KEY=your-api-key
VITE_AI_MODEL_ID=qwen-72b  # optional override
```

Model configuration in `config/ai.json`.

### Type Definitions

Core types in `src/types.ts`:
- `Player` - Player state with attributes, career, relationships
- `Event` - Game event with choices and effects
- `LifeStage` - Enum for life phases (childhood → elderly)

### Adding New Features

1. Add types to `types.ts` or `types/` directory
2. Create service logic in `services/`
3. Create handler hook in `views/<feature>/useXxxHandlers.ts`
4. Create UI component in `components/`
5. Integrate in `GameView.tsx`

## Development Workflow

### Complex Tasks → Agent Team

For complex, multi-step tasks, prioritize using the **Task tool** to spawn specialized agents:

```
Task tool with subagent_type:
- "general-purpose": Research, code exploration, multi-step tasks
- "Explore": Fast codebase exploration and searching
- "Plan": Architecture planning and implementation design
```

Run multiple agents in parallel when tasks are independent.

### Available Skills

Use existing skills via the Skill tool for specialized workflows:

| Skill | Usage |
|-------|-------|
| `frontend-design` | Creating UI components, pages, or applications with high design quality |
| `planning-with-files:plan` | Manus-style file-based planning for complex tasks |
| `code-review:code-review` | Reviewing pull requests |

Example: For UI redesign tasks, invoke `frontend-design` skill first.

### Task Strategy

1. **Simple tasks** (1-3 steps): Execute directly
2. **Medium tasks** (3-5 steps): Use Task tool with appropriate agent
3. **Complex tasks** (>5 steps): Use `planning-with-files:plan` skill or spawn multiple agents in parallel
