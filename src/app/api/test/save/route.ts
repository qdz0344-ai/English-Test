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
