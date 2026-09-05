# 公開の手順（個人運営・費用ゼロ構成）

収益化せず、個人で、赤字を出さずに公開するための構成です。
**月額は0円**です（独自ドメインを取る場合のみ年1,500円程度）。

## 構成

| 役割 | 使うもの | 費用 | 選んだ理由 |
| --- | --- | --- | --- |
| サイトの公開 | Cloudflare Pages | 0円 | 無料枠で商用利用も可。転送量の上限がなく、口コミで急に伸びても止まらない |
| 会員・データ・写真 | Supabase 無料枠 | 0円 | DB 500MB・ストレージ1GB・月間アクティブ5万人まで無料。数百人規模なら十分 |
| ドメイン | 任意 | 年1,500円程度 | `〇〇.pages.dev` のままでも公開できる |

> **Vercel ではなく Cloudflare Pages を選ぶ理由**
> Vercel の無料プラン(Hobby)は非商用に限られ、将来わずかでも収益を得ると有料プラン（月20ドル）が必要になります。
> Cloudflare Pages の無料枠にはその制限がないため、方針が変わっても慌てずに済みます。

### 無料枠で気をつける点

- Supabase の無料プロジェクトは、**7日間まったくアクセスがないと一時停止**します。管理画面から再開できますが、
  人が来ている間は起きない問題です。心配なら1週間に一度アプリを開いてください。
- 写真は1GBまで。長辺900px・JPEG品質0.7に縮小して保存しているので、1枚あたり100〜200KB程度です。
  単純計算で5,000〜10,000枚入ります。足りなくなったら、そのとき考えれば十分です。

## 手順

### 1. Supabase を用意する

1. [supabase.com](https://supabase.com) で登録し、新しいプロジェクトを作る（リージョンは Tokyo）
2. 管理画面の **SQL Editor** を開き、`supabase/schema.sql` の中身を貼り付けて実行する
3. **Authentication → Providers** でメール認証を有効にする
4. **Project Settings → API** から次の2つを控える
   - Project URL
   - anon public key（公開して問題ない鍵です。service_role キーは絶対に公開しないでください）

### 2. アプリに鍵を設定する

プロジェクト直下に `.env.local` を作ります（このファイルは Git に入りません）。

```
NEXT_PUBLIC_SUPABASE_URL=（Project URL）
NEXT_PUBLIC_SUPABASE_ANON_KEY=（anon public key）
```

### 3. Cloudflare Pages に公開する

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
2. この GitHub リポジトリを連携する
3. ビルド設定
   - フレームワーク: Next.js (Static HTML Export)
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `out`
4. 環境変数に上記の2つを登録する
5. デプロイすると `〇〇.pages.dev` で公開されます

> 現在は GitHub Pages に公開しています。Cloudflare Pages に移すときは、
> `next.config.ts` の `basePath` の分岐（`GITHUB_ACTIONS` を見ている部分）を外してください。
> Cloudflare Pages ではサイトがドメイン直下に置かれるため、basePath は不要です。

## 公開前に必ず済ませること

- [ ] `lib/denkou/legal.ts` の **運営者名と連絡先メールアドレス**を実際のものに差し替える
      （削除依頼を受け付ける窓口がないまま公開してはいけません）
- [ ] 利用規約・プライバシーポリシーを自分の言葉で読み返す。ひな形のままにしない
- [ ] 勤務先の就業規則（副業規定）を確認する
- [ ] 通報が届いたことに気づける状態にする（Supabase の管理画面を毎日見るか、通報時にメールが飛ぶようにする）
- [ ] 自分で5件以上、本物の投稿を入れておく（誰もいない掲示板には人が居つきません）

## 通報の確認方法

Supabase の管理画面 → SQL Editor で次を実行すると、未対応の通報が新しい順に出ます。
`danger`（感電・火災につながる内容）が最優先です。

```sql
select r.created_at, r.reason, r.note,
       p.title as 投稿, c.body as コメント
from reports r
left join posts p on p.id = r.post_id
left join comments c on c.id = r.comment_id
where r.handled_at is null
order by case when r.reason = 'danger' then 0 else 1 end, r.created_at desc;
```

対応したら、非表示にして記録を残します。

```sql
update posts set hidden_at = now(), hidden_reason = '危険な作業手順のため' where id = '対象のID';
update reports set handled_at = now(), handled_note = '投稿を非表示にした' where id = '通報のID';
```

## 費用が発生しはじめる目安

無料枠を超えるのは、次のあたりからです。慌てて備える必要はありません。

- 登録者が数千人を超える
- 写真が1GB（5,000〜10,000枚）を超える
- 投稿が数万件を超える

そこまで育ったら、Supabase Pro（月25ドル）への移行を検討してください。
その規模になっていれば、支え方（寄付、タイアップ、有料機能）も一緒に考えられる段階に来ています。
