import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SortShroom - きのこで学ぶソートアルゴリズム図鑑'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>🍄</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          SortShroom
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'white',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          きのこで学ぶソートアルゴリズム図鑑
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          バブル・選択・挿入・マージ・クイック・ヒープソート
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
