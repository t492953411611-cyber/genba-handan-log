"use client";

import { CircleCheckBig, Search, X } from "lucide-react";

type Props = {
  query: string;
  solvedOnly: boolean;
  resultCount: number;
  onQueryChange: (v: string) => void;
  onSolvedOnlyChange: (v: boolean) => void;
};

export function SearchBar({
  query,
  solvedOnly,
  resultCount,
  onQueryChange,
  onSolvedOnlyChange,
}: Props) {
  const active = query.trim().length > 0 || solvedOnly;

  return (
    <div className="shrink-0 border-b border-slate-300 bg-white px-2 pb-2 pt-1.5">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={2.6}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="過去の投稿を検索（例：相順、接地、通線）"
            aria-label="投稿を検索"
            className="tap w-full rounded-lg border border-slate-300 bg-slate-50 py-0 pl-8 pr-8 text-[13px] text-slate-900 placeholder:text-slate-400"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="検索語を消す"
              className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-500 active:bg-slate-200"
            >
              <X size={15} strokeWidth={2.8} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSolvedOnlyChange(!solvedOnly)}
          aria-pressed={solvedOnly}
          className={`tap flex shrink-0 items-center gap-1 rounded-lg px-2.5 text-[12px] font-bold transition ${
            solvedOnly
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 active:bg-slate-200"
          }`}
        >
          <CircleCheckBig size={14} strokeWidth={2.8} />
          解決報告
        </button>
      </div>

      {active && (
        <p className="mt-1.5 px-0.5 text-[11px] font-bold text-slate-600">
          {resultCount}件が一致
          {solvedOnly && "（解決報告ありのみ）"}
        </p>
      )}
    </div>
  );
}
