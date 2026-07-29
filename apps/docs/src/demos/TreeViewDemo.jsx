import { useState } from 'react'
import { FileText, Folder } from 'lucide-react'
import { TreeView } from '@kryv/teal'

const workspaceFiles = [
  {
    id: 'apps',
    label: 'apps',
    icon: <Folder className="size-4" />,
    children: [
      {
        id: 'web',
        label: 'web',
        icon: <Folder className="size-4" />,
        children: [
          { id: 'web-src', label: 'Dashboard.tsx', icon: <FileText className="size-4" /> },
          { id: 'web-settings', label: 'Settings.tsx', icon: <FileText className="size-4" /> },
        ],
      },
      { id: 'mobile', label: 'Mobile.tsx', icon: <FileText className="size-4" /> },
    ],
  },
  {
    id: 'packages',
    label: 'packages',
    icon: <Folder className="size-4" />,
    children: [
      { id: 'ui-kit', label: 'ui-kit', icon: <Folder className="size-4" />, children: [
        { id: 'button', label: 'Button.tsx', icon: <FileText className="size-4" /> },
        { id: 'input', label: 'Input.tsx', icon: <FileText className="size-4" /> },
      ] },
    ],
  },
  { id: 'readme', label: 'README.md', icon: <FileText className="size-4" /> },
]

export function TreeViewDemo({ exampleIndex = 0 }) {
  const [expandedIds, setExpandedIds] = useState(['apps'])
  const [selectedId, setSelectedId] = useState('web-src')

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs rounded-xl border border-[color:var(--teal-border-subtle)] p-2">
        <TreeView
          aria-label="Workspace file tree"
          items={workspaceFiles}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs rounded-xl border border-[color:var(--teal-border-subtle)] p-2">
      <TreeView
        aria-label="Workspace file tree"
        items={workspaceFiles}
        defaultExpandedIds={['apps', 'web']}
        onSelect={() => undefined}
      />
    </div>
  )
}
