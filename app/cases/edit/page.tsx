"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CaseForm, CaseFormData } from "@/components/CaseForm";
import { KnowledgeCase } from "@/lib/types";
import { getCase, upsertCase } from "@/lib/storage";

export default function EditCasePage() {
  const router = useRouter();
  const [item, setItem] = useState<KnowledgeCase | null | undefined>(undefined);
  useEffect(() => { const id = new URLSearchParams(window.location.search).get("id"); setItem(id ? getCase(id) ?? null : null); }, []);
  if (item === undefined) return <AppShell><p className="text-slate-500">読み込み中...</p></AppShell>;
  if (!item) return <AppShell><div className="rounded-xl bg-white p-8 text-center"><h1 className="text-xl font-bold">事例が見つかりません</h1><Link href="/cases" className="mt-4 inline-block text-[#176b87] underline">一覧へ戻る</Link></div></AppShell>;
  const save = (data: CaseFormData) => { upsertCase({ ...item, ...data, updatedAt: new Date().toISOString() }); router.push(`/cases/detail/?id=${item.id}`); };
  return <AppShell><div className="mb-7"><h1 className="text-2xl font-bold text-[#163047] sm:text-3xl">事例を編集</h1><p className="mt-2 text-sm text-slate-600">内容を修正して保存できます。</p></div><CaseForm initialCase={item} onSave={save} saveLabel="変更を保存する" /></AppShell>;
}
