/**
 * /todo command + simple in-memory TodoWrite
 * Later this will be persisted per session / project
 */

import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import type { CommandContext, TodoItem, TodoStatus } from "../types/index.js";

// Simple in-memory store for Phase 0
// Will be replaced by SessionService / file persistence
const todos: TodoItem[] = [];

export async function runTodo(ctx: CommandContext): Promise<void> {
  const [subcommand, ...rest] = ctx.args;
  const text = rest.join(" ").trim();

  switch ((subcommand || "list").toLowerCase()) {
    case "add":
    case "create":
      if (!text) {
        console.log(chalk.yellow("Usage: /todo add <task description>"));
        return;
      }
      addTodo(text);
      break;

    case "list":
    case "ls":
    case "show":
      listTodos();
      break;

    case "done":
    case "complete":
      if (!text) {
        console.log(chalk.yellow("Usage: /todo done <id or part of content>"));
        return;
      }
      updateStatus(text, "completed");
      break;

    case "start":
    case "progress":
      if (!text) {
        console.log(chalk.yellow("Usage: /todo start <id or part of content>"));
        return;
      }
      updateStatus(text, "in_progress");
      break;

    case "cancel":
      if (!text) {
        console.log(chalk.yellow("Usage: /todo cancel <id or part of content>"));
        return;
      }
      updateStatus(text, "cancelled");
      break;

    case "clear":
      todos.length = 0;
      console.log(chalk.green("✓ All todos cleared"));
      break;

    case "help":
    default:
      printHelp();
      if (subcommand && subcommand !== "help") {
        // treat the whole thing as a new todo if it doesn't match a subcommand
        addTodo([subcommand, ...rest].join(" "));
      }
      break;
  }
}

function addTodo(content: string): void {
  const item: TodoItem = {
    id: uuidv4().slice(0, 8),
    content,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  todos.push(item);
  console.log(chalk.green("✓"), `Added todo [${item.id}]: ${content}`);
  listTodos();
}

function listTodos(): void {
  if (todos.length === 0) {
    console.log(chalk.gray("\nNo todos yet. Use /todo add <task>\n"));
    return;
  }

  console.log(chalk.cyan("\n📝 Current Todos\n"));
  for (const t of todos) {
    const icon =
      t.status === "completed"
        ? chalk.green("✔")
        : t.status === "in_progress"
          ? chalk.yellow("►")
          : t.status === "cancelled"
            ? chalk.red("✖")
            : chalk.gray("○");

    const statusColor =
      t.status === "completed"
        ? chalk.green
        : t.status === "in_progress"
          ? chalk.yellow
          : t.status === "cancelled"
            ? chalk.red
            : chalk.white;

    console.log(`  ${icon} [${t.id}] ${statusColor(t.content)} ${chalk.gray(`(${t.status})`)}`);
  }
  console.log();
}

function updateStatus(query: string, status: TodoStatus): void {
  const q = query.toLowerCase();
  const item = todos.find(
    (t) => t.id === query || t.content.toLowerCase().includes(q)
  );

  if (!item) {
    console.log(chalk.red(`No todo found matching "${query}"`));
    return;
  }

  item.status = status;
  item.updatedAt = new Date().toISOString();
  console.log(chalk.green("✓"), `Updated [${item.id}] → ${status}`);
  listTodos();
}

function printHelp(): void {
  console.log(`
${chalk.bold(" /todo ")} – Task management for the agent

  /todo add <text>       Add a new todo
  /todo list             Show all todos
  /todo start <id|text>  Mark as in_progress
  /todo done <id|text>   Mark as completed
  /todo cancel <id|text> Mark as cancelled
  /todo clear            Remove all todos
  /todo help             Show this help
`);
}

/** Exported for the future TodoWrite tool used by the agent */
export function getTodos(): TodoItem[] {
  return [...todos];
}

export function setTodoStatus(id: string, status: TodoStatus): boolean {
  const item = todos.find((t) => t.id === id);
  if (!item) return false;
  item.status = status;
  item.updatedAt = new Date().toISOString();
  return true;
}
