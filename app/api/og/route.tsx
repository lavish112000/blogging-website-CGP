import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Tech-Knowlogia'
  const category = searchParams.get('category') || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1d4ed8 100%)',
          color: '#e5e7eb',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.8 }}>
          {category || 'Tech · Design · Lifestyle · Business'}
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: '1000px' }}>
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
            fontSize: 26,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0b1120',
                fontWeight: 800,
                fontSize: 32,
              }}
            >
              T
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: 28 }}>Tech-Knowlogia</span>
              <span style={{ fontSize: 20, opacity: 0.8 }}>Premium Knowledge for Modern Professionals</span>
            </div>
          </div>
          <div style={{ fontSize: 20, opacity: 0.75 }}>tech-knowlogia.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
