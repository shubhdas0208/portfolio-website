import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = 'shubhdas0208'

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
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
    next: { revalidate: 86400 },
  })

  const data = await response.json()
  const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []

  const allDays = weeks.flatMap((w: any) => w.contributionDays)
  const last14 = allDays.slice(-30)

  return NextResponse.json({ days: last14 })
}
