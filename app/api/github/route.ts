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

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN
    const data = token ? await fromGraphQL(token).catch(fromPublicPage) : await fromPublicPage()
    return NextResponse.json(data)
  } catch (err) {
    console.error('github contributions', err)
    return NextResponse.json({ error: 'Could not load contributions' }, { status: 502 })
  }
}
