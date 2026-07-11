import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@kryv/teal'
import { useCommandPalette } from '../components/CommandPalette.jsx'
import { Page } from '../components/Page.jsx'

export function NotFoundPage() {
  const { setOpen } = useCommandPalette()
  return (
    <Page
      eyebrow="Error 404"
      title="Page not found"
      description="The page you are looking for does not exist or has moved. Search the docs or head back to the start."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Back to getting started</Link>
        </Button>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Search aria-hidden="true" className="size-4" />
          Search the docs
        </Button>
      </div>
    </Page>
  )
}
