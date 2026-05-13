"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import type { TestRecord, MistakeWord } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [mistakes, setMistakes] = useState<MistakeWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);

      Promise.all([
        fetch(`/api/test/history?userId=${user.id}`).then((r) => r.json()),
        fetch(`/api/mistakes?userId=${user.id}`).then((r) => r.json()),
      ]).then(([recs, mists]) => {
        setRecords(Array.isArray(recs) ? recs : []);
        setMistakes(Array.isArray(mists) ? mists : []);
        setLoading(false);
      });
    });
  }, []);

  const totalTests = records.length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          records.reduce((s, r) => s + (r.correct / r.total) * 100, 0) /
            totalTests
        )
      : 0;
  const uniqueWords =
    totalTests > 0
      ? records.reduce((s, r) => s + r.total, 0)
      : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Navbar loggedIn={true} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">加载中...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar loggedIn={true} />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg">
              {user.email?.[0].toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            退出登录
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border">
            <p className="text-2xl font-bold">{totalTests}</p>
            <p className="text-sm text-gray-500">测试次数</p>
          </div>
          <div className="p-4 bg-white rounded-xl border">
            <p className="text-2xl font-bold">{avgScore}%</p>
            <p className="text-sm text-gray-500">平均正确率</p>
          </div>
          <div className="p-4 bg-white rounded-xl border">
            <p className="text-2xl font-bold">{uniqueWords}</p>
            <p className="text-sm text-gray-500">已测单词</p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">最近测试</h2>
          {records.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无记录</p>
          ) : (
            <div className="border rounded-lg divide-y">
              {records.slice(0, 10).map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center px-4 py-3"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {r.word_bank === "cet4"
                        ? "CET-4"
                        : r.word_bank === "cet6"
                        ? "CET-6"
                        : "考研"}
                      {" · "}
                      {r.mode === "choice"
                        ? "选择题"
                        : r.mode === "spelling"
                        ? "拼写"
                        : "听音"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span>{r.correct}/{r.total}</span>
                    <span
                      className={`ml-2 font-medium ${
                        (r.correct / r.total) >= 0.8
                          ? "text-green-500"
                          : (r.correct / r.total) >= 0.6
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {Math.round((r.correct / r.total) * 100)}%
                    </span>
                    <span className="text-gray-400 ml-2 text-xs">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString("zh-CN")
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">错词本</h2>
          {mistakes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无错词</p>
          ) : (
            <div className="border rounded-lg divide-y">
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center px-4 py-3"
                >
                  <span className="font-medium">{m.word}</span>
                  <span className="text-sm text-red-500">
                    错 {m.error_count} 次
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
