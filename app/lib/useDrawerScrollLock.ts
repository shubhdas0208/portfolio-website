'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useDrawerScrollLock(
  isOpen: boolean,
  scrollRef: RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!isOpen) return

    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevHtmlOverscroll = html.style.overscrollBehavior
    const prevBodyOverflow = body.style.overflow
    const prevBodyOverscroll = body.style.overscrollBehavior
    const prevBodyPaddingRight = body.style.paddingRight
    const scrollbarGap = window.innerWidth - html.clientWidth

    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`
    window.dispatchEvent(new CustomEvent('drawer-scroll-lock', { detail: { locked: true } }))

    scrollEl.focus({ preventScroll: true })

    // --- Wheel (desktop): intercept and apply to drawer with smooth interpolation ---
    let scrollVelocity = 0
    let scrollRaf = 0

    const applyMomentum = () => {
      if (Math.abs(scrollVelocity) < 0.5) {
        scrollVelocity = 0
        scrollRaf = 0
        return
      }
      scrollEl.scrollTop += scrollVelocity
      scrollVelocity *= 0.92
      scrollRaf = requestAnimationFrame(applyMomentum)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * scrollEl.clientHeight
            : event.deltaY

      scrollVelocity += delta * 0.4

      if (!scrollRaf) {
        scrollRaf = requestAnimationFrame(applyMomentum)
      }
    }

    // --- Keyboard ---
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName
      const isTypingTarget =
        target?.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT'

      if (isTypingTarget) return

      const viewportJump = Math.max(scrollEl.clientHeight - 120, 160)
      let nextScrollTop: number | null = null

      switch (event.key) {
        case 'ArrowDown':
          nextScrollTop = scrollEl.scrollTop + 72
          break
        case 'ArrowUp':
          nextScrollTop = scrollEl.scrollTop - 72
          break
        case 'PageDown':
        case ' ':
          nextScrollTop = scrollEl.scrollTop + viewportJump
          break
        case 'PageUp':
          nextScrollTop = scrollEl.scrollTop - viewportJump
          break
        case 'Home':
          nextScrollTop = 0
          break
        case 'End':
          nextScrollTop = scrollEl.scrollHeight
          break
        default:
          return
      }

      event.preventDefault()
      event.stopPropagation()
      scrollEl.scrollTo({ top: nextScrollTop, behavior: 'smooth' })
    }

    // No touchmove listener — mobile scroll is handled purely by CSS:
    // body overflow:hidden blocks background, overscroll-behavior:contain
    // on .detail-drawer-scroll traps scroll inside the drawer, and the
    // browser handles native momentum scrolling.

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      document.removeEventListener('wheel', handleWheel, true)
      document.removeEventListener('keydown', handleKeyDown, true)

      html.style.overflow = prevHtmlOverflow
      html.style.overscrollBehavior = prevHtmlOverscroll
      body.style.overflow = prevBodyOverflow
      body.style.overscrollBehavior = prevBodyOverscroll
      body.style.paddingRight = prevBodyPaddingRight
      window.dispatchEvent(new CustomEvent('drawer-scroll-lock', { detail: { locked: false } }))
    }
  }, [isOpen, scrollRef])
}
