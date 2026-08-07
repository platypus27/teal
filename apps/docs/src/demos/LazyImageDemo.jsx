import { LazyImage } from '@kryv/teal'

const chartSvg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#e0f2f1"/><rect x="40" y="100" width="40" height="60" fill="#0d9488"/><rect x="100" y="70" width="40" height="90" fill="#14b8a6"/><rect x="160" y="40" width="40" height="120" fill="#2dd4bf"/><rect x="220" y="20" width="40" height="140" fill="#5eead4"/></svg>',
  )

const mapSvg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#ecfeff"/><circle cx="160" cy="90" r="48" fill="#0891b2"/><circle cx="160" cy="90" r="20" fill="#cffafe"/></svg>',
  )

export function LazyImageDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <LazyImage
        src={mapSvg}
        alt="Stylized map of the coverage area"
        width={320}
        height={180}
        className="rounded-xl"
        placeholder={
          <span className="flex h-[180px] w-[320px] items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-600">
            Map loads when scrolled into view
          </span>
        }
      />
    )
  }

  return (
    <LazyImage
      src={chartSvg}
      alt="Bar chart of quarterly signups"
      width={320}
      height={180}
      className="rounded-xl"
    />
  )
}
