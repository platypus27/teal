import { FunnelChart } from '@kryv/teal'

const signupStages = [
  { name: 'Visited', value: 10000 },
  { name: 'Signed up', value: 3200 },
  { name: 'Activated', value: 1400 },
  { name: 'Paid', value: 480 },
]

const hiringStages = [
  { name: 'Applied', value: 240 },
  { name: 'Screened', value: 80 },
  { name: 'Interviewed', value: 24 },
  { name: 'Offer', value: 6 },
  { name: 'Hired', value: 4 },
]

export function FunnelChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <FunnelChart
          aria-label="Hiring pipeline funnel"
          stages={hiringStages}
          width={360}
          height={300}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <FunnelChart aria-label="Signup conversion funnel" stages={signupStages} />
    </div>
  )
}
