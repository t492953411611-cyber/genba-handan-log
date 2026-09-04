export type CategoryId = "trouble" | "knowhow" | "anonymous" | "review";

export type PostStatus = "open" | "solved";

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  /** バッジ背景 / 文字色 */
  badgeClass: string;
  /** タブ選択時のアクセント */
  accentClass: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "trouble",
    label: "現場トラブル解決",
    short: "トラブル",
    badgeClass: "bg-red-100 text-red-800 ring-red-200",
    accentClass: "bg-red-600",
  },
  {
    id: "knowhow",
    label: "職人ノウハウ",
    short: "ノウハウ",
    badgeClass: "bg-amber-100 text-amber-900 ring-amber-300",
    accentClass: "bg-amber-500",
  },
  {
    id: "anonymous",
    label: "匿名Q&A",
    short: "匿名Q&A",
    badgeClass: "bg-slate-200 text-slate-800 ring-slate-300",
    accentClass: "bg-slate-600",
  },
  {
    id: "review",
    label: "工具・資材レビュー",
    short: "レビュー",
    badgeClass: "bg-sky-100 text-sky-900 ring-sky-200",
    accentClass: "bg-sky-600",
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>,
);

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  anonymous: boolean;
  body: string;
  photo?: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  /** 質問者が「これで解決！」を押したコメント */
  isSolution: boolean;
};

export type Post = {
  id: string;
  category: CategoryId;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  /** 「第1種電工・現場歴12年」など */
  authorTitle: string;
  anonymous: boolean;
  urgent: boolean;
  status: PostStatus;
  photo?: string;
  site?: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  saved: boolean;
  comments: Comment[];
};

export type CurrentUser = {
  id: string;
  name: string;
  title: string;
  license: string;
  area: string;
  years: number;
};

export const CURRENT_USER: CurrentUser = {
  id: "me",
  name: "タカハシ",
  title: "第1種電工・現場歴12年",
  license: "第一種電気工事士",
  area: "熊本県",
  years: 12,
};

export const ANON_NAME = "匿名電工";
export const ANON_TITLE = "匿名電工";

export function displayName(p: { anonymous: boolean; authorName: string }): string {
  return p.anonymous ? ANON_NAME : p.authorName;
}

export function displayTitle(p: { anonymous: boolean; authorTitle: string }): string {
  return p.anonymous ? ANON_TITLE : p.authorTitle;
}
