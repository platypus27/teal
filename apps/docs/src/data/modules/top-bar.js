export default {
  "id": "top-bar",
  "name": "Top Bar",
  "apiNames": [
    "TopBar",
    "TopBarBrand",
    "TopBarSearch",
    "TopBarActions"
  ],
  "imports": [
    "TopBar",
    "TopBarBrand",
    "TopBarSearch",
    "TopBarActions"
  ],
  "description": "A sticky top bar with brand, search, and action slots.",
  "usage": "<TopBar sticky>\n  <TopBarBrand>...</TopBarBrand>\n  <TopBarSearch>...</TopBarSearch>\n  <TopBarActions>...</TopBarActions>\n</TopBar>",
  "anatomy": [
    {
      "part": "Bar",
      "description": "The sticky container that keeps its slots visible while scrolling."
    },
    {
      "part": "Brand",
      "description": "TopBarBrand slot for product identity on the leading edge."
    },
    {
      "part": "Search",
      "description": "TopBarSearch slot for global search in the middle."
    },
    {
      "part": "Actions",
      "description": "TopBarActions slot for trailing controls such as the account menu."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use sticky for apps where global actions must stay reachable while scrolling.",
      "Collapse secondary actions into a menu on narrow screens."
    ],
    "donts": [
      "Don't put page-level actions here; they belong in Page Header.",
      "Don't stack multiple top bars; compose the slots into one."
    ]
  },
  "related": [
    "page-header",
    "app-switcher",
    "account-menu"
  ],
  "examples": [
    {
      "title": "Brand, search, and actions",
      "description": "Slots compose into full and compact headers; sticky keeps the bar visible while scrolling."
    },
    {
      "title": "Application shell header",
      "description": "Combine brand, global search, and account actions in one persistent header."
    },
    {
      "title": "Compact shell",
      "description": "Use the same slots for a focused route header with fewer global actions.",
      "demo": "top-bar-shell"
    }
  ],
  "guidance": {
    "useWhen": "An application needs a consistent global header and action slots.",
    "avoidWhen": "A page has only local controls that belong in its header.",
    "behavior": "Sticky mode keeps the bar visible while its slots remain composable.",
    "responsive": "Collapse secondary actions and move search to a dedicated mobile trigger."
  }
}
