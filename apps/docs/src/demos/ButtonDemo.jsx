import { Button, IconButton } from '@kryv/teal'
import { Search } from 'lucide-react'

export function ButtonDemo() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Saving</Button>
      <IconButton label="Search">
        <Search />
      </IconButton>
    </>
  )
}
