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

/**
 * 「答え」ではなく「切り分け」を書かせるための確認済み項目。
 * トラブル投稿では最低1つの選択を必須にして、断定的な質問・回答が減るよう誘導する。
 */
export type SafetyCheckId =
  | "power-off"
  | "voltage"
  | "phase"
  | "insulation"
  | "earth"
  | "drawing"
  | "escalated";

export const SAFETY_CHECKS: { id: SafetyCheckId; label: string; short: string }[] = [
  { id: "power-off", label: "電源を切って検電した", short: "検電済" },
  { id: "voltage", label: "電圧を測定した", short: "電圧測定" },
  { id: "phase", label: "検相器で相順を確認した", short: "相順確認" },
  { id: "insulation", label: "絶縁抵抗を測定した", short: "絶縁測定" },
  { id: "earth", label: "接地抵抗を測定した", short: "接地測定" },
  { id: "drawing", label: "図面・仕様書を確認した", short: "図面確認" },
  { id: "escalated", label: "メーカー・上位者に確認した", short: "上位確認" },
];

export const SAFETY_CHECK_MAP: Record<SafetyCheckId, { label: string; short: string }> =
  SAFETY_CHECKS.reduce(
    (acc, c) => ({ ...acc, [c.id]: { label: c.label, short: c.short } }),
    {} as Record<SafetyCheckId, { label: string; short: string }>,
  );

/** 全画面で共通に出す免責。規約の中ではなく、書く／読む瞬間に必ず見える位置に置く。 */
export const SAFETY_DISCLAIMER =
  "投稿・回答は経験の共有です。最終判断は現場の有資格者が法令・仕様書に従って行ってください。";

/** トラブル投稿の作成時に出す注意。活線・高圧の手順そのものは扱わない方針を明示する。 */
export const TROUBLE_NOTICE =
  "活線作業や高圧受電設備の作業手順そのものを尋ねる投稿はご遠慮ください。まず確認した項目を書くと、的確な回答が集まります。";

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
  /** 質問者が「この方法で直りました」を押したコメント */
  isSolution: boolean;
  /** 危険な内容として報告されたか */
  flagged: boolean;
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
  /** 投稿者が現場で確認済みの項目 */
  checks: SafetyCheckId[];
  /** 危険な内容として報告されたか */
  flagged: boolean;
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
