import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "現場判断ログ",
  description: "電気工事の施工管理判断を記録・蓄積するアプリ",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "現場判断ログ" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
