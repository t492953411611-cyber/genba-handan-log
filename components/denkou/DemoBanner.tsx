"use client";

import { FlaskConical } from "lucide-react";

/**
 * 体験版であることの常時表示。
 *
 * 現在はサーバーを持たず、投稿は各自のブラウザ内にしか保存されない。
 * URLを配って触ってもらう段階なので、「投稿したのに誰も反応しない」という
 * 誤解が生まれないよう、隠さず常に出しておく。
 */
export function DemoBanner() {
  return (
    <p className="flex shrink-0 items-center justify-center gap-1.5 bg-slate-800 px-3 py-1 text-center text-[11px] font-bold leading-snug text-slate-100">
      <FlaskConical size={12} strokeWidth={2.8} className="shrink-0 text-denkou-accent" />
      体験版：投稿はこの端末内だけに保存され、他の人には表示されません
    </p>
  );
}
