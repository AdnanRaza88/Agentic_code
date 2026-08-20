# AgentForge (Agentic_code)

**Open Source AI Coding Agent** – Terminal-first alternative to Claude Code.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)

> **Repository**: [AdnanRaza88/Agentic_code](https://github.com/AdnanRaza88/Agentic_code)

---

## Vision

AgentForge is a modular, local-first AI coding agent that:

- Reads your codebase
- Plans changes
- Writes and executes code
- Manages long-running tasks with todos
- Keeps persistent project memory via `.agentforge/`

It ships as:
1. **CLI** (`agentforge` command) – current focus
2. **Web UI** (localhost:3000) – planned
3. **Desktop App** (Tauri / Windows .exe) – planned

## Quick Start (Development)

```bash
git clone https://github.com/AdnanRaza88/Agentic_code.git
cd Agentic_code
npm install
npm run dev          # or: npx tsx src/cli.ts
```

### Available Commands (Phase 0)

```bash
# Initialize project memory
npx tsx src/cli.ts init
# or
npx tsx src/cli.ts /init

# Create a plan
npx tsx src/cli.ts plan "Refactor auth to use JWT"
npx tsx src/cli.ts /plan Refactor auth module

# Manage todos
npx tsx src/cli.ts todo add "Write unit tests for mentions parser"
npx tsx src/cli.ts todo list
npx tsx src/cli.ts todo done <id>

# Help
npx tsx src/cli.ts help
```

### @Mentions

```bash
npx tsx src/cli.ts "Explain this code @src/cli.ts @src/core/mentions.ts"
npx tsx src/cli.ts "Show me the current changes @git"
```

## Project Structure

```
Agentic_code/
├── planning-docs/          # PRD, TRD, FEATURES, SERVICES, ARCHITECTURE, ROADMAP
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── commands/           # /init, /plan, /todo, /help
│   ├── core/               # mentions parser, (soon: agent, context, permissions)
│   ├── tools/              # (future)
│   ├── providers/          # (future LLM providers)
│   └── types/
├── package.json
└── tsconfig.json
```

## Planning Documents

All product & technical planning lives in [`planning-docs/`](./planning-docs/):

| Document | Description |
|----------|-------------|
| [PRD.md](./planning-docs/PRD.md) | Product Requirements |
| [TRD.md](./planning-docs/TRD.md) | Technical Requirements |
| [FEATURES.md](./planning-docs/FEATURES.md) | Live feature checklist (with progress ticks) |
| [SERVICES.md](./planning-docs/SERVICES.md) | Internal services & external integrations |
| [ARCHITECTURE.md](./planning-docs/ARCHITECTURE.md) | High-level architecture |
| [ROADMAP.md](./planning-docs/ROADMAP.md) | Phased roadmap |

**We keep FEATURES.md updated** – every completed feature gets a `[x]` and a log entry.

## Current Status (Phase 0)

- [x] GitHub repository created
- [x] Full planning documentation
- [x] Project scaffolding
- [x] CLI entry point
- [x] `/init` command (creates `.agentforge/`, `AgentForge.md`, settings)
- [x] `/plan` command (stub – LLM coming next)
- [x] `/todo` command (in-memory for now)
- [x] `@mention` parser (`@file`, `@folder`, `@git`)

Next up: Session management, LLM provider abstraction, basic agent loop, permissions.

## Tech Stack

- TypeScript + Node.js 20+
- Commander.js for CLI
- Pluggable LLM providers (Anthropic, OpenAI, Gemini, Ollama)
- Later: React + Vite (Web UI), Tauri (Desktop)

## Contributing

This is an open-source project. Contributions are welcome!

1. Read the planning docs first
2. Pick an item from FEATURES.md that is still `[ ]`
3. Open a PR with clear description
4. Update FEATURES.md ticks when you complete something

## License

MIT

---

Built with ❤️ by [AdnanRaza88](https://github.com/AdnanRaza88) and the community.
