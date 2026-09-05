import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";
import type { ReactNode } from "react";

/** 規約・プライバシーポリシー・問い合わせ用の共通枠。アプリ本体と同じスマホ幅に揃える。 */
export function LegalShell({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-slate-300">
      <div className="flex min-h-dvh w-full max-w-[480px] flex-col bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-1 bg-denkou px-2 text-white">
          <Link
            href="/"
            className="tap flex items-center gap-0.5 rounded-lg px-2 text-sm font-bold active:bg-white/10"
          >
            <ChevronLeft size={20} strokeWidth={2.8} />
            戻る
          </Link>
          <p className="flex-1 truncate text-center text-[15px] font-black">{title}</p>
          <span className="grid w-11 place-items-center">
            <Zap size={18} strokeWidth={3} fill="currentColor" className="text-denkou-accent" />
          </span>
        </header>

        <main className="flex-1 px-4 py-5">
          <p className="text-[11px] font-bold text-slate-500">最終更新日：{updatedAt}</p>
          <div className="legal mt-4">{children}</div>

          <nav className="mt-10 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-4 text-[12px] font-bold text-denkou">
            <Link href="/" className="underline">
              電工コネクト トップ
            </Link>
            <Link href="/terms/" className="underline">
              利用規約
            </Link>
            <Link href="/privacy/" className="underline">
              プライバシーポリシー
            </Link>
            <Link href="/contact/" className="underline">
              お問い合わせ・削除依頼
            </Link>
          </nav>
        </main>
      </div>
    </div>
  );
}

/** 見出し＋本文のまとまり */
export function Article({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="text-[15px] font-black leading-snug text-slate-900">{heading}</h2>
      <div className="mt-1.5 space-y-2 text-[13.5px] leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

/** 番号なしの箇条書き */
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-slate-400">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** 特に読ませたい注意 */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-[13px] font-semibold leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-300">
      {children}
    </p>
  );
}
