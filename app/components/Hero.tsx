'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../lib/ThemeContext'

const WORDS = ['AI-native', 'systems-first', 'evidence-backed', 'outcome-tied']

// ── Dot grid flashlight canvas ────────────────────────────────────────
function useDotGrid(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { theme } = useTheme()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const GAP = 24
    let W = 0, H = 0
    let mouseX = -9999, mouseY = -9999
    let rafId = 0

    const isDark = theme === 'dark'
    const dotBase = isDark ? 'rgba(242,239,232,' : 'rgba(17,17,16,'
    const RADIUS = 150

    function resize() {
      W = canvas!.parentElement!.offsetWidth
      H = canvas!.parentElement!.offsetHeight
      canvas!.width = W
      canvas!.height = H
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      const cols = Math.ceil(W / GAP) + 1
      const rows = Math.ceil(H / GAP) + 1

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GAP
          const y = r * GAP
          const dx = x - mouseX
          const dy = y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)

          let alpha = 0.12
          if (dist < RADIUS) {
            alpha = 0.12 + (1 - dist / RADIUS) * 0.65
          }

          ctx!.beginPath()
          ctx!.arc(x, y, 1, 0, Math.PI * 2)
          ctx!.fillStyle = `${dotBase}${alpha})`
          ctx!.fill()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    function onLeave() { mouseX = -9999; mouseY = -9999 }

    resize()
    if (!reduced) {
      draw()
      window.addEventListener('mousemove', onMouse, { passive: true })
      canvas.parentElement!.addEventListener('mouseleave', onLeave)
    } else {
      draw()
      cancelAnimationFrame(rafId)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouse)
      canvas.parentElement?.removeEventListener('mouseleave', onLeave)
    }
  }, [canvasRef, theme])
}

