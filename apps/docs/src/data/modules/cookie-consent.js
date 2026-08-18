export default {
  "id": "cookie-consent",
  "name": "Cookie Consent",
  "apiNames": [
    "CookieConsent"
  ],
  "description": "Polite, non-modal bottom banner for cookie consent with accept and decline actions and an optional preferences link.",
  "usage": "<CookieConsent\n  message=\"We use cookies to improve your experience.\"\n  manageHref=\"/settings/cookies\"\n  onAccept={allowAll}\n  onDecline={allowEssential}\n/>",
  "anatomy": [
    {
      "part": "Message",
      "description": "The plain-language disclosure of what cookies or tracking are used for."
    },
    {
      "part": "Manage link",
      "description": "An optional link to granular preferences, via manageHref."
    },
    {
      "part": "Accept and decline",
      "description": "Equal-weight actions that report the choice through onAccept and onDecline and dismiss the banner."
    }
  ],
  "dosDonts": {
    "dos": [
      "Write the message in plain language and keep it to one or two sentences.",
      "Wire onAccept and onDecline to real consent state, not just dismissal.",
      "Control visibility so users can re-open consent from a settings page later."
    ],
    "donts": [
      "Don't block the page until consent; the banner is intentionally non-modal.",
      "Don't style accept and decline asymmetrically to nudge one choice.",
      "Don't show the banner again after a recorded choice unless consent expires."
    ]
  },
  "related": [
    "alert",
    "dialog"
  ],
  "examples": [
    {
      "title": "Consent banner",
      "description": "Pins to the bottom of the viewport with a message, manage link, and accept/decline actions that dismiss it."
    },
    {
      "title": "Custom labels, controlled",
      "description": "Controlled visibility with tailored action labels and no manage link."
    }
  ],
  "guidance": {
    "useWhen": "You must collect consent without interrupting the task at hand, as required for cookie and tracking disclosures.",
    "avoidWhen": "The decision blocks use of the product; use AlertDialog for a mandatory acknowledgement.",
    "behavior": "Accept and decline both report the choice and dismiss the banner; visibility is controllable so consent can be re-opened later.",
    "responsive": "Actions stack above the message on narrow screens and sit inline from the sm breakpoint up."
  }
}
