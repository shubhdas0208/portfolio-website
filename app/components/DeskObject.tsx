'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'

const DRAG_THRESHOLD_PX = 6

interface Props {
  href: string
  label: string
  className: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * A desk object: a link you can also pick up and slide around the desk.
 * A short press opens it; once it has moved past the threshold, the click is swallowed.
 */
export default function DeskObject({ href, label, className, style, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const drag = useRef<{ x: number; y: number; dx: number; dy: number; moved: boolean } | null>(null)
  const offset = useRef({ dx: 0, dy: 0 })

  const onPointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, dx: offset.current.dx, dy: offset.current.dy, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const d = drag.current, el = ref.current
    if (!d || !el) return
    const scale = Number(getComputedStyle(el.closest('.desk') as HTMLElement).getPropertyValue('--s')) || 1
    const mx = (e.clientX - d.x) / scale, my = (e.clientY - d.y) / scale
    if (!d.moved && Math.hypot(mx, my) < DRAG_THRESHOLD_PX) return
    d.moved = true
    offset.current = { dx: d.dx + mx, dy: d.dy + my }
    el.style.setProperty('--dx', `${offset.current.dx}px`)
    el.style.setProperty('--dy', `${offset.current.dy}px`)
    el.classList.add('held')
  }

  const onPointerUp = () => {
    ref.current?.classList.remove('held')
    // keep `moved` until the click event fires, then reset
    window.setTimeout(() => { drag.current = null }, 0)
  }

  const isAnchor = href.startsWith('#')
  const common = {
    ref,
    className: `ob ${className}`,
    style,
    'aria-label': label,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onClick: (e: React.MouseEvent) => { if (drag.current?.moved) e.preventDefault() },
    draggable: false,
  }

  return isAnchor
    ? <a href={href} {...common}>{children}<span className="dlab" aria-hidden="true">{label} →</span></a>
    : <Link href={href} {...common}>{children}<span className="dlab" aria-hidden="true">{label} →</span></Link>
}