// ── Per-character bounce on hover ─────────────────────────────────────
function BounceText({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'inline-block', ...style }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 20}ms`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.transform = 'translateY(-7px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.transform = 'translateY(0)' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────
export default function Hero() {
  const [word, setWord] = useState('AI-native')
  const [clock, setClock] = useState('')
  const [revealed, setRevealed] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ wi: 0, ci: 9, del: false })
  const { theme } = useTheme()

  useDotGrid(canvasRef as React.RefObject<HTMLCanvasElement>)

  const isDark = theme === 'dark'
  const metaPillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.52)'
  const metaPillBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,26,26,0.08)'
  const metaText = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(26,26,26,0.82)'
  const metaDivider = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(26,26,26,0.16)'

  // Clip-path reveal on mount
  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(id)
  }, [])

  // Typewriter
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function tick() {
      const s = stateRef.current
      const w = WORDS[s.wi]
      if (!s.del) {
        s.ci++
        setWord(w.slice(0, s.ci))
        if (s.ci === w.length) { s.del = true; timer = setTimeout(tick, 1900); return }
      } else {
        s.ci--
        setWord(w.slice(0, s.ci))
        if (s.ci === 0) { s.del = false; s.wi = (s.wi + 1) % WORDS.length }
      }
      timer = setTimeout(tick, s.del ? 52 : 92)
    }
    timer = setTimeout(tick, 1200)
    return () => clearTimeout(timer)
  }, [])

  // IST clock
  useEffect(() => {
    function tick() {
      setClock(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: any
    const handleDrawerScrollLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked?: boolean }>).detail?.locked
      if (!lenis) return
      if (locked) lenis.stop()
      else lenis.start()
    }

    window.addEventListener('drawer-scroll-lock', handleDrawerScrollLock)

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    }).catch(() => {})

    return () => {
      window.removeEventListener('drawer-scroll-lock', handleDrawerScrollLock)
      if (lenis) lenis.destroy()
    }
  }, [])

  const clipStyle = (delay: string): React.CSSProperties => ({
    clipPath: revealed ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
    transition: `clip-path 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}`,
    overflow: 'hidden',
  })

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 4rem 3.5rem',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
    }}>

      {/* Dot grid canvas */}
      <canvas ref={canvasRef} aria-hidden style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Radial vignette */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 70% at 40% 80%, var(--bg) 30%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Status pill */}
        <div style={clipStyle('0.10s')}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            fontFamily: 'var(--font-m)', fontSize: '0.59rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--accent)', border: '1px solid var(--accent-b)',
            padding: '0.27rem 0.7rem', borderRadius: '100px',
            marginBottom: '1.1rem', width: 'fit-content',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pdot 2s ease-in-out infinite',
            }} />
            Open to AI PM roles · 2026
            <style>{`@keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.7)}}`}</style>
          </div>
        </div>

        {/* Eyebrow + clock */}
        <div style={clipStyle('0.18s')}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            width: 'min(100%, 1240px)',
          }}>
            <div style={{
              fontFamily: 'var(--font-m)', fontSize: '0.67rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--fg-dim)',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ display: 'block', width: '2rem', height: 1, background: 'var(--fg-dimmer)' }} />
              AI Product Manager
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.46rem 0.8rem',
              borderRadius: '999px',
              border: `1px solid ${metaPillBorder}`,
              background: metaPillBg,
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            }}>
              <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.7rem', letterSpacing: '0.08em', color: metaText }}>
                Goa, India
              </span>
              <span style={{ width: 1, height: 12, background: metaDivider }} />
              <span style={{
                fontFamily: 'var(--font-m)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
                opacity: 0.9,
              }}>{clock}</span>
              <span style={{ width: 1, height: 12, background: metaDivider }} />
              <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.7rem', letterSpacing: '0.08em', color: metaText }}>
                IST
              </span>
            </div>
          </div>
        </div>

        {/* Name — static block, BounceText handles per-char hover */}
        <div style={clipStyle('0.26s')}>
          <div style={{ marginBottom: '1.5rem', userSelect: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-d)',
              fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
              fontWeight: 700, lineHeight: 0.9,
              letterSpacing: '-0.04em', color: 'var(--fg)',
            }}>
              <BounceText text="SHUBH" />
            </div>
            <div style={{
              fontFamily: 'var(--font-d)',
              fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
              fontWeight: 700, lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: '2px var(--fg)',
              paddingLeft: 'clamp(1.4rem, 3vw, 3.6rem)',
            }}>
              <BounceText text="SANKALP" />
            </div>
            <div style={{
              fontFamily: 'var(--font-d)',
              fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
              fontWeight: 700, lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--accent)',
              paddingLeft: 'clamp(2.6rem, 5vw, 6rem)',
            }}>
              <BounceText text="DAS" />
            </div>
          </div>
        </div>

        {/* Typewriter + copy + CTAs */}
        <div style={clipStyle('0.36s')}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            gap: '3rem', maxWidth: 960, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                fontFamily: 'var(--font-d)',
                fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
                fontWeight: 600, lineHeight: 1.25,
                letterSpacing: '-0.02em', color: 'var(--fg)',
                marginBottom: '0.9rem',
              }}>
                I build{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                  <span style={{
                    borderRight: '2px solid var(--accent)',
                    paddingRight: 2,
                    animation: 'blink 0.88s step-end infinite',
                  }}>{word}</span>
                </em>
                <style>{`@keyframes blink{0%,100%{border-color:var(--accent)}50%{border-color:transparent}}`}</style>
                {' '}products that ship.
              </div>
              <p style={{
                fontSize: '0.92rem', color: 'var(--fg-dim)',
                lineHeight: 1.75, maxWidth: 380,
              }}>
                <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Currently</strong> building
                AI-native tools at the intersection of LLM infrastructure and consumer experience.
                Obsessed with what breaks in production, not what looks good in Figma.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flexShrink: 0 }}>
              <a href="#projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  fontFamily: 'var(--font-m)', fontSize: '0.69rem', fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#fff', background: 'var(--accent)',
                  padding: '0.78rem 1.4rem', borderRadius: 'var(--r)',
                  transition: 'background 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dark)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
              >
                See my work ↓
              </a>
              <a href="/resume.pdf" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                fontFamily: 'var(--font-m)', fontSize: '0.69rem', fontWeight: 400,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--fg-dim)', border: '1px solid var(--border-2)',
                padding: '0.78rem 1.4rem', borderRadius: 'var(--r)',
              }}>
                Download CV ↗
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
