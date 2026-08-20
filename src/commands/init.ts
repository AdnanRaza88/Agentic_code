/**
 * /init command
 * Creates the .agentforge/ project memory structure
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import type { CommandContext } from "../types/index.js";

const AGENTFORGE_DIR = ".agentforge";
const AGENTFORGE_MD = "AgentForge.md";
const SETTINGS_JSON = "settings.json";
const IGNORE_FILE = ".agentforgeignore";

export async function runInit(ctx: CommandContext): Promise<void> {
  const root = ctx.cwd;
  const agentDir = path.join(root, AGENTFORGE_DIR);
  const mdPath = path.join(root, AGENTFORGE_MD);
  const settingsPath = path.join(agentDir, SETTINGS_JSON);
  const ignorePath = path.join(root, IGNORE_FILE);

  console.log(chalk.cyan("\n🚀 Initializing AgentForge project memory...\n"));

  // 1. Create .agentforge/ directory
  await fs.ensureDir(agentDir);
  console.log(chalk.green("✓"), `Created ${AGENTFORGE_DIR}/`);

  // 2. Create default settings.json
  if (!(await fs.pathExists(settingsPath))) {
    const defaultSettings = {
      model: "claude-sonnet-4-20250514",
      permission: "ask",
      rules: [
        "Always prefer TypeScript over JavaScript",
        "Write clear comments for complex logic",
        "Follow existing project code style",
      ],
      alwaysUseTypeScript: true,
    };
    await fs.writeJson(settingsPath, defaultSettings, { spaces: 2 });
    console.log(chalk.green("✓"), `Created ${AGENTFORGE_DIR}/${SETTINGS_JSON}`);
  } else {
    console.log(chalk.yellow("•"), `${SETTINGS_JSON} already exists – skipped`);
  }

  // 3. Create AgentForge.md if missing
  if (!(await fs.pathExists(mdPath))) {
    const projectName = path.basename(root);
    const content = generateAgentForgeMd(projectName, root);
    await fs.writeFile(mdPath, content, "utf-8");
    console.log(chalk.green("✓"), `Created ${AGENTFORGE_MD}`);
  } else {
    console.log(chalk.yellow("•"), `${AGENTFORGE_MD} already exists – skipped`);
  }

  // 4. Create .agentforgeignore if missing
  if (!(await fs.pathExists(ignorePath))) {
    const ignoreContent = `# AgentForge ignore – same syntax as .gitignore
node_modules/
dist/
build/
.git/
*.log
.env
.env.*
coverage/
.DS_Store
`;
    await fs.writeFile(ignorePath, ignoreContent, "utf-8");
    console.log(chalk.green("✓"), `Created ${IGNORE_FILE}`);
  } else {
    console.log(chalk.yellow("•"), `${IGNORE_FILE} already exists – skipped`);
  }

  // 5. Create skills folder placeholder
  const skillsDir = path.join(agentDir, "skills");
  await fs.ensureDir(skillsDir);
  const readmeSkills = path.join(skillsDir, "README.md");
  if (!(await fs.pathExists(readmeSkills))) {
    await fs.writeFile(
      readmeSkills,
      `# Project Skills\n\nPlace \`skill.md\` files here.\nEach skill teaches AgentForge domain-specific knowledge.\n`,
      "utf-8"
    );
  }
  console.log(chalk.green("✓"), `Created ${AGENTFORGE_DIR}/skills/`);

  console.log(chalk.cyan("\n✨ AgentForge initialized successfully!\n"));
  console.log("Next steps:");
  console.log("  • Edit", chalk.bold("AgentForge.md"), "to describe your architecture & rules");
  console.log("  • Adjust", chalk.bold(".agentforge/settings.json"), "for model & permissions");
  console.log("  • Run", chalk.bold("/plan"), "or start chatting with the agent\n");
}

function generateAgentForgeMd(projectName: string, root: string): string {
  return `# AgentForge Memory – ${projectName}

> This file is the project brain for AgentForge.
> It is shared via git. Keep it up to date.

## Project Overview
- **Name**: ${projectName}
- **Root**: ${root}
- **Initialized**: ${new Date().toISOString().split("T")[0]}

## Architecture
(Describe high-level architecture here)

## Code Style
- Prefer TypeScript
- Use meaningful variable names
- Keep functions small and focused

## Key Libraries
(List important libraries and why they are used)

## Common Commands
\`\`\`bash
# Examples
npm run dev
npm run build
npm test
\`\`\`

## Rules for the Agent
1. Always ask before destructive actions (unless permission is set to allow)
2. Follow existing patterns in the codebase
3. Prefer editing existing files over creating new ones when possible
4. Write tests for critical logic

## Notes
(Any additional context the agent should always remember)
`;
}
