"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import ChoiceTest from "@/components/ChoiceTest";
import SpellingTest from "@/components/SpellingTest";
import ListeningTest from "@/components/ListeningTest";
import { getRandomWords } from "@/lib/vocab";
import { generateQuestions } from "@/lib/test-engine";
import { createClient } from "@/lib/supabase";
import type { VocabSource, TestMode, TestQuestion, TestResult } from "@/types";

function TestPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") as VocabSource;
  const mode = searchParams.get("mode") as TestMode;
  const count = parseInt(searchParams.get("count") || "20", 10);

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!source || !mode) {
      router.push("/");
      return;
    }

    getRandomWords(source, count).then((words) => {
      const qs = generateQuestions(words, mode, count);
      setQuestions(qs);
    });
  }, [source, mode, count, router]);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      const result: TestResult = {
        question: questions[currentIndex],
        userAnswer: answer,
        isCorrect,
      };
      const newResults = [...results, result];
      setResults(newResults);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const timeSec = Math.round((Date.now() - startTime) / 1000);
        sessionStorage.setItem(
          "testResults",
          JSON.stringify({ results: newResults, timeSec, source, mode })
        );

        // Save to API if logged in
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            const correct = newResults.filter((r) => r.isCorrect).length;
            const mistakes = newResults
              .filter((r) => !r.isCorrect && r.userAnswer !== "")
              .map((r) => ({
                wordId: r.question.word.id,
                word: r.question.word.word,
              }));

            fetch("/api/test/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                mode,
                wordBank: source,
                total: newResults.length,
                correct,
                timeSec,
                mistakes,
              }),
            });
          }
        });

        router.push("/result");
      }
    },
    [currentIndex, questions, results, router, startTime, source, mode]
  );

  if (questions.length === 0) {
    return (
      <>
        <Navbar loggedIn={false} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">加载中...</p>
        </div>
      </>
    );
  }

  const question = questions[currentIndex];
  const modeLabel = { choice: "选择题", spelling: "拼写", listening: "听音" }[mode];

  return (
    <>
      <Navbar loggedIn={false} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{source === "cet4" ? "CET-4" : source === "cet6" ? "CET-6" : "考研"} · {modeLabel}</span>
          <span className="font-medium text-gray-700">第 {currentIndex + 1} / {questions.length} 题</span>
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {mode === "choice" && (
            <ChoiceTest question={question} onAnswer={handleAnswer} />
          )}
          {mode === "spelling" && (
            <SpellingTest question={question} onAnswer={handleAnswer} />
          )}
          {mode === "listening" && (
            <ListeningTest question={question} onAnswer={handleAnswer} />
          )}
        </div>
      </main>
    </>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-400">加载中...</p>
      </div>
    }>
      <TestPageInner />
    </Suspense>
  );
}
