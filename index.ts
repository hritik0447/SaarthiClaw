#!/usr/bin/env bun

import { Command } from "commander";
import figlet from "figlet";
import { select, isCancel } from "@clack/prompts";
import { exit } from "node:process";
import chalk from "chalk";
import { runCliMode } from "./modes/cli";
import { runTelegramMode } from "./modes/telegram";

console.log("INDEX FILE LOADED");

async function runwakeup() {
  const banner = figlet.textSync("SaarthiClaw");
 console.log(chalk.bold.whiteBright(banner));

  console.log("Before Select");

  const mode = await select({
    message: "Which mode you want to proceed with?",
    options: [
      { value: "cli", label: "CLI" },
      { value: "telegram", label: "Telegram" },
      {  value : "Exit", label: "exit"}
    ]
  });

  console.log("After Select", mode);

  if (isCancel(mode || mode === exit)) {
    console.log(chalk.dim('\n Goodbye!! \n'))
  }

  if (mode === "cli") {
    await runCliMode();
  } else if(mode ===  "telegram") {
    await runTelegramMode()
  }
}

const program = new Command();

program
  .command("wakeup")
  .action(async () => {
    await runwakeup();
  });

await program.parseAsync(process.argv);