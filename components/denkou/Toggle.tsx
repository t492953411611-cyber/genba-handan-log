"use client";

import type { ReactNode } from "react";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: "navy" | "amber";
};

export function Toggle({ checked, onChange, label, description, icon, tone = "navy" }: Props) {
  const onColor = tone === "amber" ? "bg-red-600" : "bg-denkou";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
        checked ? "border-slate-400 bg-slate-50" : "border-slate-300 bg-white"
      }`}
    >
      {icon && <span className={checked ? "text-slate-900" : "text-slate-500"}>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold text-slate-900">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">{description}</span>
        )}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? onColor : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
