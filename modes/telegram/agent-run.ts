import {tool, ToolLoopAgent, stepCountIs} from 'ai';
import {z} from 'zod';
import { getAgentModel } from '../../ai';
import { ActionTracker } from '../agent/ActionTracker';
import { ToolExecutor } from '../agent/tool-execuutor';
import { createAgentTools } from '../agent/agent-tools';
import { defaultAgentConfig, type AgentConfig } from '../agent/types';
import { createWebTools } from '../plan/web-tools';
import type { Plan, PlanStep } from '../plan/types';
import { finishOrApprove } from './approval-session';

function readOnlyConfig(): AgentConfig {

  const c = defaultAgentConfig();

  c.tools.allowFileCreation = false;
  c.tools.allowFileModification = false;
  c.tools.allowFolderCreation = false;
  c.tools.allowShellExecution = false;

  return c;
}

function agentOptions(config: AgentConfig, maxSteps :  number){
  return{
    model : getAgentModel(),
    stopWhen: stepCountIs(maxSteps),
    instructions : `Workspace root: ${config.codebasePath}`,

  }
}

function createReadOnlyTools(executor: ToolExecutor){
  return{
    read_file: tool({
      description: "Read a text file from the workspace. Use a  path relative to the project.",
      inputSchema: z.object({
        path: z.string().describe("Relative file path")
      }),
      execute: async ({ path: p }: { path: string }) =>
  executor.readFile(p),
    }),
    list_files: tool({
  description: "List files and directories under a path.",
  inputSchema: z.object({
    path: z.string(),
    recursive: z.boolean().optional().default(false),
  }),
  execute: async ({ path: p, recursive }) =>
    executor.listFiles(p, recursive),
}),

search_files: tool({
  description:
    "Find files matching a glob pattern (e.g. '*.ts', '**/*.md'). Optional content substring filter.",
  inputSchema: z.object({
    root: z.string().describe("Directory to search, relative to root"),
    pattern: z
      .string()
      .describe("Glob-like pattern using * and ** (forward slashes)"),
    content_contains: z.string().optional(),
  }),
  execute: async ({ root, pattern, content_contains }) =>
    executor.searchFiles(root, pattern, content_contains),
}),
  analyze_codebase: tool({
  description:
    "Summarize structure: file counts, size, extensions. Read-only.",
  inputSchema: z.object({
    path: z.string().default("."),
  }),
  execute: async ({ path: p }) => executor.analyzeCodebase(p),
}),
  }
}

function extraWebTools(tracker:  ActionTracker){
  return process.env.FIRECRAWL_API_KEY ? createWebTools(tracker) : {};
}

export async function runAsk(ctx:{reply:(t:string, o? : object)=> Promise<unknown>}, question:string){
  const config = readOnlyConfig();
const tracker = new ActionTracker();
const executor = new ToolExecutor(tracker, config);
const tools = {
  ...createReadOnlyTools(executor),
  ...extraWebTools(tracker),
};
const agent = new ToolLoopAgent({
  ...agentOptions(config, 20),
  tools,
});
const {text} = await agent.generate({prompt: question});
await replyMd(ctx, text || ("no answer"))
}


function replyMd(ctx: { reply: (t: string, o?: object) => Promise<unknown>; }, arg1: string) {
  throw new Error('Function not implemented.');
}

export async function runAgent(
  ctx: { reply: (t: string, o?: object) => Promise<unknown> },
  chatId: number,
  goal: string
) {
  const config = defaultAgentConfig();

  const tracker = new ActionTracker();

  const executor = new ToolExecutor(tracker, config);

  const tools = createAgentTools(executor);

  const agent = new ToolLoopAgent({
    ...agentOptions(config, 40),
    tools,
  });

  const { text } = await agent.generate({ prompt: goal });

  if (text?.trim()) {
    await replyMd(ctx, text.trim());
    await finishOrApprove( ctx, chatId,tracker,executor, "✅ Done. No file changes were needed." )
  }
}
export async function runPlanSteps(
  ctx: { reply: (t: string, o?: object) => Promise<unknown> },
  chatId: number,
  plan: Plan,
  steps: PlanStep[],
) {
  const config = defaultAgentConfig();

  const tracker = new ActionTracker();

  const executor = new ToolExecutor(tracker, config);

  const tools = {
    ...createAgentTools(executor),
    ...extraWebTools(tracker),
  };

  for (const step of steps) {
    await ctx.reply(
      `🔨 Executing: *${step.title}*`,
      { parse_mode: 'Markdown' },
    );

    const prompt = [
      `Goal: ${plan.goal}`,
      `Step: ${step.title}`,
      step.description,
    ].join('\n');

    const agent = new ToolLoopAgent({
      ...agentOptions(config, 30),
      tools,
    });

    const { text } = await agent.generate({ prompt });

    if (text?.trim())  await replyMd(ctx, text.trim()); 
  }
  await finishOrApprove( ctx, chatId,tracker,executor, "✅ Done. No file changes were needed." );
}
