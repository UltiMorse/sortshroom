import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
  description: "きのこをモチーフにしたアニメーションで、バブルソート、選択ソート、挿入ソート、マージソート、クイックソート、ヒープソートなどのソートアルゴリズムを直感的に学習できる教育サイトです。",
  keywords: ["ソートアルゴリズム", "プログラミング学習", "アルゴリズム可視化", "教育", "きのこ", "バブルソート", "選択ソート", "挿入ソート", "マージソート", "クイックソート", "ヒープソート"],
  authors: [{ name: "SortShroom" }],
  creator: "SortShroom",
  publisher: "SortShroom",
  robots: "index, follow",
  openGraph: {
    title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    description: "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習",
    type: "website",
    locale: "ja_JP",
    siteName: "SortShroom",
  },
  twitter: {
    card: "summary_large_image",
    title: "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    description: "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習",
  },
  alternates: {
    canonical: "https://sortshroom.vercel.app", // あなたのVercelドメインに変更してください
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
