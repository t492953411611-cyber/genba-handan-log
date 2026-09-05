"use client";

import { Info, ShieldAlert, TriangleAlert } from "lucide-react";
import { SAFETY_DISCLAIMER, TROUBLE_NOTICE } from "@/lib/denkou/types";

/**
 * 免責。規約の中に埋めず、書く瞬間・読む瞬間に必ず目に入る位置へ常時表示する。
 */
export function SafetyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`flex items-start gap-1.5 border-y border-amber-300 bg-amber-50 px-3 text-amber-900 ${
        compact ? "py-1.5 text-[11px] leading-snug" : "py-2 text-[12px] leading-relaxed"
      }`}
    >
      <Info size={compact ? 13 : 14} strokeWidth={2.6} className="mt-0.5 shrink-0" />
      <span className="font-semibold">{SAFETY_DISCLAIMER}</span>
    </p>
  );
}

/** トラブル投稿の作成時にだけ出す、扱わない話題の明示 */
export function TroubleNotice() {
  return (
    <p className="flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-800 ring-1 ring-inset ring-red-200">
      <TriangleAlert size={14} strokeWidth={2.6} className="mt-0.5 shrink-0" />
      <span className="font-semibold">{TROUBLE_NOTICE}</span>
    </p>
  );
}

/** 危険な内容としての通報ボタン。通常の通報とは分けて、1タップで押せる位置に置く。 */
export function DangerReportButton({
  flagged,
  onReport,
  label = "危険な内容として報告",
}: {
  flagged: boolean;
  onReport: () => void;
  label?: string;
}) {
  if (flagged) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-700">
        <ShieldAlert size={13} strokeWidth={2.8} />
        報告済み
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onReport}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-500 transition active:bg-red-50 active:text-red-700"
    >
      <ShieldAlert size={13} strokeWidth={2.6} />
      {label}
    </button>
  );
}
