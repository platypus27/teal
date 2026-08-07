import { useState } from 'react'
import { InfiniteScroll } from '@kryv/teal'

const allRows = Array.from({ length: 30 }, (_, index) => `Report ${index + 1}`)

export function InfiniteScrollDemo({ exampleIndex = 0 }) {
  const [count, setCount] = useState(8)
  const [loading, setLoading] = useState(false)

  function loadMore() {
    setLoading(true)
    setTimeout(() => {
      setCount((value) => Math.min(allRows.length, value + 6))
      setLoading(false)
    }, 600)
  }

  if (exampleIndex === 1) {
    return (
      <InfiniteScroll hasMore={false} endMessage="You have seen every report." className="w-72">
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200">
          {allRows.slice(0, 4).map((row) => (
            <li key={row} className="px-4 py-2 text-sm">
              {row}
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    )
  }

  return (
    <InfiniteScroll
      hasMore={count < allRows.length}
      loading={loading}
      onLoadMore={loadMore}
      endMessage="You have seen every report."
      tabIndex={0}
      className="h-56 w-72 overflow-y-auto"
    >
      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200">
        {allRows.slice(0, count).map((row) => (
          <li key={row} className="px-4 py-2 text-sm">
            {row}
          </li>
        ))}
      </ul>
    </InfiniteScroll>
  )
}
