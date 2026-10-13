/**
 * Voxel motif registry — the per-product landmarks of the voxel-world design
 * language (ADR-0009). Cube geometry is ported verbatim from the approved
 * redesign-2026 prototype (`home/mockups/redesign-2026/voxel.js`) so the
 * rendered builds match the mockups pixel-for-geometry.
 */

/** One voxel: grid position (z stacks upward), hex face color, optional glow. */
export interface VoxelCube {
  x: number
  y: number
  z: number
  /** Face color as a lowercase hex string, e.g. `#0f6a6c`. */
  c: string
  /** Render the cube with a drop-shadow glow in its own color. */
  glow?: boolean
}

/** The six approved product motif identifiers. */
export type VoxelMotifId = 'home' | 'photos-tree' | 'photos-windmill' | 'yang' | 'trict' | 'twinkle'

/** Ground plate of grass/sand cubes, shared by every motif. */
export function plate(size: number, { grass = '#7cb25c', sand = '#e0cf9e' } = {}): VoxelCube[] {
  const cubes: VoxelCube[] = []
  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++) {
      const edge = x === 0 || y === 0 || x === size - 1 || y === size - 1
      cubes.push({ x, y, z: 0, c: edge ? sand : grass })
    }
  return cubes
}

/** Cube lists keyed by motif id. Coordinates on a small grid; z stacks upward. */
export const voxelMotifs: Record<VoxelMotifId, VoxelCube[]> = {
  // Home — striped lighthouse on a rock
  home: [
    ...plate(4),
    { x: 1, y: 1, z: 1, c: '#8a8f96' }, { x: 2, y: 1, z: 1, c: '#8a8f96' },
    { x: 1, y: 2, z: 1, c: '#8a8f96' }, { x: 2, y: 2, z: 1, c: '#8a8f96' },
    { x: 1, y: 1, z: 2, c: '#f2ede0' }, { x: 1, y: 1, z: 3, c: '#0f6a6c' },
    { x: 1, y: 1, z: 4, c: '#f2ede0' }, { x: 1, y: 1, z: 5, c: '#0f6a6c' },
    { x: 1, y: 1, z: 6, c: '#ffd66b', glow: true },
  ],

  // Photos — option A: cherry spirit tree
  'photos-tree': [
    ...plate(4),
    { x: 1, y: 1, z: 1, c: '#6d4a2f' }, { x: 1, y: 1, z: 2, c: '#6d4a2f' },
    { x: 1, y: 1, z: 3, c: '#e89bb4' }, { x: 2, y: 1, z: 3, c: '#e89bb4' },
    { x: 1, y: 2, z: 3, c: '#e89bb4' }, { x: 0, y: 1, z: 3, c: '#d16a8f' },
    { x: 1, y: 0, z: 3, c: '#d16a8f' }, { x: 2, y: 2, z: 3, c: '#d16a8f' },
    { x: 1, y: 1, z: 4, c: '#f0b9cc' },
  ],

  // Photos — option B: windmill
  'photos-windmill': [
    ...plate(4),
    { x: 1, y: 1, z: 1, c: '#e8dfc8' }, { x: 1, y: 1, z: 2, c: '#e8dfc8' },
    { x: 1, y: 1, z: 3, c: '#8a5a3b' },
    { x: 1, y: 1, z: 4, c: '#c25e7e' }, { x: 2, y: 1, z: 3, c: '#c25e7e' },
    { x: 0, y: 1, z: 3, c: '#c25e7e' }, { x: 1, y: 0, z: 3, c: '#c25e7e' },
    { x: 1, y: 2, z: 3, c: '#c25e7e' },
  ],

  // Yang — beacon tripod, amber light
  yang: [
    ...plate(4),
    { x: 0, y: 1, z: 1, c: '#4c565e' }, { x: 2, y: 1, z: 1, c: '#4c565e' },
    { x: 1, y: 0, z: 1, c: '#4c565e' }, { x: 1, y: 2, z: 1, c: '#4c565e' },
    { x: 1, y: 1, z: 1, c: '#5d686f' }, { x: 1, y: 1, z: 2, c: '#5d686f' },
    { x: 1, y: 1, z: 3, c: '#f5b14c', glow: true },
  ],

  // Trict — candlestick chart on a plinth
  trict: [
    ...plate(4),
    { x: 0, y: 2, z: 1, c: '#2e7d4f' },
    { x: 1, y: 2, z: 1, c: '#c2503c' }, { x: 1, y: 2, z: 2, c: '#c2503c' },
    { x: 2, y: 2, z: 1, c: '#2e7d4f' }, { x: 2, y: 2, z: 2, c: '#2e7d4f' }, { x: 2, y: 2, z: 3, c: '#2e7d4f' },
    { x: 3, y: 2, z: 1, c: '#2e7d4f' }, { x: 3, y: 2, z: 2, c: '#2e7d4f' },
    { x: 3, y: 2, z: 3, c: '#ffd66b', glow: true },
  ],

  // Twinkle — floating firefly star cluster
  twinkle: [
    ...plate(4),
    { x: 1, y: 1, z: 2, c: '#6d5bd0' },
    { x: 1, y: 1, z: 3, c: '#a78bfa', glow: true },
    { x: 2, y: 1, z: 2, c: '#a78bfa', glow: true },
    { x: 0, y: 2, z: 3, c: '#a78bfa', glow: true },
    { x: 1, y: 0, z: 2, c: '#8b76e8' },
    { x: 2, y: 2, z: 4, c: '#ffd66b', glow: true },
  ],
}
