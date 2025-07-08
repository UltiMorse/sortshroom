# 🍄 SortShroom - きのこで学ぶソートアルゴリズム図鑑

[![Vercel](https://img.shields.io/badge/vercel-deployed-brightgreen)](https://sortshroom.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)

きのこをモチーフにしたアニメーションを通して、各種ソートアルゴリズムの動作原理を直感的に理解できる教育ウェブサイトです。

🔗 **ライブデモ**: [https://sortshroom.vercel.app](https://sortshroom.vercel.app)

## ✨ 特徴

- 🍄 **かわいいきのこのアニメーション** - きのこが並び替わる様子でアルゴリズムを可視化
- 📊 **6種類のソートアルゴリズム** - バブル、選択、挿入、マージ、クイック、ヒープソート  
- 🎵 **サウンド効果** - 比較や交換時の音で楽しく
- 📱 **レスポンシブ対応** - PC、タブレット、スマートフォンで快適に利用可能
- 🌙 **ダークモード対応** - 目に優しいテーマ切り替え機能
- ⚡ **パフォーマンス計測** - 比較回数・交換回数のリアルタイム表示
- 🎮 **インタラクティブ設定** - データサイズ、アニメーション速度の調整
- **直感的なビジュアライゼーション**: きのこのアニメーションでソート過程を表現
- **教育的解説**: アルゴリズムの特性、計算量、コード例

## 🛠️ 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (アニメーション)
- **Lucide React** (アイコン)
- **Vercel** (デプロイ)

## 🚀 デプロイ

このプロジェクトはVercelでホストされています。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/UltiMorse/sortshroom)

### 自分でデプロイする場合

1. プロジェクトをクローン
2. Vercelにサインアップ
3. GitHubリポジトリを接続
4. 自動デプロイが開始されます

## 🚀 開発環境の構築

### 前提条件
- Node.js 18.0.0 以上
- npm または yarn

### インストールと起動

```bash
# リポジトリのクローン
git clone <repository-url>
cd sortshroom

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ターミナルに表示されたリンクを開いてください。

## 📚 実装済み機能

### ✅ 完了
- [x] プロジェクト基盤の構築
- [x] きのこの森テーマデザイン
- [x] ダークモード切り替え
- [x] きのこビジュアライゼーション基本実装
- [x] アルゴリズム選択UI
- [x] パフォーマンスカウンター表示
- [x] 操作パネル（再生、リセット、設定）
- [x] データ数・速度調整スライダー
- [x] SNS共有機能

### 🚧 実装予定 保守性皆無なのでどうにかしたいが、今のところ厳しい。勉強します。
- [ ] ソートアルゴリズム追加
- [ ] 初期データパターン選択

## 🎯 使い方

1. **アルゴリズム選択**: 上部のタブから学習したいソートアルゴリズムを選択
2. **データ調整**: スライダーできのこの数と再生速度を調整
3. **ソート実行**: 再生ボタンでアニメーション開始
4. **解説確認**: 下部の解説・コードタブで詳細を学習

## 🎨 デザインコンセプト

### ライトモード（昼の森）
- アースカラー（ブラウン、グリーン）基調

### ダークモード（夜の森）
- 濃紺、ダークグレー基調

## 📁 プロジェクト構造

```
sortshroom/
├── src/
│   ├── app/
│   │   ├── globals.css      # グローバルスタイル
│   │   ├── layout.tsx       # レイアウトコンポーネント
│   │   └── page.tsx         # メインページ
│   ├── components/          # 再利用可能コンポーネント
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ関数
│   └── types/              # TypeScript型定義
├── public/                 # 静的ファイル
└── .github/               # GitHub設定
    └── copilot-instructions.md
```

## 🚀 デプロイ

Vercelでデプロイした：

```bash
# Vercelへデプロイ
npm run build
npx vercel --prod
```

## 🤝 コントリビューション

1. Forkしてください
2. Feature branchを作成してください (`git checkout -b feature/AmazingFeature`)
3. 変更をコミットしてください (`git commit -m 'Add some AmazingFeature'`)
4. Branchにプッシュしてください (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成してください

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👨‍💻 作者

UltiMorse
