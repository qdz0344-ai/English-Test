"use client";

import { useState } from "react";
import type { TestQuestion } from "@/types";

export default function ChoiceTest({
  question,
  onAnswer,
}: {
  question: TestQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = selected === question.correctIndex;
    setTimeout(() => {
      onAnswer(String(selected), isCorrect);
      setSelected(null);
      setSubmitted(false);
    }, 800);
  };

  const handleSkip = () => {
    onAnswer("", false);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-3xl font-bold mb-2">{question.word.word}</p>
        {question.word.phonetic && (
          <p className="text-gray-400">{question.word.phonetic}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options!.map((option, idx) => {
          let borderColor = "border-gray-200 hover:border-gray-400";
          if (submitted) {
            if (idx === question.correctIndex) {
              borderColor = "border-green-500 bg-green-50";
            } else if (idx === selected) {
              borderColor = "border-red-500 bg-red-50";
            }
          } else if (idx === selected) {
            borderColor = "border-indigo-500 bg-indigo-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={`p-4 border-2 rounded-lg text-center transition ${borderColor}`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + idx)}. {option}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSkip}
          disabled={submitted}
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          跳过
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected === null || submitted}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
        >
          确认
        </button>
      </div>
    </div>
  );
}
