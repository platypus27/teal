export default {
  "id": "ecosystem-shell",
  "name": "Ecosystem Shell",
  "apiNames": [
    "EcosystemShell",
    "EcosystemBrand"
  ],
  "imports": [
    "EcosystemShell",
    "EcosystemBrand",
    "catalogIcon"
  ],
  "description": "The assembled ecosystem chrome: the floating glass-pill EcosystemRail with the default Kryv brand and wordmark reveal, Home, canonical catalog icons, health-dotted destinations, settings and account footer, plus a top bar slot, a scrolling main region, and a mobile drawer.",
  "usage": "<EcosystemShell\n  home={{ href: '/', label: 'Home' }}\n  destinations={entitledDestinations}\n  settingsHref=\"/settings\"\n  user={{ name: me.name }}\n  appSignOut={{ label: 'Sign out of Photos', onSelect: signOut }}\n  ssoSignOut={{ label: 'Sign out everywhere', onSelect: signOutEverywhere }}\n>\n  <Outlet />\n</EcosystemShell>",
  "anatomy": [
    {
      "part": "Rail",
      "description": "The EcosystemRail in rail mode on desktop: a floating glass-pill overlay that expands to 14rem on hover or focus without moving the main region, the stable Home destination first, then caller-filtered destinations with honest health dots."
    },
    {
      "part": "Brand",
      "description": "Defaults to EcosystemBrand — the Kryv mark with the wordmark tail that reveals as the rail expands, artwork inlined so no asset plumbing is needed. The brand prop replaces it entirely."
    },
    {
      "part": "Icons",
      "description": "Home and destination icons resolve through catalogIcon from each entry's id or the catalog's icon name, so every product renders the same canonical glyphs; an explicit per-item icon wins."
    },
    {
      "part": "Footer",
      "description": "Composed from settingsHref and user: a Settings SidebarItem above an AccountMenu with app-level and SSO sign-out. The footer prop replaces it entirely."
    },
    {
      "part": "Top bar slot",
      "description": "Optional product-level bar above the main region, kept outside the scroll area. The rail overlays it, so offset its leading content past the collapsed rail."
    },
    {
      "part": "Main region",
      "description": "The scrolling content area; the shell itself is viewport-height so the rail stays put. The rail is an overlay: clear the collapsed 5rem rail in desktop layouts (for example md:pl-24 on page content)."
    }
  ],
  "dosDonts": {
    "dos": [
      "Filter destinations by entitlement before passing them in; the shell renders exactly what it is given.",
      "Pass status only with real evidence; omit it or use unknown otherwise.",
      "Rely on the default EcosystemBrand and catalog icons so every product renders identical chrome.",
      "Use footer to fully replace the composed footer when a product needs different session controls."
    ],
    "donts": [
      "Don't import routing or auth logic into the shell; callers supply hrefs and sign-out callbacks.",
      "Don't reorder Home into the destinations list; it is always rendered first.",
      "Don't hide the mobile trigger; it is the only ecosystem navigation on small screens.",
      "Don't let main-region content sit under the collapsed overlay rail; offset desktop layouts past it."
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
      "description": "Default brand, canonical catalog icons, Home, health-dotted destinations, settings and account footer, and a top bar above the scrolling main region."
    },
    {
      "title": "Overrides and minimal shell",
      "description": "An explicit brand and per-item icon override the defaults; without user, settingsHref, or topBar the shell is just the rail and the main region."
    }
  ],
  "guidance": {
    "useWhen": "A Kryv product needs the shared ecosystem frame; every product renders the same chrome so moving between products feels like moving within one world.",
    "avoidWhen": "In-product navigation belongs to Sidebar or the product's own shell; embed those inside the main region.",
    "behavior": "Purely presentational: anchors navigate natively, onNavigate reports the destination id first (use it to close menus or instrument), and the mobile drawer closes itself on navigation.",
    "responsive": "At and above md the icon rail floats over the main region and expands on hover or focus; below md it collapses into the Ecosystem drawer trigger."
  }
}
