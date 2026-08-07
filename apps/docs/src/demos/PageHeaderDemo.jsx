import { Button, PageHeader } from '@kryv/teal'

export function PageHeaderDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full">
        <PageHeader
          title="Usage and billing"
          subtitle="Seat counts, invoices, and plan limits for the whole workspace"
          actions={
            <>
              <Button variant="secondary">Download invoice</Button>
              <Button>Upgrade plan</Button>
            </>
          }
        />
      </div>
    )
  }
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
