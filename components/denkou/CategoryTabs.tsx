"use client";

import { CATEGORIES, type CategoryId } from "@/lib/denkou/types";

type Props = {
  active: CategoryId;
  counts: Record<CategoryId, number>;
  onSelect: (id: CategoryId) => void;
};

export function CategoryTabs({ active, counts, onSelect }: Props) {
  return (
    <div className="z-20 shrink-0 border-b border-slate-300 bg-white shadow-sm">
      <div role="tablist" aria-label="カテゴリ" className="grid grid-cols-4 gap-1 px-1.5 py-1.5">
        {CATEGORIES.map((c) => {
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(c.id)}
              className={`tap flex flex-col items-center justify-center rounded-lg px-0.5 py-1 transition ${
                isActive
                  ? "bg-denkou text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 active:bg-slate-200"
              }`}
            >
              {/* 狭い実機幅でもラベルが枠からはみ出さないよう字送りを可変にする */}
              <span className="whitespace-nowrap text-[clamp(9px,2.55vw,11px)] font-black tracking-tighter">
                {c.label}
              </span>
              <span
                className={`text-[10px] font-black leading-tight ${
                  isActive ? "text-denkou-accent" : "text-slate-500"
                }`}
              >
                {counts[c.id]}件
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
