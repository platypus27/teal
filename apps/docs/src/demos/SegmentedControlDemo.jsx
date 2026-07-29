import { SegmentedControl } from '@kryv/teal'
import { CalendarDays, KanbanSquare, List } from 'lucide-react'

export function SegmentedControlDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <SegmentedControl
        aria-label="Billing period"
        size="sm"
        defaultValue="monthly"
        options={[
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />
    )
  }

  return (
    <SegmentedControl
      aria-label="Project view"
      defaultValue="board"
      options={[
        { value: 'list', label: 'List', icon: <List /> },
        { value: 'board', label: 'Board', icon: <KanbanSquare /> },
        { value: 'calendar', label: 'Calendar', icon: <CalendarDays />, disabled: true },
      ]}
    />
  )
}
