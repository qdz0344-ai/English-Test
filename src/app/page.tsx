"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import VocabSelector from "@/components/VocabSelector";
import ModeSelector from "@/components/ModeSelector";
import type { VocabSource, TestMode } from "@/types";

const questionCounts = [10, 20, 30, 50];

export default function Home() {
  const router = useRouter();
  const [source, setSource] = useState<VocabSource | null>(null);
  const [mode, setMode] = useState<TestMode | null>(null);
  const [count, setCount] = useState(20);

  const startTest = () => {
    if (!source || !mode) return;
    router.push(`/test?source=${source}&mode=${mode}&count=${count}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar loggedIn={false} />
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-16 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            考研 · 四六级 · 单词测试
          </h1>
          <p className="text-gray-500 text-lg">
            内置标准词库，多种测试模式，追踪学习进度
          </p>
        </div>

        {/* Vocab */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 text-center">选择词库</h2>
          <VocabSelector selected={source} onSelect={setSource} />
        </div>

        {/* Mode */}
        {source && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 text-center">选择模式</h2>
            <ModeSelector selected={mode} onSelect={setMode} />
          </div>
        )}

        {/* Count */}
        {mode && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 text-center">题目数量</h2>
            <div className="flex gap-3 justify-center">
              {questionCounts.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`w-16 h-12 rounded-xl border-2 text-lg font-semibold transition ${
                    count === n
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start */}
        {source && mode && (
          <div className="text-center">
            <button
              onClick={startTest}
              className="px-12 py-4 bg-indigo-600 text-white text-lg rounded-2xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              开始测试 · {count} 题
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
