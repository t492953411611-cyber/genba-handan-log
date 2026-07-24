"use client";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CaseForm, CaseFormData } from "@/components/CaseForm";
import { upsertCase } from "@/lib/storage";

export default function NewCasePage() { const router = useRouter(); const save = (data: CaseFormData) => { const timestamp = new Date().toISOString(); const id = crypto.randomUUID(); upsertCase({ ...data, id, createdAt: timestamp, updatedAt: timestamp }); router.push(`/cases/detail/?id=${id}`); }; return <AppShell><PageTitle title="新しい現場判断を記録" description="現場で気付いたことと、行った判断を記録します。" /><CaseForm onSave={save} saveLabel="事例を保存する" /></AppShell>; }
function PageTitle({ title, description }: { title: string; description: string }) { return <div className="mb-7"><h1 className="text-2xl font-bold text-[#163047] sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-600">{description}</p></div>; }
