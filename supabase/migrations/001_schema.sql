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
