"use client";

import { useEffect, useRef } from "react";
import { Bell, Zap } from "lucide-react";
import type { NotificationItem } from "@/lib/denkou/mock";
import { timeAgo } from "@/lib/denkou/store";

type Props = {
  notifications: NotificationItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function Header({ notifications, open, onToggle, onClose }: Props) {
  const unread = notifications.filter((n) => n.unread).length;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <header className="sticky top-0 z-30 bg-denkou text-white shadow-md">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-denkou-accent text-denkou-dark">
            <Zap size={20} strokeWidth={3} fill="currentColor" />
          </span>
          <div className="leading-none">
            <h1 className="text-lg font-black tracking-wide">電工コネクト</h1>
            <p className="mt-0.5 text-[10px] font-medium tracking-widest text-blue-200">
              ELECTRICIANS FIELD NETWORK
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={`通知${unread > 0 ? `（未読${unread}件）` : ""}`}
          aria-expanded={open}
          className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/10 active:bg-white/20"
        >
          <Bell size={22} strokeWidth={2.4} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-denkou-accent px-1 text-[10px] font-black text-denkou-dark ring-2 ring-denkou">
              {unread}
            </span>
          )}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="通知を閉じる"
            onClick={onClose}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div
            ref={panelRef}
            className="absolute right-3 top-14 z-20 w-[19rem] max-w-[calc(100%-1.5rem)] animate-rise overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-300"
          >
            <p className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700">
              通知
            </p>
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 text-sm leading-relaxed ${n.unread ? "bg-amber-50" : ""}`}
                >
                  <p className="text-slate-800">{n.text}</p>
                  <p className="mt-1 text-xs text-slate-500">{timeAgo(n.createdAt)}</p>
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-slate-500">通知はありません</li>
              )}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
