export type CaseStatus = "下書き" | "確認中" | "承認済み" | "保留" | "廃止";
export type JudgmentLevel = "問題なし" | "経過確認" | "要確認" | "要是正" | "作業一時停止" | "即時対応" | "上位者・設計者への確認が必要";

export type KnowledgeCase = {
  id: string; title: string; projectName: string; recordedAt: string;
  managementCategory: string; workCategory: string; location: string; workPhase: string;
  sceneSummary: string; goodPoints: string[]; warningSigns: string[]; futureRisks: string[];
  judgmentLevel: JudgmentLevel; judgmentReason: string; actions: string[]; alternatives: string[];
  additionalChecks: string[]; trainingExplanation: string; tags: string[]; status: CaseStatus;
  createdAt: string; updatedAt: string;
};

export const managementCategories = ["品質", "安全", "工程", "原価", "材料", "写真管理", "他業種調整", "教育", "その他"];
export const judgmentLevels: JudgmentLevel[] = ["問題なし", "経過確認", "要確認", "要是正", "作業一時停止", "即時対応", "上位者・設計者への確認が必要"];
export const caseStatuses: CaseStatus[] = ["下書き", "確認中", "承認済み", "保留", "廃止"];
