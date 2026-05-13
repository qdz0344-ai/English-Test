import { describe, it, expect } from "vitest";
import {
  generateQuestions,
  checkSpellingAnswer,
  checkChoiceAnswer,
  calculateScore,
} from "@/lib/test-engine";
import { Word } from "@/types";

const sampleWords: Word[] = [
  { id: "1", word: "abandon", phonetic: "/əˈbændən/", meanings: ["抛弃，放弃"] },
  { id: "2", word: "ability", phonetic: "/əˈbɪləti/", meanings: ["能力，才能"] },
  { id: "3", word: "absent", phonetic: "/ˈæbsənt/", meanings: ["缺席的"] },
  { id: "4", word: "absorb", phonetic: "/əbˈzɔːb/", meanings: ["吸收"] },
  { id: "5", word: "abstract", phonetic: "/ˈæbstrækt/", meanings: ["抽象的"] },
];

describe("generateQuestions", () => {
  it("generates choice questions with 4 options each", () => {
    const questions = generateQuestions(sampleWords, "choice", 3);
    expect(questions).toHaveLength(3);
    questions.forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options![q.correctIndex!]).toBe(q.word.meanings[0]);
    });
  });

  it("returns all available words when count exceeds pool", () => {
    const questions = generateQuestions(sampleWords, "choice", 100);
    expect(questions).toHaveLength(sampleWords.length);
  });

  it("generates spelling questions without options", () => {
    const questions = generateQuestions(sampleWords, "spelling", 3);
    expect(questions).toHaveLength(3);
    questions.forEach((q) => {
      expect(q.options).toBeUndefined();
      expect(q.correctIndex).toBeUndefined();
    });
  });
});

describe("checkChoiceAnswer", () => {
  it("returns true for correct index", () => {
    const result = checkChoiceAnswer(2, 2);
    expect(result).toBe(true);
  });

  it("returns false for wrong index", () => {
    const result = checkChoiceAnswer(0, 1);
    expect(result).toBe(false);
  });
});

describe("checkSpellingAnswer", () => {
  it("matches exact spelling", () => {
    expect(checkSpellingAnswer("abandon", "abandon")).toBe(true);
  });

  it("ignores case", () => {
    expect(checkSpellingAnswer("ABANDON", "abandon")).toBe(true);
    expect(checkSpellingAnswer("Abandon", "abandon")).toBe(true);
  });

  it("trims whitespace", () => {
    expect(checkSpellingAnswer("  abandon  ", "abandon")).toBe(true);
  });
});

describe("calculateScore", () => {
  it("calculates percentage", () => {
    const results = [
      { isCorrect: true } as any,
      { isCorrect: true } as any,
      { isCorrect: false } as any,
      { isCorrect: true } as any,
    ];
    expect(calculateScore(results)).toBe(75);
  });

  it("returns 0 for all wrong", () => {
    const results = [{ isCorrect: false } as any, { isCorrect: false } as any];
    expect(calculateScore(results)).toBe(0);
  });

  it("returns 100 for all correct", () => {
    const results = [{ isCorrect: true } as any];
    expect(calculateScore(results)).toBe(100);
  });
});
