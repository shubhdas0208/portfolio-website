import { NextResponse } from 'next/server'
import { GITHUB_USER } from '../../lib/site'

export const revalidate = 3600

interface Day { date: string; count: number; level: number }

const LEVELS: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }

/** Full last-year calendar via the GraphQL API (needs GITHUB_TOKEN). */
async function fromGraphQL(token: string) {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: GITHUB_USER } }),
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`)
  const json = await res.json()
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar
  if (!cal) throw new Error('GitHub GraphQL: no calendar')
  const weeks: Day[][] = cal.weeks.map((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
    w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })))
  return { total: cal.totalContributions as number, weeks }
}

/** Fallback without a token: the public contributions page. */
async function fromPublicPage() {
  const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`GitHub page ${res.status}`)
  const html = await res.text()
  const days: Day[] = []
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)) days.push({ date: m[1], count: 0, level: Number(m[2]) })
  days.sort((a, b) => a.date.localeCompare(b.date))
  const weeks: Day[][] = []
  for (const day of days) {
    const dow = new Date(day.date + 'T00:00:00Z').getUTCDay()
    if (dow === 0 || weeks.length === 0) weeks.push([])
    weeks[weeks.length - 1].push(day)
  }
  const total = Number((html.match(/([\d,]+)\s+contributions?\s+in the last year/) || [])[1]?.replace(/,/g, '') || 0)
  return { total, weeks }
}

const GH_HEADERS = (token: string) => ({ Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' })
const MAX_SEARCH_PAGES = 5 // 100 commits per page; a month with more than 500 commits is clipped
const DAY_MS = 86_400_000

type DayCounts = Map<string, number>

const bump = (m: DayCounts, date: string, n: number) => m.set(date, (m.get(date) ?? 0) + n)

/** Commits authored by the user in ANY public repo (own, someone else's, forks), per day, over the window. */
async function commitsFromSearch(token: string, from: Date, to: Date): Promise<DayCounts> {
  const out: DayCounts = new Map()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  // Monthly windows keep each query under the 1000-result search cap.
  const windows: [Date, Date][] = []
  for (let s = from.getTime(); s < to.getTime(); s += 31 * DAY_MS) windows.push([new Date(s), new Date(Math.min(s + 30 * DAY_MS, to.getTime()))])
  for (const [a, b] of windows) {
    for (let page = 1; page <= MAX_SEARCH_PAGES; page++) {
      const q = encodeURIComponent(`author:${GITHUB_USER} author-date:${iso(a)}..${iso(b)}`)
      const res = await fetch(`https://api.github.com/search/commits?q=${q}&per_page=100&page=${page}`, { headers: GH_HEADERS(token), next: { revalidate: 3600 } })
      if (!res.ok) throw new Error(`GitHub commit search ${res.status}`)
      const json = await res.json() as { items?: { commit: { author: { date: string } } }[] }
      const items = json.items ?? []
      for (const it of items) bump(out, it.commit.author.date.slice(0, 10), 1)
      if (items.length < 100) break
    }
  }
  return out
}

const MAX_REPOS = 40
const MAX_BRANCHES = 30
const MAX_COMMIT_PAGES = 3

async function ghJson<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: GH_HEADERS(token), next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`GitHub ${path.split('?')[0]} ${res.status}`)
  return res.json() as Promise<T>
}

/**
 * Commits by the user on EVERY branch of every repo the token can read, including private org repos
 * (GitHub's own calendar only counts default branches). Read-only: list repos, branches, commits.
 * A commit that sits on several branches is counted once (deduped by sha).
 */
async function commitsFromBranches(token: string, from: Date): Promise<DayCounts> {
  const out: DayCounts = new Map()
  const seen = new Set<string>()
  const since = from.toISOString()
  const repos = (await ghJson<{ full_name: string; pushed_at: string | null }[]>(token, '/user/repos?per_page=100&sort=pushed'))
    .filter(r => r.pushed_at && r.pushed_at >= since)
    .slice(0, MAX_REPOS)
  for (const repo of repos) {
    const branches = await ghJson<{ name: string }[]>(token, `/repos/${repo.full_name}/branches?per_page=${MAX_BRANCHES}`).catch(() => [])
    for (const { name } of branches) {
      for (let page = 1; page <= MAX_COMMIT_PAGES; page++) {
        const q = `sha=${encodeURIComponent(name)}&author=${GITHUB_USER}&since=${since}&per_page=100&page=${page}`
        const commits = await ghJson<{ sha: string; commit: { author: { date: string } } }[]>(token, `/repos/${repo.full_name}/commits?${q}`).catch(() => [])
        for (const c of commits) {
          if (seen.has(c.sha)) continue
          seen.add(c.sha)
          bump(out, c.commit.author.date.slice(0, 10), 1)
        }
        if (commits.length < 100) break
      }
    }
  }
  return out
}

/** Quartile levels (0-4) from the busiest day, same shape as GitHub's own shading. */
function levelFor(count: number, max: number): number {
  if (count <= 0) return 0
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)))
}

/**
 * Official calendar plus every commit GitHub can attribute to the account elsewhere. For each day the
 * higher of the three sources wins, so the same commit is never double counted.
 */
function overlay(base: { total: number; weeks: Day[][] }, extras: DayCounts[]) {
  const best = (date: string, own: number) => Math.max(own, ...extras.map(m => m.get(date) ?? 0))
  const weeks = base.weeks.map(w => w.map(d => ({ ...d, count: best(d.date, d.count) })))
  const max = Math.max(1, ...weeks.flat().map(d => d.count))
  const leveled = weeks.map(w => w.map(d => ({ ...d, level: Math.max(d.level, levelFor(d.count, max)) })))
  const total = leveled.flat().reduce((n, d) => n + d.count, 0)
  return { total: Math.max(total, base.total), weeks: leveled }
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) return NextResponse.json(await fromPublicPage())
    const base = await fromGraphQL(token).catch(fromPublicPage)
    const to = new Date()
    const from = new Date(to.getTime() - 365 * DAY_MS)
    // The extras are best effort: a rate limit or outage still returns the official calendar.
    const extras = (await Promise.allSettled([commitsFromSearch(token, from, to), commitsFromBranches(token, from)]))
      .flatMap(r => {
        if (r.status === 'fulfilled') return [r.value]
        console.error('github extra commits', r.reason)
        return []
      })
    return NextResponse.json(overlay(base, extras))
  } catch (err) {
    console.error('github contributions', err)
    return NextResponse.json({ error: 'Could not load contributions' }, { status: 502 })
  }
}
