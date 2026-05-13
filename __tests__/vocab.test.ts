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
    expect(same).toBe(false); // extremely unlikely with 55-word pool
  });
});

describe("getVocabSources", () => {
  it("returns all three sources", () => {
    expect(getVocabSources()).toEqual(["cet4", "cet6", "kaoyan"]);
  });
});
