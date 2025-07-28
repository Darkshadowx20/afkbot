// src/afk.ts
import { Bot } from 'mineflayer';

export function setupAfk(bot: Bot) {
  setInterval(() => {
    if (bot.entity && bot.entity.onGround) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 30000);
} 