import {
  PHOTO_CONDUIT,
  PHOTO_EARTH,
  PHOTO_LIGHT,
  PHOTO_PANEL,
  PHOTO_RACK,
  PHOTO_TOOLS,
} from "./images";
import { CURRENT_USER, type Comment, type Post } from "./types";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

type SeedComment = Omit<Comment, "postId">;

function comment(c: Partial<SeedComment> & Pick<SeedComment, "id" | "body" | "createdAt">): SeedComment {
  return {
    authorId: "u-other",
    authorName: "現場の職人",
    authorTitle: "第2種電工・現場歴5年",
    anonymous: false,
    likes: 0,
    likedByMe: false,
    isSolution: false,
    flagged: false,
    ...c,
  };
}

/**
 * 初期表示用のモックデータ。
 * 投稿時刻は読み込み時刻からの相対で作るので「◯分前」表示が常に自然になる。
 */
type SeedPost = Omit<Post, "comments"> & { comments: SeedComment[] };

export function buildInitialPosts(): Post[] {
  const seeds: SeedPost[] = [
    {
      id: "p1",
      category: "trouble",
      title: "【至急】動力盤の結線で相順を間違えた可能性。逆相リレーが動作して復帰しない",
      body: `テナントビル4階の空調更新で、動力盤（三相200V 主幹75A）の一次側を結線したあと送電したら、室外機側の逆相・欠相保護リレーが動作しっぱなしで復帰しません。

・R相赤／S相白／T相黒で盤内は結線済み
・検相器を当てたら逆相表示（ランプが左回り）
・盤内の相順自体は上流のキュービクルから来ている想定
・今日中に空調を立ち上げないと明日の内装検査に間に合わない

上流を触らずに、室外機の一次側で2線入替えだけして逃げるのはアリでしょうか？ それとも盤の一次側で直すべき？ 現場は熊本市中央区、あと2時間で撤収時間です。`,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorTitle: CURRENT_USER.title,
      anonymous: false,
      urgent: true,
      status: "open",
      photo: PHOTO_PANEL,
      site: "熊本市中央区 テナントビル空調更新",
      createdAt: ago(38 * MIN),
      likes: 12,
      likedByMe: false,
      saved: false,
      checks: ["voltage", "phase", "drawing"],
      flagged: false,
      comments: [
        comment({
          id: "p1c1",
          authorName: "オクムラ",
          authorTitle: "第1種電工・現場歴22年",
          body: "まず検相器の当て方を疑ってください。盤内でR-S-Tのマーキングと実際の結線が合っていても、上流のキュービクル二次側で相順が入れ替わっている現場はザラにあります。上流が正相なら、あなたの結線が入れ替わっているだけです。",
          createdAt: ago(30 * MIN),
          likes: 8,
        }),
        comment({
          id: "p1c2",
          authorName: "タニグチ",
          authorTitle: "第1種電工・現場歴15年",
          body: "室外機の一次側だけで2線入替えは絶対にやめたほうがいいです。その盤から後で分岐する回路（コンセント・別系統の動力）が全部逆相のまま残ります。次に入る業者が確実に踏みます。直すなら盤の一次側で、竣工図の相順に合わせてください。",
          createdAt: ago(24 * MIN),
          likes: 15,
        }),
        comment({
          id: "p1c3",
          authorName: "ナカムラ",
          authorTitle: "第2種電工・現場歴7年",
          body: "うちも先月同じことやりました。復帰しないのは保護リレーのラッチが残ってるだけのことも多いので、相順直したあとは主幹を一度落として3分ほど待ってから再投入してみてください。",
          createdAt: ago(15 * MIN),
          likes: 6,
          photo: PHOTO_RACK,
        }),
      ],
    },
    {
      id: "p2",
      category: "knowhow",
      title: "間仕切り壁内のVVF通線、呼線が落ちてこない時の裏技（マグネットキャッチャー併用）",
      body: `軽鉄＋石膏ボードの間仕切りで、上から呼線を落としても断熱材や振れ止めに引っかかって降りてこない、というのは誰でも経験あると思います。

自分がここ2年で定着した手順です。

1. 上から落とすのは呼線ではなく、まずΦ13の強力ネオジム玉（マグネットキャッチャーの子玉）を細めのタコ糸で落とす
2. 下のコンセントボックス開口から親マグネットを壁面に当てて、上下にゆっくり滑らせる
3. 子玉が吸い付いたら、そのままタコ糸ごと開口まで誘導する
4. タコ糸に呼線を結んで引き上げる（呼線を直接落とすより圧倒的に抵抗が少ない）

コツは玉を落とすときに壁面から離さないこと。振れ止めの上に乗ってしまったら、上でタコ糸を数センチ持ち上げて落とし直せば大抵越えます。断熱材（グラスウール）入りの壁でも成功率は8割くらい。

天井内から手が入らない改修現場ほど効きます。工具箱に子玉の予備を2〜3個入れておくと安心です。`,
      authorId: "u-2",
      authorName: "ヒラヤマ",
      authorTitle: "第1種電工・現場歴18年",
      anonymous: false,
      urgent: false,
      status: "open",
      photo: PHOTO_CONDUIT,
      site: "改修工事全般",
      createdAt: ago(5 * HOUR),
      likes: 128,
      likedByMe: true,
      saved: true,
      checks: [],
      flagged: false,
      comments: [
        comment({
          id: "p2c1",
          authorName: "サコダ",
          authorTitle: "第2種電工・現場歴3年",
          body: "これ本当に助かりました。今日さっそくやってみたら一発で通りました。タコ糸じゃなくて釣り糸（ナイロン4号）でもいけますか？",
          createdAt: ago(3 * HOUR),
          likes: 4,
        }),
        comment({
          id: "p2c2",
          authorName: "ヒラヤマ",
          authorTitle: "第1種電工・現場歴18年",
          body: "釣り糸だと細すぎて呼線を引くときに石膏ボードの切り口で切れることがあります。タコ糸か、細めの水糸がおすすめです。",
          createdAt: ago(2 * HOUR),
          likes: 9,
        }),
      ],
    },
    {
      id: "p3",
      category: "anonymous",
      title: "【匿名】接地抵抗測定でどうしても100Ω以下が出ない現場、皆さんどうしてますか？",
      body: `山側の造成地で、D種接地（100Ω以下）がどうやっても出ません。

・接地棒Φ14×1500を打ち込み → 単独で約230Ω
・並列に3本打って約140Ω（間隔は2m以上取っています）
・地質は真砂土＋岩盤、掘ると50cmで石にあたる
・水を撒いた直後だけ100Ωを切るが、翌日測ると戻る

正直に言うと、元請から「数字だけ合わせといて」と言われかけていて、それは絶対にやりたくないので相談です。

・接地抵抗低減剤はどのくらい効きますか（費用感も知りたい）
・網状接地極や板状接地極に変えて改善した経験はありますか
・そもそも漏電遮断器を設置してD種を省略できる条件に該当させるほうが現実的でしょうか

同業に相談しづらい内容なので匿名で失礼します。`,
      authorId: "u-3",
      authorName: "ヤマグチ",
      authorTitle: "第1種電工・現場歴9年",
      anonymous: true,
      urgent: false,
      status: "open",
      photo: PHOTO_EARTH,
      site: "郊外造成地 屋外キュービクル",
      createdAt: ago(9 * HOUR),
      likes: 64,
      likedByMe: false,
      saved: false,
      checks: ["earth", "drawing"],
      flagged: false,
      comments: [
        comment({
          id: "p3c1",
          authorName: "匿名電工",
          authorTitle: "匿名電工",
          anonymous: true,
          body: "数字を作るのは絶対ダメです。判断は正しいと思います。真砂土＋岩盤なら低減剤（ジェル系）はよく効きます。うちの現場では約180Ω→60Ωまで落ちました。材料費は1袋5,000円前後で、接地極1本あたり1〜2袋です。",
          createdAt: ago(7 * HOUR),
          likes: 22,
        }),
        comment({
          id: "p3c2",
          authorName: "イマムラ",
          authorTitle: "第1種電工・現場歴25年",
          body: "岩盤で打てないなら、深く打つより「浅く広く」です。銅板（900×900）を50cm程度の深さに埋めて、掘削土に低減剤を混ぜ戻す方法が一番安定します。並列に打った3本も、離隔が足りないと相互干渉で理論値どおりには下がりません。",
          createdAt: ago(6 * HOUR),
          likes: 31,
        }),
        comment({
          id: "p3c3",
          authorName: "匿名電工",
          authorTitle: "匿名電工",
          anonymous: true,
          body: "漏電遮断器（0.5秒以内動作）の設置でD種を500Ωまで緩和できる規定はありますが、それは条件を満たす場合の話で、元請の「合わせといて」の逃げ道に使うものではないです。まず設計者に測定結果を文書で上げるのが先だと思います。",
          createdAt: ago(4 * HOUR),
          likes: 18,
        }),
      ],
    },
    {
      id: "p4",
      category: "review",
      title: "フジ矢の偏芯パワーペンチとクラインを現場で1年使い倒した比較レビュー",
      body: `両方とも自腹で買って、盤屋と内線をまたいで1年使ったので正直な比較を書きます。

【フジ矢 偏芯パワーペンチ 200mm】
・切断はとにかく軽い。IV5.5sqの切断で握力が明らかに温存できる
・偏芯構造のおかげでVVF2.0-3Cもストレスなし
・グリップが太めなので手が小さい人は好みが分かれる
・1年でガタは出ていない。刃こぼれもなし

【クライン D213-9NE】
・掴む力が別物。ロックナットを回す、細い鉄線をねじる用途では圧倒的
・切断は正直フジ矢より重い。太物を数こなす日は疲労差が出る
・重量があるので腰道具に入れると存在感がある
・刃の耐久性は素晴らしい。ネジ切りボルトを切っても平気

【結論】
・切断が主体の内線工事 → フジ矢
・掴む・ねじる・叩くが混ざる盤や電力系 → クライン

自分は今、腰にフジ矢、工具箱にクラインという運用に落ち着きました。どちらか1本だけと言われたら、正直に言って現場の職種で変わります。値段はクラインが約1.8倍なので、2種を取ったばかりの若い子にはフジ矢を勧めています。`,
      authorId: "u-4",
      authorName: "コバヤシ",
      authorTitle: "第1種電工・現場歴14年",
      anonymous: false,
      urgent: false,
      status: "open",
      photo: PHOTO_TOOLS,
      site: "工具レビュー",
      createdAt: ago(1 * DAY + 2 * HOUR),
      likes: 203,
      likedByMe: false,
      saved: true,
      checks: [],
      flagged: false,
      comments: [
        comment({
          id: "p4c1",
          authorName: "ウエノ",
          authorTitle: "第2種電工・現場歴2年",
          body: "ちょうど1本目のペンチを買うところでした。フジ矢にします。ありがとうございます。",
          createdAt: ago(1 * DAY),
          likes: 5,
        }),
        comment({
          id: "p4c2",
          authorName: "マツオ",
          authorTitle: "第1種電工・現場歴11年",
          body: "クラインは掴みが強すぎて、締めすぎたロックナットをなめずに回せるのが本当に助かります。ただ重いのは同意です。腰に2本ぶら下げると夕方に効いてきます。",
          createdAt: ago(20 * HOUR),
          likes: 12,
        }),
      ],
    },
    {
      id: "p5",
      category: "trouble",
      title: "三相200Vのポンプが唸って回らない。欠相を疑ったら原因はまったく別だった",
      body: `マンション受水槽のポンプ更新後、試運転で「ウーン」と唸るだけで回転しませんでした。

・電源電圧は3線とも200V前後で欠相なし
・絶縁も問題なし（500Vメガで100MΩ以上）
・手で軸を回すと少し回るがすぐ止まる

同じ症状で悩んでいる人がいたら、確認した順番を共有します。原因が分かったので下にまとめました。`,
      authorId: "u-5",
      authorName: "フクダ",
      authorTitle: "第1種電工・現場歴16年",
      anonymous: false,
      urgent: false,
      status: "solved",
      photo: PHOTO_RACK,
      site: "分譲マンション 受水槽ポンプ更新",
      createdAt: ago(2 * DAY),
      likes: 87,
      likedByMe: false,
      saved: false,
      checks: ["power-off", "voltage", "insulation"],
      flagged: false,
      comments: [
        comment({
          id: "p5c1",
          authorName: "ヨコタ",
          authorTitle: "第1種電工・現場歴20年",
          body: "電磁接触器の主接点、1極だけ接触不良になっていませんか。無負荷で電圧を測ると3線とも出るのに、負荷をかけた瞬間に1相だけ落ちる、いわゆる「負荷欠相」は電圧測定では見えません。クランプで3線の電流を同時に見るのが確実です。",
          createdAt: ago(1 * DAY + 20 * HOUR),
          likes: 44,
          isSolution: true,
        }),
        comment({
          id: "p5c2",
          authorName: "フクダ",
          authorTitle: "第1種電工・現場歴16年",
          body: "まさにこれでした。クランプで測ったらT相だけ電流がほぼゼロ。電磁接触器を交換したら一発で回りました。電圧だけ見て「欠相なし」と判断していたのが敗因です。ありがとうございました。",
          createdAt: ago(1 * DAY + 18 * HOUR),
          likes: 26,
        }),
      ],
    },
    {
      id: "p6",
      category: "knowhow",
      title: "既設LED器具の一斉更新、脚立の往復を半分に減らす段取りの組み方",
      body: `事務所フロア（60灯）の器具更新を2人でやったときの段取りです。作業そのものより、脚立の上げ下げと移動が工数を食います。

・先行して全灯の電源を落とし、1フロア分の既設器具を「外すだけ」で一周する
・外した器具はその場に置かず、通路側に一列に並べて搬出動線を1本にする
・新器具は開梱・電線接続（コネクタ結線まで）を床で全数済ませてから一周目に戻る
・脚立の上でやるのは「引掛シーリング接続＋ビス2本」だけにする

これで1灯あたりの脚立上滞在が3分から1分を切りました。60灯だと2時間近く変わります。

注意点は、外した既設器具を並べるときに安定器（PCB含有の可能性がある古いもの）を混ぜないこと。年式が古い現場では、外す前に銘板を必ず撮影して記録を残してください。`,
      authorId: "u-6",
      authorName: "アリマ",
      authorTitle: "第1種電工・現場歴13年",
      anonymous: false,
      urgent: false,
      status: "open",
      photo: PHOTO_LIGHT,
      site: "オフィスビル 照明更新",
      createdAt: ago(3 * DAY),
      likes: 96,
      likedByMe: false,
      saved: false,
      checks: [],
      flagged: false,
      comments: [
        comment({
          id: "p6c1",
          authorName: "シライシ",
          authorTitle: "第2種電工・現場歴6年",
          body: "床で結線まで済ませておくのは目からウロコです。安定器の銘板撮影、うちの会社でもルール化します。",
          createdAt: ago(2 * DAY + 4 * HOUR),
          likes: 8,
        }),
      ],
    },
    {
      id: "p7",
      category: "review",
      title: "充電インパクトの14.4Vと18V、内線工事で本当に必要なのはどっちか",
      body: `1年半、同じメーカーの14.4Vと18Vを現場で持ち替えて比べた感想です。

・天井内・脚立上の作業が主体なら14.4V。取り回しと軽さが正義で、腕の残り具合が夕方に効く
・ラック用のアンカー打ち、屋外の太めのビス、コンクリートビスが増えるなら18V
・バッテリーの本数と充電器を統一できるほうが結局現場で強い。混在させると必ず片方が電池切れになる

自分は14.4Vをメインにして、アンカー打ちの日だけ18Vを積む運用です。パワー不足を感じたのはこの1年半で3日だけでした。

若い子に最初の1台を勧めるなら、正直に言って14.4Vです。18Vは「重くて振り回せない」と現場で置きっぱなしになりがちでした。`,
      authorId: "u-7",
      authorName: "ミゾグチ",
      authorTitle: "第2種電工・現場歴8年",
      anonymous: false,
      urgent: false,
      status: "open",
      photo: PHOTO_TOOLS,
      site: "工具レビュー",
      createdAt: ago(4 * DAY),
      likes: 71,
      likedByMe: false,
      saved: false,
      checks: [],
      flagged: false,
      comments: [
        comment({
          id: "p7c1",
          authorName: "匿名電工",
          authorTitle: "匿名電工",
          anonymous: true,
          body: "バッテリー統一の話は本当にそのとおりです。うちは3電圧が混在していて、現場で充電器を3台積む羽目になっています。",
          createdAt: ago(3 * DAY),
          likes: 14,
        }),
      ],
    },
    {
      id: "p8",
      category: "anonymous",
      title: "【匿名】一人親方に転向するか迷っています。単価と手取りのリアルを知りたい",
      body: `熊本で内線工事の会社に10年勤めています。第1種は取得済みで、現場代理人も何度か経験しました。

同期が独立して「手取りが1.5倍になった」と言うので気持ちが揺れていますが、実際のところどうなのでしょうか。

・常用単価の相場（1日あたり）はどのくらいですか
・材料立替や入金サイトで資金繰りが厳しくなる場面はありますか
・労災保険（特別加入）や車両・工具の維持費を引くと、結局どのくらい残りますか
・仕事が途切れた月をどう凌いでいますか

家族がいるので、勢いだけで決めたくありません。会社の同僚には聞けない内容なので匿名で失礼します。`,
      authorId: "u-8",
      authorName: "非公開",
      authorTitle: "第1種電工・現場歴10年",
      anonymous: true,
      urgent: false,
      status: "open",
      site: "キャリア相談",
      createdAt: ago(5 * DAY),
      likes: 142,
      likedByMe: false,
      saved: false,
      checks: [],
      flagged: false,
      comments: [
        comment({
          id: "p8c1",
          authorName: "匿名電工",
          authorTitle: "匿名電工",
          anonymous: true,
          body: "独立7年目です。常用は地域差が大きいので数字は控えますが、額面が上がっても「機材・車・保険・税金・仕事が無い日」を引くと、増えるのは思ったより少ないです。増えるのは自由度のほうです。そこに価値を感じるかどうかだと思います。",
          createdAt: ago(4 * DAY + 6 * HOUR),
          likes: 58,
        }),
        comment({
          id: "p8c2",
          authorName: "ハラダ",
          authorTitle: "第1種電工・現場歴28年",
          body: "先に取引先を2社確保してから辞めることを強く勧めます。1社依存で独立して、その1社の工事が止まった瞬間に詰んだ人を何人も見ています。あと労災の特別加入は絶対に入ってください。",
          createdAt: ago(4 * DAY),
          likes: 73,
        }),
      ],
    },
  ];

  return seeds.map((post) => ({
    ...post,
    comments: post.comments.map((c) => ({ ...c, postId: post.id })),
  }));
}

export type NotificationItem = {
  id: string;
  text: string;
  createdAt: string;
  unread: boolean;
};

export function buildInitialNotifications(): NotificationItem[] {
  return [
    {
      id: "n1",
      text: "タニグチさんがあなたの投稿「【至急】動力盤の結線で相順を間違えた可能性」にコメントしました",
      createdAt: ago(24 * MIN),
      unread: true,
    },
    {
      id: "n2",
      text: "オクムラさんがあなたの投稿にコメントしました",
      createdAt: ago(30 * MIN),
      unread: true,
    },
    {
      id: "n3",
      text: "保存した投稿「間仕切り壁内のVVF通線」に新しいコメントが付きました",
      createdAt: ago(2 * HOUR),
      unread: true,
    },
    {
      id: "n4",
      text: "あなたのコメントが「これで解決！」に選ばれました",
      createdAt: ago(2 * DAY),
      unread: false,
    },
  ];
}
