# 英语单词测试网站 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-mode English vocabulary test website for 考研/CET-4/CET-6 prep with user accounts and progress tracking.

**Architecture:** Next.js App Router frontend + API routes, Supabase for auth and user data, static JSON word banks bundled in the project, deployed to Vercel under `llybb.ggff.net`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL), Vitest

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local.example`, `.gitignore`, `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Create vitest config**

Write `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Configure Tailwind**

Edit `tailwind.config.ts` — keep defaults, add content paths. The scaffold already sets this up.

- [ ] **Step 5: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 6: Create `.gitignore` additions**

Append to `.gitignore`:
```
.env.local
.superpowers/
```

- [ ] **Step 7: Write root layout**

Write `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "英语单词测试",
  description: "考研 · 四六级 · 单词测试",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify scaffold**

```bash
npm run dev
```

Open `http://localhost:3000` — should show the default Next.js page.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types**

Write `src/types/index.ts`:

```ts
export type VocabSource = "cet4" | "cet6" | "kaoyan";
export type TestMode = "choice" | "spelling" | "listening";

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  example?: string;
}

export interface TestQuestion {
  word: Word;
  options?: string[];       // choice mode only: 4 Chinese meanings
  correctIndex?: number;    // choice mode only: index of correct answer
}

export interface TestResult {
  question: TestQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export interface TestSession {
  mode: TestMode;
  source: VocabSource;
  questions: TestQuestion[];
  currentIndex: number;
  results: TestResult[];
  startedAt: number;
  endedAt?: number;
}

export interface TestRecord {
  id?: string;
  user_id: string;
  mode: TestMode;
  word_bank: VocabSource;
  total: number;
  correct: number;
  time_sec: number;
  created_at?: string;
}

export interface MistakeWord {
  id?: string;
  user_id: string;
  word_id: string;
  word: string;
  error_count: number;
  last_error_at?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types"
```

---

### Task 3: Vocab Data Files

**Files:**
- Create: `data/vocab/cet4.json`, `data/vocab/cet6.json`, `data/vocab/kaoyan.json`

- [ ] **Step 1: Create CET-4 word bank**

Write `data/vocab/cet4.json` with sample entries (expand to ~50 words for initial development):

```json
[
  { "id": "c4_001", "word": "abandon", "phonetic": "/əˈbændən/", "meanings": ["抛弃，放弃"], "example": "He abandoned his plan to travel." },
  { "id": "c4_002", "word": "ability", "phonetic": "/əˈbɪləti/", "meanings": ["能力，才能"], "example": "She has the ability to learn quickly." },
  { "id": "c4_003", "word": "absent", "phonetic": "/ˈæbsənt/", "meanings": ["缺席的，不在的"], "example": "He was absent from the meeting." },
  { "id": "c4_004", "word": "absorb", "phonetic": "/əbˈzɔːb/", "meanings": ["吸收", "吸引"], "example": "Plants absorb water from soil." },
  { "id": "c4_005", "word": "abstract", "phonetic": "/ˈæbstrækt/", "meanings": ["抽象的", "摘要"], "example": "The concept is too abstract to understand." }
]
```

- [ ] **Step 2: Create CET-6 word bank**

Write `data/vocab/cet6.json` with sample entries:

```json
[
  { "id": "c6_001", "word": "abbreviation", "phonetic": "/əˌbriːviˈeɪʃn/", "meanings": ["缩写，略语"], "example": "UN is the abbreviation for United Nations." },
  { "id": "c6_002", "word": "abide", "phonetic": "/əˈbaɪd/", "meanings": ["遵守，忍受"], "example": "You must abide by the rules." },
  { "id": "c6_003", "word": "abolish", "phonetic": "/əˈbɒlɪʃ/", "meanings": ["废除，取消"], "example": "Slavery was abolished in the 19th century." },
  { "id": "c6_004", "word": "abrupt", "phonetic": "/əˈbrʌpt/", "meanings": ["突然的，唐突的"], "example": "The meeting came to an abrupt end." },
  { "id": "c6_005", "word": "absurd", "phonetic": "/əbˈsɜːd/", "meanings": ["荒谬的，荒唐的"], "example": "What an absurd idea!" }
]
```

