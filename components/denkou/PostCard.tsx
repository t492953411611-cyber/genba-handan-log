"use client";

import { Bookmark, HardHat, MapPin, MessageSquare, ThumbsUp } from "lucide-react";
import {
  AnonymousBadge,
  CategoryBadge,
  FlaggedBadge,
  SafetyCheckList,
  StatusBadge,
  UrgentBadge,
} from "./Badges";
import { timeAgo } from "@/lib/denkou/store";
import { CURRENT_USER, displayName, displayTitle, type Post } from "@/lib/denkou/types";

type Props = {
  post: Post;
  onOpen: (post: Post) => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
};

export function PostCard({ post, onOpen, onLike, onSave }: Props) {
  const solved = post.status === "solved";
  const mine = post.authorId === CURRENT_USER.id;

  return (
    <article
      className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition ${
        post.urgent && !solved
          ? "ring-2 ring-red-500"
          : solved
            ? "ring-2 ring-emerald-500"
            : "ring-slate-300"
      }`}
    >
      {post.urgent && !solved && (
        <p className="bg-red-600 px-3 py-1 text-[11px] font-black tracking-wide text-white">
          現場で急ぎ！ 至急の回答を求めています
        </p>
      )}

      <button
        type="button"
        onClick={() => onOpen(post)}
        className="block w-full px-3 pt-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${
              post.anonymous ? "bg-slate-700 text-white" : "bg-denkou text-white"
            }`}
          >
            {post.anonymous ? <HardHat size={18} strokeWidth={2.4} /> : displayName(post).slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
              <span className="truncate">{displayName(post)}</span>
              {post.anonymous && <AnonymousBadge />}
              {mine && !post.anonymous && (
                <span className="rounded bg-denkou-accent px-1.5 py-0.5 text-[10px] font-black text-denkou-dark">
                  自分
                </span>
              )}
            </p>
            <p className="truncate text-[11px] text-slate-600">
              {displayTitle(post)} ・ {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {post.urgent && !solved && <UrgentBadge />}
          <CategoryBadge id={post.category} />
          <StatusBadge status={post.status} />
          {post.flagged && <FlaggedBadge />}
        </div>

        <h2 className="mt-2 text-[15px] font-bold leading-snug text-slate-900">{post.title}</h2>

        <p className="mt-1.5 line-clamp-3 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">
          {post.body}
        </p>

        <SafetyCheckList checks={post.checks} />

        {post.site && (
          <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <MapPin size={12} strokeWidth={2.5} />
            {post.site}
          </p>
        )}

        {post.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.photo}
            alt="現場写真"
            className="mt-2.5 h-44 w-full rounded-lg border border-slate-200 object-cover"
          />
        )}
      </button>

      <div className="mt-1 flex items-center gap-1 border-t border-slate-200 px-1.5 py-1">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          aria-pressed={post.likedByMe}
          className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition active:bg-slate-100 ${
            post.likedByMe ? "text-denkou-accent-dark" : "text-slate-600"
          }`}
        >
          <ThumbsUp size={17} strokeWidth={2.4} fill={post.likedByMe ? "currentColor" : "none"} />
          {post.likes}
        </button>

        <button
          type="button"
          onClick={() => onOpen(post)}
          className="tap flex flex-1 items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold text-slate-600 transition active:bg-slate-100"
        >
          <MessageSquare size={17} strokeWidth={2.4} />
          {post.comments.length}
        </button>

        <button
          type="button"
          onClick={() => onSave(post.id)}
          aria-pressed={post.saved}
          aria-label={post.saved ? "保存を解除" : "保存する"}
          className={`tap flex flex-1 items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition active:bg-slate-100 ${
            post.saved ? "text-denkou" : "text-slate-600"
          }`}
        >
          <Bookmark size={17} strokeWidth={2.4} fill={post.saved ? "currentColor" : "none"} />
          {post.saved ? "保存済" : "保存"}
        </button>
      </div>
    </article>
  );
}
