import type { Metadata, Viewport } from "next"; // Viewportを追加
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 修正箇所: メタデータ定義
export const metadata: Metadata = {
  title: "Beat Actor",
  description: "Click notation is dead. 拍を、演じろ。",
  manifest: "/manifest.json", // PWAマニフェストへのリンク
  icons: {
    apple: "/icon", // iPhone用アイコン
  },
};

// 追加: スマホで拡大縮小させない（アプリっぽくする）設定
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
