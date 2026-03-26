import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './lib/ThemeContext'

export const metadata: Metadata = {
  title: 'Shubh Sankalp Das — AI PM',
  description: 'AI Product Manager building at the intersection of LLM infrastructure and consumer experience. Targeting AI Platform PM and Consumer AI PM roles.',
  openGraph: {
    title: 'Shubh Sankalp Das — AI PM',
    description: 'AI PM portfolio — shipped products, technical teardowns, and PM writing.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
