export default {
  "id": "navigation-menu",
  "name": "Navigation Menu",
  "apiNames": [
    "NavigationMenu"
  ],
  "description": "A top-level navigation bar mixing links with rich content panels in a shared viewport.",
  "usage": "<NavigationMenu\n  label=\"Primary\"\n  items={[\n    { type: 'link', label: 'Overview', href: '/', active: true },\n    { type: 'panel', label: 'Products', content: <ProductsPanel /> },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "List",
      "description": "Top-level row mixing link items and panel triggers."
    },
    {
      "part": "Link items",
      "description": "Plain navigation links; the active one sets aria-current=\"page\"."
    },
    {
      "part": "Panel triggers",
      "description": "Buttons that open rich content in the shared viewport."
    },
    {
      "part": "Viewport",
      "description": "One shared surface that animates between open panels."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep panels to scannable groups of links, not forms.",
      "Mark the current page's link item active."
    ],
    "donts": [
      "Don't use it when everything is a flat link; simpler link styling suffices.",
      "Don't put commands or forms inside panels; they are for navigation content."
    ]
  },
  "related": [
    "menubar",
    "top-bar"
  ],
  "examples": [
    {
      "title": "Links and panels",
      "description": "Link items navigate with aria-current; panel items reveal content in one viewport."
    },
    {
      "title": "Flat links",
      "description": "A link-only bar still gets the shared landmark and active-link styling without any panels."
    },
    {
      "title": "Multi-column panel",
      "description": "Panel content accepts grouped columns of links with headings, replacing the old MegaMenu pattern."
    },
    {
      "title": "Panel content",
      "description": "Panel items accept arbitrary content such as feature grids or promoted links."
    }
  ],
  "guidance": {
    "useWhen": "Top-level destinations mix links with rich preview panels.",
    "avoidWhen": "The navigation is flat links only; use simpler link styling.",
    "behavior": "Panels open in a shared viewport; the active link sets aria-current.",
    "responsive": "Fall back to a vertical nav or drawer on narrow screens."
  }
}
