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

    const body = document.body
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth

    // Save current scroll position and lock body with position:fixed
    // This is the only reliable way to prevent background scroll on iOS Safari
    const scrollY = window.scrollY
    const prevPosition = body.style.position
    const prevTop = body.style.top
    const prevWidth = body.style.width
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`

    window.dispatchEvent(new CustomEvent('drawer-scroll-lock', { detail: { locked: true } }))
    scrollEl.focus({ preventScroll: true })

    // --- Wheel (desktop): intercept and apply to drawer with momentum ---
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

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      document.removeEventListener('wheel', handleWheel, true)
      document.removeEventListener('keydown', handleKeyDown, true)

      // Restore body and scroll position
      body.style.position = prevPosition
      body.style.top = prevTop
      body.style.width = prevWidth
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      window.scrollTo(0, scrollY)

      window.dispatchEvent(new CustomEvent('drawer-scroll-lock', { detail: { locked: false } }))
    }
  }, [isOpen, scrollRef])
}
