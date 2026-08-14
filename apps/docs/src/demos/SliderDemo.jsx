import { useState } from 'react'
import { Slider } from '@kryv/teal'

export function SliderDemo({ exampleIndex = 0 }) {
  const [quota, setQuota] = useState(40)

  if (exampleIndex === 3) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <Slider
          label="Font size"
          description="Applies to editor text"
          min={12}
          max={24}
          step={1}
          defaultValue={16}
          showValue
        />
        <Slider label="Speaker volume" min={0} max={10} step={0.5} defaultValue={4} showValue />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <Slider label="Price range" range defaultValue={[20, 80]} showValue />
        <Slider
          label="Year range"
          range
          min={2000}
          max={2030}
          step={5}
          defaultValue={[2010, 2025]}
          thumbLabels={['From year', 'To year']}
          showValue
        />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <Slider label="Storage quota" description="Applies to the whole workspace" defaultValue={65} showValue />
        <Slider label="Archived projects" defaultValue={20} disabled />
      </div>
    )
  }
  return (
    <Slider
      label="Storage quota"
      description="Drag or use the arrow keys to adjust the workspace limit"
      value={quota}
      onValueChange={(value) => {
        if (typeof value === 'number') setQuota(value)
      }}
      showValue
      className="w-full max-w-md"
    />
  )
}
