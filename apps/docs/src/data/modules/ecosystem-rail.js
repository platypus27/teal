export default {
  "id": "ecosystem-rail",
  "name": "Ecosystem Rail",
  "apiNames": [
    "EcosystemRail"
  ],
  "imports": [
    "EcosystemRail",
    "SidebarItem"
  ],
  "description": "A persistent cross-product rail with a stable Home destination, caller-filtered applications, and honest health status.",
  "usage": "<EcosystemRail\n  home={{ href: '#', label: 'Home', icon: <Home /> }}\n  destinations={[\n    { id: 'yang', label: 'Yang Operations', href: '#', icon: <Gauge />, current: true },\n    { id: 'photos', label: 'Photos', href: '#', icon: <Camera />, status: 'degraded' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Brand",
      "description": "Optional product-family mark rendered above the list, supplied through the brand prop."
    },
    {
      "part": "Home destination",
      "description": "The stable Home link, always rendered first; pass current when Home is the active product."
    },
    {
      "part": "Destinations",
      "description": "Caller-filtered application links with icons; an optional HealthIndicator shows an honest status beside each label."
    },
    {
      "part": "Footer",
      "description": "Optional account or session controls pinned to the bottom of the rail."
    }
  ],
  "dosDonts": {
    "dos": [
      "Filter destinations by entitlement before passing them in; the rail renders exactly what it is given.",
      "Mark the product the person is currently using with current so the item sets aria-current.",
      "Pass status only with real evidence; omit it or use unknown when health is not measured."
    ],
    "donts": [
      "Don't use it for navigation inside one application; use Sidebar instead.",
      "Don't derive or hide entitlements inside the rail; it never filters destinations itself.",
      "Don't reorder Home into the destination list; it is always rendered first by design."
    ]
  },
  "related": [
    "app-switcher",
    "sidebar",
    "health-indicator"
  ],
  "examples": [
    {
      "title": "Rail mode with health status",
      "description": "The default icon rail expands on hover or focus; destinations carry an honest HealthIndicator status only when evidence exists."
    },
    {
      "title": "Full mode with a degraded destination",
      "description": "mode=\"full\" keeps labels visible; Home is marked current and the degraded Photos status stays readable beside its label."
    }
  ],
  "guidance": {
    "useWhen": "A product needs persistent navigation across the whole ecosystem, not just its own sections.",
    "avoidWhen": "The navigation is inside one application; use Sidebar. For a temporary switcher menu, use App Switcher.",
    "behavior": "Home always renders first, the caller filters destinations by entitlement, health status appears only when supplied, and onNavigate fires before ordinary anchor navigation.",
    "responsive": "Rail mode collapses to icons until hover or focus; fold the rail into a drawer on narrow screens."
  }
}
