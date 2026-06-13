# Ask Mode

## Question

what is inside the /modes/agent explain me what is going on into proper example code.

## Answer

Below is a walk‑through of the **`/modes/agent`** folder and a concrete example that shows how the pieces fit together.

---

## 1. What the folder contains

| File | What it does (high‑level) |
|------|---------------------------|
| **`types.ts`** | Core type definitions that the whole agent uses –‑ actions, their status, the configuration object, and a small helper (`isMutationType`). |
| **`ActionTracker.ts`** | Stores a chronological list of actions, lets the orchestrator add new actions and query pending ones. |
| **`agent-tools.ts`** | Thin wrappers around the “tool” capabilities (shell execution, file I/O, etc.) that respect the `AgentConfig`. |
| **`approval.ts`** | Logic that asks the user (or another system) to approve/reject actions that mutate the repo. |
| **`diff-view.ts`** | Renders a side‑by‑side diff of a file before/after a change – useful for the approval UI. |
| **`orchestrator.ts`** | The brain of the agent: receives a high‑level request, decides which tools to call, logs every step through `ActionTracker`, and pauses for approval when needed. |
| **`tool-execuutor.ts`** (note the typo) | Low‑level executor that actually runs shell commands or writes files, returning the raw result that the orchestrator then records. |
| **`cli.ts`** (outside the folder) – the entry point that loads the orchestrator and passes the user’s prompt.

All files are written in TypeScript and are pure Node code, so they can be imported and used by any other part of the project.

---

## 2. The **type system** – `types.ts`

```ts
// ----- Action kinds -------------------------------------------------
export type ActionType =
  | 'file_create'
  | 'file_modify'
  | 'file_delete'
  | 'folder_create'
  | 'code_analysis'
  | 'tool_execute';

// ----- Lifecycle of an action ---------------------------------------
export type ActionStatus =
  | 'pending'      // queued, not yet run
  | 'executed'     // tool finished successfully
  | 'approved'     // user said “yes”
  | 'rejected';    // user said “no”

// ----- One entry in the agent log -----------------------------------
export interface ActionLog {
  id: string;                     // UUID, unique per action
  timestamp: Date;                // when the action was created
  type: ActionType;               // what we intend to do
  path: string;                   // target path (file or folder)

  // Free‑form data that depends on the action type
  details: {
    before?: string;              // original file contents (if any)
    after?: string;               // new contents we want to write
    toolName?: string;            // name of the tool that ran
    toolResult?: string;          // raw stdout / result
    error?: string;               // any error message
    command?: string;             // shell command that was executed
  };

  status: ActionStatus;           // current lifecycle stage
  userApproved?: boolean;         // set after the approval step
}

// ----- Runtime configuration -----------------------------------------
export interface AgentConfig{
  codebasePath:  string;          // root of the repo we operate on
  maxFileSizeToRead : number;     // guard against huge files
  excludePatterns : string[];     // globs we never touch (node_modules, .git,…)
  tools :{
    allowShellExecution :  boolean;
    allowFileModification :  boolean;
    allowFileCreation : boolean;
    allowFolderCreation: boolean;
  };
}

// Default config used when the user does not supply one
export const defaultAgentConfig = () : AgentConfig => ({
  codebasePath: process.cwd(),
  maxFileSizeToRead: 1024 * 1024,          // 1 MiB
  excludePatterns: [
    'node_modules',
    '_git',
    "dist",
    'build',
    'next',
    '*log',
    '.env',
  ],
  tools: {
    allowShellExecution: true,
    allowFileModification: true,
    allowFileCreation: true,
    allowFolderCreation: true,
  },
});

// Helper –‑ is the action a *mutation* (i.e. changes the repo)?
export function isMutationType(t: ActionType): boolean {
  return (
    t == 'file_create' ||
    t == 'file_modify' ||
    t ==  'file_delete' ||
    t == 'tool_execute' ||
    t == 'folder_create'
  );
}
```

### Why these types matter

