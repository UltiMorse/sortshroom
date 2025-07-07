import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
  description: "きのこをモチーフにしたアニメーションで、バブルソート、選択ソート、挿入ソート、マージソート、クイックソート、ヒープソートなどのソートアルゴリズムを直感的に学習できる教育サイトです。",
  keywords: ["ソートアルゴリズム", "アルゴリズム可視化", "プログラミング学習", "教育", "きのこ", "データ構造", "コンピューターサイエンス"],
  openGraph: {
    title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    description: "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習",
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
