"use client";

import type { TestResult } from "@/types";

export default function MistakeReview({
  results,
}: {
  results: TestResult[];
}) {
  const mistakes = results.filter((r) => !r.isCorrect);

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        全部正确！
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">错题回顾</h3>
      {mistakes.map((r, i) => (
        <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="font-bold text-lg">
            {r.question.word.word}{" "}
            <span className="text-sm text-gray-400 font-normal">
              {r.question.word.phonetic}
            </span>
          </p>
          <p className="text-gray-600 mt-1">
            释义: {r.question.word.meanings.join("；")}
          </p>
          {r.userAnswer && (
            <p className="text-red-500 text-sm mt-1">
              你的回答: {r.userAnswer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