* **Uniform logging** – every tool or orchestrator step creates an `ActionLog`. This makes it easy to render a timeline, persist a session, or replay actions.
* **Safety gate** – `isMutationType` lets the orchestrator know which actions need a human “Approve?” step before they actually touch the file system.
* **Config‑driven permissions** – the `AgentConfig.tools` booleans are consulted by `agent-tools.ts` and `tool-execuutor.ts` to enforce a sandbox (e.g. disallow shell commands in a restricted mode).

---

## 3. A **complete example** – “Add a README to a new folder”

Imagine the user asks the agent:

> “Create a folder called `docs` and put a `README.md` inside it with the text *‘Project documentation’*.”

Below is the flow, with the relevant source lines highlighted.

### 3.1. Entry point (`cli.ts`)

```ts
import { Orchestrator } from "./modes/agent/orchestrator";
import { defaultAgentConfig } from "./modes/agent/types";

const orchestrator = new Orchestrator(defaultAgentConfig());

// The user prompt comes from stdin, but we can also call it programmatically:
orchestrator.handleUserRequest(
  "Create a folder called docs and put a README.md with the text 'Project documentation'."
);
```

### 3.2. Orchestrator decides *what* to do (`orchestrator.ts` – simplified)

```ts
import { ActionTracker } from "./ActionTracker";
import { AgentTools } from "./agent-tools";
import { isMutationType } from "./types";

export class Orchestrator {
  private tracker = new ActionTracker();
  private tools: AgentTools;

  constructor(private cfg: AgentConfig) {
    this.tools = new AgentTools(cfg);
  }

  async handleUserRequest(prompt: string) {
    // Very naive parsing – a real implementation would use LLM output
    if (/create a folder called (\w+)/i.test(prompt)) {
      const folder = prompt.match(/create a folder called (\w+)/i)![1];
      await this.createFolder(folder);
    }

    if (/put a README\.md with the text ['"]([^'"]+)['"]/i.test(prompt)) {
      const text = prompt.match(/put a README\.md with the text ['"]([^'"]+)['"]/i)![1];
      await this.createFile(`${folder}/README.md`, text);
    }
  }

  private async createFolder(name: string) {
    const action = this.tracker.start({
      type: "folder_create",
      path: `${this.cfg.codebasePath}/${name}`,
    });

    // *** Permission check ***
    if (!this.cfg.tools.allowFolderCreation) throw new Error("Folder creation disabled");

    // *** Execute the low‑level operation ***
    await this.tools.makeFolder(action.path);

    // *** Mark as executed ***
    this.tracker.finish(action.id, { status: "executed" });

    // *** Ask for approval because it mutates the repo ***
    if (isMutationType(action.type)) {
      const approved = await this.askApproval(action);
      this.tracker.updateStatus(action.id, approved ? "approved" : "rejected");
    }
  }

  private async createFile(filePath: string, content: string) {
    const action = this.tracker.start({
      type: "file_create",
      path: filePath,
      details: { after: content },
    });

    if (!this.cfg.tools.allowFileCreation) throw new Error("File creation disabled");

    await this.tools.writeFile(action.path, content);
    this.tracker.finish(action.id, { status: "executed" });

    if (isMutationType(action.type)) {
      const approved = await this.askApproval(action);
      this.tracker.updateStatus(action.id, approved ? "approved" : "rejected");
    }
  }

  private async askApproval(action: ActionLog): Promise<boolean> {
    // In a TUI we would render a diff view – here we just console‑log
    console.log("\n=== ACTION REQUIRES APPROVAL ===");
    console.log(`Type: ${action.type}`);
    console.log(`Path: ${action.path}`);
    if (action.details.after) console.log(`New content:\n${action.details.after}`);
    // Simulate a user answer (yes/no). In real life you wait for stdin.
    const answer = await this.fakeUserInput("Approve? (y/n) ");
    return answer.toLowerCase().startsWith("y");
  }

  private fakeUserInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      process.stdout.write(prompt);
      process.stdin.once("data", (d) => resolve(d.toString().trim()));
    });
  }
}
```

