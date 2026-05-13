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
    <div className="flex gap-3 justify-center flex-wrap">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onSelect(m.key)}
          className={`p-4 rounded-xl border-2 text-center w-36 transition ${
            selected === m.key
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl">{m.icon}</p>
          <p className="font-bold mt-1">{m.label}</p>
          <p className="text-xs text-gray-500">{m.desc}</p>
        </button>
      ))}
    </div>
  );
}
