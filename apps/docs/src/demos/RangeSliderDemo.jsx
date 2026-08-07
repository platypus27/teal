import { RangeSlider } from '@kryv/teal'

export function RangeSliderDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <RangeSlider
          label="Year range"
          min={2000}
          max={2030}
          step={5}
          defaultValue={[2010, 2025]}
          thumbLabels={['From year', 'To year']}
          showValue
        />
        <RangeSlider label="Quiet hours" max={24} defaultValue={[22, 7]} description="Thumbs keep at least one step apart." />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <RangeSlider label="Price range" defaultValue={[20, 80]} showValue />
      <RangeSlider label="Team size" min={1} max={50} defaultValue={[5, 15]} />
    </div>
  )
}
