'use client'

import { useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type VTDoc = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown }

const MAX_WAIT_MS = 1500
const VT_CLASS_MS = 500
let resolvePending: (() => void) | null = null

/**
 * A next/link that, where supported, wraps the route change in a View Transition so the
 * project media morphs into the case-study cover. Falls back to a plain link everywhere else.
 */
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & { href: string; children: ReactNode }

export default function ViewTransitionLink({ href, children, ...rest }: Props) {
  const router = useRouter()

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doc = document as VTDoc
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    document.documentElement.classList.add('vt-nav')
    doc.startViewTransition(() => new Promise<void>(resolve => {
      const finish = () => {
        if (resolvePending === finish) resolvePending = null
        resolve()
        window.setTimeout(() => document.documentElement.classList.remove('vt-nav'), VT_CLASS_MS)
      }
      resolvePending = finish
      // Same-path links never change the pathname, so the timer is the backstop that always settles it.
      window.setTimeout(finish, MAX_WAIT_MS)
      router.push(href)
    }))
  }

  return <Link {...rest} href={href} onClick={onClick}>{children}</Link>
}

/**
 * Mounted once in the root layout: finishes a pending transition once the new route has committed.
 * It resolves straight from the effect: rendering (and so requestAnimationFrame) is paused while a
 * view transition waits for its DOM update, so waiting a frame here would stall until the browser aborts.
 */
export function ViewTransitionResolver() {
  const pathname = usePathname()
  useEffect(() => { resolvePending?.() }, [pathname])
  return null
}
