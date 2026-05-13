"use client";

import type { TestMode } from "@/types";

const modes: { key: TestMode; label: string; desc: string; icon: string }[] = [
  { key: "choice", label: "选择题", desc: "看英文选中文释义", icon: "📋" },
  { key: "spelling", label: "拼写", desc: "看中文写英文单词", icon: "✏️" },
  { key: "listening", label: "听音", desc: "听发音写单词", icon: "🎧" },
];

export default function ModeSelector({
  selected,
  onSelect,
}: {
  selected: TestMode | null;
  onSelect: (m: TestMode) => void;
}) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onSelect(m.key)}
          className={`p-5 rounded-2xl border-2 text-center w-40 transition-all hover:scale-[1.02] ${
            selected === m.key
              ? "border-indigo-400 bg-indigo-50 shadow-md"
              : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
          }`}
        >
          <p className="text-3xl mb-2">{m.icon}</p>
          <p className="font-bold text-slate-800">{m.label}</p>
          <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
        </button>
      ))}
    </div>
  );
}
