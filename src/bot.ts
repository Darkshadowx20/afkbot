import mineflayer, { Bot } from 'mineflayer';
import { BotConfig } from './config';
import { setupAfk } from './afk';
import { setupAutoEat } from './autoeat';
import { TelegramService } from './telegram';

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

  // Initialize Telegram service if configured
  let telegramService: TelegramService | undefined;
  if (config.telegram) {
    try {
      telegramService = new TelegramService(config.telegram);
      telegramService.setMinecraftBot(bot);
      telegramService.start();
    } catch (error) {
      // console.error('[Bot] Failed to initialize Telegram service:', error);
    }
  }

  bot.on('login', () => {
    // console.log(`[Bot] Logged in as ${bot.username}`);
    bot.chat('/register password password'); // For cracked servers, may need to register
    bot.chat('/login password'); // For cracked servers, may need to login
    
    // Notify Telegram about successful login
    if (telegramService) {
      telegramService.sendMinecraftLog('info', `Bot logged in as ${bot.username}`);
    }
  });

  bot.on('end', () => {
    // console.log('[Bot] Disconnected, reconnecting in 5s...');
    
    // Notify Telegram about disconnect
    if (telegramService) {
      telegramService.sendMinecraftLog('info', 'Bot disconnected, reconnecting in 5s...');
    }
    
    setTimeout(() => createBot(config), 5000);
  });

  bot.on('error', (err) => {
    // console.error('[Bot] Error:', err);
    
    // Notify Telegram about error
    if (telegramService) {
      telegramService.sendMinecraftLog('info', `Bot error: ${err.message}`);
    }
  });

  // Listen for chat messages and forward to Telegram
  bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Don't log our own messages
    
    // console.log(`[MC Chat] ${username}: ${message}`);
    
    if (telegramService) {
      telegramService.sendMinecraftLog('chat', `${username}: ${message}`);
    }
  });

  // Listen for player join/leave events
  bot.on('playerJoined', (player) => {
    // console.log(`[MC] ${player.username} joined the game`);
    
    if (telegramService) {
      telegramService.sendMinecraftLog('join', `${player.username} joined the game`);
    }
  });

  bot.on('playerLeft', (player) => {
    // console.log(`[MC] ${player.username} left the game`);
    
    if (telegramService) {
      telegramService.sendMinecraftLog('leave', `${player.username} left the game`);
    }
  });

  // Listen for death messages
  bot.on('death', () => {
    // console.log('[MC] Bot died!');
    
    if (telegramService) {
      telegramService.sendMinecraftLog('death', 'Bot died!');
    }
  });

  // Listen for kicked events
  bot.on('kicked', (reason) => {
    // console.log(`[MC] Bot was kicked: ${reason}`);
    
    if (telegramService) {
      telegramService.sendMinecraftLog('info', `Bot was kicked: ${reason}`);
    }
  });

  // Enable AFK functionality (auto-jump every 30 seconds to prevent being kicked for inactivity)
  setupAfk(bot);
  
  // Enable auto-eat functionality (automatically eat food when hunger is low)
  setupAutoEat(bot);
  
  return bot;
} 