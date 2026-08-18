import { Link } from '@kryv/teal'

export function LinkDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Link href="#" variant="standalone">
        View all projects
      </Link>
    )
  }

  if (exampleIndex === 2) {
    return (
      <Link href="#" external>
        System status
      </Link>
    )
  }

  return (
    <p className="max-w-md text-sm">
      Your workspace is shared with the design team. <Link href="#">Manage access</Link> to change who
      can see this project.
    </p>
  )
}
