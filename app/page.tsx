"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LevelBadge, StatusBadge } from "@/components/Badges";
import { KnowledgeCase } from "@/lib/types";
import { loadCases } from "@/lib/storage";

export default function HomePage() {
  const [cases, setCases] = useState<KnowledgeCase[]>([]);
  useEffect(() => setCases(loadCases()), []);
  const recent = [...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  return <AppShell><section className="rounded-2xl bg-[#163047] px-5 py-8 text-white sm:px-9 sm:py-11"><p className="text-sm font-bold tracking-widest text-sky-200">ELECTRICAL CONSTRUCTION</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">現場判断ログ</h1><p className="mt-3 max-w-2xl leading-7 text-slate-200">現場での気付き、判断、指示を記録し、再利用できる施工管理の知識として蓄積します。</p><Link href="/cases/new" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#f2ae31] px-5 font-bold text-slate-900 shadow-sm hover:bg-[#ffc65d]">＋ 新しい現場判断を記録する</Link></section>
  <section className="mt-6 grid gap-4 sm:grid-cols-3"><Stat label="登録済み事例" value={cases.length} /><Stat label="下書き" value={cases.filter((c) => c.status === "下書き").length} /><Stat label="承認済み" value={cases.filter((c) => c.status === "承認済み").length} /></section>
  <section className="mt-9"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-[#163047]">最近登録した事例</h2><Link href="/cases" className="text-sm font-bold text-[#176b87] hover:underline">すべて見る →</Link></div>{recent.length === 0 ? <Empty /> : <div className="grid gap-4 md:grid-cols-2">{recent.map((item) => <Link href={`/cases/detail/?id=${item.id}`} key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#176b87]"><div className="flex gap-2"><LevelBadge level={item.judgmentLevel} /><StatusBadge status={item.status} /></div><h3 className="mt-3 font-bold text-slate-800">{item.title}</h3><p className="mt-2 text-sm text-slate-600">{item.projectName || "現場名未入力"} · {item.recordedAt}</p></Link>)}</div>}</section></AppShell>;
}
function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">{label}</p><p className="mt-1 text-3xl font-bold text-[#163047]">{value}<span className="ml-1 text-base font-normal text-slate-500">件</span></p></div>; }
function Empty() { return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">まだ事例がありません。最初の現場判断を記録しましょう。</div>; }
