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
