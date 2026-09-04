# 電工コネクト（フロントエンド MVP）

電気工事士に特化した現場SNSのプロトタイプです。外部DBやAPIキーの設定は不要で、
モックデータと React state / LocalStorage だけでひととおりの操作が動きます。

## 起動

```bash
npm install
npm run dev
```

ブラウザで **http://localhost:3000** を開いてください。
PC画面では最大幅 480px のスマホビュー枠が中央に表示されます。

その他のコマンド:

```bash
npm run build   # 本番ビルド（型チェック込み）
npm run lint    # tsc --noEmit による型チェックのみ
```

## 実装している機能

| 画面 | 内容 |
| --- | --- |
| タイムライン | 「現場トラブル解決 / 職人ノウハウ / 匿名Q&A / 工具・資材レビュー」の4カテゴリ切替。カードにカテゴリバッジ、ステータス（回答募集中 / これで解決！）、【至急！】バッジ、現場写真、いいね、コメント数、保存を表示 |
| 新規投稿 | タイトル・本文・カテゴリ・現場名、写真アップロード（プレビュー付き）、「匿名で投稿する」トグル、「現場で急ぎ！」トグル（トラブル選択時のみ）。投稿するとタイムライン先頭に即時追加 |
| 投稿詳細 | コメント一覧、画像添付プレビュー対応のコメント入力、コメントごとのいいね |
| これで解決！ | 質問者（自分の投稿）だけコメント横のボタンを押せる。押すとそのコメントが緑枠で最上部に固定され、投稿ステータスが解決済に変わる |
| 保存一覧 | カードの「保存」を押した投稿の一覧 |
| マイページ | プロフィール、投稿数 / コメント数 / いいね数 / 解決数、自分の投稿、モックデータの初期化 |

## 技術構成

- Next.js 15（App Router） / TypeScript / React 19
- Tailwind CSS v4、lucide-react
- 状態は `lib/denkou/store.ts` の `useDenkouStore` に集約し、LocalStorage へ自動保存
- 現場写真のダミー画像は `lib/denkou/images.ts` でインライン SVG（data URI）として生成するため、
  ネットワークに一切アクセスしません。アップロードした写真は長辺 900px / JPEG 品質 0.7 に縮小して保存します

### 主なファイル

```
app/page.tsx                        画面全体の状態管理（タブ・モーダル・トースト）
components/denkou/Header.tsx        ヘッダー（ロゴ・通知）
components/denkou/BottomNav.tsx     下部固定ナビ
components/denkou/CategoryTabs.tsx  カテゴリ切替タブ
components/denkou/PostCard.tsx      タイムラインのカード
components/denkou/NewPostModal.tsx  新規投稿モーダル
components/denkou/PostDetailModal.tsx  投稿詳細・コメント・「これで解決！」
components/denkou/MyPage.tsx        マイページ
lib/denkou/types.ts                 型とカテゴリ定義
lib/denkou/mock.ts                  初期表示用モックデータ（8件）
lib/denkou/store.ts                 状態管理と LocalStorage 永続化
lib/denkou/images.ts                ダミー現場写真と画像リサイズ
```

## カラー

- メイン: インダストリアルネイビー `#1E3A8A`
- アクセント: アンバー `#F59E0B`
- 背景: 屋外でも読める高コントラストなライトグレー / ホワイト

## 補足

同じリポジトリの `/cases` 以下には別アプリ「現場判断ログ」が残っています。
電工コネクトのプロトタイプはルート（`/`）のみで完結しています。
