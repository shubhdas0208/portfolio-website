'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import * as THREE from 'three'
import { useTheme } from '../lib/ThemeContext'

const WORDS = ['AI-native', 'systems-first', 'evidence-backed', 'outcome-tied']

function useCursorShader(
  hostRef: RefObject<HTMLElement>,
  containerRef: RefObject<HTMLDivElement>
) {
  const { theme } = useTheme()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const host = hostRef.current
    const container = containerRef.current

    if (!host || !container || reduced) return

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const geometry = new THREE.PlaneGeometry(2, 2)
    const trail = Array.from({ length: 5 }, () => new THREE.Vector2(0.5, 0.5))
    const target = new THREE.Vector2(0.5, 0.5)
    // Two persistent shard sources placed in the right-side blank area.
    const anchors = [new THREE.Vector2(0.76, 0.67), new THREE.Vector2(0.84, 0.33)]
    const strengths = [1, 0.82, 0.64, 0.46, 0.3]
    const anchorStrengths = [0.68, 0.0]
    const palette =
      theme === 'dark'
        ? {
            base: new THREE.Color('#f6f0e7'),
            accent: new THREE.Color('#ff8a3d'),
            wash: new THREE.Color('#9fb4c8'),
          }
        : {
            base: new THREE.Color('#221f1b'),
            accent: new THREE.Color('#ff6b00'),
            wash: new THREE.Color('#8b8177'),
          }

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
      points: { value: trail },
      strengths: { value: strengths },
      anchors: { value: anchors },
      anchorStrengths: { value: anchorStrengths },
      activation: { value: 0 },
      ambient: { value: theme === 'dark' ? 0.34 : 0.24 },
      colorA: { value: palette.base },
      colorB: { value: palette.accent },
      colorC: { value: palette.wash },
    }

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;
        uniform vec2 points[5];
        uniform float strengths[5];
        uniform vec2 anchors[2];
        uniform float anchorStrengths[2];
        uniform float activation;
        uniform float ambient;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;

        float rippleField(vec2 uv, vec2 point, float tOffset) {
          float d = length(uv - point);
          float signal = 0.0;

          for (int i = 1; i <= 3; i++) {
            float fi = float(i);
            signal += 0.0016 * fi * fi /
              abs(fract(time * 0.065 + tOffset + fi * 0.03) * 4.5 - d * 3.2 + mod(uv.x + uv.y, 0.24));
          }

          return signal * smoothstep(0.82, 0.02, d);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec2 centered = uv * 2.0 - 1.0;
          centered.x *= resolution.x / resolution.y;

          float field = 0.0;
          float anchorField = 0.0;
          float minDist = 10.0;

          for (int i = 0; i < 5; i++) {
            vec2 point = points[i] * 2.0 - 1.0;
            point.x *= resolution.x / resolution.y;

            float d = length(centered - point);
            minDist = min(minDist, d);
            field += rippleField(centered, point, float(i) * 0.09) * strengths[i];
          }

          for (int i = 0; i < 2; i++) {
            vec2 point = anchors[i] * 2.0 - 1.0;
            point.x *= resolution.x / resolution.y;

            float d = length(centered - point);
            minDist = min(minDist, d);
            anchorField += rippleField(centered, point, float(i) * 0.17 + 0.31) * anchorStrengths[i];
          }

          field = anchorField * (ambient + 0.22) + field * (ambient + activation * 0.9);
          field = clamp(field, 0.0, 1.2);

          float haze = (ambient * 0.4 + activation) * smoothstep(0.95, 0.0, minDist) * 0.12;
          vec3 color = colorA * field * 0.5 + colorB * field * 0.95 + colorC * pow(field, 1.35) * 0.4;
          color += mix(colorC, colorB, 0.55) * haze;

          float alpha = clamp(field * 0.84 + haze, 0.0, 0.78);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    let activationTarget = 0.22
    let rafId = 0

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return

      renderer.setSize(width, height, false)
      uniforms.resolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio()
      )
    }

    const setPointer = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = 1 - (clientY - rect.top) / rect.height

      target.set(
        THREE.MathUtils.clamp(x, 0, 1),
        THREE.MathUtils.clamp(y, 0, 1)
      )
    }

    const onPointerMove = (event: PointerEvent) => {
      setPointer(event.clientX, event.clientY)
      activationTarget = 1
    }

    const onPointerEnter = (event: PointerEvent) => {
      setPointer(event.clientX, event.clientY)
      activationTarget = 1
    }

    const onPointerLeave = () => {
      activationTarget = 0.22
    }

    const draw = () => {
      uniforms.time.value += 0.035
      uniforms.activation.value = THREE.MathUtils.lerp(
        uniforms.activation.value,
        activationTarget,
        0.08
      )

      // Alternate two shards: shard B starts rising only after shard A drops to ~10%, then swap.
      const phase = (uniforms.time.value * 0.055) % 2
      let shardA = 0
      let shardB = 0

      if (phase < 1) {
        const p = phase
        shardA = 1 - Math.min(p / 0.9, 1)
        shardB = p <= 0.9 ? 0 : (p - 0.9) / 0.1
      } else {
        const p = phase - 1
        shardB = 1 - Math.min(p / 0.9, 1)
        shardA = p <= 0.9 ? 0 : (p - 0.9) / 0.1
      }

      uniforms.anchorStrengths.value[0] = 0.72 * shardA
      uniforms.anchorStrengths.value[1] = 0.66 * shardB

      trail[0].lerp(target, 0.16)
      for (let i = 1; i < trail.length; i++) {
        trail[i].lerp(trail[i - 1], Math.max(0.06, 0.14 - i * 0.012))
      }

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerenter', onPointerEnter)
    host.addEventListener('pointerleave', onPointerLeave)
    draw()

    return () => {
      window.cancelAnimationFrame(rafId)
      ro.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerenter', onPointerEnter)
      host.removeEventListener('pointerleave', onPointerLeave)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [containerRef, hostRef, theme])
}

