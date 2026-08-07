import { UploadProgress } from '@kryv/teal'

export function UploadProgressDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        <UploadProgress fileName="quarterly-report.pdf" progress={100} size={842_000} />
        <UploadProgress fileName="assets-backup.zip" progress={35} size={1_342_177_280} onCancel={() => {}} />
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <UploadProgress fileName="design-spec.fig" progress={62} size={4_718_592} onCancel={() => {}} />
      <UploadProgress fileName="avatar.png" progress={12} />
    </div>
  )
}
