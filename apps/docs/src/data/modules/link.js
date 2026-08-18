export default {
  "id": "link",
  "name": "Link",
  "apiNames": [
    "Link"
  ],
  "description": "Themed inline and standalone links with an external indicator.",
  "usage": "<Link href=\"/projects\">View projects</Link>\n<Link href=\"#\" external>Status page</Link>",
  "anatomy": [
    {
      "part": "Anchor text",
      "description": "The underlined link text, inline within prose or standalone."
    },
    {
      "part": "External indicator",
      "description": "The icon appended to links that open a new tab, paired with rel=\"noreferrer\"."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use links for navigation, even when the destination opens in a new tab.",
      "Use the external prop for off-site links so the new-tab behavior is signposted.",
      "Write link text that makes sense out of context, not \"click here\"."
    ],
    "donts": [
      "Don't use a link to perform an action like saving or deleting; use a Button.",
      "Don't wrap whole sentences or paragraphs in a link."
    ]
  },
  "related": [
    "button",
    "breadcrumb",
    "skip-link"
  ],
  "examples": [
    {
      "title": "Inline and external",
      "description": "Inline links underline within prose; external links open a new tab with an icon."
    },
    {
      "title": "Standalone navigation",
      "description": "Use the standalone variant outside prose, where underline-on-hover signals the affordance."
    }
  ],
  "guidance": {
    "useWhen": "Navigation happens inline in prose or as a lightweight standalone action.",
    "avoidWhen": "The affordance performs an action; use Button instead.",
    "behavior": "External links open a new tab with rel=\"noreferrer\" and an indicator icon.",
    "responsive": "Let inline links wrap naturally with their surrounding text."
  }
}
