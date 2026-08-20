#!/usr/bin/env node
/**
 * AgentForge CLI entry point
 * Usage: agentforge [command] [options]
 *        agentforge          → interactive REPL (future)
 */

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import { runInit } from "./commands/init.js";
import { runPlan } from "./commands/plan.js";
import { runTodo } from "./commands/todo.js";
import { runHelp } from "./commands/help.js";
import { processMentions } from "./core/mentions.js";
import type { CommandContext } from "./types/index.js";

const program = new Command();

program
  .name("agentforge")
  .description("AgentForge – Open Source AI Coding Agent")
  .version("0.1.0")
  .option("-r, --resume", "Resume last session")
  .option("--cwd <path>", "Working directory", process.cwd());

program
  .command("init")
  .description("Initialize .agentforge/ project memory")
  .action(async () => {
    const ctx: CommandContext = { cwd: program.opts().cwd, args: [] };
    await runInit(ctx);
  });

program
  .command("plan")
  .description("Generate a plan (Plan Mode)")
  .argument("[text...]", "What to plan")
  .action(async (text: string[]) => {
    const ctx: CommandContext = { cwd: program.opts().cwd, args: text };
    await runPlan(ctx);
  });

program
  .command("todo")
  .description("Manage todos")
  .argument("[args...]", "subcommand and arguments")
  .action(async (args: string[]) => {
    const ctx: CommandContext = { cwd: program.opts().cwd, args };
    await runTodo(ctx);
  });

program
  .command("help")
  .description("Show help")
  .action(async () => {
    await runHelp();
  });

// Default action when no subcommand – simple REPL-like message for now
program.action(async () => {
  const opts = program.opts();
  console.log(chalk.cyan.bold("\n⚡ AgentForge v0.1.0"));
  console.log(chalk.gray("Open source AI coding agent – https://github.com/AdnanRaza88/Agentic_code\n"));

  if (opts.resume) {
    console.log(chalk.yellow("Session resume not yet implemented. Coming in Phase 1.\n"));
  }

  console.log("Available commands:");
  console.log("  agentforge init");
  console.log("  agentforge plan <description>");
  console.log("  agentforge todo [add|list|done|...]");
  console.log("  agentforge help");
  console.log("\nOr use slash style inside a future interactive session: /init, /plan, /todo\n");
});

// Also support slash-style when passed as first argument
const rawArgs = process.argv.slice(2);
if (rawArgs[0]?.startsWith("/")) {
  const cmd = rawArgs[0].slice(1).toLowerCase();
  const rest = rawArgs.slice(1);
  const ctx: CommandContext = {
    cwd: process.cwd(),
    args: rest,
  };

  (async () => {
    switch (cmd) {
      case "init":
        await runInit(ctx);
        break;
      case "plan":
        await runPlan(ctx);
        break;
      case "todo":
        await runTodo(ctx);
        break;
      case "help":
        await runHelp();
        break;
      default:
        // Treat as a free-form message that may contain @mentions
        console.log(chalk.cyan("Processing message with possible @mentions...\n"));
        const { contexts } = await processMentions(rawArgs.join(" "), ctx.cwd);
        if (contexts.length > 0) {
          console.log(chalk.green(`Resolved ${contexts.length} mention(s):\n`));
          for (const c of contexts) {
            console.log(chalk.bold(`@${c.path}`), `(${c.type})`);
            if (c.error) {
              console.log(chalk.red("  Error:"), c.error);
            } else {
              const preview = c.content.slice(0, 300).replace(/\n/g, " ");
              console.log(chalk.gray("  Preview:"), preview + (c.content.length > 300 ? "..." : ""));
            }
            console.log();
          }
        } else {
          console.log(chalk.yellow("No @mentions found. Full chat loop coming soon."));
        }
        break;
    }
  })().catch((err) => {
    console.error(chalk.red("Error:"), err.message);
    process.exit(1);
  });
} else {
  program.parse(process.argv);
}
