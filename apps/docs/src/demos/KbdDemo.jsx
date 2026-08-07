import { Kbd } from '@kryv/teal'

export function KbdDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-3 text-sm">
        <p>
          Press <Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd> to open the command menu.
        </p>
        <p>
          Use <Kbd>Ctrl</Kbd> + <Kbd>Alt</Kbd> + <Kbd>N</Kbd> for a new file and{' '}
          <Kbd>⌘</Kbd> + <Kbd>Option</Kbd> + <Kbd>W</Kbd> to close the window.
        </p>
      </div>
    )
  }

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
