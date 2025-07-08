export function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
    "description": "きのこをモチーフにしたアニメーションで、バブルソート、選択ソート、挿入ソート、マージソート、クイックソート、ヒープソートなどのソートアルゴリズムを直感的に学習できる教育サイトです。",
    "url": "https://sortshroom.vercel.app",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "creator": {
      "@type": "Person",
      "name": "SortShroom Team"
    },
    "educationalUse": "プログラミング学習",
    "learningResourceType": "インタラクティブシミュレーション",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "ソートアルゴリズム"
      },
      {
        "@type": "Thing", 
        "name": "データ構造"
      },
      {
        "@type": "Thing",
        "name": "アルゴリズム可視化"
      }
    ],
    "keywords": "ソートアルゴリズム, アルゴリズム可視化, プログラミング学習, 教育, きのこ, データ構造, コンピューターサイエンス",
    "inLanguage": "ja"
  };
}
