"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import VocabSelector from "@/components/VocabSelector";
import ModeSelector from "@/components/ModeSelector";
import type { VocabSource, TestMode } from "@/types";

export default function Home() {
  const router = useRouter();
  const [source, setSource] = useState<VocabSource | null>(null);
  const [mode, setMode] = useState<TestMode | null>(null);

  const startTest = () => {
    if (!source || !mode) return;
    router.push(`/test?source=${source}&mode=${mode}`);
  };

  return (
    <>
      <Navbar loggedIn={false} />
      <main className="max-w-2xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">考研 · 四六级 · 单词测试</h1>
          <p className="text-gray-500">内置标准词库，多种测试模式，追踪学习进度</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">选择词库</h2>
          <VocabSelector selected={source} onSelect={setSource} />
        </div>

        {source && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">选择模式</h2>
            <ModeSelector selected={mode} onSelect={setMode} />
          </div>
        )}

        {source && mode && (
          <div className="text-center">
            <button
              onClick={startTest}
              className="px-10 py-3 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 transition"
            >
              开始测试
            </button>
          </div>
        )}
      </main>
    </>
  );
}
