'use client'

import { useBandPause, useSectionArrival } from '../lib/hooks'

/** Home-page wiring: section arrival for headers + FloatNav, and pausing off-screen band loops. */
export default function PageMotion() {
  useSectionArrival()
  useBandPause()
  return null
}
