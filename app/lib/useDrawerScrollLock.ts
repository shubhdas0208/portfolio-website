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

    let lastTouchY: number | null = null

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * scrollEl.clientHeight
            : event.deltaY

      scrollEl.scrollBy({ top: delta, behavior: 'auto' })
    }

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY
      if (currentTouchY == null) return

      if (lastTouchY == null) {
        lastTouchY = currentTouchY
        return
      }

      event.preventDefault()
      event.stopPropagation()
      scrollEl.scrollBy({ top: lastTouchY - currentTouchY, behavior: 'auto' })
      lastTouchY = currentTouchY
    }

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
      scrollEl.scrollTo({ top: nextScrollTop, behavior: 'auto' })
    }

    const resetTouch = () => {
      lastTouchY = null
    }

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('touchend', resetTouch)
    document.addEventListener('touchcancel', resetTouch)

    return () => {
      document.removeEventListener('wheel', handleWheel, true)
      document.removeEventListener('touchstart', handleTouchStart, true)
      document.removeEventListener('touchmove', handleTouchMove, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('touchend', resetTouch)
      document.removeEventListener('touchcancel', resetTouch)

      html.style.overflow = prevHtmlOverflow
      html.style.overscrollBehavior = prevHtmlOverscroll
      body.style.overflow = prevBodyOverflow
      body.style.overscrollBehavior = prevBodyOverscroll
      body.style.paddingRight = prevBodyPaddingRight
      window.dispatchEvent(new CustomEvent('drawer-scroll-lock', { detail: { locked: false } }))
    }
  }, [isOpen, scrollRef])
}
