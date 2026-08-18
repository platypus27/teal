export default {
  "id": "upload-progress",
  "name": "Upload Progress",
  "apiNames": [
    "UploadProgress"
  ],
  "description": "A file upload progress row with file name, determinate bar, formatted size, and a cancel button.",
  "usage": "<UploadProgress\n  fileName=\"design-spec.fig\"\n  progress={62}\n  size={4718592}\n  onCancel={cancelUpload}\n/>",
  "anatomy": [
    {
      "part": "File icon and name",
      "description": "Decorative file glyph plus the file name, which truncates with ellipsis."
    },
    {
      "part": "Progress bar",
      "description": "role=\"progressbar\" labeled \"Uploading <file name>\" with values clamped to 0–100."
    },
    {
      "part": "Size",
      "description": "Byte size formatted into KB, MB, or GB."
    },
    {
      "part": "Cancel",
      "description": "Trailing button that calls onCancel; its accessible name includes the file name."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep one row per in-flight upload and wire onCancel to abort the request.",
      "Pass raw bytes and percentages; the component clamps and formats them."
    ],
    "donts": [
      "Don't use it for a single overall progress figure; use Progress or LoadingBar.",
      "Don't remove the row the instant it hits 100%; give the completion a beat."
    ]
  },
  "related": [
    "file-upload",
    "loading"
  ],
  "examples": [
    {
      "title": "In-flight uploads",
      "description": "Rows with progress, size, and a cancel action for active uploads."
    },
    {
      "title": "Completed and large files",
      "description": "A finished upload at 100% and a large file with formatted GB size."
    }
  ],
  "guidance": {
    "useWhen": "Uploads run in the background and users need per-file progress plus the ability to cancel.",
    "avoidWhen": "You only need a single overall progress figure; use Progress or LoadingBar instead.",
    "behavior": "Clamps progress to 0–100, formats the byte size, and calls onCancel from the trailing button without managing the upload itself.",
    "responsive": "The file name truncates with ellipsis so the bar and cancel button keep their space at narrow widths."
  }
}
