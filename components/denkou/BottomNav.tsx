"use client";

import { Bookmark, Home, PlusCircle, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TabId = "timeline" | "new" | "saved" | "mypage";

const ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "timeline", label: "タイムライン", icon: Home },
  { id: "new", label: "新規投稿", icon: PlusCircle },
  { id: "saved", label: "保存一覧", icon: Bookmark },
  { id: "mypage", label: "マイページ", icon: UserRound },
];

type Props = {
  active: TabId;
  savedCount: number;
  onSelect: (id: TabId) => void;
};

export function BottomNav({ active, savedCount, onSelect }: Props) {
  return (
    <nav className="safe-bottom sticky bottom-0 z-30 border-t border-slate-300 bg-white shadow-[0_-2px_10px_rgba(15,23,42,0.08)]">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const isNew = id === "new";
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex w-full flex-col items-center justify-center gap-0.5 px-1 py-2 transition ${
                  isActive ? "text-denkou" : "text-slate-500"
                } active:bg-slate-100`}
              >
                <span className="relative">
                  <Icon
                    size={isNew ? 26 : 23}
                    strokeWidth={isActive ? 2.6 : 2}
                    className={isNew ? "text-denkou-accent-dark" : undefined}
                  />
                  {id === "saved" && savedCount > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-denkou px-1 text-[10px] font-bold text-white">
                      {savedCount}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] ${isActive ? "font-black" : "font-semibold"}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-denkou-accent" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
