import { ImageResponse } from 'next/og'
import { getAboutWithFacts } from '@/actions/about'

export const alt = 'Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const about = await getAboutWithFacts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0A0F0C',
          color: '#E4EDE6',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {about.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#3ECF8E',
            fontStyle: 'italic',
          }}
        >
          {about.subtitle}
        </div>
        {about.location && (
          <div
            style={{
              fontSize: 24,
              color: '#7A9A82',
              marginTop: 24,
            }}
          >
            {about.location}
          </div>
        )}
      </div>
    ),
    { ...size },
  )
}
