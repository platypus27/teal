import { useState } from 'react'
import { FileUpload } from '@kryv/teal'

export function FileUploadDemo({ exampleIndex = 0 }) {
  const [files, setFiles] = useState([{ name: 'roadmap-q3.pdf', size: 482_304 }])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md">
        <FileUpload
          label="Project attachments"
          description="Design docs, spreadsheets, or archives"
          multiple
          value={files}
          onValueChange={setFiles}
          onFilesAdded={(added) => console.log('Added', added.map((file) => file.name))}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <FileUpload label="Profile photo" description="PNG or JPG, up to 5 MB" accept="image/*" />
    </div>
  )
}
