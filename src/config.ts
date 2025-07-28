import 'dotenv/config';

export type AuthType = 'mojang' | 'microsoft' | 'offline';

export interface BotConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  auth: AuthType;
  version?: string;
}

export function getConfig(): BotConfig {
  const host = process.env.MC_HOST || 'localhost';
  const port = parseInt(process.env.MC_PORT || '25565', 10);
  const username = process.env.MC_USER || 'Bot';
  const password = process.env.MC_PASS;
  const authEnv = process.env.MC_AUTH;
  let auth: AuthType = 'offline';
  if (authEnv === 'mojang' || authEnv === 'microsoft' || authEnv === 'offline') {
    auth = authEnv;
  }
  const version = process.env.MC_VERSION;
  return { host, port, username, password, auth, version };
} 