"use client";

import type { VocabSource } from "@/types";

const sources: { key: VocabSource; label: string; desc: string; count: string; color: string }[] = [
  { key: "cet4", label: "CET-4", desc: "大学英语四级", count: "~4,500 词", color: "from-blue-500 to-cyan-500" },
  { key: "cet6", label: "CET-6", desc: "大学英语六级", count: "~6,000 词", color: "from-emerald-500 to-teal-500" },
  { key: "kaoyan", label: "考研", desc: "研究生入学考试", count: "~5,500 词", color: "from-orange-500 to-red-500" },
];

export default function VocabSelector({
  selected,
  onSelect,
}: {
  selected: VocabSource | null;
  onSelect: (s: VocabSource) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {sources.map((s) => (
        <button
          key={s.key}
          onClick={() => onSelect(s.key)}
          className={`p-6 rounded-2xl border-2 text-center transition-all hover:scale-[1.02] ${
            selected === s.key
              ? "border-indigo-400 bg-indigo-50 shadow-md"
              : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
          }`}
        >
          <div className={`inline-block w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} mb-3`} />
          <p className="text-xl font-bold text-slate-800">{s.label}</p>
          <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          <p className="text-xs text-gray-400 mt-1">{s.count}</p>
        </button>
      ))}
    </div>
  );
}
