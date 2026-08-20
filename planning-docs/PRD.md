# Product Requirements Document (PRD) - AgentForge (Agentic_code)

**Version**: 1.0.0  
**Last Updated**: 2026-08-20  
**Status**: Draft / Active Development  
**Owner**: AdnanRaza88 / AgentForge Team

---

## 1. Vision

AgentForge is an open-source, terminal-first AI coding agent designed as a powerful alternative to proprietary tools like Claude Code. It empowers developers to read, plan, write, execute, and manage codebases through natural language, with deep project awareness, modular tools, and multi-interface support (CLI + Web UI + Desktop).

## 2. Goals

- Provide a local-first, privacy-respecting AI coding companion.
- Support pluggable LLM providers (Anthropic, OpenAI, Gemini, local models).
- Enable complex multi-step coding workflows with planning, todos, subagents, and parallel execution.
- Maintain full project memory and context via `.agentforge/` conventions.
- Ship first as a high-quality CLI, then Web UI, then Windows Desktop (Tauri).

## 3. Target Users

- Professional software engineers and full-stack developers
- AI engineers building agents and automation
- Indie hackers and open-source maintainers
- Teams wanting self-hosted or customizable coding agents

## 4. Core Value Propositions

1. **Terminal-native** – Works where developers already live.
2. **Project Memory** – Persistent context via AgentForge.md and settings.
3. **Safety First** – Permission system (`allow` / `ask` / `deny`) for tools.
4. **Extensible** – Skills, Plugins, MCP, Hooks, Custom Slash Commands.
5. **Open Source** – Clean TypeScript codebase, community contributions welcome.

## 5. Success Metrics

- Number of GitHub stars / forks
- Daily active CLI users
- Successful multi-file refactors completed
- Community plugins and skills published
- Time-to-first-commit contribution from outsiders

## 6. Out of Scope (v1)

- Full IDE replacement
- Real-time collaborative multiplayer editing
- Mobile app
- Cloud-hosted multi-tenant SaaS (focus is local / self-hosted)

## 7. Key User Stories

- As a developer, I can run `agentforge` in any project and it understands my codebase via `/init`.
- As a developer, I can toggle Plan Mode vs Agent Mode with `Shift+Tab`.
- As a developer, I can reference files with `@src/utils.ts` and the agent adds them to context.
- As a developer, I can break work into todos with `/todo` and track progress.
- As a developer, I can run bash commands inside the agent with `Shift+!`.

## 8. Non-Functional Requirements

- Fast startup (< 1s for CLI)
- Context compaction at 75–92% window usage
- Modular architecture (each feature is a separate module)
- TypeScript strict mode
- Comprehensive tests for core tools
- Clear documentation and examples

## 9. Release Strategy

1. **Phase 1** – Core CLI + `/init`, `/plan`, `/todo`, `@mentions`, basic LLM integration
2. **Phase 2** – Sessions, permissions, compaction, skills, git integration
3. **Phase 3** – Subagents, parallel agents, MCP, hooks
4. **Phase 4** – Web UI (localhost:3000)
5. **Phase 5** – Tauri desktop packaging for Windows

---

*This document will be updated as features are implemented. Check FEATURES.md for live progress.*
