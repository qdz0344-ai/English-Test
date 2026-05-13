"use client";

import type { VocabSource } from "@/types";

const sources: { key: VocabSource; label: string; desc: string; count: string }[] = [
  { key: "cet4", label: "CET-4", desc: "大学英语四级", count: "~4,500 词" },
  { key: "cet6", label: "CET-6", desc: "大学英语六级", count: "~6,000 词" },
  { key: "kaoyan", label: "考研", desc: "研究生入学考试", count: "~5,500 词" },
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
          className={`p-6 rounded-xl border-2 text-center transition ${
            selected === s.key
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-xl font-bold">{s.label}</p>
          <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          <p className="text-xs text-gray-400 mt-1">{s.count}</p>
        </button>
      ))}
    </div>
  );
}
