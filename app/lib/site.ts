// Site-wide constants and section data that is not part of the posts/projects content.

export const RESUME_URL = 'https://drive.google.com/file/d/1BA4IKjQMZAQbHeRM5nver6vW0qQF7s7Y/view'
export const EMAIL = 'dasshriyans2802@gmail.com'
export const GITHUB_USER = 'shubhdas0208'

export const SOCIALS = {
  linkedin: 'https://www.linkedin.com/in/shubhsankalpdas/',
  github: `https://github.com/${GITHUB_USER}`,
  x: 'https://x.com/shubh_das02',
}

export const NAV_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'writing', label: 'Blogs' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export const VOXIKIN_LINE = 'A voice AI elderly healthcare assistant.'

export interface LogEntry {
  when: string
  text: string
  link?: { label: string; href: string }
}

// "Log" tile in About. Newest first. Only published facts.
export const LOG: LogEntry[] = [
  { when: 'Now', text: 'Product Manager at Dezerv, on lending and voice AI agents.' },
  { when: "Mar '26", text: 'Shipped ToolMonkey and Filtr. Wrote', link: { label: 'P99 is a UX Metric', href: '/writing/p99-is-a-ux-metric' } },
  { when: "Dec '25", text: 'Wrapped the Dezerv internship. M1 retention 38% to 51%.' },
  { when: "Apr '25", text: 'Left 91Ventures. LP reporting down from 48 hours to 60 minutes.' },
]

export interface Bullet { lead: string; rest: string }
/** One proof figure: the number and what it measures. */
export interface Stat { value: string; label: string }
interface RoleBase { title: string; meta: string; bullets: Bullet[] }
/**
 * A role with its proof pulled out of the bullets: `hero` is the headline, `how` is the verbatim `rest`
 * of the hero bullet, `results` are the other figures. Every number comes from a bullet. A `pending`
 * role has no published figures yet and renders "Shubh to add" slots instead.
 */
export type Role = RoleBase & ({ pending: true } | { pending?: false; hero: Stat; how: string; results: Stat[] })

export interface Company {
  id: string
  name: string
  monogram: string
  city: string
  years: string
  metric: string
  metricCaption: string
  summary: string
  roles: Role[]
}

// Bullet copy is verbatim from the original Experience section.
export const EXPERIENCE: Company[] = [
  {
    id: 'dezerv', name: 'Dezerv', monogram: 'Dz', city: 'Bengaluru', years: "'25 to now", metric: '38→51%', metricCaption: 'M1 retention after shipping Portfolio Snapshot', summary: 'Product Manager · Product Intern',
    roles: [
      { title: 'Product Manager', meta: 'Full-time · Bengaluru', pending: true, bullets: [
        { lead: 'Lending products', rest: 'Loan against mutual funds and loan against securities.' },
        { lead: 'Voice AI agents', rest: 'For PMS client calls.' },
      ] },
      { title: 'Product Intern', meta: 'Jul 2025 to Dec 2025 · Internship · Bengaluru',
        hero: { value: '38→51%', label: 'M1 retention' },
        how: 'by conducting user research on weekly portfolio tracking needs and shipping the Portfolio Snapshot feature.',
        results: [
          { value: '94→2%', label: 'status misclassification' },
          { value: '18%', label: 'more conversions, same RM capacity' },
          { value: '+40%', label: 'session time, controlled cohort' },
        ],
        bullets: [
          { lead: 'M1 retention lifted from 38% to 51%', rest: ' by conducting user research on weekly portfolio tracking needs and shipping the Portfolio Snapshot feature.' },
          { lead: 'Status misclassification reduced from 94% to 2%', rest: ' by engineering a client call status identifier that analysed transcripts using classification rules.' },
          { lead: '18% more conversions with the same RM capacity', rest: ' by developing an affluent user model using salary, spend, and investment patterns.' },
          { lead: 'Session time increased 40% in a controlled cohort', rest: ' by discovering the need for actionable insights and integrating Thurro AI into the stocks page.' },
        ] },
    ],
  },
  {
    id: '91ventures', name: '91Ventures', monogram: '91', city: 'Remote', years: "'24 to '25", metric: '97.9%', metricCaption: 'less effort on quarterly LP reporting', summary: 'Investment Analyst Intern',
    roles: [{ title: 'Investment Analyst Intern', meta: 'Apr 2024 to Apr 2025 · Internship · Remote',
      hero: { value: '97.9%', label: 'less effort on quarterly LP reporting' },
      how: '(48 hours to 60 minutes) by programming Excel automation for the reporting workflow.',
      results: [
        { value: '83%', label: 'portfolio review time cut' },
        { value: '50%', label: 'deal closure time cut' },
      ],
      bullets: [
        { lead: 'Portfolio review time reduced by 83%', rest: ' (30 to 5 minutes) by consolidating MIS reports into curated summaries for 200+ LPs.' },
        { lead: 'Quarterly LP reporting effort cut by 97.9%', rest: ' (48 hours to 60 minutes) by programming Excel automation for the reporting workflow.' },
        { lead: 'Deal closure time cut by 50%', rest: ' (60 days to 30 days) by establishing standardised deal documentation and communication workflows.' },
      ] }],
  },
  {
    id: 'multigraphics', name: 'Multigraphics', monogram: 'Mg', city: 'Delhi', years: "'24", metric: '3x', metricCaption: 'dealership inquiries in 30 days', summary: 'Business Analyst Intern',
    roles: [{ title: 'Business Analyst Intern', meta: 'May 2024 to Jul 2024 · Internship · Delhi',
      hero: { value: '3x', label: 'dealership inquiries in 30 days' },
      how: '(33 to 95) by identifying user drop-off due to lack of product context and redesigning the inquiry flow.',
      results: [
        { value: '1.8%', label: 'conversion rate, from under 1%' },
        { value: '92→27%', label: 'bounce rate in 45 days' },
      ],
      bullets: [
        { lead: 'Dealership inquiries increased 3x in 30 days', rest: ' (33 to 95) by identifying user drop-off due to lack of product context and redesigning the inquiry flow.' },
        { lead: 'Conversion rate increased from under 1% to 1.8% in 60 days', rest: ' by analysing data identifying delivery drivers as the highest-intent cohort and restructuring outreach.' },
        { lead: 'Bounce rate reduced from 92% to 27% within 45 days', rest: ' by restructuring homepage CTAs with product categories and test drive options.' },
      ] }],
  },
  {
    id: 'product-space', name: 'Product Space', monogram: 'PS', city: 'Remote', years: "'24", metric: '+15%', metricCaption: 'signups within 2 weeks', summary: 'Product Intern',
    roles: [{ title: 'Product Intern', meta: 'Mar 2024 to Apr 2024 · Internship · Remote',
      hero: { value: '+15%', label: 'signups within 2 weeks' },
      how: 'by restructuring the website with testimonials and sample decks to address the trust barrier, validated via A/B testing.',
      results: [
        { value: '22%', label: 'higher conversion than other sources' },
        { value: '25 to 30%', label: 'lower cost per signup' },
      ],
      bullets: [
        { lead: '+15% signups within 2 weeks', rest: ' by restructuring the website with testimonials and sample decks to address the trust barrier, validated via A/B testing.' },
        { lead: '22% higher conversion rate than other traffic sources', rest: ' achieved by releasing a monthly Product Newsletter to drive cohort awareness.' },
        { lead: 'Lead attribution time cut by 1 week, cost per signup reduced 25 to 30%', rest: ' by implementing a UTM-linked conversion dashboard tracking 9 sources.' },
      ] }],
  },
]
