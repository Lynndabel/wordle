// Deterministically pick a daily word from a list based on the current date
const WORD_LIST = [
  'CRANE', 'PLANT', 'SHARE', 'STORY', 'BRAVE', 'GLASS', 'WORLD', 'PLUSH', 'TRAIL', 'CROWN', 
  'LOVE', 'SUNNY', 'BLOCKCHAIN', 'ECOSYSTEM', 'MEME', 'BASE', 'MINIAPP', 'REWARD'
  // ...add more words as needed
];

export function getDailyWord(date = new Date()): string {
  const epoch = new Date('2024-01-01'); // Pick a start date
  const days = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return WORD_LIST[days % WORD_LIST.length];
}
