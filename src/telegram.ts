import { Bot as TelegramBot } from 'grammy';
import { Bot as MinecraftBot } from 'mineflayer';
import { BotConfig } from './config';

export class TelegramService {
  private telegramBot: TelegramBot;
  private chatId: string;
  private minecraftBot?: MinecraftBot;

  constructor(config: BotConfig['telegram']) {
    if (!config) {
      throw new Error('Telegram configuration is required');
    }

    this.telegramBot = new TelegramBot(config.botToken);
    this.chatId = config.chatId;

    this.setupTelegramHandlers();
  }

  private setupTelegramHandlers() {
    // Handle messages that are replies to the bot
    this.telegramBot.on('message:text', async (ctx) => {
      // Only process messages in the configured chat
      if (ctx.chat.id.toString() !== this.chatId) {
        return;
      }

      // Check if the message is a reply to the bot
      if (ctx.message.reply_to_message?.from?.id === ctx.me.id) {
        const messageText = ctx.message.text;
        const senderName = ctx.from?.first_name || ctx.from?.username || 'Unknown';
        
        // Send message to Minecraft
        if (this.minecraftBot && messageText) {
          this.minecraftBot.chat(messageText);
          // console.log(`[Telegram->MC] ${senderName}: ${messageText}`);
        }
        
        // React to show message was received
        await ctx.react('👍');
      }
    });

    // Handle errors
    this.telegramBot.catch((err) => {
      // console.error('[Telegram Bot] Error:', err);
    });
  }

  public setMinecraftBot(bot: MinecraftBot) {
    this.minecraftBot = bot;
  }

  public async start() {
    try {
      await this.telegramBot.start();
      // console.log('[Telegram Bot] Started successfully');
      
      // Send startup message
      await this.sendMessage('🤖 Minecraft bot connected to Telegram!\n\nReply to this message to send commands to Minecraft.');
    } catch (error) {
      // console.error('[Telegram Bot] Failed to start:', error);
    }
  }

  public async stop() {
    try {
      await this.telegramBot.stop();
      // console.log('[Telegram Bot] Stopped');
    } catch (error) {
      // console.error('[Telegram Bot] Error stopping:', error);
    }
  }

  public async sendMessage(message: string) {
    try {
      await this.telegramBot.api.sendMessage(this.chatId, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      // console.error('[Telegram Bot] Failed to send message:', error);
    }
  }

  public async sendMinecraftLog(type: 'chat' | 'join' | 'leave' | 'death' | 'info', message: string) {
    const emoji = {
      chat: '💬',
      join: '🟢',
      leave: '🔴',
      death: '💀',
      info: 'ℹ️'
    };

    const formattedMessage = `${emoji[type]} **${type.toUpperCase()}**\n\`${message}\``;
    await this.sendMessage(formattedMessage);
  }
} 