- [ ] **Step 3: Create 考研 word bank**

Write `data/vocab/kaoyan.json` with sample entries:

```json
[
  { "id": "ky_001", "word": "abate", "phonetic": "/əˈbeɪt/", "meanings": ["减轻，减少"], "example": "The storm began to abate." },
  { "id": "ky_002", "word": "abdicate", "phonetic": "/ˈæbdɪkeɪt/", "meanings": ["退位，放弃权力"], "example": "The king abdicated the throne." },
  { "id": "ky_003", "word": "aberration", "phonetic": "/ˌæbəˈreɪʃn/", "meanings": ["偏差，异常"], "example": "It was an aberration from the norm." },
  { "id": "ky_004", "word": "abhor", "phonetic": "/əbˈhɔː(r)/", "meanings": ["憎恶，痛恨"], "example": "I abhor violence in any form." },
  { "id": "ky_005", "word": "abstain", "phonetic": "/əbˈsteɪn/", "meanings": ["弃权，戒除"], "example": "He abstained from drinking alcohol." }
]
```

Note: These are starter samples. Full word lists (~4500/6000/5500 words) will be sourced from public educational resources and populated into the same JSON format. The loader code in Task 4 works identically regardless of list size.

- [ ] **Step 4: Commit**

```bash
git add data/
git commit -m "feat: add sample vocab data files"
```

---

### Task 4: Vocab Loader

**Files:**
- Create: `src/lib/vocab.ts`, `__tests__/vocab.test.ts`

- [ ] **Step 1: Write the failing test**

Write `__tests__/vocab.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { loadVocab, getRandomWords, getVocabSources } from "@/lib/vocab";

describe("loadVocab", () => {
  it("loads CET-4 word list", async () => {
    const words = await loadVocab("cet4");
    expect(words.length).toBeGreaterThan(0);
    expect(words[0]).toHaveProperty("id");
    expect(words[0]).toHaveProperty("word");
    expect(words[0]).toHaveProperty("meanings");
  });

  it("loads CET-6 word list", async () => {
    const words = await loadVocab("cet6");
    expect(words.length).toBeGreaterThan(0);
  });

  it("loads 考研 word list", async () => {
    const words = await loadVocab("kaoyan");
    expect(words.length).toBeGreaterThan(0);
  });

  it("throws for invalid source", async () => {
    await expect(loadVocab("invalid" as any)).rejects.toThrow();
  });
});

describe("getRandomWords", () => {
  it("returns requested number of words", async () => {
    const words = await getRandomWords("cet4", 5);
    expect(words).toHaveLength(5);
  });

  it("returns all words if count exceeds available", async () => {
    const words = await getRandomWords("cet4", 99999);
    const all = await loadVocab("cet4");
    expect(words).toHaveLength(all.length);
  });

  it("shuffles results (probabilistic)", async () => {
    const batch1 = await getRandomWords("cet4", 10);
    const batch2 = await getRandomWords("cet4", 10);
    const same = batch1.every((w, i) => w.id === batch2[i]?.id);
    expect(same).toBe(false); // extremely unlikely with large pool
  });
});

describe("getVocabSources", () => {
  it("returns all three sources", () => {
    expect(getVocabSources()).toEqual(["cet4", "cet6", "kaoyan"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/vocab.test.ts
```
Expected: FAIL — module `@/lib/vocab` not found.

- [ ] **Step 3: Write the implementation**

Write `src/lib/vocab.ts`:

```ts
import { Word, VocabSource } from "@/types";

const vocabModules: Record<VocabSource, () => Promise<{ default: Word[] }>> = {
  cet4: () => import("@/../data/vocab/cet4.json"),
  cet6: () => import("@/../data/vocab/cet6.json"),
  kaoyan: () => import("@/../data/vocab/kaoyan.json"),
};

export async function loadVocab(source: VocabSource): Promise<Word[]> {
  const loader = vocabModules[source];
  if (!loader) throw new Error(`Unknown vocab source: ${source}`);
  const mod = await loader();
  return mod.default;
}

export async function getRandomWords(
  source: VocabSource,
  count: number
): Promise<Word[]> {
  const words = await loadVocab(source);
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getVocabSources(): VocabSource[] {
  return ["cet4", "cet6", "kaoyan"];
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/vocab.test.ts
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/vocab.ts __tests__/vocab.test.ts
git commit -m "feat: add vocab loader with dynamic imports"
```

