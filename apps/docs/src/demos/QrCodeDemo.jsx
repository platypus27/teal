import { QrCode } from '@kryv/teal'

export function QrCodeDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-end gap-6">
        <QrCode value="https://example.com/app/invite" label="QR code for the invite link" size={96} />
        <QrCode value="https://example.com/app/invite" label="QR code for the invite link" size={160} />
        <QrCode value="https://example.com/app/invite" label="QR code for the invite link" size={224} margin={2} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <QrCode value="https://example.com/docs/teal" label="QR code linking to the teal documentation" />
    </div>
  )
}
