/**
 * /plan command
 * Forces the agent into Plan Mode – AI only produces a plan, no code execution
 */

import chalk from "chalk";
import type { CommandContext } from "../types/index.js";

export async function runPlan(ctx: CommandContext): Promise<void> {
  const args = ctx.args.join(" ").trim();

  console.log(chalk.magenta("\n📋 Plan Mode activated\n"));

  if (!args) {
    console.log(
      chalk.yellow(
        "Usage: /plan <what you want planned>\n\nExample:\n  /plan Refactor the authentication module to use JWT + refresh tokens"
      )
    );
    console.log(
      chalk.gray(
        "\nIn Plan Mode the agent will only produce a structured plan.\nNo files will be written and no commands will be executed.\n"
      )
    );
    return;
  }

  // For now we print a structured plan template.
  // Later this will call the LLM with plan-mode system prompt.
  console.log(chalk.bold("Requested Plan:"), args);
  console.log(chalk.gray("─".repeat(60)));

  console.log(`
${chalk.cyan("1. Understanding")}
   - Analyze current codebase related to: "${args}"
   - Identify affected modules and dependencies

${chalk.cyan("2. High-level Approach")}
   - (LLM will fill this in once providers are wired)

${chalk.cyan("3. Detailed Steps")}
   - [ ] Step 1
   - [ ] Step 2
   - [ ] Step 3

${chalk.cyan("4. Risks & Considerations")}
   - ...

${chalk.cyan("5. Success Criteria")}
   - ...
`);

  console.log(chalk.gray("─".repeat(60)));
  console.log(
    chalk.yellow(
      "\n⚠️  This is a stub. Full LLM-powered planning will be available after provider integration.\n"
    )
  );
  console.log(
    chalk.green(
      "Tip: Switch to Agent Mode later with Shift+Tab (or /mode agent) to execute the plan.\n"
    )
  );
}
