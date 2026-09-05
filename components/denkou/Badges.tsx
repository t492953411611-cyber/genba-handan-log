import { AlertTriangle, CircleHelp, CircleCheckBig, ShieldAlert } from "lucide-react";
import {
  CATEGORY_MAP,
  SAFETY_CHECK_MAP,
  type CategoryId,
  type PostStatus,
  type SafetyCheckId,
} from "@/lib/denkou/types";

export function CategoryBadge({ id }: { id: CategoryId }) {
  const c = CATEGORY_MAP[id];
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${c.badgeClass}`}
    >
      {c.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: PostStatus }) {
  if (status === "solved") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
        <CircleCheckBig size={12} strokeWidth={3} />
        解決報告あり
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-slate-700 px-2 py-0.5 text-[11px] font-bold text-white">
      <CircleHelp size={12} strokeWidth={3} />
      回答募集中
    </span>
  );
}

export function UrgentBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
      <AlertTriangle size={12} strokeWidth={3} />
      至急！
    </span>
  );
}

export function AnonymousBadge() {
  return (
    <span className="inline-flex items-center rounded bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-white">
      匿名
    </span>
  );
}

/** 危険な内容として報告された投稿・コメントに付く印 */
export function FlaggedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800 ring-1 ring-inset ring-red-300">
      <ShieldAlert size={12} strokeWidth={2.8} />
      運営が確認中
    </span>
  );
}

/** 投稿者が現場で確認済みの項目。「答え」より先に「切り分け」を見せる。 */
export function SafetyCheckList({ checks }: { checks: SafetyCheckId[] }) {
  if (checks.length === 0) return null;
  return (
    <div className="mt-2 rounded-lg bg-slate-100 px-2.5 py-2 ring-1 ring-inset ring-slate-200">
      <p className="text-[10px] font-black tracking-wide text-slate-500">投稿者が確認済み</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {checks.map((id) => (
          <span
            key={id}
            className="inline-flex items-center rounded bg-white px-1.5 py-0.5 text-[11px] font-bold text-slate-700 ring-1 ring-inset ring-slate-300"
          >
            {SAFETY_CHECK_MAP[id]?.short ?? id}
          </span>
        ))}
      </div>
    </div>
  );
}
