export default {
  "id": "password-strength-meter",
  "name": "Password Strength Meter",
  "apiNames": [
    "PasswordStrengthMeter"
  ],
  "description": "A progressbar-style meter that visualizes password strength from a caller-supplied or built-in score.",
  "usage": "<PasswordStrengthMeter\n  password={password}\n  score={(value) => zxcvbn(value).score}\n/>",
  "anatomy": [
    {
      "part": "Label row",
      "description": "The meter label and the current strength band text, spaced apart on one row."
    },
    {
      "part": "Meter track",
      "description": "A progressbar with aria-valuemin 0, aria-valuemax 4, and the band name as aria-valuetext."
    },
    {
      "part": "Fill",
      "description": "The colored portion reflecting the clamped 0–4 score; never the only signal, since the band is also text."
    }
  ],
  "dosDonts": {
    "dos": [
      "Place it directly under the password Input it scores and pass the live password value.",
      "Supply a real estimator such as zxcvbn through the score prop for sign-up flows.",
      "Keep the visible band text on; hide it only when space is truly constrained."
    ],
    "donts": [
      "Don't use the meter as the only statement of password requirements; list the rules too.",
      "Don't block submission on the meter alone; enforce policy server-side."
    ]
  },
  "related": [
    "input",
    "meter",
    "form"
  ],
  "examples": [
    {
      "title": "Default heuristic",
      "description": "The built-in scorer rewards length and character variety, mapping passwords onto five labeled bands."
    },
    {
      "title": "Custom scorer",
      "description": "Bring your own scoring function (for example zxcvbn) or hide the visible text while keeping the accessible value."
    }
  ],
  "guidance": {
    "useWhen": "A sign-up or password-change flow should give live feedback on password quality next to a password Input.",
    "avoidWhen": "You only need to state requirements; a description list under a password Input is simpler and less noisy.",
    "behavior": "Scores are clamped to 0–4 and mapped to Very weak through Very strong; the score prop replaces the default heuristic entirely.",
    "responsive": "The meter stretches to fill its container; the label and strength text stay on one row with space between."
  }
}
