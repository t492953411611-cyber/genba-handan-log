import { KnowledgeCase } from "./types";

export const STORAGE_KEY = "genba-handan-log-cases";
const now = "2026-07-24T09:00:00.000Z";

export const sampleCase: KnowledgeCase = {
  id: "sample-cable-wood-beam", title: "狭い天井内での木梁角部とケーブルの接触", projectName: "サンプル電気設備工事",
  recordedAt: "2026-07-24", managementCategory: "品質", workCategory: "配線工事", location: "天井内・木梁周辺", workPhase: "先行配線",
  sceneSummary: "天井懐が約300〜400mmと狭く、上部がコンクリートスラブで、内部に木梁がある場所で先行配線を行っていた。",
  goodPoints: ["コンクリートスラブへケーブルを直接接触させず、支持していた"],
  warningSigns: ["木梁の角部にケーブルが接触していた", "ケーブルが将来的に揺れて擦れる可能性があった"],
  futureRisks: ["ケーブル被覆の摩耗", "絶縁抵抗の低下", "漏電または地絡"], judgmentLevel: "要是正",
  judgmentReason: "木材への接触自体を一律に不良とはしないが、角部でケーブルが動く状態は長期的な被覆損傷のおそれがある。",
  actions: ["離隔可能な箇所は支持位置を変更し、木梁角部から離す", "離隔が困難な箇所はゴムシート等で角部を保護する", "養生材からケーブルが外れない状態にする", "隠蔽前に施工状況を写真で記録する"], alternatives: [],
  additionalChecks: ["ケーブルの種類", "ケーブルの支持間隔", "接触箇所でケーブルが動く可能性", "養生材の耐久性", "他の金物やビスとの接触"],
  trainingExplanation: "木材へ触れているだけで直ちに不良とは限らない。ただし、角部に接触してケーブルが動く状態では、施工時には異常がなくても長期間の摩擦で被覆が傷む可能性がある。現場条件に応じて離隔または保護を行う。",
  tags: ["天井内配線", "ケーブル", "木梁", "角部", "被覆摩耗", "絶縁不良", "隠蔽前確認"], status: "承認済み", createdAt: now, updatedAt: now,
};

export function loadCases(): KnowledgeCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) { window.localStorage.setItem(STORAGE_KEY, JSON.stringify([sampleCase])); return [sampleCase]; }
    const cases = JSON.parse(raw) as KnowledgeCase[];
    return Array.isArray(cases) ? cases : [sampleCase];
  } catch { return [sampleCase]; }
}
export function saveCases(cases: KnowledgeCase[]) { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases)); }
export function getCase(id: string) { return loadCases().find((item) => item.id === id); }
export function upsertCase(item: KnowledgeCase) {
  const cases = loadCases(); const index = cases.findIndex((c) => c.id === item.id);
  if (index >= 0) cases[index] = item; else cases.unshift(item); saveCases(cases);
}
export function removeCase(id: string) { saveCases(loadCases().filter((item) => item.id !== id)); }
