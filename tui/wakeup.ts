/*import { select, isCancel } from "@clack/prompts";
import figlet from "figlet";

export async function runwakeup() {
  const banner = figlet.textSync("SaarthiClaw");

  console.log(banner);

  const mode = await select({
    message: "Which mode you want to proceed with?",
    options: [
      {
        value: "cli",
        label: "CLI",
      },
      {
        value: "telegram",
        label: "Telegram",
      },
    ],
  });

  if (isCancel(mode)) {
    process.exit(0);
  }

  console.log("Selected:", mode);

  if (mode === "cli") {
    console.log("Starting CLI mode...");
  } else {
    console.log("Starting Telegram mode...");
  }
}*/