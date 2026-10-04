'use client'

import { useEffect, useRef, useState } from 'react'
import { Archivo } from 'next/font/google'
import { SPLASH_ROWS } from '../lib/splash'

const archivo = Archivo({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-archivo', display: 'swap' })

const REPLAY_MS = 3600

/**
 * The Voxikin app's splash (v4 SCREEN 01.01) at its true 390x844 size, zoomed into the desk phone so text stays sharp.
 * Greetings in Indic scripts gather, a warm clearing opens, the wordmark lands. It replays while on screen;
 * reduced motion shows the settled frame only.
 */
export default function VoxikinSplash() {
  const ref = useRef<HTMLSpanElement>(null)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (entry.isIntersecting) timer = window.setInterval(() => setRun(n => n + 1), REPLAY_MS)
    })
    io.observe(el)
    return () => { io.disconnect(); window.clearInterval(timer) }
  }, [])

  return (
    <span ref={ref} className={`vx-frame ${archivo.variable}`} aria-hidden="true">
      <span key={run} className="vx-play">
        <span className="vx-field">
          {SPLASH_ROWS.map(r => (
            <i key={r.y} style={{ ['--y' as string]: `${r.y}px`, ['--tx' as string]: `${r.tx}px`, ['--dy' as string]: `${r.dy}px`, ['--d' as string]: `${r.d}ms` }}>
              {r.words.map(([text, size, tone], i) => (
                <span key={i} style={{ ['--s' as string]: `${size}px`, ['--c' as string]: `var(--r${tone})` }}>{text}</span>
              ))}
            </i>
          ))}
        </span>
        <span className="vx-clear" />
        <span className="vx-name"><b>Voxikin</b></span>
      </span>
      <span className="vx-sb">
        <span>9:41</span>
        <span className="sig">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" /><rect x="9" y="3" width="3" height="9" rx="1" /><rect x="13.5" y="0" width="3" height="12" rx="1" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 10.2 6.1 8.3a2.7 2.7 0 0 1 3.8 0L8 10.2Zm0-3.7a5.2 5.2 0 0 0-3.7 1.5L2.9 6.6a7.2 7.2 0 0 1 10.2 0l-1.4 1.4A5.2 5.2 0 0 0 8 6.5Zm0-3.6c-2.5 0-4.9 1-6.6 2.7L0 3.9A11.2 11.2 0 0 1 16 3.9l-1.4 1.4A9.2 9.2 0 0 0 8 2.9Z" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity=".38" /><rect x="2" y="2" width="15" height="8" rx="1.8" fill="currentColor" /><path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" /></svg>
        </span>
      </span>
      <span className="vx-island" />
      <span className="vx-home" />
    </span>
  )
}
