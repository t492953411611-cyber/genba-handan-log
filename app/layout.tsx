import type { Metadata, Viewport } from "next";
import "./globals.css";

const publicPath = process.env.GITHUB_ACTIONS === "true" ? "/genba-handan-log" : "";

export const metadata: Metadata = {
  title: "電工コネクト",
  description: "電気工事士のための現場SNS。トラブル解決・職人ノウハウ・匿名Q&A・工具レビュー。",
  manifest: `${publicPath}/manifest.webmanifest`,
  icons: { icon: `${publicPath}/icon.svg?v=3`, apple: `${publicPath}/apple-touch-icon.png?v=3` },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "電工コネクト" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1E3A8A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
