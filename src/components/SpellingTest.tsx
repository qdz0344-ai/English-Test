"use client";

import { useState } from "react";
import type { TestQuestion } from "@/types";
import { checkSpellingAnswer } from "@/lib/test-engine";

export default function SpellingTest({
  question,
  onAnswer,
}: {
  question: TestQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = checkSpellingAnswer(input, question.word.word);
    setResult(correct);
    setSubmitted(true);
    setTimeout(() => {
      onAnswer(input, correct);
      setInput("");
      setSubmitted(false);
      setResult(null);
    }, 800);
  };

  const handleSkip = () => {
    onAnswer("", false);
    setInput("");
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">
          {question.word.meanings[0]}
        </p>
        {question.word.phonetic && (
          <p className="text-gray-400">{question.word.phonetic}</p>
        )}
      </div>

      <div className="flex justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="请输入英文单词..."
          autoFocus
          className={`w-72 text-center text-xl p-3 border-2 rounded-lg outline-none ${
            submitted
              ? result
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-indigo-500"
          }`}
        />
      </div>

      {submitted && !result && (
        <p className="text-center text-green-600 font-medium">
          正确: {question.word.word}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={handleSkip} disabled={submitted} className="px-4 py-2 text-gray-500 hover:text-gray-700">
          跳过
        </button>
        <button onClick={handleSubmit} disabled={!input.trim() || submitted} className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
          确认
        </button>
      </div>
    </div>
  );
}
