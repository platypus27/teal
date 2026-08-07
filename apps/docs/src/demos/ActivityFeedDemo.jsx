import { ActivityFeed } from '@kryv/teal'
import { GitMerge, Rocket } from 'lucide-react'

const now = Date.now()

const items = [
  { id: '1', actor: 'Ada Lovelace', action: 'merged the parser rewrite into main', timestamp: new Date(now - 12 * 60_000) },
  { id: '2', actor: 'Alan Turing', action: 'approved the cipher spec', timestamp: new Date(now - 47 * 60_000) },
  { id: '3', actor: 'Grace Hopper', action: 'closed 4 triage tickets', timestamp: new Date(now - 26 * 3_600_000) },
]

export function ActivityFeedDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ActivityFeed
        label="Release activity"
        groupByDay
        items={[
          { id: 'a', actor: 'Deploy bot', action: 'shipped v2.4.0 to production', timestamp: new Date(now - 30 * 60_000), icon: <Rocket aria-hidden="true" className="size-8 rounded-full bg-emerald-100 p-1.5 text-emerald-700" /> },
          { id: 'b', actor: 'Ada Lovelace', action: 'merged the parser rewrite', timestamp: new Date(now - 2 * 3_600_000), icon: <GitMerge aria-hidden="true" className="size-8 rounded-full bg-violet-100 p-1.5 text-violet-700" /> },
          { id: 'c', actor: 'Grace Hopper', action: 'tagged the v2.4.0 release', timestamp: new Date(now - 26 * 3_600_000) },
        ]}
        className="w-full max-w-md"
      />
    )
  }

  return <ActivityFeed label="Project activity" items={items} className="w-full max-w-md" />
}
