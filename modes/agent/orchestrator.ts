import chalk from "chalk";
import { isCancel, text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./ActionTracker";
import { ToolExecutor } from "./tool-execuutor";
import {createAgentTools} from "./agent-tools";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../ai";
import { renderTerminalMarkdown } from "../../tui/terminal-md";
import { runApprovalFlow } from "./approval";

export async function runAgentMode() {
  console.log(chalk.bold('\n 🕵️ Agent Mode \n'))

  const goal = await text({
    message: "What would you want agent to do ?",
    placeholder :  "Concrete task for this code base.."
  });
  if(isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();

  const Tracker = new ActionTracker();

  const executor = new ToolExecutor(Tracker, config)
  const tools = createAgentTools(executor)

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `workspace root: ${config.codebasePath}` ,
      'All mutation are staged untill approval',
    ].join('\n'),
    tools,
  });
  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({toolCalls})=>{
      for(const tc  of toolCalls){
        const preview = JSON.stringify(tc.input).slice(0,160);
        console.log(
          chalk.green('✓'),
          chalk.bold(String(tc.toolName)),
          chalk.dim(preview + (preview.length >= 160 ? "..." : "")),
        )
      }

    }
  });
  if(result.text?.trim()) console.log(renderTerminalMarkdown(result.text));

  //Approval flow

  const ok = await runApprovalFlow(Tracker);

  if(!ok) return  executor.clearStaging()

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