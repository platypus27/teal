export default {
  "id": "account-menu",
  "name": "Account Menu",
  "apiNames": [
    "AccountMenu"
  ],
  "imports": [
    "AccountMenu"
  ],
  "description": "A household account menu with an identity header, product items, and distinct app and SSO sign-out actions.",
  "usage": "<AccountMenu\n  user={{ name: 'Avery Chen', email: 'avery@example.com' }}\n  items={[{ id: 'sessions', label: 'Active sessions', onSelect: () => undefined }]}\n  appSignOut={{ label: 'Sign out of Photos', onSelect: () => undefined }}\n  ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => undefined }}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "Compact avatar button named after the signed-in user."
    },
    {
      "part": "Identity header",
      "description": "Name and email block that anchors the menu to an account."
    },
    {
      "part": "Product items",
      "description": "Caller-defined account actions such as active sessions or settings."
    },
    {
      "part": "Sign-out actions",
      "description": "Distinct app-session and SSO sign-out items with product-supplied labels."
    }
  ],
  "dosDonts": {
    "dos": [
      "Label both sign-out actions by product so sessions stay distinguishable.",
      "Keep the identity header even when there are no product items.",
      "Order neutral account items before the sign-out actions."
    ],
    "donts": [
      "Don't merge app and SSO sign-out into one ambiguous action.",
      "Don't show the menu on public surfaces with no signed-in identity.",
      "Don't bury primary navigation here; it is for account and session actions."
    ]
  },
  "related": [
    "app-switcher",
    "menu",
    "top-bar"
  ],
  "examples": [
    {
      "title": "Household account",
      "description": "Sign-out actions are labeled by the product so people can tell an application session from the shared SSO session."
    },
    {
      "title": "Without product items",
      "description": "The items list is optional; the identity header and sign-out actions remain."
    }
  ],
  "guidance": {
    "useWhen": "A signed-in household identity needs session and account actions.",
    "avoidWhen": "The surface has no identity concept or is public.",
    "behavior": "App-session and SSO sign-out stay distinct actions with product-supplied labels.",
    "responsive": "The trigger stays a compact avatar so it fits top bars at any width."
  }
}
