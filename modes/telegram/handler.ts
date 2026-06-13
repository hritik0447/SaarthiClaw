import type { Telegraf } from "telegraf";
import { isOwner } from "./auth";
import { WELCOME } from "./constant";

export function registerHandlers(bot: Telegraf){
  bot.on("text", async (ctx) => {
  console.log("MESSAGE:", ctx.message.text);

  await ctx.reply("Received: " + ctx.message.text);
});
}