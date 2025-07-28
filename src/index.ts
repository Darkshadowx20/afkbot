import { getConfig } from './config';
import { createBot } from './bot';

if (require.main === module) {
  createBot(getConfig());
} 