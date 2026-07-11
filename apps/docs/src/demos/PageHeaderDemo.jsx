import { Button, PageHeader } from '@kryv/teal'

export function PageHeaderDemo() {
  return (
    <div className="w-full">
      <PageHeader
        title="Workspace settings"
        subtitle="Manage security and notifications"
        actions={<Button>Save changes</Button>}
      />
    </div>
  )
}
