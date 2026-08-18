export default {
  "id": "network-status",
  "name": "Network Status",
  "apiNames": [
    "NetworkStatus"
  ],
  "description": "An inline indicator of the browser's online/offline state with a render prop for custom display.",
  "usage": "<NetworkStatus\n  onlineLabel=\"Connected\"\n  offlineLabel=\"No connection\"\n/>",
  "anatomy": [
    {
      "part": "Icon",
      "description": "Decorative connectivity glyph that flips with the online state."
    },
    {
      "part": "Label",
      "description": "Online and offline text supplied through onlineLabel and offlineLabel."
    },
    {
      "part": "Render prop",
      "description": "Optional custom output receiving the current online boolean."
    }
  ],
  "dosDonts": {
    "dos": [
      "Place it near sync or save controls where connectivity changes the outcome.",
      "Expose the state as text in custom renders, never as color alone."
    ],
    "donts": [
      "Don't use it as the only offline signal when unsaved work is at risk; use OfflineBanner.",
      "Don't poll navigator.onLine yourself; the component already listens to online and offline events."
    ]
  },
  "related": [
    "offline-banner",
    "save-status",
    "status-dot"
  ],
  "examples": [
    {
      "title": "Default indicator",
      "description": "An icon and label that track online/offline browser events."
    },
    {
      "title": "Custom render prop",
      "description": "Fully custom output driven by the current online boolean."
    }
  ],
  "guidance": {
    "useWhen": "The UI depends on connectivity and users benefit from a persistent inline indicator, for example next to sync controls.",
    "avoidWhen": "You only need to interrupt the user when connectivity drops; use OfflineBanner instead.",
    "behavior": "Initializes from navigator.onLine and updates live on the window online/offline events.",
    "responsive": "Compact inline element; the render prop allows any responsive treatment."
  }
}
