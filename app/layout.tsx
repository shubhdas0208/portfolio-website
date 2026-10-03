import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
import './tailwind.css'
import './globals.css'
import Header from './components/Header'
import FloatNav from './components/FloatNav'
import P99Panel from './components/P99Panel'
import { ViewTransitionResolver } from './components/ViewTransitionLink'

const clash = localFont({
  src: [
    { path: './fonts/fontshare/Clash-Display-600.woff2', weight: '600' },
    { path: './fonts/fontshare/Clash-Display-700.woff2', weight: '700' },
  ],
  variable: '--font-clash',
  display: 'swap',
})

const satoshi = localFont({
  src: [
    { path: './fonts/fontshare/Satoshi-400.woff2', weight: '400' },
    { path: './fonts/fontshare/Satoshi-500.woff2', weight: '500' },
    { path: './fonts/fontshare/Satoshi-700.woff2', weight: '600 700' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--font-instrument', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-website-shubh-das.vercel.app'),
  title: 'Shubh Sankalp Das · Product Manager who builds AI products',
  description: 'Product Manager at Dezerv. Case studies on LLM agent reliability and RAG, and blogs on the product decisions inside engineering.',
  openGraph: {
    title: 'Shubh Sankalp Das · Product Manager who builds AI products',
    description: 'Product Manager at Dezerv. Case studies on LLM agent reliability and RAG, and blogs on the product decisions inside engineering.',
    type: 'website',
  },
}

// Sets the theme before first paint (light by default) so there is no flash, and adds motion-ok
// only when JS runs and motion is allowed, so every motion pre-state is opt-in.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light'}catch(e){}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${clash.variable} ${satoshi.variable} ${dmMono.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#content">Skip to content</a>
        <Header />
        <FloatNav />
        {children}
        <P99Panel />
        <ViewTransitionResolver />
      </body>
    </html>
  )
}
