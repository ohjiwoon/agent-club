import fs from "fs";
import path from "path";

const agentsPath = path.join(process.cwd(), "data", "agents.json");
const filesPath  = path.join(process.cwd(), "data", "files.json");

export interface Agent {
  id: string;
  name: string;
  team: string;
  level: "팀장" | "팀원";       // 조직 계층
  reportsTo: string;            // 보고 대상 (에이전트 이름 또는 "CEO")
  status: "active" | "idle" | "offline";
  description: string;
  capabilities: string[];
  gradient: string;
  icon: string;
  registeredAt: string;
}

export interface FileRecord {
  id: string;
  name: string;
  content: string;
  agentId: string;
  agentName: string;
  team: string;
  type: "md" | "txt" | "other";
  createdAt: string;
}

export function readAgents(): Agent[] {
  try {
    return JSON.parse(fs.readFileSync(agentsPath, "utf-8"));
  } catch {
    return [];
  }
}

export function writeAgents(agents: Agent[]) {
  fs.writeFileSync(agentsPath, JSON.stringify(agents, null, 2));
}

export function readFiles(): FileRecord[] {
  try {
    return JSON.parse(fs.readFileSync(filesPath, "utf-8"));
  } catch {
    return [];
  }
}

export function writeFiles(files: FileRecord[]) {
  fs.writeFileSync(filesPath, JSON.stringify(files, null, 2));
}
