import { renderToString } from 'react-dom/server'
import { Button, Dialog, Menu, Popover, Select, Toaster, Tooltip } from '../src/index'

describe('portal-backed modules are SSR safe', () => {
  it('renders closed interaction surfaces without a browser document', () => {
    expect(() => renderToString(
      <>
        <Dialog title="Archive" description="The project can be restored."><p>Content</p></Dialog>
        <Tooltip content="Help"><Button>Help</Button></Tooltip>
        <Menu trigger={<Button>Actions</Button>} items={[{ id: 'settings', label: 'Settings', onSelect: () => undefined }]} />
        <Popover label="Filters" trigger={<Button>Filters</Button>}><p>Filter content</p></Popover>
        <Select aria-label="Role" options={[{ value: 'viewer', label: 'Viewer' }]} />
        <Toaster />
      </>,
    )).not.toThrow()
  })
})
