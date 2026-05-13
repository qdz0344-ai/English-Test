"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ResultSummary from "@/components/ResultSummary";
import MistakeReview from "@/components/MistakeReview";
import type { TestResult } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    results: TestResult[];
    timeSec: number;
  } | null>(null);
  const [showMistakes, setShowMistakes] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("testResults");
    if (!raw) {
      router.push("/");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) {
    return (
      <>
        <Navbar loggedIn={false} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">加载中...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar loggedIn={false} />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <ResultSummary
          results={data.results}
          timeSec={data.timeSec}
          onRetry={() => router.push("/")}
          onReviewMistakes={() => setShowMistakes(true)}
        />

        {showMistakes && <MistakeReview results={data.results} />}
      </main>
    </>
  );
}
