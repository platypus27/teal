export default {
  "id": "file-upload",
  "name": "File Upload",
  "apiNames": [
    "FileUpload"
  ],
  "description": "A drag-and-drop zone with a browse action and a removable file list.",
  "usage": "<FileUpload label=\"Attachments\" multiple onFilesAdded={(files) => undefined} />",
  "anatomy": [
    {
      "part": "Drop zone",
      "description": "The drag target that highlights on drag-over and holds the browse action."
    },
    {
      "part": "Browse action",
      "description": "The explicit button that opens the file picker without drag-and-drop."
    },
    {
      "part": "File list",
      "description": "Rows with the name, size, and a remove action per file."
    }
  ],
  "dosDonts": {
    "dos": [
      "State accepted types and size limits in the description.",
      "Mirror the caller-owned value so removals stay in sync.",
      "Use accept to narrow the picker, then validate again on the server."
    ],
    "donts": [
      "Don't auto-upload on selection without telling the user.",
      "Don't use it for a single text reference; use Input.",
      "Don't swallow rejected files silently; surface why a file was refused."
    ]
  },
  "related": [
    "upload-progress",
    "input",
    "field",
    "form"
  ],
  "examples": [
    {
      "title": "Drop or browse",
      "description": "Drag-over highlights the zone; files list with sizes and remove actions."
    },
    {
      "title": "Multiple attachments",
      "description": "A controlled multi-file zone seeded with an existing file and a removal action."
    }
  ],
  "guidance": {
    "useWhen": "Users attach files to a form.",
    "avoidWhen": "A single URL or text reference suffices; use Input.",
    "behavior": "Drag-over highlights the zone; the list mirrors the caller-owned value.",
    "responsive": "The zone fills its container and the file list wraps below."
  }
}
