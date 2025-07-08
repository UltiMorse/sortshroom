import type { Metadata } from "next";
import "./globals.css";
import { generateStructuredData } from "@/utils/structuredData";

export const metadata: Metadata = {
  title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
  description: "きのこをモチーフにしたアニメーションで、バブルソート、選択ソート、挿入ソート、マージソート、クイックソート、ヒープソートなどのソートアルゴリズムを直感的に学習できる教育サイトです。",
  keywords: ["ソートアルゴリズム", "アルゴリズム可視化", "プログラミング学習", "教育", "きのこ", "データ構造", "コンピューターサイエンス"],
  openGraph: {
    title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    description: "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習",
    url: "https://sortshroom.vercel.app",
    siteName: "SortShroom",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SortShroom - きのこで学ぶソートアルゴリズム図鑑',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    description: "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = generateStructuredData();

  return (
    <html lang="ja">
      <head>
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
