export default {
  "id": "lightbox",
  "name": "Lightbox",
  "apiNames": [
    "Lightbox"
  ],
  "description": "Full-screen gallery overlay for paging through images with arrow keys, on-screen controls, and a live counter.",
  "usage": "<Lightbox\n  open={open}\n  onOpenChange={setOpen}\n  images={[{ src: \"/photo.jpg\", alt: \"Team offsite\", caption: \"Spring offsite\" }]}\n/>",
  "anatomy": [
    {
      "part": "Overlay",
      "description": "The full-screen dialog surface that dims the page and traps focus while open."
    },
    {
      "part": "Image stage",
      "description": "The current image, scaled to fit the viewport, with its alt and optional caption."
    },
    {
      "part": "Prev/next controls",
      "description": "Chevron buttons that mirror the arrow keys and wrap around the ends."
    },
    {
      "part": "Counter",
      "description": "The live \"n of m\" indicator tracking the current position."
    }
  ],
  "dosDonts": {
    "dos": [
      "Give every image meaningful alt text and a short caption where it adds context.",
      "Open at the clicked thumbnail's index via the controlled index prop.",
      "Let the overlay own paging; arrow keys and buttons stay in sync."
    ],
    "donts": [
      "Don't use a lightbox for a single image that needs zoom inspection; use ImageViewer.",
      "Don't write long prose captions; keep them to a short label.",
      "Don't hide the close path; Escape and the backdrop always close it."
    ]
  },
  "related": [
    "image-viewer",
    "dialog"
  ],
  "examples": [
    {
      "title": "Gallery overlay",
      "description": "A button opens the lightbox; arrow keys and the chevron buttons page through images while the counter tracks position."
    },
    {
      "title": "Thumbnail entry points",
      "description": "Each thumbnail opens the gallery at its own index via the controlled index prop."
    }
  ],
  "guidance": {
    "useWhen": "Users need to inspect a set of images one at a time without leaving the page, such as photo galleries or screenshot collections.",
    "avoidWhen": "A single inline image with zoom controls is enough; use ImageViewer instead.",
    "behavior": "Wraps from the last image to the first (and back) with both keys and buttons; Escape and backdrop clicks close the overlay.",
    "responsive": "The image scales to fit the viewport while controls stay anchored to the edges on any width."
  }
}
