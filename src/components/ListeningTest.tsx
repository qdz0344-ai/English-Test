"use client";

import { useState } from "react";
import type { TestQuestion } from "@/types";
import { speakWord } from "@/lib/tts";
import { checkSpellingAnswer } from "@/lib/test-engine";

export default function ListeningTest({
  question,
  onAnswer,
}: {
  question: TestQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}) {
  const [englishInput, setEnglishInput] = useState("");
  const [chineseInput, setChineseInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!englishInput.trim()) return;
    const correct = checkSpellingAnswer(englishInput, question.word.word);
    setResult(correct);
    setSubmitted(true);
    setTimeout(() => {
      onAnswer(englishInput, correct);
      setEnglishInput("");
      setChineseInput("");
      setSubmitted(false);
      setResult(null);
    }, 1200);
  };

  const handleSkip = () => {
    onAnswer("", false);
    setEnglishInput("");
    setChineseInput("");
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={() => speakWord(question.word.word)}
          className="text-4xl p-4 rounded-full hover:bg-gray-100 transition"
          title="播放发音"
        >
          🔊
        </button>
        <p className="text-sm text-gray-400 mt-1">点击图标播放发音</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={englishInput}
          onChange={(e) => setEnglishInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="英文拼写"
          autoFocus
          className={`w-64 text-center text-lg p-3 border-2 rounded-lg outline-none ${
            submitted
              ? result
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-indigo-500"
          }`}
        />
        <input
          type="text"
          value={chineseInput}
          onChange={(e) => setChineseInput(e.target.value)}
          disabled={submitted}
          placeholder="中文释义（可选）"
          className="w-64 text-center text-lg p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-500"
        />
      </div>

      {submitted && !result && (
        <p className="text-center text-green-600 font-medium">
          正确: {question.word.word} — {question.word.meanings[0]}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={handleSkip} disabled={submitted} className="px-4 py-2 text-gray-500 hover:text-gray-700">
          跳过
        </button>
        <button onClick={handleSubmit} disabled={!englishInput.trim() || submitted} className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
          确认
        </button>
      </div>
    </div>
  );
}
