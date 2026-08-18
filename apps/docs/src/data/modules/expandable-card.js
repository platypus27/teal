export default {
  "id": "expandable-card",
  "name": "Expandable Card",
  "apiNames": [
    "ExpandableCard"
  ],
  "description": "A card that expands and collapses its extra content with a built-in trigger, chevron affordance, and smooth height animation.",
  "usage": "<ExpandableCard title=\"Release notes\">\n  <p>Version 2.4 adds dark surface tokens and fixes drawer scroll locking.</p>\n</ExpandableCard>",
  "anatomy": [
    {
      "part": "Header",
      "description": "The always-visible title area, rendered as a configurable heading (h2 by default)."
    },
    {
      "part": "Trigger",
      "description": "The button with aria-expanded and the rotating chevron affordance."
    },
    {
      "part": "Region",
      "description": "The collapsible content area, aria-hidden and inert while collapsed."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for secondary detail most readers skip, like changelogs or advanced settings.",
      "Rename the trigger with domain wording when it is clearer, like \"View shortcuts\".",
      "Keep the default collapsed so the summary stays scannable."
    ],
    "donts": [
      "Don't put primary content in the collapsible region.",
      "Don't stack several as a pseudo-accordion; use Accordion so sections are grouped."
    ]
  },
  "related": [
    "accordion",
    "card"
  ],
  "examples": [
    {
      "title": "Collapsible extra content",
      "description": "The header stays visible while the trigger smoothly reveals or folds away the secondary content."
    },
    {
      "title": "Initially expanded with custom labels",
      "description": "Start open and rename the trigger when the action is clearer with domain wording such as 'View shortcuts'."
    }
  ],
  "guidance": {
    "useWhen": "A card carries secondary detail that most readers skip, for example changelogs, advanced settings, or long descriptions under a summary.",
    "avoidWhen": "Several stacked disclosures belong together; use Accordion instead so only one section expands at a time and headings are grouped.",
    "behavior": "The trigger button sets aria-expanded and points at the content region; while collapsed the region is aria-hidden and inert, and the chevron rotates as the height animates. Supports controlled (expanded) and uncontrolled (defaultExpanded) usage.",
    "responsive": "The height animation uses the grid-rows technique, so any content height animates smoothly at any width without JavaScript measurement."
  }
}
