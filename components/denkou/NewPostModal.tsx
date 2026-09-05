"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, EyeOff, Send, X } from "lucide-react";
import { PhotoPicker } from "./PhotoPicker";
import { Toggle } from "./Toggle";
import type { NewPostInput } from "@/lib/denkou/store";
import { ANON_NAME, CATEGORIES, CURRENT_USER, type CategoryId } from "@/lib/denkou/types";

type Props = {
  open: boolean;
  defaultCategory: CategoryId;
  onClose: () => void;
  onSubmit: (input: NewPostInput) => void;
};

const PLACEHOLDERS: Record<CategoryId, { title: string; body: string }> = {
  trouble: {
    title: "例）動力盤の結線後に逆相リレーが復帰しない",
    body: "現場の状況、電圧・相順などの測定値、試したこと、いつまでに解決したいかを書くと回答が集まりやすくなります。",
  },
  knowhow: {
    title: "例）狭い天井内でVVFを通すときの段取り",
    body: "手順を番号付きで書くと後から読む人が再現しやすくなります。使う工具や材料、注意点も添えてください。",
  },
  anonymous: {
    title: "例）接地抵抗が規定値まで下がらない現場での判断",
    body: "会社や現場が特定される固有名詞は避けて書いてください。投稿者名は「匿名電工」で表示されます。",
  },
  review: {
    title: "例）2社のペンチを1年使った比較",
    body: "使った期間、用途、良かった点・不満点、どんな職種の人に向くかを書くと参考になります。",
  },
};

export function NewPostModal({ open, defaultCategory, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<CategoryId>(defaultCategory);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [site, setSite] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setCategory(defaultCategory);
      setTitle("");
      setBody("");
      setSite("");
      setAnonymous(defaultCategory === "anonymous");
      setUrgent(false);
      setPhoto(undefined);
      setTouched(false);
    }
  }, [open, defaultCategory]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const isTrouble = category === "trouble";
  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function handleCategory(next: CategoryId) {
    setCategory(next);
    if (next === "anonymous") setAnonymous(true);
    if (next !== "trouble") setUrgent(false);
  }

  function handleSubmit() {
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({ category, title, body, anonymous, urgent: isTrouble && urgent, photo, site });
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-slate-900/50">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="h-10 w-full cursor-default bg-transparent"
      />
      <div className="animate-sheet flex min-h-0 flex-1 flex-col rounded-t-2xl bg-white shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between rounded-t-2xl border-b border-slate-200 bg-denkou px-3 text-white">
          <button
            type="button"
            onClick={onClose}
            className="tap flex items-center gap-1 rounded-lg px-2 text-sm font-bold active:bg-white/10"
          >
            <X size={18} strokeWidth={2.6} />
            やめる
          </button>
          <p className="text-[15px] font-black">新規投稿</p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`tap flex items-center gap-1.5 rounded-lg px-3 text-sm font-black transition ${
              canSubmit
                ? "bg-denkou-accent text-denkou-dark active:bg-amber-400"
                : "bg-white/20 text-white/60"
            }`}
          >
            <Send size={16} strokeWidth={2.8} />
            投稿
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 pb-8">
          <section>
            <p className="mb-1.5 text-[12px] font-black text-slate-700">カテゴリ</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`tap rounded-lg px-2 text-[13px] font-bold transition ${
                    category === c.id
                      ? "bg-denkou text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 active:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="np-title" className="mb-1.5 block text-[12px] font-black text-slate-700">
              タイトル <span className="text-red-600">必須</span>
            </label>
            <input
              id="np-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={PLACEHOLDERS[category].title}
              maxLength={80}
              className={`w-full rounded-lg border px-3 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 ${
                touched && !title.trim() ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
              }`}
            />
            <p className="mt-1 text-right text-[11px] text-slate-500">{title.length}/80</p>
          </section>

          <section>
            <label htmlFor="np-body" className="mb-1.5 block text-[12px] font-black text-slate-700">
              本文 <span className="text-red-600">必須</span>
            </label>
            <textarea
              id="np-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={PLACEHOLDERS[category].body}
              rows={7}
              className={`w-full rounded-lg border px-3 py-2.5 text-[14px] leading-relaxed text-slate-900 placeholder:text-slate-400 ${
                touched && !body.trim() ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
              }`}
            />
          </section>

          <section>
            <label htmlFor="np-site" className="mb-1.5 block text-[12px] font-black text-slate-700">
              現場名・場所（任意）
            </label>
            <input
              id="np-site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="例）熊本市中央区 テナントビル空調更新"
              maxLength={40}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400"
            />
          </section>

          <section>
            <p className="mb-1.5 text-[12px] font-black text-slate-700">現場写真（任意）</p>
            <PhotoPicker value={photo} onChange={setPhoto} />
          </section>

          <section className="space-y-2">
            <Toggle
              checked={anonymous}
              onChange={setAnonymous}
              icon={<EyeOff size={18} strokeWidth={2.4} />}
              label="匿名で投稿する"
              description={
                anonymous
                  ? `投稿者名は「${ANON_NAME}」と表示されます`
                  : `「${CURRENT_USER.title}」として表示されます`
              }
            />

            {isTrouble && (
              <Toggle
                checked={urgent}
                onChange={setUrgent}
                tone="amber"
                icon={<AlertTriangle size={18} strokeWidth={2.4} />}
                label="現場で急ぎ！"
                description="カードが赤枠になり、【至急！】バッジ付きで目立つ形で表示されます"
              />
            )}
          </section>

          <div className="rounded-lg bg-slate-100 p-3">
            <p className="text-[12px] font-black text-slate-700">プレビュー</p>
            <p className="mt-1 text-[12px] text-slate-600">
              投稿者：{anonymous ? ANON_NAME : `${CURRENT_USER.name}（${CURRENT_USER.title}）`}
              {isTrouble && urgent && " ／ 【至急！】バッジ付き"}
            </p>
          </div>

          {touched && !canSubmit && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
              タイトルと本文を入力してください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
