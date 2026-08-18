export default {
  "id": "app-switcher",
  "name": "App Switcher",
  "apiNames": [
    "AppSwitcher"
  ],
  "imports": [
    "AppSwitcher",
    "Button"
  ],
  "description": "An entitlement-filtered application switcher with an explicit Home destination and keyboard navigation.",
  "usage": "<AppSwitcher\n  trigger={<Button variant=\"secondary\">Switch application</Button>}\n  homeHref=\"#\"\n  homeLabel=\"Home\"\n  apps={[\n    { id: 'yang', label: 'Yang Operations', href: '#' },\n    { id: 'photos', label: 'Photos', href: '#', current: true },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The caller-supplied element, usually a Button, that opens the switcher menu."
    },
    {
      "part": "Home destination",
      "description": "The explicit Home link rendered first; homeCurrent marks it with aria-current."
    },
    {
      "part": "Separator",
      "description": "A divider shown only when at least one entitled application follows Home."
    },
    {
      "part": "Application items",
      "description": "Entitlement-filtered links with optional icons; the current application sets aria-current=\"page\"."
    }
  ],
  "dosDonts": {
    "dos": [
      "Filter apps by entitlement before passing them in; the switcher renders only what it receives.",
      "Always provide homeHref and homeLabel so people can return to the stable Home destination.",
      "Mark the application in use with current so it is announced as the current page."
    ],
    "donts": [
      "Don't use it for navigation within one application; use Sidebar or Tabs instead.",
      "Don't hide the current application from the list; show it marked current instead.",
      "Don't put actions in the menu; every item navigates to a product destination."
    ]
  },
  "related": [
    "ecosystem-rail",
    "launcher-card",
    "menu"
  ],
  "examples": [
    {
      "title": "Household applications",
      "description": "The caller filters applications by entitlement first; the switcher renders only what it is given plus the explicit Home destination."
    },
    {
      "title": "Single application",
      "description": "A member with one entitled application still gets the explicit Home destination."
    }
  ],
  "guidance": {
    "useWhen": "People move between entitled ecosystem applications.",
    "avoidWhen": "The navigation is inside one application; use a sidebar or tabs instead.",
    "behavior": "The caller filters applications by entitlement first; the switcher always includes the explicit Home destination.",
    "responsive": "The dropdown collision-handles to stay on screen; keep labels short on narrow layouts."
  }
}
