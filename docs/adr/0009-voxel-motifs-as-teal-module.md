# ADR-0009: Voxel motifs as a teal module

- Status: Accepted
- Date: 2026-10-13

## Context

The redesign-2026 program approved a voxel-world design language for the Kryv
ecosystem (ADR-0007). Within that language every product is a place in the
same world, with its own landmark: a striped lighthouse for home, a beacon
tripod for yang, a candlestick chart for trict, a firefly cluster for twinkle,
and two candidates for photos (spirit tree and windmill). These per-product
voxel motifs were prototyped as tiny isometric voxel builds in the throwaway
mockup `home/mockups/redesign-2026/voxel.js` and approved by the owner
(`shots/motifs-day.png`, `shots/motifs-night.png`). Production currently shows
plain icon glyphs in their place.

The motifs are product identities, not app-specific decoration: the same
lighthouse appears on home's rail, its settings hub, its empty states, and as
a thumbnail on launcher cards in every sibling app. Home's own AGENTS.md
requires evaluating a teal addition before building local alternatives, and
teal owns the design language — so the motif renderer belongs here, once,
rather than copied into five apps.

## Decision

Port the motif concept into teal as a new `VoxelMotif` module:

- **`src/voxel-motifs.ts`** — the motif registry as a typed data module:
  `VoxelCube` (`{ x, y, z, c, glow? }`), a `VoxelMotifId` union of the six
  approved ids, and `voxelMotifs` mapping each id to its cube list. The cube
  coordinates and colors are ported verbatim from the prototype so the output
  matches the approved mockup.
- **`src/VoxelMotif.tsx`** — a component rendering a cube map as one scalable
  `<svg>`: the prototype's isometric projection (TW=30/TH=15/CH=18), three
  polygons per cube with the 1.2/0.82/0.62 face shading, drop-shadow glows in
  the cube color, painter's-order paint back to front, and a viewBox computed
  from the cube bounds. Rendering is static: no animation, no layout
  measurement, no theme dependency — the literal voxel colors read on both
  themes per the approved night shots.
- **`LauncherCard` gains a `media` slot** — an optional block rendered above
  the icon/label row, which is where a motif thumbnail goes. Existing `icon`
  behavior is unchanged.

The mockup folder is explicitly throwaway: the geometry (cube maps,
projection constants, shading factors) is canonical and ported; the
DOM/clip-path rendering code is not — it is rebuilt as SVG so motifs scale
cleanly at any size and carry proper accessibility (`label` → `role="img"`,
otherwise `aria-hidden`).

## Consequences

- All five apps can render any product's motif from `@kryv/teal` with no
  local asset or renderer; per-app follow-ups replace glyph stand-ins with
  `VoxelMotif` where the redesign calls for them.
- The registry is closed: adding a motif means a teal release, which is
  deliberate — motifs are ecosystem identities, and teal versioning is the
  review gate for changing one.
- Photos keeps both approved candidates (`photos-tree`, `photos-windmill`)
  until the owner picks one; the rejected variant will be removed in a later
  major.
