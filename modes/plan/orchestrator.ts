import chalk, { Chalk } from "chalk";
import {confirm, isCancel, select, text} from '@clack/prompts';
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { getAgentModel } from "../../ai";
import { ActionTracker } from "../agent/ActionTracker";
import { ToolExecutor } from "../agent/tool-execuutor";
import { defaultAgentConfig } from "../agent/types";
import { renderTerminalMarkdown } from "../../tui/terminal-md";
import { runApprovalFlow } from "../agent/approval";
import { createAgentTools } from "../agent/agent-tools";
import { generatePlan } from "./planner";
import { printPlan, selectSteps } from "./selection";
import type { PlanStep } from "./types";
import { createWebTools } from "./web-tools";

function stepPrompt(goal: string, step: PlanStep): string {
  return [
    `Goal: ${goal}`,
    `Step: ${step.title}`,
    step.description,
  ].join('\n');
}

export async  function runPlanMode():Promise<void>{
  console.log(chalk.bold('\n ✍🏻 Plan Mode\n'));


  const goal =  await text({message: "What is your goal?"})
  if(isCancel(goal) || !goal.trim()) return;

  const  plan =  await generatePlan(goal);
  printPlan(plan)

  const selected = await selectSteps(plan);
  if(selected.length === 0) return;

  const proceed = await confirm({
    message: 'Execute ${selected.length} step(s)',
    initialValue: true
  });
  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor =  new ToolExecutor(tracker, config);
//Todo : add web tools

  const tools = {
    ...createAgentTools(executor),
    ...createWebTools(tracker)
  };
  for(const step of selected){
   console.log(chalk.bold(`\n 🛠️ ${step.title} \n`))

    const agent = new ToolLoopAgent({
  model: getAgentModel(),
  stopWhen: stepCountIs(30),
  tools,
});
  const r = await agent.generate({prompt:stepPrompt(plan.goal, step)})
  if(r.text) return console.log(renderTerminalMarkdown(r.text))
  }
const ok = await runApprovalFlow(tracker);
if(!ok) return executor.clearStaging();

 const {errors} = executor.applyApprovedFromTracker();
    if(errors.length){
      console.log(chalk.red('Some operations reported errors'));
      for (const e of errors) console.log(chalk.red(` • ${e}`));
    }
    else{
      console.log(chalk.green('\n ✓ Applied\n'))
    }
    executor.clearStaging();

} 