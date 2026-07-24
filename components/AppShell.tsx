import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><Link href="/" className="text-lg font-bold tracking-tight text-[#163047]">現場判断ログ</Link><nav className="flex items-center gap-3 text-sm"><Link className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100" href="/cases">事例一覧</Link><Link className="rounded-md bg-[#176b87] px-3 py-2 font-medium text-white hover:bg-[#11566d]" href="/cases/new">新規登録</Link></nav></div></header><main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">{children}</main></div>;
}