---

### Task 5: Test Engine

**Files:**
- Create: `src/lib/test-engine.ts`, `__tests__/test-engine.test.ts`

- [ ] **Step 1: Write the failing test**

Write `__tests__/test-engine.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  generateQuestions,
  checkSpellingAnswer,
  checkChoiceAnswer,
  calculateScore,
} from "@/lib/test-engine";
import { Word } from "@/types";

const sampleWords: Word[] = [
  { id: "1", word: "abandon", phonetic: "/əˈbændən/", meanings: ["抛弃，放弃"] },
  { id: "2", word: "ability", phonetic: "/əˈbɪləti/", meanings: ["能力，才能"] },
  { id: "3", word: "absent", phonetic: "/ˈæbsənt/", meanings: ["缺席的"] },
  { id: "4", word: "absorb", phonetic: "/əbˈzɔːb/", meanings: ["吸收"] },
  { id: "5", word: "abstract", phonetic: "/ˈæbstrækt/", meanings: ["抽象的"] },
];

describe("generateQuestions", () => {
  it("generates choice questions with 4 options each", () => {
    const questions = generateQuestions(sampleWords, "choice", 3);
    expect(questions).toHaveLength(3);
    questions.forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options![q.correctIndex!]).toBe(q.word.meanings[0]);
    });
  });

  it("returns all available words when count exceeds pool", () => {
    const questions = generateQuestions(sampleWords, "choice", 100);
    expect(questions).toHaveLength(sampleWords.length);
  });

  it("generates spelling questions without options", () => {
    const questions = generateQuestions(sampleWords, "spelling", 3);
    expect(questions).toHaveLength(3);
    questions.forEach((q) => {
      expect(q.options).toBeUndefined();
      expect(q.correctIndex).toBeUndefined();
    });
  });
});

describe("checkChoiceAnswer", () => {
  it("returns true for correct index", () => {
    const result = checkChoiceAnswer(2, 2);
    expect(result).toBe(true);
  });

  it("returns false for wrong index", () => {
    const result = checkChoiceAnswer(0, 1);
    expect(result).toBe(false);
  });
});

describe("checkSpellingAnswer", () => {
  it("matches exact spelling", () => {
    expect(checkSpellingAnswer("abandon", "abandon")).toBe(true);
  });

  it("ignores case", () => {
    expect(checkSpellingAnswer("ABANDON", "abandon")).toBe(true);
    expect(checkSpellingAnswer("Abandon", "abandon")).toBe(true);
  });

  it("trims whitespace", () => {
    expect(checkSpellingAnswer("  abandon  ", "abandon")).toBe(true);
  });
});

describe("calculateScore", () => {
  it("calculates percentage", () => {
    const results = [
      { isCorrect: true } as any,
      { isCorrect: true } as any,
      { isCorrect: false } as any,
      { isCorrect: true } as any,
    ];
    expect(calculateScore(results)).toBe(75);
  });

  it("returns 0 for all wrong", () => {
    const results = [{ isCorrect: false } as any, { isCorrect: false } as any];
    expect(calculateScore(results)).toBe(0);
  });

  it("returns 100 for all correct", () => {
    const results = [{ isCorrect: true } as any];
    expect(calculateScore(results)).toBe(100);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run __tests__/test-engine.test.ts
```
Expected: FAIL — module `@/lib/test-engine` not found.

- [ ] **Step 3: Write the implementation**

Write `src/lib/test-engine.ts`:

