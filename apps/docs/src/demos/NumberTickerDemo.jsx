import { useState } from 'react'
import { NumberTicker } from '@kryv/teal'

const currency = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function NumberTickerDemo({ exampleIndex = 0 }) {
  const [signups, setSignups] = useState(1284)

  if (exampleIndex === 1) {
    return (
      <div className="grid justify-items-start gap-3">
        <NumberTicker
          value={48210}
          duration={1600}
          formatter={(value) => currency.format(value)}
          className="text-2xl font-semibold"
        />
        <span className="text-sm text-gray-500">Projected annual recurring revenue</span>
      </div>
    )
  }

  return (
    <div className="grid justify-items-start gap-3">
      <NumberTicker value={signups} className="text-3xl font-semibold" />
      <button
        type="button"
        onClick={() => setSignups((value) => value + Math.floor(Math.random() * 400) + 50)}
        className="rounded-full bg-teal-700 px-4 py-1.5 text-sm font-medium text-white"
      >
        Simulate new signups
      </button>
    </div>
  )
}
