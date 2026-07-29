import { Meter } from '@kryv/teal'

export function MeterDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-sm gap-5">
        <Meter label="Storage used" value={68} max={120} formatValue={(v) => `${Math.round(v)} GB of 120 GB`} />
        <Meter label="Bandwidth" value={0.82} max={1} formatValue={(v) => `${Math.round(v * 100)}%`} />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-sm gap-5">
      <Meter label="Storage used" value={42} low={60} high={85} optimum={20} />
      <Meter label="Memory pressure" value={72} low={60} high={85} optimum={20} />
      <Meter label="CPU load" value={93} low={60} high={85} optimum={20} />
    </div>
  )
}
