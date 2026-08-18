import { NotificationItem } from '@kryv/teal'

export function NotificationItemDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <NotificationItem
      severity="success"
      appLabel="Photos"
      timestamp="just now"
      title="Import finished"
      href="#"
      read
    />
  ) : (
    <NotificationItem
      severity="warning"
      appLabel="Yang Operations"
      timestamp="2 hours ago"
      title="photos-api restarted unexpectedly"
      href="#"
      onMute={() => undefined}
      onArchive={() => undefined}
    />
  )
}
