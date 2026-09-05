"use client";

import Link from "next/link";
import {
  Award,
  CircleCheckBig,
  ExternalLink,
  MapPin,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";
import { PostCard } from "./PostCard";
import { CURRENT_USER, type Post } from "@/lib/denkou/types";

type Props = {
  posts: Post[];
  onOpen: (post: Post) => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onReset: () => void;
};

export function MyPage({ posts, onOpen, onLike, onSave, onReset }: Props) {
  const mine = posts.filter((p) => p.authorId === CURRENT_USER.id);
  const likes = mine.reduce((sum, p) => sum + p.likes, 0);
  const solved = mine.filter((p) => p.status === "solved").length;
  const myComments = posts.reduce(
    (sum, p) => sum + p.comments.filter((c) => c.authorId === CURRENT_USER.id).length,
    0,
  );

  return (
    <div className="space-y-3 p-3">
      <section className="overflow-hidden rounded-xl bg-denkou text-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-denkou-accent text-2xl font-black text-denkou-dark">
            {CURRENT_USER.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="text-lg font-black">{CURRENT_USER.name}</p>
            <p className="mt-0.5 text-[12px] font-bold text-blue-100">{CURRENT_USER.title}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-200">
              <MapPin size={12} strokeWidth={2.5} />
              {CURRENT_USER.area}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-white/15 px-4 py-2.5">
          <Award size={16} strokeWidth={2.5} className="text-denkou-accent" />
          <p className="text-[12px] font-bold">
            {CURRENT_USER.license} ／ 現場歴 {CURRENT_USER.years}年
          </p>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-1.5">
        <Stat label="投稿" value={mine.length} />
        <Stat label="コメント" value={myComments} icon={<MessageSquare size={13} />} />
        <Stat label="いいね" value={likes} icon={<ThumbsUp size={13} />} />
        <Stat label="解決報告" value={solved} icon={<CircleCheckBig size={13} />} />
      </section>

      <section>
        <h2 className="mb-2 px-0.5 text-[13px] font-black text-slate-700">自分の投稿</h2>
        {mine.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-400 bg-white px-3 py-8 text-center text-[13px] text-slate-500">
            まだ投稿がありません。下の「新規投稿」から現場の困りごとを書いてみましょう。
          </p>
        ) : (
          <div className="space-y-3">
            {mine.map((p) => (
              <PostCard key={p.id} post={p} onOpen={onOpen} onLike={onLike} onSave={onSave} />
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-300">
        <p className="border-b border-slate-200 px-3 py-2 text-[12px] font-black text-slate-700">
          規約・お問い合わせ
        </p>
        <ul className="divide-y divide-slate-100">
          {[
            { href: "/terms/", label: "利用規約（安全に関する免責を含む）" },
            { href: "/privacy/", label: "プライバシーポリシー" },
            { href: "/contact/", label: "お問い合わせ・削除依頼" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="tap flex items-center justify-between gap-2 px-3 text-[13px] font-bold text-slate-700 active:bg-slate-50"
              >
                {item.label}
                <ExternalLink size={14} strokeWidth={2.4} className="shrink-0 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-1.5 border-t border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
          <ShieldAlert size={13} strokeWidth={2.6} className="mt-0.5 shrink-0 text-slate-500" />
          危険な投稿を見つけたら、投稿・コメントの「危険な内容として報告」を押してください。
        </p>
      </section>

      <section className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-300">
        <p className="text-[12px] font-black text-slate-700">プロトタイプ用の操作</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
          投稿・いいね・保存・解決状態はこの端末のブラウザ（LocalStorage）に保存されています。
          デモをやり直したいときは初期データに戻せます。
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("投稿内容を初期のモックデータに戻します。よろしいですか？")) {
              onReset();
            }
          }}
          className="tap mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-400 bg-slate-50 text-[13px] font-bold text-slate-700 active:bg-slate-100"
        >
          <RotateCcw size={16} strokeWidth={2.4} />
          初期データに戻す
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white px-1 py-2 text-center shadow-sm ring-1 ring-slate-300">
      <p className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-xl font-black text-denkou">{value}</p>
    </div>
  );
}
