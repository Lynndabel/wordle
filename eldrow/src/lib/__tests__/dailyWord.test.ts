import { describe, expect, it } from "vitest";

import { getDailyWord, WORD_LENGTH } from "~/lib/dailyWord";

describe("getDailyWord", () => {
  const epoch = new Date("2024-01-01");

  const getDateAfter = (days: number) => {
    const date = new Date(epoch);
    date.setDate(epoch.getDate() + days);
    return date;
  };

  it("returns uppercase words with the configured length", () => {
    const sampleSpan = 60;
    for (let offset = 0; offset < sampleSpan; offset++) {
      const word = getDailyWord(getDateAfter(offset));
      expect(word).toMatch(/^[A-Z]+$/);
      expect(word).toHaveLength(WORD_LENGTH);
    }
  });

  it("cycles deterministically after the configured word list", () => {
    const seenAt = new Map<string, number>();
    let cycleLength = 0;

    for (let offset = 0; offset < 200; offset++) {
      const word = getDailyWord(getDateAfter(offset));
      if (seenAt.has(word)) {
        cycleLength = offset - (seenAt.get(word) ?? 0);
        break;
      }
      seenAt.set(word, offset);
    }

    expect(cycleLength).toBeGreaterThan(0);

    const wordToday = getDailyWord(epoch);
    const wordAfterCycle = getDailyWord(getDateAfter(cycleLength));
    expect(wordAfterCycle).toBe(wordToday);
  });
});
