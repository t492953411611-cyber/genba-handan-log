"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheckBig, TriangleAlert, Zap } from "lucide-react";
import { CONSENT_KEY } from "@/lib/denkou/legal";

/**
 * 初回起動時の同意画面。
 * 規約への同意を取るだけでなく、安全に関する免責をここで一度必ず読ませる。
 */
export function ConsentGate() {
  const [needsConsent, setNeedsConsent] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      setNeedsConsent(window.localStorage.getItem(CONSENT_KEY) !== "agreed");
    } catch {
      // ストレージが使えない環境では同意画面を出さない（利用自体は妨げない）
      setNeedsConsent(false);
    }
  }, []);

  if (!needsConsent) return null;

  function agree() {
    if (!checked) return;
    try {
      window.localStorage.setItem(CONSENT_KEY, "agreed");
    } catch {
      // 保存できなくても利用は続行できるようにする
    }
    setNeedsConsent(false);
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center gap-2 bg-denkou px-4 py-4 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-denkou-accent text-denkou-dark">
          <Zap size={20} strokeWidth={3} fill="currentColor" />
        </span>
        <div>
          <p className="text-lg font-black leading-tight">電工コネクト</p>
          <p className="text-[11px] font-medium text-blue-200">はじめにお読みください</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-300">
          <p className="flex items-center gap-1.5 text-[13px] font-black text-amber-900">
            <TriangleAlert size={16} strokeWidth={2.8} />
            安全についての大切なお願い
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-amber-900">
            ここでのやりとりは、電気工事に携わる方どうしの経験の共有です。
            特定の現場に対する作業指示ではありません。
            <b className="font-black">
              実際に作業するかどうかの最終判断は、必ず現場の有資格者が、法令と機器の仕様書に従って行ってください。
            </b>
          </p>
        </div>

        <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-700">
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              これは<b className="font-bold">体験版</b>です。書いた投稿は
              <b className="font-bold">この端末の中だけに保存され、他の人には表示されません</b>。
              使い勝手を試すためのものとお考えください。
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              活線作業や高圧受電設備の<b className="font-bold">作業手順そのものを尋ねる投稿は扱いません</b>。
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              現場写真には<b className="font-bold">施主名・図面・看板・人の顔を写さない</b>でください。
              守秘義務違反になり、あなたの勤務先にも影響します。
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              匿名投稿でも、運営者は投稿者を識別できる情報を保持します。
              <b className="font-bold">完全な匿名ではありません。</b>
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              危険だと感じた投稿は、<b className="font-bold">「危険な内容として報告」</b>を押してください。
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              将来ここが本公開になった際は、投稿や登録情報が
              <b className="font-bold">米国に所在する事業者のクラウド</b>（Supabase, Cloudflare）に
              保管されます。体験版の現在は、どこにも送信していません。
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig size={16} strokeWidth={2.8} className="mt-0.5 shrink-0 text-denkou" />
            <span>
              未成年の方は、<b className="font-bold">保護者の同意</b>を得てからご利用ください。
            </span>
          </li>
        </ul>

        <p className="mt-5 text-[12.5px] leading-relaxed text-slate-600">
          詳しくは
          <Link href="/terms/" className="font-bold text-denkou underline">
            利用規約
          </Link>
          と
          <Link href="/privacy/" className="font-bold text-denkou underline">
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>
      </div>

      <div className="safe-bottom shrink-0 border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => setChecked((v) => !v)}
          role="checkbox"
          aria-checked={checked}
          className="flex w-full items-start gap-2.5 rounded-lg px-1 py-2 text-left active:bg-slate-50"
        >
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition ${
              checked ? "border-denkou bg-denkou text-white" : "border-slate-400 bg-white"
            }`}
          >
            {checked && <CircleCheckBig size={13} strokeWidth={3.5} />}
          </span>
          <span className="text-[13px] font-bold leading-snug text-slate-800">
            上記を読み、利用規約とプライバシーポリシー（外国にある第三者への個人データの提供を含む）に同意します
          </span>
        </button>

        <button
          type="button"
          onClick={agree}
          className={`tap mt-2 w-full rounded-lg text-[15px] font-black transition ${
            checked
              ? "bg-denkou text-white shadow-sm active:bg-denkou-dark"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          同意してはじめる
        </button>
      </div>
    </div>
  );
}
