import { Button, Card, EmptyState, Table } from '@kryv/teal'

export function EmptyTableRecipe() {
  return (
    <Card className="w-full max-w-3xl">
      <Table caption="Projects" rows={[]} columns={[{ key: 'name', header: 'Project', cell: (row) => row.name }]} getRowKey={(row) => row.id} empty={<EmptyState title="No projects yet" description="Create a project to start tracking work." action={<Button size="sm">Create project</Button>} />} />
    </Card>
  )
}
