import { NetworkStatus } from '@kryv/teal'

export function NetworkStatusDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <NetworkStatus>
        {(online) => (
          <span className={`text-sm font-semibold ${online ? 'text-emerald-600' : 'text-red-600'}`}>
            {online ? 'Connected — all systems go' : 'Connection lost'}
          </span>
        )}
      </NetworkStatus>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <NetworkStatus />
      <NetworkStatus onlineLabel="Connected" offlineLabel="No connection" />
    </div>
  )
}
