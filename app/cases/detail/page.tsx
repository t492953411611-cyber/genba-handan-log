"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LevelBadge, StatusBadge } from "@/components/Badges";
import { KnowledgeCase } from "@/lib/types";
import { getCase, removeCase } from "@/lib/storage";

const sections: { key: keyof KnowledgeCase; title: string; list?: boolean }[] = [
  { key: "sceneSummary", title: "現場状況" }, { key: "goodPoints", title: "良好だった点", list: true }, { key: "warningSigns", title: "気になった点", list: true }, { key: "futureRisks", title: "想定リスク", list: true }, { key: "judgmentReason", title: "判断理由" }, { key: "actions", title: "指示・対策", list: true }, { key: "alternatives", title: "代替案", list: true }, { key: "additionalChecks", title: "追加確認事項", list: true }, { key: "trainingExplanation", title: "新人向け解説" },
];

export default function DetailPage() {
  const router = useRouter();
  const [item, setItem] = useState<KnowledgeCase | null | undefined>(undefined);
  useEffect(() => { const id = new URLSearchParams(window.location.search).get("id"); setItem(id ? getCase(id) ?? null : null); }, []);
  if (item === undefined) return <AppShell><p className="text-slate-500">読み込み中...</p></AppShell>;
  if (!item) return <AppShell><NotFound /></AppShell>;
  const remove = () => { if (window.confirm("この事例を削除しますか？ この操作は元に戻せません。")) { removeCase(item.id); router.push("/cases"); } };
  return <AppShell><Link href="/cases" className="text-sm font-bold text-[#176b87] hover:underline">← 一覧へ戻る</Link><div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap gap-2"><LevelBadge level={item.judgmentLevel} /><StatusBadge status={item.status} /></div><h1 className="mt-3 text-2xl font-bold text-[#163047] sm:text-3xl">{item.title}</h1><p className="mt-2 text-slate-600">{item.projectName || "現場名未入力"} · 登録日 {item.recordedAt}</p></div><div className="flex gap-2"><Link href={`/cases/edit/?id=${item.id}`} className="rounded-lg border border-[#176b87] px-4 py-2 font-bold text-[#176b87] hover:bg-sky-50">編集</Link><button onClick={remove} className="rounded-lg border border-rose-300 px-4 py-2 font-bold text-rose-700 hover:bg-rose-50">削除</button></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Info label="管理分類" value={item.managementCategory} /><Info label="工種" value={item.workCategory} /><Info label="場所" value={item.location} /><Info label="工事段階" value={item.workPhase} /></div><div className="mt-6 space-y-4">{sections.map((section) => <Section key={section.key} title={section.title} value={item[section.key]} list={section.list} />)}<Section title="タグ" value={item.tags} list /></div></AppShell>;
}
function NotFound() { return <div className="rounded-xl bg-white p-8 text-center"><h1 className="text-xl font-bold">事例が見つかりません</h1><Link href="/cases" className="mt-4 inline-block text-[#176b87] underline">一覧へ戻る</Link></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-slate-200 bg-white px-4 py-3"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1">{value || "—"}</p></div>; }
function Section({ title, value, list }: { title: string; value: string | string[]; list?: boolean }) { if ((Array.isArray(value) && !value.length) || (!Array.isArray(value) && !value)) return null; return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-[#163047]">{title}</h2>{list && Array.isArray(value) ? <ul className="mt-3 space-y-2">{value.map((v) => <li key={v} className="flex gap-2 text-slate-700"><span className="text-[#176b87]">•</span><span>{v}</span></li>)}</ul> : <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{value as string}</p>}</section>; }
