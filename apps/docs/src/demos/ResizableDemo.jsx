import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@kryv/teal'

const paneClasses =
  'flex h-full items-center justify-center rounded-lg border border-teal-outline-variant/50 bg-teal-surface-container-low text-sm text-teal-on-surface-variant'

export function ResizableDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="h-56 w-full max-w-lg">
        <ResizablePanelGroup direction="vertical" className="gap-1">
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className={paneClasses}>Summary</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={20}>
            <div className={paneClasses}>Details</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
  }

  return (
    <div className="h-40 w-full max-w-2xl">
      <ResizablePanelGroup direction="horizontal" className="gap-1">
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className={paneClasses}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={30}>
          <div className={paneClasses}>Content — drag the handle or focus it and use arrow keys</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
