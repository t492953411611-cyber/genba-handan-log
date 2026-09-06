import type { Metadata } from "next";
import Link from "next/link";
import { Article, Highlight, LegalShell, List } from "@/components/denkou/LegalShell";
import { LEGAL_UPDATED_AT, OPERATOR_CONTACT, SUBPROCESSORS } from "@/lib/denkou/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー ｜ 電工コネクト",
  description: "電工コネクトにおける個人情報の取り扱いについて。",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="プライバシーポリシー" updatedAt={LEGAL_UPDATED_AT}>
      <p className="text-[13.5px] leading-relaxed text-slate-700">
        電工コネクト（以下「本サービス」）における、利用者の個人情報の取り扱いについて定めます。
        本ポリシーは、個人情報の保護に関する法律（個人情報保護法）に基づき、
        保有個人データに関する事項を公表するものを兼ねます。
      </p>

      <Article heading="1. 事業者の情報">
        <List
          items={[
            `事業者：${OPERATOR_CONTACT.operator}`,
            `所在地：${OPERATOR_CONTACT.address}`,
            `個人情報の取り扱いに関する窓口：${OPERATOR_CONTACT.email}`,
          ]}
        />
      </Article>

      <Article heading="2. 取得する情報">
        <List
          items={[
            "アカウント登録時にご入力いただく情報（メールアドレス、表示名、保有資格、現場歴、活動地域）",
            "投稿・コメントの内容、添付された写真",
            "いいね・保存・通報などの操作の記録",
            "アクセスログ（IPアドレス、日時、ブラウザの種類、参照元）",
          ]}
        />
        <p>
          クレジットカード情報などの決済情報は、本サービスでは一切取得しません。
          また、要配慮個人情報（病歴、犯罪歴など）を意図的に取得することはありません。
        </p>
      </Article>

      <Article heading="3. 利用目的">
        <List
          items={[
            "本サービスの提供、維持、改善のため",
            "利用者の本人確認、およびアカウントの管理のため",
            "利用規約に違反する投稿の確認と対応のため",
            "権利侵害の申し立てや、法令に基づく開示請求に対応するため",
            "重要なお知らせを利用者に連絡するため",
            "不正アクセスや不正利用の防止のため",
          ]}
        />
        <p>
          利用目的を変更する場合は、変更後の目的が変更前と関連性を有すると合理的に認められる範囲で行い、
          本ポリシーの改定によりお知らせします。
        </p>
      </Article>

      <Article heading="4. 匿名投稿とアクセスログについて">
        <Highlight>
          匿名で投稿した場合、他の利用者には「匿名電工」と表示されますが、
          運営者は投稿者を識別できる情報とアクセスログを保持します。
          法令に基づく正当な開示請求があった場合には、法令に従って対応することがあります。
          完全な匿名ではないことをご理解のうえ、ご利用ください。
        </Highlight>
      </Article>

      <Article heading="5. 第三者への提供">
        <p>次の場合を除き、取得した個人データを第三者に提供することはありません。</p>
        <List
          items={[
            "ご本人の同意がある場合",
            "法令に基づく場合、または裁判所・警察等の公的機関から法令に基づく開示を求められた場合",
            "人の生命、身体または財産の保護のために必要があり、ご本人の同意を得ることが困難な場合",
          ]}
        />
        <p>
          本サービスは、広告配信のための第三者へのデータ提供や、個人情報の販売は一切行いません。
        </p>
      </Article>

      <Article heading="6. 外国にある第三者への提供（重要）">
        <Highlight>
          本サービスは、システムの稼働のために、外国に所在する事業者のクラウドサービスを利用しています。
          このため、取得した個人データは、外国にある第三者に提供されます。
          ご利用にあたっては、この点についてあらかじめご同意いただく必要があります。
        </Highlight>
        <p>提供先および利用目的は次のとおりです。</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[380px] border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-1.5 text-left font-bold">提供先</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left font-bold">所在国</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left font-bold">役割</th>
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map((s) => (
                <tr key={s.name}>
                  <td className="border border-slate-300 px-2 py-1.5">{s.name}</td>
                  <td className="border border-slate-300 px-2 py-1.5">{s.country}</td>
                  <td className="border border-slate-300 px-2 py-1.5">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <List
          items={[
            "提供先の国における個人情報の保護に関する制度は、日本の制度と異なる場合があります。アメリカ合衆国には、日本の個人情報保護法に相当する包括的な連邦法はなく、分野別の法律と州法によって規律されています。",
            "運営者は、提供先が講じている安全管理措置（通信の暗号化、保管データの暗号化、アクセス制御など）を確認したうえで、これらの事業者を利用しています。",
            "提供先の個人情報の取り扱いについて詳細をお知りになりたい場合は、お問い合わせ窓口までご連絡ください。",
          ]}
        />
      </Article>

      <Article heading="7. 安全管理のために講じている措置">
        <p>
          運営者は、取得した個人データの漏えい、滅失または毀損を防ぐため、次の措置を講じています。
        </p>
        <List
          items={[
            "基本方針の策定：本ポリシーを定め、公表しています。",
            "組織的措置：本サービスは運営者ひとりが管理しており、個人データを取り扱う者を運営者本人に限定しています。",
            "技術的措置：データベースには行単位のアクセス制御を設定し、利用者は自分のデータおよび公開された投稿以外にアクセスできない仕組みとしています。管理用の鍵は運営者のみが保管します。通信は暗号化しています。",
            "物理的措置：管理に用いる端末には画面ロックを設定し、第三者が操作できない状態で保管しています。",
            "外的環境の把握：前項のとおり、外国の事業者のサービスを利用しており、当該国の個人情報保護制度を把握したうえで安全管理措置を講じています。",
          ]}
        />
        <p className="text-[12.5px] text-slate-600">
          本サービスは個人が運営しているため、大規模な事業者と同等の体制ではないことをあらかじめご了承ください。
        </p>
      </Article>

      <Article heading="8. 漏えい等が発生した場合の対応">
        <p>
          個人データの漏えい、滅失、毀損その他の事態が生じた場合、
          運営者は、法令に従って個人情報保護委員会への報告および本人への通知を行います。
        </p>
      </Article>

      <Article heading="9. ブラウザに保存される情報">
        <p>
          本サービスは、ログイン状態の保持、同意状況の記録、表示設定の記憶のために、
          クッキーおよびブラウザの保存領域（LocalStorage 等）を利用します。
          これらは利用者の端末内に保存されるもので、広告目的の追跡には使用しません。
          ブラウザの設定から削除できますが、削除するとログイン状態が保持されなくなります。
        </p>
      </Article>

      <Article heading="10. 未成年者の個人情報">
        <p>
          15歳未満の方の個人情報を取得する場合は、法定代理人の同意を得たうえでご登録ください。
          法定代理人の同意なく登録されたことが判明した場合、当該アカウントを削除することがあります。
        </p>
      </Article>

      <Article heading="11. 開示・訂正・利用停止・削除の請求">
        <p>
          ご自身の保有個人データについて、利用目的の通知、開示、内容の訂正・追加・削除、
          利用の停止・消去、第三者提供の停止を請求できます。手続きは次のとおりです。
        </p>
        <List
          items={[
            `請求方法：お問い合わせ窓口（${OPERATOR_CONTACT.email}）宛に、件名を「個人情報の開示等の請求」としてメールでご連絡ください。`,
            "本人確認：登録されているメールアドレスからご連絡いただくことで本人確認とします。第三者を経由する場合は、委任状などの確認書類をお願いすることがあります。",
            "手数料：無料です。",
            `回答の期間：${OPERATOR_CONTACT.responseTime}に回答します。`,
            "なお、法令により応じられない場合や、他の利用者の権利を害するおそれがある場合には、その旨と理由をお伝えします。",
          ]}
        />
      </Article>

      <Article heading="12. 退会とデータの取り扱い">
        <List
          items={[
            "アカウントの削除（退会）は、アプリ内のマイページからいつでも行えます。",
            "退会した場合、アカウント情報は削除されます。ただし、他の利用者とのやりとりの流れを保つため、投稿内容は投稿者名を伏せた状態で残ることがあります。投稿自体の削除をご希望の場合は、退会前に削除するか、お問い合わせ窓口までご連絡ください。",
            "法令により保存が求められる記録、および紛争対応のために必要な記録については、必要な期間に限り保管する場合があります。",
          ]}
        />
      </Article>

      <Article heading="13. 本ポリシーの変更">
        <p>
          本ポリシーの内容を変更する場合は、本ページに掲載します。
          利用目的の変更や、外国にある第三者への提供先の追加など、
          利用者にとって重要な変更を行う場合は、アプリ内でお知らせし、
          必要に応じてあらためて同意をお願いします。
        </p>
      </Article>

      <Article heading="14. お問い合わせ窓口">
        <p>{OPERATOR_CONTACT.operator}</p>
        <p>所在地：{OPERATOR_CONTACT.address}</p>
        <p>連絡先：{OPERATOR_CONTACT.email}</p>
        <p>回答の目安：{OPERATOR_CONTACT.responseTime}</p>
        <p className="text-[12.5px] text-slate-600">
          削除依頼の手順は
          <Link href="/contact/" className="font-bold text-denkou underline">
            お問い合わせ・削除依頼
          </Link>
          をご覧ください。
        </p>
      </Article>
    </LegalShell>
  );
}
