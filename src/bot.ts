import mineflayer, { Bot } from 'mineflayer';
import { BotConfig } from './config';
import { setupAfk } from './afk';

export function createBot(config: BotConfig): Bot {
  const options: any = {
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    auth: config.auth,
  };
  if (config.version) options.version = config.version;
  const bot: Bot = mineflayer.createBot(options);

  bot.on('login', () => {
    console.log(`[Bot] Logged in as ${bot.username}`);
    bot.chat('/register password password'); // For cracked servers, may need to register
    bot.chat('/login password'); // For cracked servers, may need to login
  });

  bot.on('end', () => {
    console.log('[Bot] Disconnected, reconnecting in 5s...');
    setTimeout(() => createBot(config), 5000);
  });

  bot.on('error', (err) => {
    console.error('[Bot] Error:', err);
  });

  setupAfk(bot);
  return bot;
} 