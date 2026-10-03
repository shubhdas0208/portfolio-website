'use client'

import { useEffect, useState } from 'react'
import type { ContributionData } from './GitHubGraph'

export type ContributionsState =
  | { status: 'loading' }
  | { status: 'ready'; data: ContributionData }
  | { status: 'failed' }

// One request per page load, shared by every caller. A failed request is cleared so a later mount can retry.
let request: Promise<ContributionData> | null = null

function isContributionData(v: unknown): v is ContributionData {
  const d = v as ContributionData | null
  return !!d && typeof d.total === 'number' && Array.isArray(d.weeks)
}

export function loadContributions(): Promise<ContributionData> {
  request ??= fetch('/api/github')
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`GitHub contributions ${r.status}`))))
    .then((d: unknown) => {
      if (!isContributionData(d)) throw new Error('GitHub contributions: unexpected shape')
      return d
    })
    .catch((err: unknown) => {
      request = null
      throw err
    })
  return request
}

/** The /api/github calendar (same source as the About graph), fetched once and shared. */
export function useContributions(): ContributionsState {
  const [state, setState] = useState<ContributionsState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    loadContributions()
      .then(data => { if (!cancelled) setState({ status: 'ready', data }) })
      .catch(() => { if (!cancelled) setState({ status: 'failed' }) })
    return () => { cancelled = true }
  }, [])
  return state
}