```ts
import { TestMode, Word, TestQuestion, TestResult } from "@/types";

export function generateQuestions(
  pool: Word[],
  mode: TestMode,
  count: number
): TestQuestion[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (mode === "choice") {
    return selected.map((word) => {
      const correctMeaning = word.meanings[0];
      const distractors = pool
        .filter((w) => w.id !== word.id)
        .map((w) => w.meanings[0])
        .filter((m) => m !== correctMeaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [...distractors, correctMeaning].sort(
        () => Math.random() - 0.5
      );
      const correctIndex = options.indexOf(correctMeaning);

      return { word, options, correctIndex };
    });
  }

  return selected.map((word) => ({ word }));
}

export function checkChoiceAnswer(
  selectedIndex: number,
  correctIndex: number
): boolean {
  return selectedIndex === correctIndex;
}

export function checkSpellingAnswer(
  userInput: string,
  correctWord: string
): boolean {
  return userInput.trim().toLowerCase() === correctWord.trim().toLowerCase();
}

export function calculateScore(results: TestResult[]): number {
  if (results.length === 0) return 0;
  const correct = results.filter((r) => r.isCorrect).length;
  return Math.round((correct / results.length) * 100);
}

export function getCorrectCount(results: TestResult[]): number {
  return results.filter((r) => r.isCorrect).length;
}

export function getSkippedCount(results: TestResult[]): number {
  return results.filter((r) => r.userAnswer === "").length;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/test-engine.test.ts
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/test-engine.ts __tests__/test-engine.test.ts
git commit -m "feat: add test engine with choice and spelling logic"
```

---

### Task 6: Supabase Setup

**Files:**
- Create: `src/lib/supabase.ts`, `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create Supabase project**

1. Go to https://supabase.com, sign up, create a new project.
2. After creation, copy the project URL and anon key.
3. Write them to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

- [ ] **Step 2: Write database migration**

Write `supabase/migrations/001_schema.sql`:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Test records
CREATE TABLE test_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('choice', 'spelling', 'listening')),
  word_bank TEXT NOT NULL CHECK (word_bank IN ('cet4', 'cet6', 'kaoyan')),
  total INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  time_sec INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mistake words
CREATE TABLE mistake_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  word TEXT NOT NULL,
  error_count INTEGER DEFAULT 1,
  last_error_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- Indexes
CREATE INDEX idx_test_records_user ON test_records(user_id, created_at DESC);
CREATE INDEX idx_mistake_words_user ON mistake_words(user_id);

-- RLS: users can only read/write their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_policy ON profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY test_records_policy ON test_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY mistake_words_policy ON mistake_words FOR ALL USING (auth.uid() = user_id);
```

- [ ] **Step 3: Apply migration**

Run the SQL in Supabase SQL Editor (web UI) or via `supabase db push`.

- [ ] **Step 4: Write Supabase client**

Write `src/lib/supabase.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 5: Update `.env.local.example`**

Write `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase.ts supabase/ .env.local.example
git commit -m "feat: add Supabase client and database schema"
```

---

### Task 7: Shared UI Components

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/ProgressBar.tsx`, `src/components/VocabSelector.tsx`, `src/components/ModeSelector.tsx`

- [ ] **Step 1: Write Navbar**

Write `src/components/Navbar.tsx`:

```tsx
"use client";

import Link from "next/link";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      <Link href="/" className="text-lg font-bold text-indigo-600">
        📝 英语单词测试
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {loggedIn ? (
          <>
            <Link href="/profile" className="hover:text-indigo-600">个人中心</Link>
            <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
              U
            </span>
          </>
        ) : (
          <Link href="/auth" className="text-indigo-600 hover:underline">
            登录 / 注册
          </Link>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Write ProgressBar**

Write `src/components/ProgressBar.tsx`:

```tsx
"use client";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>进度</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write VocabSelector**

Write `src/components/VocabSelector.tsx`:

```tsx
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
```

- [ ] **Step 4: Write ModeSelector**

