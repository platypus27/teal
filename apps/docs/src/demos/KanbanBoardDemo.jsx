import { KanbanBoard } from '@kryv/teal'

export function KanbanBoardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <KanbanBoard
        label="Release checklist"
        defaultColumns={[
          {
            id: 'planned',
            title: 'Planned',
            cards: [
              { id: 'r1', title: 'Write changelog', description: 'Cover all v0.5 additions' },
              { id: 'r2', title: 'Smoke test docs' },
            ],
          },
          { id: 'shipped', title: 'Shipped', cards: [{ id: 'r3', title: 'Tag v0.4.1' }] },
        ]}
      />
    )
  }

  return (
    <KanbanBoard
      label="Sprint board"
      defaultColumns={[
        {
          id: 'todo',
          title: 'To do',
          cards: [
            { id: 'a', title: 'Design tokens audit', description: 'Align spacing scale with spec' },
            { id: 'b', title: 'Empty state illustrations' },
            { id: 'c', title: 'TreeGrid keyboard spec' },
          ],
        },
        {
          id: 'doing',
          title: 'Doing',
          cards: [{ id: 'd', title: 'Kanban board component', description: 'Grab and move with the keyboard' }],
        },
        {
          id: 'done',
          title: 'Done',
          cards: [{ id: 'e', title: 'Rating sizes' }],
        },
      ]}
    />
  )
}
