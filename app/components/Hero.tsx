'use client'

import { useEffect, useRef, useState } from 'react'

const WORDS = ['AI-native', 'systems-first', 'evidence-backed', 'outcome-tied']

export default function Hero() {
  const [text, setText] = useState('AI-native')
  const [clock, setClock] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ wi: 0, ci: 9, del: false })
  const rafRef = useRef<number>(0)

  // Typewriter
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function tick() {
      const s = stateRef.current
      const w = WORDS[s.wi]
      if (!s.del) {
        s.ci++
        setText(w.slice(0, s.ci))
        if (s.ci === w.length) { s.del = true; timer = setTimeout(tick, 1900); return }
      } else {
        s.ci--
        setText(w.slice(0, s.ci))
        if (s.ci === 0) { s.del = false; s.wi = (s.wi + 1) % WORDS.length }
      }
      timer = setTimeout(tick, s.del ? 52 : 92)
    }
    timer = setTimeout(tick, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Live clock — IST
  useEffect(() => {
    function tick() {
      const t = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      })
      setClock(t)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Drifting particles
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    type Particle = {
      x: number; y: number; vx: number; vy: number
      r: number; alpha: number; alphaDir: number
    }

    let W = 0, H = 0
    const COUNT = 55
    const particles: Particle[] = []

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      W = parent.offsetWidth
      H = parent.offsetHeight
      canvas!.width = W
      canvas!.height = H
    }

    function spawn(p: Particle) {
      p.x = Math.random() * W
      p.y = Math.random() * H
      p.vx = (Math.random() - 0.5) * 0.28
      p.vy = (Math.random() - 0.5) * 0.28
      p.r = Math.random() * 1.6 + 0.5
      p.alpha = Math.random() * 0.12 + 0.03
      p.alphaDir = Math.random() > 0.5 ? 1 : -1
    }

    for (let i = 0; i < COUNT; i++) {
      const p = {} as Particle
      spawn(p)
      particles.push(p)
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir * 0.0008
        if (p.alpha > 0.15 || p.alpha < 0.02) p.alphaDir *= -1

        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(249,115,22,${p.alpha})`
        ctx!.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '0 4rem 5rem',
      position: 'relative', overflow: 'hidden',
      borderBottom: '1px solid var(--border)', paddingTop: 0,
    }}>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Decorative background text */}
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '-0.02em', transform: 'translateY(-54%)',
        fontFamily: 'var(--font-d)', fontSize: 'clamp(12rem,24vw,22rem)',
        fontWeight: 700, color: 'transparent',
        WebkitTextStroke: '1px rgba(249,115,22,0.04)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        letterSpacing: '-0.04em', zIndex: 0,
      }}>AI</div>

      {/* All content above canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
          fontFamily: 'var(--font-m)', fontSize: '0.59rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--accent)', border: '1px solid var(--accent-b)',
          padding: '0.27rem 0.7rem', borderRadius: '100px', marginBottom: '1.75rem', width: 'fit-content',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pdot 2s ease-in-out infinite' }} />
          Open to AI PM roles · 2026
          <style>{`@keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.7)}}`}</style>
        </div>

        {/* Eyebrow + clock */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem', maxWidth: 820,
        }}>
          <div style={{
            fontFamily: 'var(--font-m)', fontSize: '0.67rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ display: 'block', width: '2rem', height: 1, background: 'var(--accent)' }} />
            AI Product Manager
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-m)', fontSize: '0.6rem',
              letterSpacing: '0.06em', color: 'var(--fg-dimmer)',
            }}>
              Goa, India
            </span>
            <span style={{ width: 1, height: 10, background: 'var(--fg-dimmer)', opacity: 0.4 }} />
            <span className="live-clock">{clock}</span>
            <span style={{
              fontFamily: 'var(--font-m)', fontSize: '0.6rem',
              letterSpacing: '0.06em', color: 'var(--fg-dimmer)',
            }}>
              IST
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-d)', fontSize: 'clamp(3rem,7.5vw,7rem)',
          fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.04em',
          maxWidth: 820, marginBottom: '2.75rem',
        }}>
          I build<br />
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
            <span style={{
              borderRight: '2px solid var(--accent)', paddingRight: 2,
              animation: 'blink 0.88s step-end infinite',
            }}>{text}</span>
          </em>
          <style>{`@keyframes blink{0%,100%{border-color:var(--accent)}50%{border-color:transparent}}`}</style>
          <br />products that<br />ship.
        </h1>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4rem', maxWidth: 820, flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--fg-dim)', lineHeight: 1.75, maxWidth: 340, fontWeight: 400 }}>
            <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Currently</strong> building AI-native tools at the intersection of LLM infrastructure and consumer experience. Obsessed with what breaks in production, not what looks good in Figma.<br /><br />
            Targeting <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>AI Platform PM</strong> and <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Consumer AI PM</strong> roles at AI-first and Fintech companies.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flexShrink: 0 }}>
            <a href="#projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              fontFamily: 'var(--font-m)', fontSize: '0.69rem', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#0a0a09', background: 'var(--accent)',
              padding: '0.78rem 1.4rem', borderRadius: 'var(--r)',
            }}>See my work ↓</a>
            <a href="/resume.pdf" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              fontFamily: 'var(--font-m)', fontSize: '0.69rem', fontWeight: 400,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-dim)', border: '1px solid var(--border-2)',
              padding: '0.78rem 1.4rem', borderRadius: 'var(--r)',
            }}>Download CV ↗</a>
          </div>
        </div>

      </div>
    </section>
  )
}
