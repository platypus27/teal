---
'@kryv/teal': minor
---

Add ecosystem feedback modules for Kryv Home (WP1).

- `NotificationItem`: sanitized inbox row with severity indicator, source application label, timestamp, read-state emphasis with an announced unread marker, deep link, and mute/archive controls that touch delivery state only.
- `HealthIndicator`: explicit ecosystem health badge covering healthy, degraded, down, stale, unknown, and checking — health is never inferred from missing evidence.
- `StepUpNotice`: inline warning built on `Alert` that explains a required fresh verification and hosts a caller-supplied action; it never starts verification itself.

All three ship with unit and axe coverage and documented module pages.
