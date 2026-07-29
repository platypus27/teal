import { Button, Popconfirm } from '@kryv/teal'

export function PopconfirmDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Popconfirm
        trigger={<Button variant="secondary">Publish report</Button>}
        title="Publish now?"
        message="The report becomes visible to all workspace members."
        confirmText="Publish"
        onConfirm={() => undefined}
      />
    )
  }

  return (
    <Popconfirm
      trigger={<Button variant="secondary">Remove member</Button>}
      title="Remove Avery?"
      message="They lose access to this workspace immediately."
      tone="danger"
      confirmText="Remove"
      onConfirm={() => undefined}
    />
  )
}
