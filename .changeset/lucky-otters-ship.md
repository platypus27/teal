---
'@kryv/teal': minor
---

Ship a `"use client"` directive on every dist module so React Server Component
consumers (Next.js App Router and friends) can import components from server
files, and guard the directive in the packed-package verification.
