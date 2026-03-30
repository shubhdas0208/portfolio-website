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

    // Lock background: position:fixed preserves scroll position
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

    // --- Shared momentum engine ---
    let velocity = 0
    let raf = 0

    const applyMomentum = () => {
      if (Math.abs(velocity) < 0.5) {
        velocity = 0
        raf = 0
        return
      }
      scrollEl.scrollTop += velocity
      velocity *= 0.95
      raf = requestAnimationFrame(applyMomentum)
    }

    const addVelocity = (delta: number) => {
      velocity += delta
      if (!raf) {
        raf = requestAnimationFrame(applyMomentum)
      }
    }

    // --- Wheel (desktop) ---
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * scrollEl.clientHeight
            : event.deltaY

      addVelocity(delta * 0.4)
    }

    // --- Touch (mobile) ---
    let lastTouchY: number | null = null
    let lastTouchTime = 0
    let touchVelocity = 0

    const handleTouchStart = (event: TouchEvent) => {
      // Stop any ongoing momentum
      velocity = 0

      const touch = event.touches[0]
      if (!touch) return
      lastTouchY = touch.clientY
      lastTouchTime = Date.now()
      touchVelocity = 0
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch || lastTouchY === null) return

      // Always prevent default to stop background scroll
      event.preventDefault()

      const currentY = touch.clientY
      const deltaY = lastTouchY - currentY
      const now = Date.now()
      const dt = Math.max(now - lastTouchTime, 1)

      // Track velocity for momentum on release
      touchVelocity = deltaY / dt * 16 // normalize to ~60fps frame

      // Apply scroll directly for responsive feel
      scrollEl.scrollTop += deltaY

      lastTouchY = currentY
      lastTouchTime = now
    }

    const handleTouchEnd = () => {
      lastTouchY = null

      // Apply momentum from touch velocity
      if (Math.abs(touchVelocity) > 1) {
        addVelocity(touchVelocity * 0.6)
      }
      touchVelocity = 0
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
    document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      document.removeEventListener('wheel', handleWheel, true)
      document.removeEventListener('touchstart', handleTouchStart, true)
      document.removeEventListener('touchmove', handleTouchMove, true)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
      document.removeEventListener('keydown', handleKeyDown, true)

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
