import { useState } from 'react'
import { Button, Command } from '@kryv/teal'
import { FilePlus2, FolderPen, Rocket, Settings, Trash2, UserPlus } from 'lucide-react'

export function CommandDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState('')

  function run(label) {
    setLastAction(label)
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
