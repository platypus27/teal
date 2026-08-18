export default {
  "id": "container",
  "name": "Container",
  "apiNames": [
    "Container"
  ],
  "description": "Centers content in a max-width column with responsive horizontal padding and fixed size steps.",
  "usage": "<Container\n  size=\"lg\"\n>\n  <p>Centered page content.</p>\n</Container>",
  "anatomy": [
    {
      "part": "Centered column",
      "description": "A max-width wrapper that keeps content readable on wide screens."
    },
    {
      "part": "Side padding",
      "description": "Horizontal padding that steps up across the sm and lg breakpoints."
    },
    {
      "part": "Size step",
      "description": "sm, md and lg cap the column at different widths; fluid removes the cap."
    }
  ],
  "dosDonts": {
    "dos": [
      "Wrap page content so line lengths stay readable on wide screens.",
      "Use size=\"fluid\" for full-bleed bands, then nest a capped Container inside for the content.",
      "Pass as=\"main\" when the Container wraps the primary page content."
    ],
    "donts": [
      "Don't nest capped Containers; the inner cap fights the outer one.",
      "Don't add Container inside already-narrow panels or sidebars.",
      "Don't hand-roll your own max-width wrappers alongside it; pick one convention."
    ]
  },
  "related": [
    "section",
    "app-shell",
    "box"
  ],
  "examples": [
    {
      "title": "Default page column",
      "description": "Content centers at max-w-6xl with side padding that widens on larger breakpoints."
    },
    {
      "title": "Size variants",
      "description": "sm, md and lg cap the column at different widths; fluid removes the cap for full-bleed regions."
    }
  ],
  "guidance": {
    "useWhen": "Page or section content should stay readable on wide screens with a consistent centered column.",
    "avoidWhen": "The content should fill the available width edge to edge; skip the wrapper or use size=\"fluid\".",
    "behavior": "Container always spans the full available width up to its size cap and keeps a minimum padding on small screens.",
    "responsive": "Horizontal padding steps up from px-4 to px-8 across the sm and lg breakpoints while the column stays centered."
  }
}
