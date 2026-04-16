import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import '../globals.css'
import { Providers } from '../providers'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { mono, sans, serif } from '@/theme/fonts'
import { getHero } from '@/actions/hero'
import { getAboutWithFacts } from '@/actions/about'

export async function generateMetadata(): Promise<Metadata> {
  const [hero, about] = await Promise.all([
    getHero(),
    getAboutWithFacts(),
  ])

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: hero.title,
      template: `%s | ${about.name}`,
    },
    description: about.subtitle,
    openGraph: {
      type: 'website',
      siteName: about.name,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [hero, about] = await Promise.all([
    getHero(),
    getAboutWithFacts(),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <Providers hero={hero} about={about}>
          <div className="min-h-screen bg-background text-foreground">
            <Nav />
            <main className="container mx-auto pb-20 px-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  )
}
