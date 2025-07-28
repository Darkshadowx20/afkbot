// src/autoeat.ts
import { Bot } from 'mineflayer';

/**
 * Set up auto-eat functionality to automatically consume food when hunger is low
 * This prevents the bot from starving and losing health
 * 
 * @param bot - The Minecraft bot instance to add auto-eat functionality to
 */
export function setupAutoEat(bot: Bot) {
  // List of food items the bot should try to eat (in order of preference)
  const foodItems = [
    'golden_apple',
    'enchanted_golden_apple', 
    'cooked_beef',
    'cooked_porkchop',
    'cooked_chicken',
    'cooked_salmon',
    'cooked_cod',
    'bread',
    'apple',
    'carrot',
    'potato',
    'baked_potato',
    'beetroot',
    'melon_slice',
    'sweet_berries',
    'dried_kelp',
    'cookie',
    'pumpkin_pie',
    'cake',
    'mushroom_stew',
    'rabbit_stew',
    'beetroot_soup',
    'suspicious_stew',
    'raw_beef',
    'raw_porkchop',
    'raw_chicken',
    'raw_salmon',
    'raw_cod',
    'rotten_flesh'  // Last resort food
  ];

  /**
   * Try to eat food from inventory
   * @returns true if successfully started eating, false otherwise
   */
  function tryToEat(): boolean {
    // Don't eat if already eating or food is full
    if (bot.food >= 20) return false; // Food is full (20 = max hunger)
    
    // Find food in inventory
    for (const foodName of foodItems) {
      const foodItem = bot.registry.itemsByName[foodName];
      if (foodItem) {
        const food = bot.inventory.items().find(item => item.type === foodItem.id);
        if (food) {
          // console.log(`[AutoEat] Eating ${foodName} (hunger: ${bot.food})`);
          
          // Equip the food item
          bot.equip(food, 'hand').then(() => {
            // Start eating
            bot.consume().catch(err => {
              // console.error('[AutoEat] Failed to consume food:', err.message);
            });
          }).catch(err => {
            // console.error('[AutoEat] Failed to equip food:', err.message);
          });
          
          return true;
        }
      }
    }
    
    // console.log('[AutoEat] No food found in inventory!');
    return false;
  }

  // Check hunger every 5 seconds
  setInterval(() => {
    // Only try to eat if hunger is below 16 (out of 20)
    if (bot.food < 16) {
      tryToEat();
    }
  }, 5000); // Check every 5 seconds

  // Also check immediately when hunger changes
  bot.on('health', () => {
    // Eat when hunger gets low (below 10) or health is low
    if (bot.food < 10 || (bot.health < 15 && bot.food < 18)) {
      setTimeout(() => tryToEat(), 500); // Small delay to avoid spam
    }
  });

  // Emergency eating when health is very low
  bot.on('health', () => {
    if (bot.health <= 6 && bot.food < 20) {
      // console.log('[AutoEat] Emergency eating - low health!');
      tryToEat();
    }
  });
} 