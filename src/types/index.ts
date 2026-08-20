/**
 * Core types for AgentForge
 */

export type PermissionLevel = "allow" | "ask" | "deny";

export type AgentMode = "plan" | "agent";

export type TodoStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  timestamp?: string;
}

export interface Session {
  id: string;
  name: string;
  messages: Message[];
  mode: AgentMode;
  model: string;
  createdAt: string;
  updatedAt: string;
  projectPath?: string;
}

export interface TodoItem {
  id: string;
  content: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AgentForgeSettings {
  model?: string;
  permission?: PermissionLevel;
  alwaysUseTypeScript?: boolean;
  rules?: string[];
  [key: string]: unknown;
}

export interface ProjectMemory {
  architecture?: string;
  codeStyle?: string;
  libraries?: string[];
  commands?: string[];
  rules?: string[];
  context?: string;
}

export interface MentionResult {
  type: "file" | "folder" | "git" | "terminal" | "unknown";
  path: string;
  content: string;
  error?: string;
}

export interface CommandContext {
  cwd: string;
  args: string[];
  session?: Session;
  settings?: AgentForgeSettings;
}
