import { Avatar, Badge, Stack } from '@kryv/teal'

export function StackDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Stack gap={3} className="w-full max-w-sm">
        <span className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">Header</span>
        <span className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">Content</span>
        <span className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">Footer</span>
      </Stack>
    )
  }

  if (exampleIndex === 2) {
    return (
      <Stack direction="row" gap={2} wrap className="w-full max-w-xs">
        <Badge>Reports</Badge>
        <Badge>Security</Badge>
        <Badge>Billing</Badge>
        <Badge>Members</Badge>
        <Badge>Audit log</Badge>
        <Badge>Usage</Badge>
        <Badge>Integrations</Badge>
        <Badge>Backups</Badge>
      </Stack>
    )
  }

  return (
    <Stack direction="row" gap={4} align="center" wrap>
      <Avatar name="Avery Chen" />
      <Stack gap={0}>
        <strong className="text-sm">Avery Chen</strong>
        <span className="text-xs text-teal-on-surface-variant">Workspace owner</span>
      </Stack>
      <Badge variant="success">Active</Badge>
    </Stack>
  )
}
