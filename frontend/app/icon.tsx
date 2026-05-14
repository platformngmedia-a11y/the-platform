import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius:   '5px',
        }}
      >
        <span
          style={{
            color:          '#c8a84b',
            fontSize:       '22px',
            fontWeight:     '800',
            fontFamily:     'sans-serif',
            letterSpacing:  '-1px',
            lineHeight:     1,
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  )
}
