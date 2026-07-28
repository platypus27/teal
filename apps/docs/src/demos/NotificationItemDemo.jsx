import { NotificationItem } from '@kryv/teal'

export function NotificationItemDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <NotificationItem
      severity="success"
      appLabel="Photos"
      timestamp="just now"
      title="Import finished"
      href="https://photos.kryvlabs.example/imports/1"
      read
    />
  ) : (
    <NotificationItem
      severity="warning"
      appLabel="Yang Operations"
      timestamp="2 hours ago"
      title="photos-api restarted unexpectedly"
      href="https://yang.kryvlabs.example/incidents/photos-api"
      onMute={() => undefined}
      onArchive={() => undefined}
    />
  )
}
