/**
 * @mention parser
 * Supports: @filename.ts, @src/, @git, @terminal
 */

import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import type { MentionResult } from "../types/index.js";

const MENTION_REGEX = /@([^\s]+)/g;

/**
 * Extract all @mentions from a message
 */
export function extractMentions(text: string): string[] {
  const matches = text.match(MENTION_REGEX) || [];
  return matches.map((m) => m.slice(1)); // remove leading @
}

/**
 * Resolve a single mention into content
 */
export async function resolveMention(
  mention: string,
  cwd: string = process.cwd()
): Promise<MentionResult> {
  const lower = mention.toLowerCase();

  // Special mentions
  if (lower === "git") {
    return resolveGitDiff(cwd);
  }

  if (lower === "terminal") {
    return {
      type: "terminal",
      path: "@terminal",
      content: "[Terminal output capture not yet implemented – coming in Phase 1]",
    };
  }

  const fullPath = path.resolve(cwd, mention);

  try {
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      return resolveFolder(fullPath, mention);
    }

    if (stat.isFile()) {
      const content = await fs.readFile(fullPath, "utf-8");
      return {
        type: "file",
        path: mention,
        content: truncateIfNeeded(content, 8000),
      };
    }
  } catch {
    // Path does not exist – try glob
    try {
      const files = await glob(mention, { cwd, absolute: false, nodir: true });
      if (files.length > 0) {
        const contents: string[] = [];
        for (const f of files.slice(0, 10)) {
          // limit to 10 files
          const p = path.join(cwd, f);
          const c = await fs.readFile(p, "utf-8");
          contents.push(`// File: ${f}\n${truncateIfNeeded(c, 3000)}`);
        }
        return {
          type: "folder",
          path: mention,
          content: contents.join("\n\n---\n\n"),
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    type: "unknown",
    path: mention,
    content: "",
    error: `Could not resolve @${mention}`,
  };
}

async function resolveFolder(dirPath: string, original: string): Promise<MentionResult> {
  const files = await glob("**/*.{ts,tsx,js,jsx,py,md,json,yml,yaml}", {
    cwd: dirPath,
    absolute: false,
    nodir: true,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
  });

  const selected = files.slice(0, 15); // safety limit
  const parts: string[] = [`Folder: ${original} (${files.length} matching files, showing ${selected.length})`];

  for (const f of selected) {
    const full = path.join(dirPath, f);
    try {
      const content = await fs.readFile(full, "utf-8");
      parts.push(`\n// === ${f} ===\n${truncateIfNeeded(content, 2000)}`);
    } catch {
      parts.push(`\n// === ${f} === (unreadable)`);
    }
  }

  return {
    type: "folder",
    path: original,
    content: parts.join("\n"),
  };
}

async function resolveGitDiff(cwd: string): Promise<MentionResult> {
  try {
    const { execSync } = await import("child_process");
    const diff = execSync("git diff --stat && echo '\\n---\\n' && git diff", {
      cwd,
      encoding: "utf-8",
      maxBuffer: 1024 * 1024,
    });
    return {
      type: "git",
      path: "@git",
      content: truncateIfNeeded(diff || "No changes", 12000),
    };
  } catch (err) {
    return {
      type: "git",
      path: "@git",
      content: "",
      error: `git diff failed: ${(err as Error).message}`,
    };
  }
}

function truncateIfNeeded(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + `\n\n... [truncated – ${text.length - max} more characters]`;
}

/**
 * Process a full user message: extract mentions and return enriched context
 */
export async function processMentions(
  message: string,
  cwd: string = process.cwd()
): Promise<{ cleanMessage: string; contexts: MentionResult[] }> {
  const mentions = extractMentions(message);
  const contexts: MentionResult[] = [];

  for (const m of mentions) {
    const result = await resolveMention(m, cwd);
    contexts.push(result);
  }

  // Optional: remove the @mentions from the clean message or keep them
  const cleanMessage = message; // keep original for now

  return { cleanMessage, contexts };
}