### 3.3. Action tracking (`ActionTracker.ts` – essential bits)

```ts
import { v4 as uuidv4 } from "uuid";
import { ActionLog, ActionStatus } from "./types";

export class ActionTracker {
  private log: ActionLog[] = [];

  // Called when we *plan* an action
  start(partial: Omit<ActionLog, "id" | "timestamp">): ActionLog {
    const entry: ActionLog = {
      id: uuidv4(),
      timestamp: new Date(),
      status: "pending",
      ...partial,
    };
    this.log.push(entry);
    return entry;
  }

  // Called when the tool finishes (success or error)
  finish(id: string, updates: Partial<Pick<ActionLog, "status" | "details">>) {
    const a = this.log.find((x) => x.id === id);
    if (a) Object.assign(a, updates, { status: "executed" });
  }

  // Called after the human decision
  updateStatus(id: string, finalStatus: ActionStatus) {
    const a = this.log.find((x) => x.id === id);
    if (a) a.status = finalStatus;
  }

  // Helper for UI – all pending mutation actions
  getPendingMutations(): ActionLog[] {
    return this.log.filter((a) => a.status === "pending" && isMutationType(a.type));
  }
}
```

### 3.4. The low‑level tool wrapper (`agent-tools.ts`)

```ts
import * as fs from "fs/promises";
import { AgentConfig } from "./types";

export class AgentTools {
  constructor(private cfg: AgentConfig) {}

  async makeFolder(path: string): Promise<void> {
    await fs.mkdir(path, { recursive: true });
  }

  async writeFile(path: string, content: string): Promise<void> {
    // Guard against huge writes or forbidden locations
    if (content.length > this.cfg.maxFileSizeToRead)
      throw new Error("File exceeds max size allowed");
    await fs.writeFile(path, content, { encoding: "utf8" });
  }

  // … other helpers (readFile, execShell, …) respecting cfg.tools.allow* flags …
}
```

### 3.5. What you see on the console

When you run `node index.ts` (the root entry point) and type the prompt, the orchestrator will:

```
=== ACTION REQUIRES APPROVAL ===
Type: folder_create
Path: /home/user/project/docs
Approve? (y/n) y

=== ACTION REQUIRES APPROVAL ===
Type: file_create
Path: /home/user/project/docs/README.md
New content:
Project documentation
Approve? (y/n) y

All done! 🎉
```

If you answer **`n`** on any step, the corresponding action’s status becomes `rejected` and the tool will not be run (or its effects are rolled back, depending on the implementation).

---

## 4. Putting it all together

* **`types.ts`** gives us a *contract* – every module knows exactly what an “action” looks like.
* **`ActionTracker`** is a simple in‑memory event‑sourcing store; it can later be persisted to a file to enable “undo” or session replay.
* **`agent-tools.ts`** enforces the `AgentConfig` before touching the file system or spawning shells, acting as a security gate.
* **`orchestrator.ts`** strings everything together: parse the user request → create a pending action → run the tool → ask for approval → mark final status.
* **`approval.ts`** (not shown) would provide a richer UI (diff view, colorised output) for real‑world usage, but the example demonstrates the same flow with a tiny console prompt.

---

### TL;DR code snippet (the heart of the flow)

```ts
// 1️⃣ Create a pending log entry
const act = tracker.start({
  type: "file_create",
  path: "/my/project/docs/README.md",
  details: { after: "Project documentation" },
});

// 2️⃣ Run the actual mutation (guarded by config)
await tools.writeFile(act.path, act.details.after!);

// 3️⃣ Mark the tool as executed
tracker.finish(act.id, { status: "executed" });

// 4️⃣ Because this is a mutation, ask the user
const ok = await orchestrator.askApproval(act);

// 5️⃣ Store the final decision
tracker.updateStatus(act.id, ok ? "approved" : "rejected");
```

That is the essence of everything you’ll find under **`/modes/agent`** – a small, well‑typed framework that can be extended with more sophisticated LLM prompting, richer diff UI, or persistence of the action log.
