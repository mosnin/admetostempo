import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Admetos — Pay with Style'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #ede9fe 0%, #d1fae5 50%, #ffedd5 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #c4b5fd 0%, #6ee7b7 50%, #fed7aa 100%)',
          borderRadius: 32, width: 120, height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 64, color: 'white', fontWeight: 800 }}>A</div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#1e1b4b', letterSpacing: -3 }}>admetos</div>
        <div style={{ fontSize: 28, color: '#6b7280', fontWeight: 400 }}>Pay with style on the Tempo blockchain</div>
        <div style={{
          marginTop: 20, padding: '12px 32px',
          background: 'linear-gradient(135deg, #c4b5fd, #6ee7b7)',
          borderRadius: 100, fontSize: 22, color: 'white', fontWeight: 600,
        }}>Stablecoin payments · Instant · Beautiful</div>
      </div>
    ),
    { ...size }
  )
}
