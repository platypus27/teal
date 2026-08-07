import { useState } from 'react'
import { Button, ColorPicker } from '@kryv/teal'

export function ColorPickerDemo({ exampleIndex = 0 }) {
  const [color, setColor] = useState('#006a6c')

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <ColorPicker label="Brand color" value={color} onChange={setColor} />
        <span
          className="inline-flex size-10 items-center justify-center rounded-lg border border-teal-outline-variant text-xs font-semibold"
          style={{ backgroundColor: color, color: '#ffffff' }}
        >
          {color}
        </span>
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="flex items-center gap-3">
        <ColorPicker label="Theme color" value={color} onChange={setColor} />
        <Button size="sm" style={{ backgroundColor: color, borderColor: color }}>
          Themed action
        </Button>
      </div>
    )
  }

  return <ColorPicker label="Accent color" defaultValue="#065a60" onChange={() => undefined} />
}
