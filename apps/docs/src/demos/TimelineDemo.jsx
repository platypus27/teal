import { Timeline } from '@kryv/teal'

export function TimelineDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-sm">
        <Timeline
          items={[
            { id: 'queued', title: 'Deploy queued', description: 'Release 2.4.0 · web-app', timestamp: '09:41', tone: 'neutral' },
            { id: 'building', title: 'Build completed', description: '412 modules in 3m 12s', timestamp: '09:46', tone: 'primary' },
            { id: 'live', title: 'Release is live', description: 'Health checks passing', timestamp: '09:52', tone: 'success' },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Timeline
        items={[
          { id: 'commit', title: 'Jonas pushed 3 commits', description: 'feat: billing usage export', timestamp: '08:15', tone: 'neutral' },
          { id: 'review', title: 'Review approved', description: 'Priya approved #482', timestamp: '08:47', tone: 'primary' },
          { id: 'deploy', title: 'Deployed to production', description: 'Release 2.4.0 is live', timestamp: '09:52', tone: 'success' },
          { id: 'alert', title: 'Error budget warning', description: 'checkout-api above 2% errors', timestamp: '10:03', tone: 'warning' },
          { id: 'rollback', title: 'Rollback triggered', description: 'Reverted to 2.3.9', timestamp: '10:11', tone: 'danger' },
        ]}
      />
    </div>
  )
}
