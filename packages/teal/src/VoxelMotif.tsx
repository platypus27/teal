import { forwardRef } from 'react'
import { cn } from './cn'
import { voxelMotifs, type VoxelCube, type VoxelMotifId } from './voxel-motifs'

export interface VoxelMotifProps {
  /** Which product motif to render. */
  motif: VoxelMotifId
  /**
   * Rendered width in pixels; height is derived from the motif's bounds so
   * proportions are preserved. Defaults to 96.
   */
  size?: number
  /**
   * Accessible name for the motif. When provided the SVG is exposed as an
   * image; when omitted it is hidden from assistive technology.
   */
  label?: string
  className?: string
}

// Isometric projection constants from the approved redesign-2026 prototype.
const TW = 30 // tile width
const TH = 15 // top rhombus height
const CH = 18 // cube height
const SIDE_H = CH + TH / 2

function shade(hex: string, factor: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) * factor))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) * factor))
  const b = Math.min(255, Math.max(0, (n & 255) * factor))
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`
}

function cubePoints(cube: VoxelCube, minP: number, maxZ: number) {
  const px = (cube.x - cube.y - minP) * (TW / 2)
  const py = (cube.x + cube.y) * (TH / 2) + (maxZ - 1 - cube.z) * CH
  const cx = px + TW / 2
  return {
    top: `${cx},${py} ${px + TW},${py + TH / 2} ${cx},${py + TH} ${px},${py + TH / 2}`,
    left: `${px},${py + TH / 2} ${cx},${py + TH} ${cx},${py + TH + CH} ${px},${py + TH / 2 + CH}`,
    right: `${cx},${py + TH} ${px + TW},${py + TH / 2} ${px + TW},${py + TH / 2 + CH} ${cx},${py + TH + CH}`,
  }
}

export const VoxelMotif = forwardRef<SVGSVGElement, VoxelMotifProps>(function VoxelMotif(
  { motif, size = 96, label, className },
  ref,
) {
  const cubes = voxelMotifs[motif]
  const minP = Math.min(...cubes.map((c) => c.x - c.y))
  const maxP = Math.max(...cubes.map((c) => c.x - c.y))
  const maxD = Math.max(...cubes.map((c) => c.x + c.y))
  const maxZ = Math.max(...cubes.map((c) => c.z)) + 1
  const width = (maxP - minP) * (TW / 2) + TW
  const height = maxD * (TH / 2) + maxZ * CH + SIDE_H

  // Painter's order: back to front.
  const sorted = [...cubes].sort((a, b) => a.x + a.y - (b.x + b.y) || a.z - b.z)

  return (
    <svg
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      width={size}
      height={(size * height) / width}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('teal-u-block', className)}
    >
      {sorted.map((cube, index) => {
        const points = cubePoints(cube, minP, maxZ)
        return (
          <g key={index} style={cube.glow ? { filter: `drop-shadow(0 0 8px ${cube.c})` } : undefined}>
            <polygon points={points.top} fill={shade(cube.c, 1.2)} />
            <polygon points={points.left} fill={shade(cube.c, 0.82)} />
            <polygon points={points.right} fill={shade(cube.c, 0.62)} />
          </g>
        )
      })}
    </svg>
  )
})
