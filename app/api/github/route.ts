import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = 'shubhdas0208'

  const now = new Date()
  const to = now.toISOString()
  const from = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  })

  const data = await response.json()
  const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []

  const allDays = weeks.flatMap((w: any) => w.contributionDays)
  const last14 = allDays.slice(-60)

  return NextResponse.json({ days: last14 })
}
