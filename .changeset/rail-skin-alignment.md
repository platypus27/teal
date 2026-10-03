---
"@kryv/teal": patch
---

Align the EcosystemShell rail skin with Home's rendered rail: adopt Home's glass surface recipe values (2px primary border at 25%, 1px primary outline ring at 10%, 16px radius, translucent white background over a 12px backdrop blur, deep drop shadow, 55% black background in dark mode). Teal 1.1.0 shipped the pre-recipe override values (32px radius, 24px blur, 1px border), so yang/trict/photos rendered a subtly different pill than Home; with this patch all consumers render Home's production rail exactly.
