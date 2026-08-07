import { useState } from 'react'
import { Button, CookieConsent } from '@kryv/teal'

export function CookieConsentDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(true)

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => setOpen(true)} disabled={open}>
          Show consent banner
        </Button>
        <span className="text-sm text-teal-on-surface-variant">Custom labels, no manage link, controlled visibility.</span>
        <CookieConsent
          open={open}
          onOpenChange={setOpen}
          message="This workspace stores your preferences locally. Choose whether to allow analytics cookies."
          acceptLabel="Allow analytics"
          declineLabel="Essentials only"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)} disabled={open}>
        Show consent banner
      </Button>
      <span className="text-sm text-teal-on-surface-variant">The banner pins to the bottom of the viewport without blocking the page.</span>
      <CookieConsent
        open={open}
        onOpenChange={setOpen}
        message="We use cookies to keep you signed in and to understand how the docs are used."
        manageHref="#cookies"
      />
    </div>
  )
}
