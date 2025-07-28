# DarkBot - Minecraft AFK Bot

A simple Minecraft AFK bot written in TypeScript using [mineflayer](https://github.com/PrismarineJS/mineflayer), supporting both cracked (offline) and premium (Mojang/Microsoft) accounts.

## Features
- AFK (auto-jump every 30 seconds)
- Auto-reconnect
- Cracked and premium account support

## Setup

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```env
   MC_HOST=your.server.ip
   MC_PORT=25565
   MC_USER=yourUsernameOrEmail
   MC_PASS=yourPassword  # Leave blank for cracked
   MC_AUTH=offline       # Use 'offline' for cracked, 'mojang' or 'microsoft' for premium
   ```

3. **Run the bot:**
   ```sh
   pnpm exec ts-node src/bot.ts
   ```

## Notes
- For cracked servers, the bot will attempt to register/login with `/register` and `/login` commands. You may need to adjust these for your server.
- For premium accounts, set `MC_AUTH` to `mojang` or `microsoft` and provide the correct credentials.

## License
MIT 