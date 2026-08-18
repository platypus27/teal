export default {
  "id": "sidebar",
  "name": "Sidebar",
  "apiNames": [
    "Sidebar",
    "SidebarHeader",
    "SidebarContent",
    "SidebarFooter",
    "SidebarSection",
    "SidebarItem",
    "SidebarCollapseButton"
  ],
  "description": "A full app sidebar with header, content, and footer slots. It collapses to an icon rail through the collapsed state, switches to a hover-expanding rail with mode=\"rail\", floats as a glass pill with floating, and sets aria-current on the active item.",
  "usage": "<Sidebar>\n  <SidebarHeader>\n    <Logo />\n  </SidebarHeader>\n  <SidebarContent>\n    <SidebarSection label=\"Workspace\">\n      <SidebarItem active href=\"/overview\" icon={<LayoutDashboard />}>\n        Overview\n      </SidebarItem>\n      <SidebarItem href=\"/projects\" icon={<FolderKanban />}>\n        Projects\n      </SidebarItem>\n    </SidebarSection>\n  </SidebarContent>\n  <SidebarFooter>\n    <SidebarCollapseButton />\n  </SidebarFooter>\n</Sidebar>",
  "anatomy": [
    {
      "part": "Header",
      "description": "SidebarHeader slot for product identity."
    },
    {
      "part": "Content",
      "description": "SidebarContent holding SidebarSection groups of items."
    },
    {
      "part": "Items",
      "description": "SidebarItem links; the active one sets aria-current=\"page\"."
    },
    {
      "part": "Footer",
      "description": "SidebarFooter slot, usually holding the SidebarCollapseButton."
    }
  ],
  "dosDonts": {
    "dos": [
      "Persist the collapsed state so it survives navigation.",
      "Keep icons on every item so the collapsed rail stays usable."
    ],
    "donts": [
      "Don't hide critical destinations only in the expanded state.",
      "Don't use it as a dense icon-only strip with tooltips; use Nav Rail instead."
    ]
  },
  "related": [
    "nav-rail",
    "ecosystem-rail",
    "dialog"
  ],
  "examples": [
    {
      "title": "Expanded sidebar",
      "description": "Full labels with header, sectioned items, and a collapse button pinned in the footer."
    },
    {
      "title": "Collapsed icon rail",
      "description": "defaultCollapsed starts the sidebar as an icon-only rail; item labels hide and icons stay centered."
    },
    {
      "title": "Rail mode",
      "description": "mode=\"rail\" collapses to an icon strip that expands on hover or keyboard focus; the active item shows a circular background around its icon."
    },
    {
      "title": "Floating glass rail",
      "description": "floating turns the rail into a translucent, blurred pill that glides over content; position it with className."
    }
  ],
  "guidance": {
    "useWhen": "The app has a persistent primary navigation that benefits from header and footer slots, such as a dashboard or admin console.",
    "avoidWhen": "The nav is a dense icon-only strip with tooltips; use Nav Rail instead.",
    "behavior": "Collapsed state is controlled or uncontrolled via collapsed/defaultCollapsed/onCollapsedChange; mode=\"rail\" collapses labels until hover or focus instead, floating renders a translucent glass pill, and the active item always exposes aria-current=\"page\".",
    "responsive": "Collapsing frees horizontal space on narrow screens; pair with Dialog placement=\"left\" for an off-canvas pattern on phones."
  }
}
