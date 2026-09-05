import type { Metadata } from "next";
import { Article, Highlight, LegalShell, List } from "@/components/denkou/LegalShell";
import { LEGAL_UPDATED_AT, OPERATOR_CONTACT } from "@/lib/denkou/legal";

export const metadata: Metadata = {
  title: "お問い合わせ・削除依頼 ｜ 電工コネクト",
  description: "電工コネクトへのお問い合わせ、投稿の削除依頼、権利侵害の申し立ての窓口。",
};

export default function ContactPage() {
  return (
    <LegalShell title="お問い合わせ・削除依頼" updatedAt={LEGAL_UPDATED_AT}>
      <Article heading="連絡先">
        <p>{OPERATOR_CONTACT.operator}</p>
        <p>
          メール：
          <span className="font-bold text-slate-900">{OPERATOR_CONTACT.email}</span>
        </p>
        <p>回答の目安：{OPERATOR_CONTACT.responseTime}</p>
        <p className="text-[12.5px] text-slate-600">
          個人で運営しているため、日中は現場に出ており、返信が遅れることがあります。
          緊急を要する内容の場合は、件名に「至急」とお書き添えください。
        </p>
      </Article>

      <Article heading="危険な内容を見つけたとき">
        <Highlight>
          感電・火災につながりかねない投稿を見つけた場合は、
          メールをお待ちいただかなくて構いません。
          アプリ内の投稿・コメントにある「危険な内容として報告」ボタンを押してください。
          運営者が確認し、必要に応じて削除します。
        </Highlight>
      </Article>

      <Article heading="投稿の削除を依頼したいとき">
        <p>次の内容をメールに記載してお送りください。確認のうえ、速やかに対応します。</p>
        <List
          items={[
            "対象の投稿またはコメントが分かる情報（URL、タイトル、投稿日時など）",
            "削除を求める理由（名誉毀損、プライバシー侵害、守秘義務違反、著作権侵害、安全上の問題など）",
            "ご連絡先（返信のためのメールアドレス）",
            "権利侵害を理由とする場合は、ご自身が権利者本人またはその代理人であることが分かる情報",
          ]}
        />
        <p className="text-[12.5px] text-slate-600">
          ご自身が投稿したものであれば、依頼をお待ちいただかなくても、
          アプリ内からいつでも削除できます。
        </p>
      </Article>

      <Article heading="写真に自社の情報が写り込んでいた場合">
        <p>
          施主名・図面・看板・従業員の顔などが写り込んだ写真を見つけられた場合も、
          上記の窓口までご連絡ください。事実関係を確認のうえ、
          写真の削除または該当箇所の処理を行います。
          緊急性が高い場合は、確認より先に非表示にする対応を取ります。
        </p>
      </Article>

      <Article heading="その他のお問い合わせ">
        <p>
          不具合の報告、機能のご要望、取材のご相談なども同じ窓口で受け付けています。
          現場で使っていて「ここが使いにくい」と感じた点があれば、ぜひ教えてください。
          一番参考になる情報です。
        </p>
      </Article>
    </LegalShell>
  );
}
