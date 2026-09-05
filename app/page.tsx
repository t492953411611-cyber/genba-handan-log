"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, CircleCheckBig, Loader2, Plus } from "lucide-react";
import { BottomNav, type TabId } from "@/components/denkou/BottomNav";
import { CategoryTabs } from "@/components/denkou/CategoryTabs";
import { Header } from "@/components/denkou/Header";
import { MyPage } from "@/components/denkou/MyPage";
import { NewPostModal } from "@/components/denkou/NewPostModal";
import { PostCard } from "@/components/denkou/PostCard";
import { ConsentGate } from "@/components/denkou/ConsentGate";
import { PostDetailModal } from "@/components/denkou/PostDetailModal";
import { SearchBar } from "@/components/denkou/SearchBar";
import { useDenkouStore, type NewPostInput } from "@/lib/denkou/store";
import { CATEGORY_MAP, type CategoryId, type Post } from "@/lib/denkou/types";

export default function DenkouConnectPage() {
  const store = useDenkouStore();
  const [tab, setTab] = useState<TabId>("timeline");
  const [category, setCategory] = useState<CategoryId>("trouble");
  const [composerOpen, setComposerOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [solvedOnly, setSolvedOnly] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);

  const { posts, notifications, ready } = store;

  const counts = useMemo(() => {
    const base: Record<CategoryId, number> = { trouble: 0, knowhow: 0, anonymous: 0, review: 0 };
    for (const p of posts) base[p.category] += 1;
    return base;
  }, [posts]);

  const timeline = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => p.category === category)
      .filter((p) => (solvedOnly ? p.status === "solved" : true))
      .filter((p) => {
        if (!q) return true;
        // 本文と現場名に加えてコメントも見る。解決した答えは本文でなくコメント側にあるため。
        const haystack = [p.title, p.body, p.site ?? "", ...p.comments.map((c) => c.body)]
          .join("\n")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [posts, category, query, solvedOnly]);

  const savedPosts = useMemo(
    () => posts.filter((p) => p.saved).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [posts],
  );

  const detail = useMemo(
    () => posts.find((p) => p.id === detailId) ?? null,
    [posts, detailId],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openDetail = useCallback((post: Post) => {
    setDetailId(post.id);
    setNotifOpen(false);
  }, []);

  const handleNav = useCallback((next: TabId) => {
    setNotifOpen(false);
    if (next === "new") {
      setComposerOpen(true);
      return;
    }
    setTab(next);
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  const handleSubmitPost = useCallback(
    (input: NewPostInput) => {
      store.addPost(input);
      setComposerOpen(false);
      setTab("timeline");
      setCategory(input.category);
      window.setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
      setToast(
        input.urgent && input.category === "trouble"
          ? "【至急】として投稿しました"
          : "投稿しました",
      );
    },
    [store],
  );

  const handleMarkSolution = useCallback(
    (postId: string, commentId: string) => {
      const before = posts.find((p) => p.id === postId);
      const wasSolution = before?.comments.find((c) => c.id === commentId)?.isSolution;
      store.markSolution(postId, commentId);
      setToast(wasSolution ? "解決報告を取り消しました" : "「この方法で直りました」として報告しました");
    },
    [posts, store],
  );

  const handleReportDanger = useCallback(
    (postId: string, commentId?: string) => {
      store.reportDanger(postId, commentId);
      setToast("報告しました（試作版のためこの端末内にのみ記録されます）");
    },
    [store],
  );

  const handleToggleNotif = useCallback(() => {
    setNotifOpen((open) => {
      if (!open) store.markNotificationsRead();
      return !open;
    });
  }, [store]);

  return (
    <div className="flex min-h-dvh justify-center bg-slate-300">
      <div className="relative flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-slate-100 shadow-2xl">
        <Header
          notifications={notifications}
          open={notifOpen}
          onToggle={handleToggleNotif}
          onClose={() => setNotifOpen(false)}
        />

        {tab === "timeline" && (
          <>
            <CategoryTabs active={category} counts={counts} onSelect={setCategory} />
            <SearchBar
              query={query}
              solvedOnly={solvedOnly}
              resultCount={timeline.length}
              onQueryChange={setQuery}
              onSolvedOnlyChange={setSolvedOnly}
            />
          </>
        )}

        <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!ready ? (
            <div className="flex h-40 items-center justify-center gap-2 text-slate-500">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-bold">読み込み中…</span>
            </div>
          ) : tab === "timeline" ? (
            <Feed
              posts={timeline}
              emptyText={
                query.trim() || solvedOnly
                  ? "条件に一致する投稿がありませんでした。検索語を変えるか、絞り込みを外してみてください。"
                  : `「${CATEGORY_MAP[category].label}」の投稿はまだありません。`
              }
              onOpen={openDetail}
              onLike={store.toggleLike}
              onSave={store.toggleSave}
            />
          ) : tab === "saved" ? (
            <>
              <p className="flex items-center gap-1.5 px-3 pt-3 text-[13px] font-black text-slate-700">
                <Bookmark size={15} strokeWidth={2.6} />
                保存した投稿 {savedPosts.length}件
              </p>
              <Feed
                posts={savedPosts}
                emptyText="保存した投稿はまだありません。カードの「保存」を押すとここに集まります。"
                onOpen={openDetail}
                onLike={store.toggleLike}
                onSave={store.toggleSave}
              />
            </>
          ) : (
            <MyPage
              posts={posts}
              onOpen={openDetail}
              onLike={store.toggleLike}
              onSave={store.toggleSave}
              onReset={() => {
                store.resetAll();
                setToast("初期データに戻しました");
              }}
            />
          )}
        </main>

        {tab === "timeline" && !composerOpen && !detail && (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            aria-label="新規投稿"
            className="absolute bottom-20 right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-denkou-accent text-denkou-dark shadow-lg shadow-slate-900/25 transition active:scale-95 active:bg-amber-400"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        )}

        <BottomNav active={tab} savedCount={savedPosts.length} onSelect={handleNav} />

        <NewPostModal
          open={composerOpen}
          defaultCategory={category}
          onClose={() => setComposerOpen(false)}
          onSubmit={handleSubmitPost}
        />

        <PostDetailModal
          post={detail}
          onClose={() => setDetailId(null)}
          onLike={store.toggleLike}
          onSave={store.toggleSave}
          onCommentLike={store.toggleCommentLike}
          onMarkSolution={handleMarkSolution}
          onReportDanger={handleReportDanger}
          onAddComment={(input) => {
            store.addComment(input);
            setToast("コメントを投稿しました");
          }}
        />

        <ConsentGate />

        {toast && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-6">
            <p className="animate-rise flex items-center gap-1.5 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] font-bold text-white shadow-lg">
              <CircleCheckBig size={15} strokeWidth={3} className="text-emerald-400" />
              {toast}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Feed({
  posts,
  emptyText,
  onOpen,
  onLike,
  onSave,
}: {
  posts: Post[];
  emptyText: string;
  onOpen: (post: Post) => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <p className="mx-3 mt-4 rounded-xl border border-dashed border-slate-400 bg-white px-3 py-10 text-center text-[13px] leading-relaxed text-slate-500">
        {emptyText}
      </p>
    );
  }
  return (
    <div className="space-y-3 p-3 pb-24">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onOpen={onOpen} onLike={onLike} onSave={onSave} />
      ))}
    </div>
  );
}
