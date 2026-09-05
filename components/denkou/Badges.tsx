import { AlertTriangle, CircleHelp, CircleCheckBig } from "lucide-react";
import { CATEGORY_MAP, type CategoryId, type PostStatus } from "@/lib/denkou/types";

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
        これで解決！
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
