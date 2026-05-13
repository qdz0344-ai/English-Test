"use client";

import type { TestResult } from "@/types";
import { calculateScore, getCorrectCount, getSkippedCount } from "@/lib/test-engine";

export default function ResultSummary({
  results,
  timeSec,
  onRetry,
  onReviewMistakes,
}: {
  results: TestResult[];
  timeSec: number;
  onRetry: () => void;
  onReviewMistakes: () => void;
}) {
  const score = calculateScore(results);
  const correct = getCorrectCount(results);
  const skipped = getSkippedCount(results);
  const wrong = results.length - correct - skipped;
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;

  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500 border-green-500";
    if (s >= 60) return "text-yellow-500 border-yellow-500";
    return "text-red-500 border-red-500";
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <div
          className={`w-28 h-28 border-8 rounded-full inline-flex items-center justify-center mb-4 ${getColor(score)}`}
        >
          <span className={`text-3xl font-bold ${getColor(score)}`}>
            {score}%
          </span>
        </div>
        <p className="text-lg font-semibold">
          {correct} / {results.length} 正确
        </p>
        <p className="text-gray-500">
          用时 {minutes} 分 {seconds} 秒
        </p>
      </div>

      <div className="flex justify-center gap-8 text-center">
        <div>
          <span className="text-2xl font-bold text-green-500">{correct}</span>
          <p className="text-sm text-gray-500">正确</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-red-500">{wrong}</span>
          <p className="text-sm text-gray-500">错误</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-400">{skipped}</span>
          <p className="text-sm text-gray-500">跳过</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          再来一次
        </button>
        {wrong > 0 && (
          <button
            onClick={onReviewMistakes}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            复习错题
          </button>
        )}
      </div>
    </div>
  );
}
