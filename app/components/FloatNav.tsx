'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_SECTIONS } from '../lib/site'

export default function FloatNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const navRef = useRef<HTMLElement>(null)
  const indRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [active, setActive] = useState<number>(-1)
  const [hidden, setHidden] = useState(false)

  const moveIndicator = useCallback((i: number) => {
    const nav = navRef.current, ind = indRef.current, link = linkRefs.current[i]
    if (!nav || !ind) return
    if (i < 0 || !link) { ind.style.opacity = '0'; return }
    const nr = nav.getBoundingClientRect(), r = link.getBoundingClientRect()
    ind.style.opacity = '1'
    ind.style.width = `${r.width}px`
    ind.style.transform = `translateX(${r.left - nr.left}px)`
  }, [])

  useEffect(() => { moveIndicator(active) }, [active, moveIndicator])

  useEffect(() => {
    if (!isHome) { setActive(-1); return }
    let lastY = window.scrollY
    const spy = () => {
      let current = -1
      NAV_SECTIONS.forEach(({ id }, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) current = i
      })
      setActive(current)
      const y = window.scrollY
      const small = window.innerWidth < 640
      const nearBottom = y > document.body.scrollHeight - window.innerHeight - 80
      if (small && y > lastY + 6 && y > 120 && !nearBottom) setHidden(true)
      else if (y < lastY - 6 || !small) setHidden(false)
      lastY = y
    }
    spy()
    const onResize = () => { spy(); moveIndicator(active) }
    window.addEventListener('scroll', spy, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', spy); window.removeEventListener('resize', onResize) }
  }, [isHome, moveIndicator, active])

  const onNavigate = (id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isHome || reduced) return
    const heading = document.querySelector(`#${id} .h2`)
    if (!heading) return
    heading.classList.remove('landed')
    window.setTimeout(() => heading.classList.add('landed'), 450)
  }

  return (
    <nav ref={navRef} className={`fnav${hidden ? ' hidden' : ''}`} aria-label="Sections">
      <span ref={indRef} className="ind" aria-hidden="true" />
      {NAV_SECTIONS.map(({ id, label }, i) => (
        <Link
          key={id}
          href={`/#${id}`}
          ref={el => { linkRefs.current[i] = el }}
          className={active === i ? 'on' : undefined}
          onClick={() => onNavigate(id)}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
