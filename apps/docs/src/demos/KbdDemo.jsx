import { Kbd } from '@kryv/teal'

export function KbdDemo() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <p>
        Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette.
      </p>
      <p>
        Use <Kbd>Esc</Kbd> to close dialogs and <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> to add a new
        line.
      </p>
    </div>
  )
}
