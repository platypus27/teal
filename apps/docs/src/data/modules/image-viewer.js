export default {
  "id": "image-viewer",
  "name": "Image Viewer",
  "apiNames": [
    "ImageViewer"
  ],
  "description": "Inline viewer for a single image with toolbar and keyboard zoom plus pointer-drag panning while zoomed.",
  "usage": "<ImageViewer\n  src=\"/blueprint.svg\"\n  alt=\"Floor plan\"\n  maxZoom={4}\n/>",
  "anatomy": [
    {
      "part": "Stage",
      "description": "The container the image renders into, sized by the caller's layout."
    },
    {
      "part": "Toolbar",
      "description": "Zoom-in, zoom-out, and reset controls that mirror the keyboard shortcuts."
    },
    {
      "part": "Image",
      "description": "The asset itself; panning by pointer drag engages once zoom passes the minimum."
    }
  ],
  "dosDonts": {
    "dos": [
      "Write alt text that describes the image content, not just \"image\".",
      "Clamp maxZoom to the asset's real resolution so zooming stays meaningful.",
      "Use for single diagrams, maps, or exports that users inspect in place."
    ],
    "donts": [
      "Don't use it to page through a set of images; use Lightbox.",
      "Don't wrap decorative images; a plain img is enough.",
      "Don't rely on drag alone; the toolbar and keyboard zoom cover pointer-free use."
    ]
  },
  "related": [
    "lightbox",
    "dialog"
  ],
  "examples": [
    {
      "title": "Default viewer",
      "description": "Zoom in and out with the toolbar buttons or the + and − keys, and drag to pan once past 100%."
    },
    {
      "title": "Custom bounds",
      "description": "Starts pre-zoomed with finer zoom steps and a lower maximum for detail inspection."
    }
  ],
  "guidance": {
    "useWhen": "A single diagram, map, or photo needs in-place inspection with zoom and pan, such as a blueprint or chart export.",
    "avoidWhen": "Browsing a set of images; use Lightbox for galleries, or a plain img when no inspection is needed.",
    "behavior": "Zoom is clamped between minZoom and maxZoom; panning only engages above minZoom and the offset resets when zoom returns to the minimum.",
    "responsive": "The viewer fills its container and the image scales within it; sizing is controlled by the caller's layout."
  }
}
