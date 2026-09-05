-- 電工コネクト データベース定義（Supabase / PostgreSQL）
--
-- 使い方:
--   Supabase の管理画面 → SQL Editor に貼り付けて実行するだけです。
--   無料枠（データベース 500MB / ストレージ 1GB / 月間アクティブユーザー 50,000人）に
--   収まる設計なので、電気工事関係者が数百人規模で使う分には費用はかかりません。
--
-- 方針:
--   すべてのテーブルで行単位セキュリティ(RLS)を有効にし、
--   「誰が読めるか・誰が書けるか」をデータベース側で強制します。
--   アプリ側のうっかりミスで他人の投稿が消せてしまう、といった事故を防ぐためです。

-- ───────────────────────────────────────────
-- プロフィール
-- ───────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null check (char_length(display_name) between 1 and 30),
  -- 資格は自己申告。規約で詐称を禁止し、画面上も自己申告である旨を明示すること。
  license       text check (license in ('第一種電気工事士', '第二種電気工事士', '認定電気工事従事者', 'その他')),
  years         int  check (years between 0 and 60),
  area          text check (char_length(area) <= 20),
  created_at    timestamptz not null default now(),
  -- 退会時は auth.users ごと削除する。投稿は投稿者名を伏せて残す（下の on delete set null）。
  suspended_at  timestamptz
);

alter table public.profiles enable row level security;

create policy "プロフィールは全員が閲覧できる"
  on public.profiles for select using (true);

create policy "自分のプロフィールだけ作成できる"
  on public.profiles for insert with check (auth.uid() = id);

create policy "自分のプロフィールだけ更新できる"
  on public.profiles for update using (auth.uid() = id);

-- ───────────────────────────────────────────
-- 投稿
-- ───────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  -- 退会しても投稿は残せるよう null 許容にする（表示は「退会した電工」になる）
  author_id    uuid references public.profiles(id) on delete set null,
  category     text not null check (category in ('trouble', 'knowhow', 'anonymous', 'review')),
  title        text not null check (char_length(title) between 1 and 80),
  body         text not null check (char_length(body) between 1 and 4000),
  site         text check (char_length(site) <= 40),
  photo_path   text,
  anonymous    boolean not null default false,
  urgent       boolean not null default false,
  status       text not null default 'open' check (status in ('open', 'solved')),
  -- 現場で確認済みの項目。トラブル投稿では1つ以上を必須にする（下の制約）。
  checks       text[] not null default '{}',
  created_at   timestamptz not null default now(),
  -- 運営が非表示にした投稿。物理削除ではなく非表示にして、対応の記録を残す。
  hidden_at    timestamptz,
  hidden_reason text,

  constraint トラブル投稿は確認項目が必要
    check (category <> 'trouble' or array_length(checks, 1) >= 1)
);

create index if not exists posts_category_created_idx
  on public.posts (category, created_at desc) where hidden_at is null;

-- 検索用。日本語は簡易一致で運用し、必要になったら pg_bigm 等を検討する。
create index if not exists posts_search_idx
  on public.posts using gin (to_tsvector('simple', title || ' ' || body));

alter table public.posts enable row level security;

create policy "非表示でない投稿は全員が閲覧できる"
  on public.posts for select using (hidden_at is null);

create policy "ログイン中の本人だけ投稿できる"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "自分の投稿だけ編集できる"
  on public.posts for update using (auth.uid() = author_id);

create policy "自分の投稿だけ削除できる"
  on public.posts for delete using (auth.uid() = author_id);

-- ───────────────────────────────────────────
-- コメント
-- ───────────────────────────────────────────
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid references public.profiles(id) on delete set null,
  body        text not null check (char_length(body) between 1 and 4000),
  photo_path  text,
  anonymous   boolean not null default false,
  -- 「この方法で直りました」。1つの投稿につき1件だけ（下の部分一意インデックス）。
  is_solution boolean not null default false,
  created_at  timestamptz not null default now(),
  hidden_at   timestamptz,
  hidden_reason text
);

create unique index if not exists comments_one_solution_per_post
  on public.comments (post_id) where is_solution;

create index if not exists comments_post_idx on public.comments (post_id, created_at);

alter table public.comments enable row level security;

create policy "非表示でないコメントは全員が閲覧できる"
  on public.comments for select using (hidden_at is null);

create policy "ログイン中の本人だけコメントできる"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "自分のコメントだけ編集できる"
  on public.comments for update using (auth.uid() = author_id);

create policy "自分のコメントだけ削除できる"
  on public.comments for delete using (auth.uid() = author_id);

-- 解決報告を付けられるのは投稿者本人だけ。
-- アプリ側のボタン制御だけに頼らず、データベース側でも守る。
create or replace function public.set_solution(p_post_id uuid, p_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.posts
    where id = p_post_id and author_id = auth.uid()
  ) then
    raise exception '解決報告を付けられるのは投稿者本人だけです';
  end if;

  update public.comments set is_solution = false where post_id = p_post_id;
  update public.comments set is_solution = true
    where id = p_comment_id and post_id = p_post_id;
  update public.posts set status = 'solved' where id = p_post_id;
end;
$$;

-- ───────────────────────────────────────────
-- いいね・保存
-- ───────────────────────────────────────────
create table if not exists public.reactions (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  kind       text not null check (kind in ('like', 'save')),
  created_at timestamptz not null default now(),
  primary key (user_id, post_id, kind)
);

alter table public.reactions enable row level security;

create policy "いいね・保存は全員が集計のため閲覧できる"
  on public.reactions for select using (true);

create policy "自分のいいね・保存だけ追加できる"
  on public.reactions for insert with check (auth.uid() = user_id);

create policy "自分のいいね・保存だけ取り消せる"
  on public.reactions for delete using (auth.uid() = user_id);

-- ───────────────────────────────────────────
-- 通報
-- ───────────────────────────────────────────
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  post_id     uuid references public.posts(id) on delete cascade,
  comment_id  uuid references public.comments(id) on delete cascade,
  -- danger は感電・火災につながる内容。最優先で確認する。
  reason      text not null check (reason in ('danger', 'privacy', 'abuse', 'spam', 'other')),
  note        text check (char_length(note) <= 500),
  created_at  timestamptz not null default now(),
  handled_at  timestamptz,
  handled_note text,

  constraint 通報対象を1つ指定すること
    check (num_nonnulls(post_id, comment_id) = 1)
);

create index if not exists reports_open_idx
  on public.reports (created_at desc) where handled_at is null;

alter table public.reports enable row level security;

-- 通報は「出せるが読めない」。他人の通報内容が見えると報復につながるため。
create policy "ログイン中の本人だけ通報できる"
  on public.reports for insert with check (auth.uid() = reporter_id);

create policy "自分が出した通報だけ確認できる"
  on public.reports for select using (auth.uid() = reporter_id);

-- 運営者は Supabase 管理画面（service_role）から全件を確認する。
-- RLS は service_role には適用されないため、追加のポリシーは不要。

-- ───────────────────────────────────────────
-- 写真の保管場所
-- ───────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('post-photos', 'post-photos', true)
on conflict (id) do nothing;

create policy "写真は全員が閲覧できる"
  on storage.objects for select
  using (bucket_id = 'post-photos');

create policy "ログイン中の本人だけ写真を置ける"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-photos' and owner = auth.uid());

create policy "自分が置いた写真だけ消せる"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-photos' and owner = auth.uid());
