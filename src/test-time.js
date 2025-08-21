// Test the time formatting function
import { formatChatTime } from './utils/timeUtils.js';

// Test cases
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

console.log('Now:', formatChatTime(now.toISOString()));
console.log('Yesterday:', formatChatTime(yesterday.toISOString()));
console.log('Last week:', formatChatTime(lastWeek.toISOString()));

// Test with actual message times from your screenshots
console.log('Test 8:07 PM yesterday:', formatChatTime('2025-08-13T20:07:00.000Z'));