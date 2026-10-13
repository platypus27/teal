import { render, screen } from '@testing-library/react'
import { VoxelMotif } from '../src/VoxelMotif'
import { voxelMotifs, type VoxelMotifId } from '../src/voxel-motifs'

const MOTIF_IDS: VoxelMotifId[] = ['home', 'photos-tree', 'photos-windmill', 'yang', 'trict', 'twinkle']

// Independent restatement of the prototype's face-shading algorithm
// (home/mockups/redesign-2026/voxel.js): multiply channels, clamp, floor.
function shade(hex: string, factor: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) * factor))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) * factor))
  const b = Math.min(255, Math.max(0, (n & 255) * factor))
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`
}

function renderMotif(motif: VoxelMotifId, props: Record<string, unknown> = {}) {
  const { container } = render(<VoxelMotif motif={motif} {...props} />)
  return container.querySelector('svg')!
}

describe('voxelMotifs registry', () => {
  it('covers exactly the six approved product motifs', () => {
    expect(Object.keys(voxelMotifs).sort()).toEqual([...MOTIF_IDS].sort())
  })

  it('lists well-formed cubes for every motif', () => {
    for (const id of MOTIF_IDS) {
      const cubes = voxelMotifs[id]
      expect(cubes.length, id).toBeGreaterThan(0)
      for (const cube of cubes) {
        expect(Number.isInteger(cube.x), id).toBe(true)
        expect(Number.isInteger(cube.y), id).toBe(true)
        expect(Number.isInteger(cube.z), id).toBe(true)
        expect(cube.c, id).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })
})

describe('VoxelMotif', () => {
  it('renders one SVG with three face polygons per cube', () => {
    for (const id of MOTIF_IDS) {
      const svg = renderMotif(id)
      expect(svg.querySelectorAll('polygon'), id).toHaveLength(voxelMotifs[id].length * 3)
    }
  })

  it('paints cubes back to front, sorted by x + y then z', () => {
    const svg = renderMotif('home')
    const topFaces = [...svg.querySelectorAll('polygon')].filter((_, index) => index % 3 === 0)
    const sorted = [...voxelMotifs.home].sort((a, b) => a.x + a.y - (b.x + b.y) || a.z - b.z)
    expect(topFaces.map((face) => face.getAttribute('fill'))).toEqual(
      sorted.map((cube) => shade(cube.c, 1.2)),
    )
  })

  it('shades the top, left, and right faces by 1.2, 0.82, and 0.62', () => {
    // Home lighthouse tower teal cube #0f6a6c at (1, 1, 3): painted after the
    // (1, 1) ground/rock stack and the (1, 1, 2) stripe, before any x+y > 2 cube.
    const svg = renderMotif('home')
    const fills = [...svg.querySelectorAll('polygon')].map((face) => face.getAttribute('fill'))
    const topIndex = fills.indexOf(shade('#0f6a6c', 1.2))
    expect(topIndex).toBeGreaterThan(-1)
    expect(fills[topIndex + 1]).toBe(shade('#0f6a6c', 0.82))
    expect(fills[topIndex + 2]).toBe(shade('#0f6a6c', 0.62))
  })

  it('gives glowing cubes a drop-shadow in their own color', () => {
    const svg = renderMotif('home')
    const glow = [...svg.querySelectorAll('g')].find((g) => g.style.filter.includes('drop-shadow'))
    expect(glow).toBeDefined()
    expect(glow!.style.filter).toContain('#ffd66b')
  })

  it('is hidden from assistive technology without a label', () => {
    const svg = renderMotif('yang')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('exposes the label as an accessible image name when provided', () => {
    render(<VoxelMotif motif="home" label="Home lighthouse motif" />)
    expect(screen.getByRole('img', { name: 'Home lighthouse motif' })).toBeInTheDocument()
  })

  it('scales to the requested width with height derived from the motif bounds', () => {
    const svg = renderMotif('trict', { size: 120 })
    expect(svg).toHaveAttribute('width', '120')
    const parts = svg.getAttribute('viewBox')!.split(' ').map(Number)
    const vbWidth = parts[2]!
    const vbHeight = parts[3]!
    expect(Number(svg.getAttribute('height'))).toBeCloseTo((120 * vbHeight) / vbWidth, 5)
  })

  it('computes the viewBox from the cube bounds', () => {
    const svg = renderMotif('home')
    // From the prototype projection (TW=30, TH=15, CH=18): home spans
    // x-y in [-3, 3] → width 120, maxD=6, maxZ=7 → height 6*7.5 + 7*18 + 25.5 = 196.5
    expect(svg).toHaveAttribute('viewBox', '0 0 120 196.5')
  })
})
