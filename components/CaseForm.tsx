"use client";

import { FormEvent, useState } from "react";
import { caseStatuses, judgmentLevels, KnowledgeCase, managementCategories } from "@/lib/types";

export type CaseFormData = Omit<KnowledgeCase, "id" | "createdAt" | "updatedAt">;
const today = () => new Date().toISOString().slice(0, 10);
const split = (value: string) => value.split("\n").map((v) => v.trim()).filter(Boolean);

function defaults(): CaseFormData { return { title: "", projectName: "", recordedAt: today(), managementCategory: "品質", workCategory: "", location: "", workPhase: "", sceneSummary: "", goodPoints: [], warningSigns: [], futureRisks: [], judgmentLevel: "要確認", judgmentReason: "", actions: [], alternatives: [], additionalChecks: [], trainingExplanation: "", tags: [], status: "下書き" }; }
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) { return <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}{required && <span className="ml-1 text-rose-600">必須</span>}</span>{children}{hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}</label>; }

export function CaseForm({ initialCase, onSave, saveLabel = "保存する" }: { initialCase?: KnowledgeCase; onSave: (data: CaseFormData) => void; saveLabel?: string }) {
  const [data, setData] = useState<CaseFormData>(initialCase ? (({ id, createdAt, updatedAt, ...rest }) => rest)(initialCase) : defaults());
  const [error, setError] = useState("");
  const update = <K extends keyof CaseFormData>(key: K, value: CaseFormData[K]) => setData((prev) => ({ ...prev, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!data.title.trim() || !data.recordedAt || !data.judgmentLevel || !data.status) { setError("タイトル、登録日、判断レベル、ステータスは必須です。"); return; } setError(""); onSave({ ...data, title: data.title.trim() }); };
  const multi = (key: "goodPoints" | "warningSigns" | "futureRisks" | "actions" | "alternatives" | "additionalChecks" | "tags", label: string, hint?: string) => <Field label={label} hint={hint ?? "複数ある場合は改行で区切って入力してください。"}><textarea value={data[key].join("\n")} onChange={(e) => update(key, split(e.target.value))} /></Field>;
  return <form onSubmit={submit} className="space-y-7">
    {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-5 text-base font-bold text-[#163047]">基本情報</h2><div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2"><Field label="タイトル" required><input value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="判断内容を端的に入力" /></Field></div>
      <Field label="現場名・案件名"><input value={data.projectName} onChange={(e) => update("projectName", e.target.value)} /></Field><Field label="登録日" required><input type="date" value={data.recordedAt} onChange={(e) => update("recordedAt", e.target.value)} /></Field>
      <Field label="管理分類"><select value={data.managementCategory} onChange={(e) => update("managementCategory", e.target.value)}>{managementCategories.map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="工種"><input value={data.workCategory} onChange={(e) => update("workCategory", e.target.value)} placeholder="例：配線工事" /></Field>
      <Field label="場所"><input value={data.location} onChange={(e) => update("location", e.target.value)} /></Field><Field label="工事段階"><input value={data.workPhase} onChange={(e) => update("workPhase", e.target.value)} placeholder="例：先行配線" /></Field>
      <Field label="判断レベル" required><select value={data.judgmentLevel} onChange={(e) => update("judgmentLevel", e.target.value as KnowledgeCase["judgmentLevel"])}>{judgmentLevels.map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="ステータス" required><select value={data.status} onChange={(e) => update("status", e.target.value as KnowledgeCase["status"])}>{caseStatuses.map((v) => <option key={v}>{v}</option>)}</select></Field>
    </div></section>
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-5 text-base font-bold text-[#163047]">現場の状況と判断</h2><div className="grid gap-5"><Field label="現場状況"><textarea value={data.sceneSummary} onChange={(e) => update("sceneSummary", e.target.value)} /></Field>{multi("goodPoints", "良好だった点")}{multi("warningSigns", "気になった点")}{multi("futureRisks", "想定リスク")}<Field label="判断理由"><textarea value={data.judgmentReason} onChange={(e) => update("judgmentReason", e.target.value)} /></Field></div></section>
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-5 text-base font-bold text-[#163047]">対策・共有事項</h2><div className="grid gap-5">{multi("actions", "指示・対策")}{multi("alternatives", "代替案")}{multi("additionalChecks", "追加確認事項")}<Field label="新人向け解説"><textarea value={data.trainingExplanation} onChange={(e) => update("trainingExplanation", e.target.value)} /></Field>{multi("tags", "タグ", "複数ある場合は改行で区切って入力してください。")}</div></section>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="submit" className="min-h-12 rounded-lg bg-[#176b87] px-6 py-3 font-bold text-white hover:bg-[#11566d]">{saveLabel}</button></div>
  </form>;
}
