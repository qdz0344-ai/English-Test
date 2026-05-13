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
