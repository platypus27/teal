export default {
  "id": "ecosystem-shell",
  "name": "Ecosystem Shell",
  "apiNames": [
    "EcosystemShell"
  ],
  "imports": [
    "EcosystemShell"
  ],
  "description": "The assembled ecosystem chrome: the EcosystemRail with brand, Home, health-dotted destinations, settings and account footer, plus a top bar slot, a scrolling main region, and a mobile drawer.",
  "usage": "<EcosystemShell\n  brand={<KryvBrand />}\n  home={{ href: '/', label: 'Home', icon: <House /> }}\n  destinations={entitledDestinations}\n  settingsHref=\"/settings\"\n  user={{ name: me.name }}\n  appSignOut={{ label: 'Sign out of Photos', onSelect: signOut }}\n  ssoSignOut={{ label: 'Sign out everywhere', onSelect: signOutEverywhere }}\n>\n  <Outlet />\n</EcosystemShell>",
  "anatomy": [
    {
      "part": "Rail",
      "description": "The EcosystemRail in rail mode on desktop: brand with wordmark reveal, the stable Home destination first, then caller-filtered destinations with honest health dots."
    },
    {
      "part": "Footer",
      "description": "Composed from settingsHref and user: a Settings SidebarItem above an AccountMenu with app-level and SSO sign-out. The footer prop replaces it entirely."
    },
    {
      "part": "Top bar slot",
      "description": "Optional product-level bar above the main region, kept outside the scroll area."
    },
    {
      "part": "Main region",
      "description": "The scrolling content area; the shell itself is viewport-height so the rail stays put."
    },
    {
      "part": "Mobile drawer",
      "description": "Below the md breakpoint the rail folds into an Ecosystem trigger that opens a left Dialog drawer carrying the voxel shadow, with the rail in full mode inside."
    }
  ],
  "dosDonts": {
    "dos": [
      "Filter destinations by entitlement before passing them in; the shell renders exactly what it is given.",
      "Pass status only with real evidence; omit it or use unknown otherwise.",
      "Use footer to fully replace the composed footer when a product needs different session controls."
    ],
    "donts": [
      "Don't import routing or auth logic into the shell; callers supply hrefs and sign-out callbacks.",
      "Don't reorder Home into the destinations list; it is always rendered first.",
      "Don't hide the mobile trigger; it is the only ecosystem navigation on small screens."
    ]
  },
  "related": [
    "ecosystem-rail",
    "account-menu",
    "settings-shell",
    "theme-provider"
  ],
  "examples": [
    {
      "title": "Full ecosystem chrome",
      "description": "Brand, Home, health-dotted destinations, settings and account footer, and a top bar above the scrolling main region."
    },
    {
      "title": "Minimal shell",
      "description": "Without user, settingsHref, or topBar the shell is just the rail and the main region."
    }
  ],
  "guidance": {
    "useWhen": "A Kryv product needs the shared ecosystem frame; every product renders the same chrome so moving between products feels like moving within one world.",
    "avoidWhen": "In-product navigation belongs to Sidebar or the product's own shell; embed those inside the main region.",
    "behavior": "Purely presentational: anchors navigate natively, onNavigate reports the destination id first (use it to close menus or instrument), and the mobile drawer closes itself on navigation.",
    "responsive": "At and above md the icon rail is visible and expands on hover or focus; below md it collapses into the Ecosystem drawer trigger."
  }
}
