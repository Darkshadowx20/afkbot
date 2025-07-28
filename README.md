# DarkBot - Minecraft AFK Bot with Telegram Integration

A simple Minecraft AFK bot written in TypeScript using [mineflayer](https://github.com/PrismarineJS/mineflayer), supporting both cracked (offline) and premium (Mojang/Microsoft) accounts, with optional Telegram integration for logging and remote control.

## Features
- AFK (auto-jump every 30 seconds)
- Auto-reconnect
- Cracked and premium account support
- **Telegram Integration** (optional):
  - Real-time logging of Minecraft events (chat, joins, leaves, deaths)
  - Send commands to Minecraft by replying to bot messages in Telegram
  - Formatted messages with emojis and status indicators

## Setup

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```env
   # Minecraft Configuration
   MC_HOST=your.server.ip
   MC_PORT=25565
   MC_USER=yourUsernameOrEmail
   MC_PASS=yourPassword  # Leave blank for cracked
   MC_AUTH=offline       # Use 'offline' for cracked, 'mojang' or 'microsoft' for premium
   MC_VERSION=           # Optional: specify Minecraft version
   
   # Telegram Configuration (optional)
   TG_BOT_TOKEN=your_telegram_bot_token
   TG_CHAT_ID=your_telegram_chat_id
   ```

3. **Set up Telegram Bot (optional):**
   - Create a new bot using [@BotFather](https://t.me/BotFather) on Telegram
   - Get your bot token from BotFather
   - Add the bot to your group/channel
   - Get the chat ID (you can use [@userinfobot](https://t.me/userinfobot) or check bot logs)
   - Make sure the bot has permission to read messages and send messages in the group

4. **Run the bot:**
   ```sh
   pnpm run dev
   ```
   or for production:
   ```sh
   pnpm run build
   pnpm start
   ```

## Telegram Usage

Once the bot is running with Telegram integration:

1. **Viewing Logs**: The bot will automatically send formatted messages to your Telegram chat for:
   - 💬 **CHAT**: Player chat messages
   - 🟢 **JOIN**: Player joins
   - 🔴 **LEAVE**: Player leaves  
   - 💀 **DEATH**: Bot deaths
   - ℹ️ **INFO**: Connection status and errors

2. **Sending Commands**: Reply to any bot message in the Telegram group to send commands to Minecraft:
   - The bot will react with 👍 to confirm the message was received
   - Your message will be sent as chat in Minecraft
   - Works for any Minecraft command or chat message

## Example Telegram Interaction

```
Bot: 🤖 Minecraft bot connected to Telegram!
     Reply to this message to send commands to Minecraft.

Bot: 💬 CHAT
     `PlayerName: Hello everyone!`

You: (Reply) /time set day
     👍 (Bot reacts to confirm)

Bot: ℹ️ INFO
     `Time set to 1000`
```

## Notes
- For cracked servers, the bot will attempt to register/login with `/register` and `/login` commands. You may need to adjust these for your server.
- For premium accounts, set `MC_AUTH` to `mojang` or `microsoft` and provide the correct credentials.
- Telegram integration is completely optional - the bot works fine without it.
- The bot will only respond to replies in the configured Telegram chat for security.

## License
MIT 