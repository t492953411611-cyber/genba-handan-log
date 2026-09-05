"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildInitialNotifications, buildInitialPosts, type NotificationItem } from "./mock";
import {
  CURRENT_USER,
  type CategoryId,
  type Comment,
  type Post,
  type SafetyCheckId,
} from "./types";

const POSTS_KEY = "denkou-connect:posts:v1";
const NOTIF_KEY = "denkou-connect:notifications:v1";

/** 旧バージョンで保存されたデータに、後から足したフィールドを補う */
function normalizePosts(raw: unknown[]): Post[] {
  return raw.map((item) => {
    const p = item as Post;
    return {
      ...p,
      checks: Array.isArray(p.checks) ? p.checks : [],
      flagged: p.flagged === true,
      comments: Array.isArray(p.comments)
        ? p.comments.map((c) => ({ ...c, flagged: c.flagged === true }))
        : [],
    };
  });
}

function readJson<T>(key: string, fallback: () => T): T {
  if (typeof window === "undefined") return fallback();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback();
    return parsed as T;
  } catch {
    return fallback();
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 容量超過などは黙って諦める（プロトタイプなので表示は継続する）
  }
}

export type NewPostInput = {
  category: CategoryId;
  title: string;
  body: string;
  anonymous: boolean;
  urgent: boolean;
  photo?: string;
  site?: string;
  checks: SafetyCheckId[];
};

export type NewCommentInput = {
  postId: string;
  body: string;
  anonymous: boolean;
  photo?: string;
};

export function useDenkouStore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  // 初回マウント時にだけ LocalStorage を読む（SSR とのミスマッチを避ける）
  useEffect(() => {
    setPosts(normalizePosts(readJson<Post[]>(POSTS_KEY, buildInitialPosts)));
    setNotifications(readJson<NotificationItem[]>(NOTIF_KEY, buildInitialNotifications));
    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    writeJson(POSTS_KEY, posts);
  }, [posts]);

  useEffect(() => {
    if (!hydrated.current) return;
    writeJson(NOTIF_KEY, notifications);
  }, [notifications]);

  const addPost = useCallback((input: NewPostInput): Post => {
    const post: Post = {
      id: `p-${Date.now()}`,
      category: input.category,
      title: input.title.trim(),
      body: input.body.trim(),
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorTitle: CURRENT_USER.title,
      anonymous: input.anonymous,
      urgent: input.category === "trouble" && input.urgent,
      status: "open",
      photo: input.photo,
      site: input.site?.trim() || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByMe: false,
      saved: false,
      checks: input.checks,
      flagged: false,
      comments: [],
    };
    setPosts((prev) => [post, ...prev]);
    return post;
  }, []);

  const addComment = useCallback((input: NewCommentInput) => {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      postId: input.postId,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorTitle: CURRENT_USER.title,
      anonymous: input.anonymous,
      body: input.body.trim(),
      photo: input.photo,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByMe: false,
      isSolution: false,
      flagged: false,
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === input.postId ? { ...p, comments: [...p.comments, comment] } : p)),
    );
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p,
      ),
    );
  }, []);

  const toggleCommentLike = useCallback((postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? { ...c, likedByMe: !c.likedByMe, likes: c.likes + (c.likedByMe ? -1 : 1) }
                  : c,
              ),
            },
      ),
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)));
  }, []);

  /** 質問者がベストアンサーを選ぶ。もう一度押すと解除して「回答募集中」に戻す。 */
  const markSolution = useCallback((postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const current = p.comments.find((c) => c.id === commentId);
        const turningOff = current?.isSolution === true;
        return {
          ...p,
          status: turningOff ? "open" : "solved",
          comments: p.comments.map((c) => ({
            ...c,
            isSolution: turningOff ? false : c.id === commentId,
          })),
        };
      }),
    );
  }, []);

  /**
   * 危険な内容として報告する。
   * 試作版なので送信先は無く、この端末内で「確認中」の印が付くだけ。
   */
  const reportDanger = useCallback((postId: string, commentId?: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (!commentId) return { ...p, flagged: true };
        return {
          ...p,
          comments: p.comments.map((c) => (c.id === commentId ? { ...c, flagged: true } : c)),
        };
      }),
    );
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const resetAll = useCallback(() => {
    setPosts(buildInitialPosts());
    setNotifications(buildInitialNotifications());
  }, []);

  return {
    posts,
    notifications,
    ready,
    addPost,
    addComment,
    toggleLike,
    toggleCommentLike,
    toggleSave,
    markSolution,
    reportDanger,
    markNotificationsRead,
    resetAll,
  };
}

/** 「◯分前」表記 */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "";
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}日前`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}週間前`;
  return new Date(iso).toLocaleDateString("ja-JP");
}
