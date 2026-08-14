import { ToggleGroup, ToggleGroupItem } from '@kryv/teal'
import { AlignCenter, AlignLeft, AlignRight, Bold, CalendarDays, Italic, KanbanSquare, List, Underline } from 'lucide-react'

export function ToggleGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <ToggleGroup type="multiple" defaultValue={['bold']} aria-label="Text formatting">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" defaultValue="week" aria-label="Report range">
          <ToggleGroupItem value="day" size="sm">
            Day
          </ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">
            Month
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <ToggleGroup
        type="single"
        variant="segmented"
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

  return (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
