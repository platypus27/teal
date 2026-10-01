export default {
  "id": "settings-shell",
  "name": "Settings Shell",
  "apiNames": [
    "SettingsShell"
  ],
  "imports": [
    "SettingsShell",
    "StepUpNotice",
    "Button"
  ],
  "description": "The unified settings layout: a sections nav on the left with an accent edge on the current item, a content panel on the right, and slots for a step-up notice and a save bar.",
  "usage": "<SettingsShell\n  accent=\"--teal-color-product-trict\"\n  title=\"Risk\"\n  description=\"Caps the execution worker enforces.\"\n  sections={[\n    { label: 'Trict', items: [\n      { id: 'account', label: 'Account', href: '/settings/account' },\n      { id: 'risk', label: 'Risk', href: '/settings/risk', current: true },\n    ]},\n  ]}\n  notice={<StepUpNotice title=\"Step-up required\">Changing risk caps needs fresh verification.</StepUpNotice>}\n  saveBar={<><Button>Save changes</Button><Button variant=\"ghost\">Discard</Button></>}\n>\n  <RiskForm />\n</SettingsShell>",
  "anatomy": [
    {
      "part": "Sections nav",
      "description": "Grouped section labels above items; items render as anchors when they carry an href and as buttons with onSelect otherwise. The current item sets aria-current=\"page\" and draws the accent edge."
    },
    {
      "part": "Content panel",
      "description": "Title, description, and the section's form or controls."
    },
    {
      "part": "Notice area",
      "description": "Optional slot above the content; compose StepUpNotice here when a sensitive section needs fresh verification before saving."
    },
    {
      "part": "Save bar",
      "description": "Optional row behind a dashed divider for the save and discard actions plus a dirty-state hint."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass the product's own accent token so the active edge keeps product identity.",
      "Use href items for real routes and onSelect items for panels swapped in place.",
      "Render a StepUpNotice in the notice slot for sensitive sections; saving still belongs to the product."
    ],
    "donts": [
      "Don't mix href and onSelect on one item; href wins.",
      "Don't build a per-product settings layout; the point of the shell is that every product's settings work the same.",
      "Don't put the save action inside the form when the save bar slot exists; keep it in one predictable place."
    ]
  },
  "related": [
    "step-up-notice",
    "ecosystem-shell",
    "sidebar"
  ],
  "examples": [
    {
      "title": "Product settings with step-up and save bar",
      "description": "Trict settings in the trict accent: anchor sections, a StepUpNotice, and a save bar with a dirty hint."
    },
    {
      "title": "In-place panels with onSelect",
      "description": "Items without an href render as buttons for settings pages that swap panels without navigating."
    }
  ],
  "guidance": {
    "useWhen": "Any product settings page; Home's account and household settings and every product's own settings share this layout, each in its own accent.",
    "avoidWhen": "Full-page wizards or single-toggle pages do not need a sections nav.",
    "behavior": "Purely presentational: anchors navigate, buttons report through onSelect, and the current item is marked with aria-current. Keyboard users tab through the items natively.",
    "responsive": "Below md the sections nav stacks above the content panel; at md and up it sits in a 15rem column on the left."
  }
}
