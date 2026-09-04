"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";
import { PHOTO_LIBRARY, fileToDataUrl } from "@/lib/denkou/images";

type Props = {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  compact?: boolean;
};

export function PhotoPicker({ value, onChange, compact = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    try {
      onChange(await fileToDataUrl(file));
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="添付写真のプレビュー"
            className={`w-full rounded-lg border border-slate-300 object-cover ${
              compact ? "h-28" : "h-44"
            }`}
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="写真を削除"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-slate-900/75 text-white shadow"
          >
            <X size={16} strokeWidth={3} />
          </button>
          <p className="mt-1 text-[11px] font-semibold text-emerald-700">
            プレビュー中：この写真が投稿に添付されます
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-400 bg-slate-50 text-[13px] font-bold text-slate-700 transition active:bg-slate-100 disabled:opacity-60 ${
              compact ? "" : "py-3"
            }`}
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" strokeWidth={2.6} />
            ) : (
              <Camera size={17} strokeWidth={2.4} />
            )}
            {loading ? "読み込み中…" : "現場写真を選ぶ"}
          </button>
          <button
            type="button"
            onClick={() => setSampleOpen((v) => !v)}
            aria-expanded={sampleOpen}
            className="tap flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-400 bg-slate-50 px-3 text-[13px] font-bold text-slate-700 transition active:bg-slate-100"
          >
            <ImagePlus size={17} strokeWidth={2.4} />
            見本
          </button>
        </div>
      )}

      {sampleOpen && !value && (
        <div className="mt-2 rounded-lg border border-slate-300 bg-white p-2">
          <p className="mb-1.5 text-[11px] font-bold text-slate-600">
            動作確認用のダミー写真（タップで添付）
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {PHOTO_LIBRARY.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(src);
                  setSampleOpen(false);
                }}
                className="overflow-hidden rounded border border-slate-200 active:opacity-70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`ダミー写真 ${i + 1}`} className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
