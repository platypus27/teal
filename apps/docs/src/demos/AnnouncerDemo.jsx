import { useState } from 'react'
import { Announcer, Button } from '@kryv/teal'

export function AnnouncerDemo({ exampleIndex = 0 }) {
  const [saved, setSaved] = useState(0)
  const [failed, setFailed] = useState(0)

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => setFailed((count) => count + 1)}>
          Simulate failure
        </Button>
        <Announcer message={failed > 0 ? 'Saving failed. Try again.' : ''} politeness="assertive" />
        <span className="text-sm text-teal-on-surface-variant">
          {failed > 0 ? `Announced ${failed} time(s) — assertively.` : 'Failures announce with politeness="assertive".'}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => setSaved((count) => count + 1)}>Save changes</Button>
      <Announcer message={saved > 0 ? 'Changes saved' : ''} />
      <span className="text-sm text-teal-on-surface-variant">
        {saved > 0 ? `Announced "Changes saved" ${saved} time(s).` : 'Saving announces through a hidden live region.'}
      </span>
    </div>
  )
}
