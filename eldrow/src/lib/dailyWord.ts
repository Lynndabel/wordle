// Deterministically pick a daily word from a list based on the current date
export const WORD_LENGTH = 5;

const RAW_WORD_LIST = [
  "CRANE",
  "PLANT",
  "SHARE",
  "STORY",
  "BRAVE",
  "GLASS",
  "WORLD",
  "PLUSH",
  "TRAIL",
  "CROWN",
  "LOOM",
  "SOLVE",
  "FRAME",
  "CHAIN",
  "TOKEN",
  "MINER",
  "REWAR",
  "BOOST",
];

const WORD_LIST = RAW_WORD_LIST.map((word) => word.trim().toUpperCase());

if (!WORD_LIST.every((word) => word.length === WORD_LENGTH)) {
  throw new Error(
    `All daily words must be exactly ${WORD_LENGTH} letters. Found: ${WORD_LIST.filter((word) => word.length !== WORD_LENGTH).join(", ") || "(none)"}`
  );
}

if (WORD_LIST.length === 0) {
  throw new Error("Daily word list must contain at least one entry.");
}

export function getDailyWord(date = new Date()): string {
  const epoch = new Date("2024-01-01"); // Pick a start date
  const days = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return WORD_LIST[days % WORD_LIST.length];
}
