import {Context, Telegraf} from 'telegraf';
import chalk, { Chalk } from 'chalk';
import { WELCOME } from './constant';
import type { Update } from '@telegraf/types';
import { registerHandlers } from './handler';

export async function runTelegramMode() {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_BOT_ID;
  
   const bot = new Telegraf(token!);
   registerHandlers(bot)

   await bot.telegram.sendMessage(ownerId!, WELCOME, {parse_mode: "Markdown"})
   console.log(chalk.green('Sent welcome message to Telegraram.\n'))

   bot.launch();
    console.log(chalk.green('Telegram bot start to run. Press ctrl+C to  stop\n'));

    await new Promise<void>((resolve) => {
  const stop = () => {
    bot.stop("SIGINT");
    resolve();
  };

  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
});
   
}

function registerHandler(bot: Telegraf<Context<Update>>) {
  throw new Error('Function not implemented.');
}
