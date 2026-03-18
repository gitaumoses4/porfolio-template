import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080C09',
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#3ECF8E',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          PF
        </span>
      </div>
    ),
    { ...size },
  )
}
