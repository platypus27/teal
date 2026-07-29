import { useState } from 'react'
import { IconButton, Toolbar, ToolbarGroup, ToolbarSeparator } from '@kryv/teal'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, List, Redo2, Underline, Undo2 } from 'lucide-react'

const alignments = [
  { key: 'left', label: 'Align left', icon: AlignLeft },
  { key: 'center', label: 'Align center', icon: AlignCenter },
  { key: 'right', label: 'Align right', icon: AlignRight },
]

export function ToolbarDemo({ exampleIndex = 0 }) {
  const [alignment, setAlignment] = useState('left')
  const [active, setActive] = useState({ bold: true, italic: false, underline: false })

  const toggleFormat = (key) => setActive((current) => ({ ...current, [key]: !current[key] }))
  const pressedClasses = 'teal-u-bg-primary/10 teal-u-text-primary'

  if (exampleIndex === 1) {
    return (
      <Toolbar aria-label="Text formatting">
        <ToolbarGroup>
          <IconButton
            size="sm"
            label="Bold"
            aria-pressed={active.bold}
            className={active.bold ? pressedClasses : undefined}
            onClick={() => toggleFormat('bold')}
          >
            <Bold aria-hidden="true" />
          </IconButton>
          <IconButton
            size="sm"
            label="Italic"
            aria-pressed={active.italic}
            className={active.italic ? pressedClasses : undefined}
            onClick={() => toggleFormat('italic')}
          >
            <Italic aria-hidden="true" />
          </IconButton>
          <IconButton
            size="sm"
            label="Underline"
            aria-pressed={active.underline}
            className={active.underline ? pressedClasses : undefined}
            onClick={() => toggleFormat('underline')}
          >
            <Underline aria-hidden="true" />
          </IconButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <IconButton size="sm" label="Insert link">
            <Link2 aria-hidden="true" />
          </IconButton>
          <IconButton size="sm" label="Bulleted list">
            <List aria-hidden="true" />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )
  }

  return (
    <Toolbar aria-label="Editor actions">
      <ToolbarGroup>
        <IconButton size="sm" label="Undo">
          <Undo2 aria-hidden="true" />
        </IconButton>
        <IconButton size="sm" label="Redo" disabled>
          <Redo2 aria-hidden="true" />
        </IconButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        {alignments.map(({ key, label, icon: Icon }) => (
          <IconButton
            key={key}
            size="sm"
            label={label}
            aria-pressed={alignment === key}
            className={alignment === key ? pressedClasses : undefined}
            onClick={() => setAlignment(key)}
          >
            <Icon aria-hidden="true" />
          </IconButton>
        ))}
      </ToolbarGroup>
    </Toolbar>
  )
}
