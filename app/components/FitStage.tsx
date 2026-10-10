'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface Props { w: number; h: number; children: ReactNode }

/** A fixed-size illustration that scales down to fit its column, so every layout inside it stays pixel-exact. */
export default function FitStage({ w, h, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const s = Math.min(1, el.clientWidth / w)
      el.style.setProperty('--s', String(s))
      el.style.height = `${h * s}px`
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h])
  return (
    <div ref={ref} className="fit" style={{ ['--w' as string]: `${w}px`, height: h }}>
      <div className="stage" style={{ width: w, height: h }}>{children}</div>
    </div>
  )
}
