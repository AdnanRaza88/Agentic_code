/**
 * /help command
 */

import chalk from "chalk";

export async function runHelp(): Promise<void> {
  console.log(`
${chalk.bold.cyan("AgentForge")} – Open Source AI Coding Agent
${chalk.gray("Repository: https://github.com/AdnanRaza88/Agentic_code")}

${chalk.bold("Core Commands")}
  ${chalk.green("/init")}          Initialize project memory (.agentforge/, AgentForge.md)
  ${chalk.green("/plan")} <text>   Enter Plan Mode and generate a structured plan
  ${chalk.green("/todo")}          Manage task checklist (add / list / done / start ...)
  ${chalk.green("/help")}          Show this help

${chalk.bold("Coming Soon")}
  /compact       Summarize conversation history
  /resume        Resume a previous session
  /config        Change model & settings
  /permission    Set tool permission (allow | ask | deny)
  /mode          Toggle Plan ↔ Agent mode

${chalk.bold("Mentions")}
  ${chalk.yellow("@filename.ts")}   Add a specific file to context
  ${chalk.yellow("@src/")}          Add a whole folder
  ${chalk.yellow("@git")}           Add current git diff
  ${chalk.yellow("@terminal")}      Add last terminal output (soon)

${chalk.bold("Keyboard (future)")}
  Shift + !      Enter Bash Mode
  Shift + Tab    Toggle Plan / Agent mode

${chalk.gray("Tip: Run /init in any project first to create persistent memory.")}
`);
}
