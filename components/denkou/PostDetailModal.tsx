"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  CircleCheckBig,
  EyeOff,
  HardHat,
  MapPin,
  Send,
  ThumbsUp,
} from "lucide-react";
import {
  AnonymousBadge,
  CategoryBadge,
  FlaggedBadge,
  SafetyCheckList,
  StatusBadge,
  UrgentBadge,
} from "./Badges";
import { PhotoPicker } from "./PhotoPicker";
import { DangerReportButton, SafetyNotice } from "./SafetyNotice";
import { timeAgo } from "@/lib/denkou/store";
import {
  ANON_NAME,
  CURRENT_USER,
  displayName,
  displayTitle,
  type Comment,
  type Post,
} from "@/lib/denkou/types";

type Props = {
  post: Post | null;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onCommentLike: (postId: string, commentId: string) => void;
  onMarkSolution: (postId: string, commentId: string) => void;
  onReportDanger: (postId: string, commentId?: string) => void;
  onAddComment: (input: { postId: string; body: string; anonymous: boolean; photo?: string }) => void;
};

export function PostDetailModal({
  post,
  onClose,
  onLike,
  onSave,
  onCommentLike,
  onMarkSolution,
  onReportDanger,
  onAddComment,
}: Props) {
  const [draft, setDraft] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [anonymous, setAnonymous] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);

  const postId = post?.id;

  useEffect(() => {
    setDraft("");
    setPhoto(undefined);
    setAttachOpen(false);
    setAnonymous(post?.category === "anonymous");
  }, [postId, post?.category]);

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  const ordered = useMemo(() => {
    if (!post) return [];
    const solution = post.comments.filter((c) => c.isSolution);
    const rest = post.comments
      .filter((c) => !c.isSolution)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return [...solution, ...rest];
  }, [post]);

  if (!post) return null;

  const isOwner = post.authorId === CURRENT_USER.id;
  const solved = post.status === "solved";

  function submitComment() {
    if (!post) return;
    if (!draft.trim()) return;
    onAddComment({ postId: post.id, body: draft, anonymous, photo });
    setDraft("");
    setPhoto(undefined);
    setAttachOpen(false);
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center gap-1 border-b border-slate-200 bg-denkou px-2 text-white">
        <button
          type="button"
          onClick={onClose}
          className="tap flex items-center gap-0.5 rounded-lg px-2 text-sm font-bold active:bg-white/10"
        >
          <ChevronLeft size={20} strokeWidth={2.8} />
          戻る
        </button>
        <p className="flex-1 truncate text-center text-[15px] font-black">投稿の詳細</p>
        <button
          type="button"
          onClick={() => onSave(post.id)}
          aria-label={post.saved ? "保存を解除" : "保存する"}
          className="tap grid w-11 place-items-center rounded-lg active:bg-white/10"
        >
          <Bookmark
            size={20}
            strokeWidth={2.4}
            fill={post.saved ? "currentColor" : "none"}
            className={post.saved ? "text-denkou-accent" : "text-white"}
          />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
        <article className="bg-white px-3 py-3">
          {post.urgent && !solved && (
            <p className="-mx-3 -mt-3 mb-3 bg-red-600 px-3 py-1.5 text-[12px] font-black text-white">
              現場で急ぎ！ 至急の回答を求めています
            </p>
          )}
          {solved && (
            <p className="-mx-3 -mt-3 mb-3 flex items-center gap-1.5 bg-emerald-600 px-3 py-1.5 text-[12px] font-black text-white">
              <CircleCheckBig size={14} strokeWidth={3} />
              投稿者から「この方法で直った」と報告があった投稿です
            </p>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black text-white ${
                post.anonymous ? "bg-slate-700" : "bg-denkou"
              }`}
            >
              {post.anonymous ? (
                <HardHat size={20} strokeWidth={2.4} />
              ) : (
                displayName(post).slice(0, 1)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900">
                <span className="truncate">{displayName(post)}</span>
                {post.anonymous && <AnonymousBadge />}
              </p>
              <p className="truncate text-[11px] text-slate-600">
                {displayTitle(post)} ・ {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {post.urgent && !solved && <UrgentBadge />}
            <CategoryBadge id={post.category} />
            <StatusBadge status={post.status} />
            {post.flagged && <FlaggedBadge />}
          </div>

          <h2 className="mt-2.5 text-[17px] font-black leading-snug text-slate-900">{post.title}</h2>

          {post.site && (
            <p className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-slate-600">
              <MapPin size={13} strokeWidth={2.5} />
              {post.site}
            </p>
          )}

          <SafetyCheckList checks={post.checks} />

          <p className="mt-2.5 whitespace-pre-wrap text-[14px] leading-7 text-slate-800">
            {post.body}
          </p>

          {post.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.photo}
              alt="現場写真"
              className="mt-3 w-full rounded-lg border border-slate-200"
            />
          )}

          <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-2">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              aria-pressed={post.likedByMe}
              className={`tap flex items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold transition active:bg-slate-100 ${
                post.likedByMe ? "text-denkou-accent-dark" : "text-slate-600"
              }`}
            >
              <ThumbsUp
                size={17}
                strokeWidth={2.4}
                fill={post.likedByMe ? "currentColor" : "none"}
              />
              参考になった {post.likes}
            </button>
            <span className="ml-auto">
              <DangerReportButton
                flagged={post.flagged}
                onReport={() => onReportDanger(post.id)}
              />
            </span>
          </div>
        </article>

        {isOwner && !solved && post.comments.length > 0 && (
          <p className="mx-3 mt-3 rounded-lg bg-amber-100 px-3 py-2 text-[12px] font-bold leading-relaxed text-amber-900 ring-1 ring-amber-300">
            あなたの投稿です。実際に直ったコメントの「この方法で直りました」を押すと、そのコメントが最上部に固定され、解決報告として表示されます。
          </p>
        )}

        <section className="mt-3 px-3 pb-4">
          <h3 className="mb-2 text-[13px] font-black text-slate-700">
            コメント {post.comments.length}件
          </h3>

          <ul className="space-y-2">
            {ordered.map((c) => (
              <CommentRow
                key={c.id}
                comment={c}
                isOwner={isOwner}
                onLike={() => onCommentLike(post.id, c.id)}
                onMarkSolution={() => onMarkSolution(post.id, c.id)}
                onReportDanger={() => onReportDanger(post.id, c.id)}
              />
            ))}
            {ordered.length === 0 && (
              <li className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-[13px] text-slate-500">
                まだコメントはありません。最初の一件を書いてみましょう。
              </li>
            )}
          </ul>
        </section>
      </div>

      <div className="safe-bottom shrink-0 bg-white">
        <SafetyNotice compact />
        <div className="p-2">
        {attachOpen && (
          <div className="mb-2">
            <PhotoPicker value={photo} onChange={setPhoto} compact />
          </div>
        )}
        <div className="flex items-end gap-1.5">
          <button
            type="button"
            onClick={() => setAttachOpen((v) => !v)}
            aria-pressed={attachOpen}
            aria-label="写真を添付"
            className={`tap grid w-11 shrink-0 place-items-center rounded-lg border transition ${
              photo
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-4.6-4.6a2 2 0 0 0-2.8 0L3 21" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAnonymous((v) => !v)}
            aria-pressed={anonymous}
            aria-label="匿名で返信"
            title={anonymous ? `${ANON_NAME}として返信` : "実名で返信"}
            className={`tap grid w-11 shrink-0 place-items-center rounded-lg border transition ${
              anonymous
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            <EyeOff size={19} strokeWidth={2.3} />
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            placeholder={anonymous ? `${ANON_NAME}として返信…` : "現場での経験を書く…"}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={submitComment}
            disabled={!draft.trim()}
            aria-label="コメントを送信"
            className={`tap grid w-11 shrink-0 place-items-center rounded-lg transition ${
              draft.trim()
                ? "bg-denkou text-white active:bg-denkou-dark"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            <Send size={19} strokeWidth={2.4} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentRow({
  comment,
  isOwner,
  onLike,
  onMarkSolution,
  onReportDanger,
}: {
  comment: Comment;
  isOwner: boolean;
  onLike: () => void;
  onMarkSolution: () => void;
  onReportDanger: () => void;
}) {
  const mine = comment.authorId === CURRENT_USER.id;
  return (
    <li
      className={`rounded-lg bg-white p-3 shadow-sm ${
        comment.isSolution ? "border-2 border-emerald-500 ring-2 ring-emerald-200" : "ring-1 ring-slate-200"
      }`}
    >
      {comment.isSolution && (
        <p className="-mx-3 -mt-3 mb-2.5 flex items-center gap-1.5 rounded-t-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-black text-white">
          <CircleCheckBig size={14} strokeWidth={3} />
          この方法で直りました（投稿者の報告）
        </p>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-black text-white ${
            comment.anonymous ? "bg-slate-700" : "bg-slate-500"
          }`}
        >
          {comment.anonymous ? (
            <HardHat size={16} strokeWidth={2.4} />
          ) : (
            displayName(comment).slice(0, 1)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <span className="truncate">{displayName(comment)}</span>
            {mine && !comment.anonymous && (
              <span className="rounded bg-denkou-accent px-1.5 py-0.5 text-[10px] font-black text-denkou-dark">
                自分
              </span>
            )}
          </p>
          <p className="truncate text-[11px] text-slate-600">
            {displayTitle(comment)} ・ {timeAgo(comment.createdAt)}
          </p>
        </div>
      </div>

      {comment.flagged && (
        <p className="mt-2">
          <FlaggedBadge />
        </p>
      )}

      <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-slate-800">
        {comment.body}
      </p>

      {comment.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={comment.photo}
          alt="コメントの添付写真"
          className="mt-2 max-h-56 w-full rounded-lg border border-slate-200 object-cover"
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={comment.likedByMe}
          className={`tap flex items-center gap-1.5 rounded-lg px-2 text-[12px] font-bold transition active:bg-slate-100 ${
            comment.likedByMe ? "text-denkou-accent-dark" : "text-slate-600"
          }`}
        >
          <ThumbsUp size={15} strokeWidth={2.5} fill={comment.likedByMe ? "currentColor" : "none"} />
          {comment.likes}
        </button>

        <DangerReportButton
          flagged={comment.flagged}
          onReport={onReportDanger}
          label="危険として報告"
        />

        {isOwner && (
          <button
            type="button"
            onClick={onMarkSolution}
            className={`tap ml-auto flex items-center gap-1.5 rounded-lg px-3 text-[12px] font-black transition ${
              comment.isSolution
                ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400 active:bg-emerald-200"
                : "bg-emerald-600 text-white shadow-sm active:bg-emerald-700"
            }`}
          >
            <CircleCheckBig size={15} strokeWidth={3} />
            {comment.isSolution ? "報告を取り消す" : "この方法で直りました"}
          </button>
        )}
      </div>
    </li>
  );
}
