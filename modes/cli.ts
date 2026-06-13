import chalk from "chalk";
import {select, isCancel} from '@clack/prompts';
import { Agent } from "node:http";
import { runAgentMode } from "./agent/orchestrator";
import { runAskMode } from "./ask/orchestrator";
import { runPlanMode } from "./plan/orchestrator";


export async function runCliMode() {
  while(true){
    const mode = await select({
      message: "Choose CLI Sub-mode",
      options :  [
        {value: "agent", label : "Agent-mode" },
        {value :  "Plan", label : "Plan-mode"},
        {value: "Ask", label : "Ask-mode"},
        {value: "Back" , label : "Go back to main view"},
      ],
    });

    if(isCancel(mode) || mode === "Back") return

    if(mode === "Ask"){
      await runAskMode()
    }
    if(mode ===  "Plan"){
      await runPlanMode()
    }
    if(mode === "agent"){
      await runAgentMode()
    }

    if (mode !== "agent" && mode !== "Plan" && mode !== "Ask") {
  console.log(chalk.yellow("\nThat mode is not implemented yet.\n"));
}
  }
  
}