function BounceText({
  text,
  style,
  charGap = '0em',
}: {
  text: string
  style?: CSSProperties
  charGap?: string
}) {
  return (
    <span style={{ display: 'inline-block', ...style }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 20}ms`,
            marginRight: i === text.length - 1 ? 0 : charGap,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-7px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const [word, setWord] = useState('AI-native')
  const [clock, setClock] = useState('')
  const [revealed, setRevealed] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const shaderRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ wi: 0, ci: 9, del: false })
  const { theme } = useTheme()

  useCursorShader(heroRef as RefObject<HTMLElement>, shaderRef)

  const isDark = theme === 'dark'
  const metaPillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.52)'
  const metaPillBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,26,26,0.08)'
  const metaText = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(26,26,26,0.82)'
  const metaDivider = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(26,26,26,0.16)'

  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const s = stateRef.current
      const currentWord = WORDS[s.wi]

      if (!s.del) {
        s.ci++
        setWord(currentWord.slice(0, s.ci))
        if (s.ci === currentWord.length) {
          s.del = true
          timer = setTimeout(tick, 1900)
          return
        }
      } else {
        s.ci--
        setWord(currentWord.slice(0, s.ci))
        if (s.ci === 0) {
          s.del = false
          s.wi = (s.wi + 1) % WORDS.length
        }
      }

      timer = setTimeout(tick, s.del ? 52 : 92)
    }

    timer = setTimeout(tick, 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      )
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let lenis: { stop: () => void; start: () => void; destroy: () => void; raf: (time: number) => void } | null = null

    const handleDrawerScrollLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked?: boolean }>).detail?.locked
      if (!lenis) return
      if (locked) lenis.stop()
      else lenis.start()
    }

    window.addEventListener('drawer-scroll-lock', handleDrawerScrollLock)

    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          duration: 2.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.55,
          touchMultiplier: 1.2,
          lerp: 0.07,
        })

        const raf = (time: number) => {
          lenis?.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      })
      .catch(() => {})

    return () => {
      window.removeEventListener('drawer-scroll-lock', handleDrawerScrollLock)
      lenis?.destroy()
    }
  }, [])

  const clipStyle = (delay: string): CSSProperties => ({
    clipPath: revealed ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
    transition: `clip-path 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}`,
    overflow: 'hidden',
  })

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 4rem 3.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <div
        ref={shaderRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 40% 80%, var(--bg) 30%, transparent 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={clipStyle('0.10s')}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-m)',
              fontSize: '0.59rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              border: '1px solid var(--accent-b)',
              padding: '0.27rem 0.7rem',
              borderRadius: '100px',
              marginBottom: '1.1rem',
              width: 'fit-content',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: 'pdot 2s ease-in-out infinite',
              }}
            />
            Open to AI PM roles · 2026
            <style>{`@keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.7)}}`}</style>
          </div>
        </div>

        <div style={clipStyle('0.18s')}>
          <div
            className="hero-meta-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              width: 'min(100%, 1240px)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-m)',
                fontSize: '0.67rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '2rem',
                  height: 1,
                  background: 'var(--fg-dimmer)',
                }}
              />
              AI Product Manager
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: '0.46rem 0.8rem',
                borderRadius: '999px',
                border: `1px solid ${metaPillBorder}`,
                background: metaPillBg,
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: metaText,
                }}
              >
                Goa, India
              </span>
              <span style={{ width: 1, height: 12, background: metaDivider }} />
              <span
                style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  opacity: 0.9,
                }}
              >
                {clock}
              </span>
              <span style={{ width: 1, height: 12, background: metaDivider }} />
              <span
                style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: metaText,
                }}
              >
                IST
              </span>
            </div>
          </div>
        </div>

        <div style={clipStyle('0.26s')}>
          <div style={{ marginBottom: '1.5rem', userSelect: 'none' }}>
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: '-0.035em',
                fontKerning: 'none',
                fontVariantLigatures: 'none',
                color: 'var(--fg)',
              }}
            >
              <BounceText text="SHUBH" charGap="0.02em" />
            </div>
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: '-0.035em',
                fontKerning: 'none',
                fontVariantLigatures: 'none',
                color: 'transparent',
                WebkitTextStroke: '2px var(--fg)',
                paddingLeft: 'clamp(1.4rem, 3vw, 3.6rem)',
              }}
            >
              <BounceText text="SANKALP" charGap="0.02em" />
            </div>
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 'clamp(3.4rem, 9vw, 8.5rem)',
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
                fontKerning: 'none',
                fontVariantLigatures: 'none',
                color: 'var(--fg)',
                paddingLeft: 'clamp(1.4rem, 6.8vw, 7.8rem)',
              }}
            >
              <BounceText text="DAS" charGap="0.000008em" />
            </div>
          </div>
        </div>

        <div style={clipStyle('0.36s')}>
          <div
            className="hero-cta-row"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '3rem',
              maxWidth: 960,
              flexWrap: 'wrap',
            }}
          >
            <div className="hero-cta-text" style={{ flex: 1, minWidth: 280 }}>
              <div
                style={{
                  fontFamily: 'var(--font-d)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
                  fontWeight: 600,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: 'var(--fg)',
                  marginBottom: '0.9rem',
                }}
              >
                I build{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                  <span
                    style={{
                      borderRight: '2px solid var(--accent)',
                      paddingRight: 2,
                      animation: 'blink 0.88s step-end infinite',
                    }}
                  >
                    {word}
                  </span>
                </em>
                <style>{`@keyframes blink{0%,100%{border-color:var(--accent)}50%{border-color:transparent}}`}</style>{' '}
                products that ship.
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--fg-dim)',
                  lineHeight: 1.75,
                  maxWidth: 380,
                }}
              >
                <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Currently</strong>{' '}
                building AI-native tools at the intersection of LLM infrastructure and consumer
                experience. Obsessed with what breaks in production, not what looks good in Figma.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flexShrink: 0, minWidth: 200 }}>
              <a
                href="https://drive.google.com/file/d/1BA4IKjQMZAQbHeRM5nver6vW0qQF7s7Y/view"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.69rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'var(--accent)',
                  padding: '0.78rem 1.4rem',
                  borderRadius: 'var(--r)',
                  transition: 'background 0.25s cubic-bezier(0.16,1,0.3,1)',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-dark)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--accent)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Resume
              </a>
              <a
                href="#experience"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.69rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-dim)',
                  border: '1px solid var(--border-2)',
                  padding: '0.78rem 1.4rem',
                  borderRadius: 'var(--r)',
                  width: '100%',
                }}
              >
                See my work ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          #hero {
            padding: 0 1.5rem 2.5rem !important;
          }
          .hero-meta-row {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          .hero-cta-row {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .hero-cta-text {
            min-width: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