Write `src/components/ModeSelector.tsx`:

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components (Navbar, ProgressBar, VocabSelector, ModeSelector)"
```

---

### Task 8: Test Mode Components

**Files:**
- Create: `src/components/ChoiceTest.tsx`, `src/components/SpellingTest.tsx`, `src/components/ListeningTest.tsx`, `src/lib/tts.ts`

- [ ] **Step 1: Write TTS helper**

Write `src/lib/tts.ts`:

```ts
export function speakWord(word: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}
```

- [ ] **Step 2: Write ChoiceTest**

Write `src/components/ChoiceTest.tsx`:

```tsx
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
```

- [ ] **Step 3: Write SpellingTest**

Write `src/components/SpellingTest.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { TestQuestion } from "@/types";
import { checkSpellingAnswer } from "@/lib/test-engine";

export default function SpellingTest({
  question,
  onAnswer,
}: {
  question: TestQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = checkSpellingAnswer(input, question.word.word);
    setResult(correct);
    setSubmitted(true);
    setTimeout(() => {
      onAnswer(input, correct);
      setInput("");
      setSubmitted(false);
      setResult(null);
    }, 800);
  };

  const handleSkip = () => {
    onAnswer("", false);
    setInput("");
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">
          {question.word.meanings[0]}
        </p>
        {question.word.phonetic && (
          <p className="text-gray-400">{question.word.phonetic}</p>
        )}
      </div>

      <div className="flex justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="请输入英文单词..."
          autoFocus
          className={`w-72 text-center text-xl p-3 border-2 rounded-lg outline-none ${
            submitted
              ? result
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-indigo-500"
          }`}
        />
      </div>

      {submitted && !result && (
        <p className="text-center text-green-600 font-medium">
          正确: {question.word.word}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={handleSkip} disabled={submitted} className="px-4 py-2 text-gray-500 hover:text-gray-700">
          跳过
        </button>
        <button onClick={handleSubmit} disabled={!input.trim() || submitted} className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
          确认
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write ListeningTest**

Write `src/components/ListeningTest.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { TestQuestion } from "@/types";
import { speakWord } from "@/lib/tts";
import { checkSpellingAnswer } from "@/lib/test-engine";

export default function ListeningTest({
  question,
  onAnswer,
}: {
  question: TestQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}) {
  const [englishInput, setEnglishInput] = useState("");
  const [chineseInput, setChineseInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!englishInput.trim()) return;
    const correct = checkSpellingAnswer(englishInput, question.word.word);
    setResult(correct);
    setSubmitted(true);
    setTimeout(() => {
      onAnswer(englishInput, correct);
      setEnglishInput("");
      setChineseInput("");
      setSubmitted(false);
      setResult(null);
    }, 1200);
  };

  const handleSkip = () => {
    onAnswer("", false);
    setEnglishInput("");
    setChineseInput("");
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={() => speakWord(question.word.word)}
          className="text-4xl p-4 rounded-full hover:bg-gray-100 transition"
          title="播放发音"
        >
          🔊
        </button>
        <p className="text-sm text-gray-400 mt-1">点击图标播放发音</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={englishInput}
          onChange={(e) => setEnglishInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="英文拼写"
          autoFocus
          className={`w-64 text-center text-lg p-3 border-2 rounded-lg outline-none ${
            submitted
              ? result
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-indigo-500"
          }`}
        />
        <input
          type="text"
          value={chineseInput}
          onChange={(e) => setChineseInput(e.target.value)}
          disabled={submitted}
          placeholder="中文释义（可选）"
          className="w-64 text-center text-lg p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-500"
        />
      </div>

      {submitted && !result && (
        <p className="text-center text-green-600 font-medium">
          正确: {question.word.word} — {question.word.meanings[0]}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={handleSkip} disabled={submitted} className="px-4 py-2 text-gray-500 hover:text-gray-700">
          跳过
        </button>
        <button onClick={handleSubmit} disabled={!englishInput.trim() || submitted} className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
          确认
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ChoiceTest.tsx src/components/SpellingTest.tsx src/components/ListeningTest.tsx src/lib/tts.ts
git commit -m "feat: add test mode components (choice, spelling, listening)"
```

---

### Task 9: API Routes

**Files:**
- Create: `src/app/api/test/save/route.ts`, `src/app/api/test/history/route.ts`, `src/app/api/mistakes/route.ts`

These API routes save test results and fetch user history. They use Supabase server client.

- [ ] **Step 1: Write save test record API**

Write `src/app/api/test/save/route.ts`:

```ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, mode, wordBank, total, correct, timeSec, mistakes } =
    await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Save test record
  const { error: recordError } = await supabase.from("test_records").insert({
    user_id: userId,
    mode,
    word_bank: wordBank,
    total,
    correct,
    time_sec: timeSec,
  });

  if (recordError) {
    return NextResponse.json({ error: recordError.message }, { status: 500 });
  }

  // Upsert mistake words
  if (mistakes && mistakes.length > 0) {
    for (const m of mistakes) {
      const { data: existing } = await supabase
        .from("mistake_words")
        .select("id, error_count")
        .eq("user_id", userId)
        .eq("word_id", m.wordId)
        .single();

      if (existing) {
        await supabase
          .from("mistake_words")
          .update({
            error_count: existing.error_count + 1,
            last_error_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("mistake_words").insert({
          user_id: userId,
          word_id: m.wordId,
          word: m.word,
          error_count: 1,
          last_error_at: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Write get test history API**

Write `src/app/api/test/history/route.ts`:

```ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("test_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Write get mistakes API**

Write `src/app/api/mistakes/route.ts`:

```ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("mistake_words")
    .select("*")
    .eq("user_id", userId)
    .order("last_error_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/
git commit -m "feat: add API routes for test records and mistakes"
```

---

### Task 10: Pages

**Files:**
- Create/Modify: `src/app/page.tsx`, `src/app/auth/page.tsx`, `src/app/test/page.tsx`, `src/app/result/page.tsx`, `src/app/profile/page.tsx`, `src/components/ResultSummary.tsx`, `src/components/MistakeReview.tsx`

- [ ] **Step 1: Write ResultSummary component**

Write `src/components/ResultSummary.tsx`:

```tsx
"use client";

import type { TestResult } from "@/types";
import { calculateScore, getCorrectCount, getSkippedCount } from "@/lib/test-engine";

export default function ResultSummary({
  results,
  timeSec,
  onRetry,
  onReviewMistakes,
}: {
  results: TestResult[];
  timeSec: number;
  onRetry: () => void;
  onReviewMistakes: () => void;
}) {
  const score = calculateScore(results);
  const correct = getCorrectCount(results);
  const skipped = getSkippedCount(results);
  const wrong = results.length - correct - skipped;
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;

  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500 border-green-500";
    if (s >= 60) return "text-yellow-500 border-yellow-500";
    return "text-red-500 border-red-500";
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <div
          className={`w-28 h-28 border-8 rounded-full inline-flex items-center justify-center mb-4 ${getColor(score)}`}
        >
          <span className={`text-3xl font-bold ${getColor(score)}`}>
            {score}%
          </span>
        </div>
        <p className="text-lg font-semibold">
          {correct} / {results.length} 正确
        </p>
        <p className="text-gray-500">
          用时 {minutes} 分 {seconds} 秒
        </p>
      </div>

      <div className="flex justify-center gap-8 text-center">
        <div>
          <span className="text-2xl font-bold text-green-500">{correct}</span>
          <p className="text-sm text-gray-500">正确</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-red-500">{wrong}</span>
          <p className="text-sm text-gray-500">错误</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-400">{skipped}</span>
          <p className="text-sm text-gray-500">跳过</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          再来一次
        </button>
        {wrong > 0 && (
          <button
            onClick={onReviewMistakes}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            复习错题
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write MistakeReview component**

Write `src/components/MistakeReview.tsx`:

```tsx
"use client";

import type { TestResult } from "@/types";

export default function MistakeReview({
  results,
}: {
  results: TestResult[];
}) {
  const mistakes = results.filter((r) => !r.isCorrect);

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        全部正确！
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">错题回顾</h3>
      {mistakes.map((r, i) => (
        <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="font-bold text-lg">
            {r.question.word.word}{" "}
            <span className="text-sm text-gray-400 font-normal">
              {r.question.word.phonetic}
            </span>
          </p>
          <p className="text-gray-600 mt-1">
            释义: {r.question.word.meanings.join("；")}
          </p>
          {r.userAnswer && (
            <p className="text-red-500 text-sm mt-1">
              你的回答: {r.userAnswer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write Home page**

Write `src/app/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Write Auth page**

Write `src/app/auth/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <>
      <Navbar loggedIn={false} />
      <main className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-8">
          {isSignUp ? "注册" : "登录"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "处理中..." : isSignUp ? "注册" : "登录"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? "已有账号？" : "没有账号？"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:underline"
          >
            {isSignUp ? "去登录" : "去注册"}
          </button>
        </p>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Write Test page**

Write `src/app/test/page.tsx`:

```tsx
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
import type { VocabSource, TestMode, TestQuestion, TestResult } from "@/types";

function TestPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") as VocabSource;
  const mode = searchParams.get("mode") as TestMode;

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!source || !mode) {
      router.push("/");
      return;
    }

    getRandomWords(source, 20).then((words) => {
      const qs = generateQuestions(words, mode, 20);
      setQuestions(qs);
    });
  }, [source, mode, router]);

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
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{source === "cet4" ? "CET-4" : source === "cet6" ? "CET-6" : "考研"} · {modeLabel}</span>
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {mode === "choice" && (
          <ChoiceTest question={question} onAnswer={handleAnswer} />
        )}
        {mode === "spelling" && (
          <SpellingTest question={question} onAnswer={handleAnswer} />
        )}
        {mode === "listening" && (
          <ListeningTest question={question} onAnswer={handleAnswer} />
        )}
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
```

Note: The test page uses `useSearchParams` which in Next.js 15 requires a Suspense boundary. The component already handles this by wrapping the export with Suspense (see top-level export at end of file).

- [ ] **Step 6: Write Result page**

Write `src/app/result/page.tsx`:

```tsx
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
```

- [ ] **Step 7: Write Profile page (placeholder)**

Write `src/app/profile/page.tsx`:

```tsx
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
        {/* User info */}
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

        {/* Stats */}
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

        {/* Test history */}
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

        {/* Mistake words */}
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
```

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/app/auth/page.tsx src/app/test/page.tsx src/app/result/page.tsx src/app/profile/page.tsx src/components/ResultSummary.tsx src/components/MistakeReview.tsx
git commit -m "feat: add all pages (home, auth, test, result, profile)"
```

---

### Task 11: Global CSS and Polish

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add base styles**

Write `src/app/globals.css` (replace scaffold content):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
}
```

- [ ] **Step 2: Quick visual check**

```bash
npm run dev
```

Open `http://localhost:3000`, verify:
- Home page shows vocab selector → choose CET-4 → mode selector appears → start test
- Test page loads and shows questions
- After completing all questions, redirects to result page
- Auth page shows login/register form

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add global CSS and polish"
```

---

### Task 12: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/<your-username>/vocab-test.git
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to https://vercel.com, sign up with GitHub
2. Click "New Project" → import the repo
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

- [ ] **Step 3: Bind custom domain**

1. In Vercel dashboard → Settings → Domains → Add `llybb.ggff.net`
2. In ggff.net DNS management, add CNAME record:
   ```
   Type: CNAME
   Host: llybb
   Value: cname.vercel-dns.com
   ```
3. Wait for DNS propagation + SSL auto-issuance (~5 min)

- [ ] **Step 4: Verify**

Open `https://llybb.ggff.net` — site loads with HTTPS.

---

## Verification

After all tasks are complete, run through:

1. **Home page**: Visit `/`, select CET-4 → select 选择题 → click 开始测试
2. **Test flow**: Answer 20 questions, verify progress bar updates, skip works
3. **Result**: Verify score display, errors shown, 再来一次 returns to home
4. **Auth**: Register a new account at `/auth`, verify redirect
5. **Profile**: Check stats show correct data after taking tests
6. **API**: After a test, check Supabase dashboard for `test_records` and `mistake_words` rows
7. **Domain**: Verify `https://llybb.ggff.net` loads correctly

```bash
# Run all unit tests
npx vitest run
```
