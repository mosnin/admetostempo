import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #c4b5fd 0%, #6ee7b7 50%, #fed7aa 100%)',
        borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 90, color: 'white', fontWeight: 800, letterSpacing: -4 }}>A</div>
      </div>
    ),
    { ...size }
  )
}
