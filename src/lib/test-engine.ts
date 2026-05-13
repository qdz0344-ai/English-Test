import { TestMode, Word, TestQuestion, TestResult } from "@/types";

export function generateQuestions(
  pool: Word[],
  mode: TestMode,
  count: number
): TestQuestion[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (mode === "choice") {
    return selected.map((word) => {
      const correctMeaning = word.meanings[0];
      const distractors = pool
        .filter((w) => w.id !== word.id)
        .map((w) => w.meanings[0])
        .filter((m) => m !== correctMeaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [...distractors, correctMeaning].sort(
        () => Math.random() - 0.5
      );
      const correctIndex = options.indexOf(correctMeaning);

      return { word, options, correctIndex };
    });
  }

  return selected.map((word) => ({ word }));
}

export function checkChoiceAnswer(
  selectedIndex: number,
  correctIndex: number
): boolean {
  return selectedIndex === correctIndex;
}

export function checkSpellingAnswer(
  userInput: string,
  correctWord: string
): boolean {
  return userInput.trim().toLowerCase() === correctWord.trim().toLowerCase();
}

export function calculateScore(results: TestResult[]): number {
  if (results.length === 0) return 0;
  const correct = results.filter((r) => r.isCorrect).length;
  return Math.round((correct / results.length) * 100);
}

export function getCorrectCount(results: TestResult[]): number {
  return results.filter((r) => r.isCorrect).length;
}

export function getSkippedCount(results: TestResult[]): number {
  return results.filter((r) => r.userAnswer === "").length;
}
