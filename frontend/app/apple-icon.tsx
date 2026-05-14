import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background:     '#1a3a5c',
          width:          '100%',
          height:         '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color:         '#c8a84b',
            fontSize:      '120px',
            fontWeight:    '800',
            fontFamily:    'sans-serif',
            letterSpacing: '-4px',
            lineHeight:    1,
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  )
}
