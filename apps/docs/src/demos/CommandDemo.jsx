import { useEffect, useState } from 'react'
import { Button, Command } from '@kryv/teal'
import { FilePlus2, FolderPen, Keyboard, PanelLeft, Rocket, Settings, SquareArrowOutUpRight, Trash2, UserPlus } from 'lucide-react'

export function CommandDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState('')

  useEffect(() => {
    if (exampleIndex !== 2) return undefined
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [exampleIndex])

  function run(label) {
    setLastAction(label)
  }

  if (exampleIndex === 2) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-on-surface-variant">
          Press <kbd className="rounded border border-teal-outline-variant/60 px-1.5 py-0.5 text-xs">⌘K</kbd> anywhere to
          open the palette.
        </p>
        {lastAction ? <p className="text-sm text-on-surface-variant">Last action: {lastAction}</p> : null}
        <Command
          open={open}
          onOpenChange={setOpen}
          placeholder="Type a command or search…"
          groups={[
            {
              label: 'Navigation',
              items: [
                { id: 'reports', label: 'Jump to reports', hint: 'G R', icon: <SquareArrowOutUpRight />, onSelect: () => run('Jump to reports') },
                { id: 'sidebar', label: 'Toggle sidebar', hint: '⌘B', icon: <PanelLeft />, onSelect: () => run('Toggle sidebar') },
              ],
            },
            {
              label: 'Help',
              items: [
                { id: 'shortcuts', label: 'Keyboard shortcuts', hint: '?', icon: <Keyboard />, onSelect: () => run('Keyboard shortcuts') },
              ],
            },
          ]}
        />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open admin commands
        </Button>
        {lastAction ? <p className="text-sm text-on-surface-variant">Last action: {lastAction}</p> : null}
        <Command
          open={open}
          onOpenChange={setOpen}
          placeholder="Search admin commands…"
          emptyMessage="No admin commands match"
          groups={[
            {
              label: 'Workspace',
              items: [
                { id: 'invite', label: 'Invite member', hint: '⌘I', icon: <UserPlus />, onSelect: () => run('Invite member') },
                { id: 'settings', label: 'Workspace settings', icon: <Settings />, onSelect: () => run('Workspace settings') },
              ],
            },
            {
              label: 'Danger zone',
              items: [
                { id: 'delete', label: 'Delete workspace', icon: <Trash2 />, onSelect: () => run('Delete workspace') },
              ],
            },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      {lastAction ? <p className="text-sm text-on-surface-variant">Last action: {lastAction}</p> : null}
      <Command
        open={open}
        onOpenChange={setOpen}
        groups={[
          {
            label: 'Project',
            items: [
              { id: 'new', label: 'New project', hint: '⌘N', icon: <FilePlus2 />, onSelect: () => run('New project') },
              { id: 'rename', label: 'Rename project', icon: <FolderPen />, onSelect: () => run('Rename project') },
              { id: 'deploy', label: 'Deploy to production', hint: '⌘D', icon: <Rocket />, onSelect: () => run('Deploy to production') },
            ],
          },
          {
            label: 'Workspace',
            items: [
              { id: 'invite', label: 'Invite member', hint: '⌘I', icon: <UserPlus />, onSelect: () => run('Invite member') },
              { id: 'settings', label: 'Workspace settings', icon: <Settings />, onSelect: () => run('Workspace settings') },
            ],
          },
        ]}
      />
    </div>
  )
}
