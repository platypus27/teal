import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface QrCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name for the code; defaults to "QR code". */
  label?: string
  /** Error-correction level. Only "L" (~7% recovery) is currently supported. */
  level?: 'L'
  /** Quiet-zone width in modules. */
  margin?: number
  /** Rendered size in pixels. */
  size?: number
  /** Text to encode; UTF-8 byte mode, up to 343 bytes. */
  value: string
}

// --- Minimal QR encoder: byte mode, error-correction level L, versions 1-10 ---

const EC_CODEWORDS_L = [7, 10, 15, 20, 26, 18, 20, 24, 30, 18]

// [block count, data codewords per block] groups per version (level L)
const BLOCKS_L: Array<Array<[number, number]>> = [
  [[1, 19]],
  [[1, 34]],
  [[1, 55]],
  [[1, 80]],
  [[1, 108]],
  [[2, 68]],
  [[2, 78]],
  [[2, 97]],
  [[2, 116]],
  [
    [2, 86],
    [2, 87],
  ],
]

const ALIGNMENT_POSITIONS: Array<Array<number>> = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
]

const GF_EXP = new Array<number>(512)
const GF_LOG = new Array<number>(256).fill(0)
{
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if ((x & 0x100) !== 0) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]!
}

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a]! + GF_LOG[b]!]!
}

function rsGenerator(degree: number): Array<number> {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] = next[j]! ^ gfMultiply(poly[j]!, GF_EXP[i]!)
      next[j + 1] = next[j + 1]! ^ poly[j]!
    }
    poly = next
  }
  return poly
}

function rsEncode(data: Array<number>, degree: number): Array<number> {
  const generator = rsGenerator(degree)
  const result = data.concat(new Array<number>(degree).fill(0))
  for (let i = 0; i < data.length; i++) {
    const coefficient = result[i]!
    if (coefficient === 0) continue
    for (let j = 0; j < generator.length; j++) {
      result[i + j] = result[i + j]! ^ gfMultiply(generator[generator.length - 1 - j]!, coefficient)
    }
  }
  return result.slice(data.length)
}

function chooseVersion(byteCount: number): number {
  for (let version = 1; version <= 10; version++) {
    const totalData = BLOCKS_L[version - 1]!.reduce((sum, [count, length]) => sum + count * length, 0)
    const countBits = version >= 10 ? 16 : 8
    if (4 + countBits + byteCount * 8 <= totalData * 8) return version
  }
  throw new Error('QrCode: value is too long to encode (max 343 UTF-8 bytes)')
}

function buildDataCodewords(bytes: Array<number>, version: number): Array<number> {
  const totalData = BLOCKS_L[version - 1]!.reduce((sum, [count, length]) => sum + count * length, 0)
  const bits: Array<number> = []
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1)
  }
  push(0b0100, 4) // byte mode indicator
  push(bytes.length, version >= 10 ? 16 : 8)
  for (const byte of bytes) push(byte, 8)
  const capacity = totalData * 8
  for (let i = 0; i < 4 && bits.length < capacity; i++) bits.push(0)
  while (bits.length % 8 !== 0) bits.push(0)
  const codewords: Array<number> = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j]!
    codewords.push(byte)
  }
  const pads = [0xec, 0x11]
  for (let i = 0; codewords.length < totalData; i++) codewords.push(pads[i % 2]!)
  return codewords
}

function interleave(data: Array<number>, version: number): Array<number> {
  const ecLength = EC_CODEWORDS_L[version - 1]!
  const blocks: Array<Array<number>> = []
  const ecc: Array<Array<number>> = []
  let offset = 0
  for (const [count, length] of BLOCKS_L[version - 1]!) {
    for (let b = 0; b < count; b++) {
      const block = data.slice(offset, offset + length)
      offset += length
      blocks.push(block)
      ecc.push(rsEncode(block, ecLength))
    }
  }
  const result: Array<number> = []
  const maxLength = Math.max(...blocks.map((block) => block.length))
  for (let i = 0; i < maxLength; i++) {
    for (const block of blocks) if (i < block.length) result.push(block[i]!)
  }
  for (let i = 0; i < ecLength; i++) {
    for (const block of ecc) result.push(block[i]!)
  }
  return result
}

type MaskFn = (row: number, col: number) => boolean

const MASKS: Array<MaskFn> = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

function bchBits(data: number, dataBits: number, generator: number): number {
  let remainder = data << (generator.toString(2).length - 1)
  const generatorBits = generator.toString(2).length - 1
  for (let i = dataBits - 1; i >= 0; i--) {
    if (((remainder >>> (i + generatorBits)) & 1) !== 0) remainder ^= generator << i
  }
  return ((data << generatorBits) | (remainder & ((1 << generatorBits) - 1))) >>> 0
}

function formatInfoBits(mask: number): number {
  // Level L = 01
  return bchBits((0b01 << 3) | mask, 5, 0x537) ^ 0x5412
}

function versionInfoBits(version: number): number {
  return bchBits(version, 6, 0x1f25)
}

interface Matrix {
  modules: Array<Array<boolean>>
  reserved: Array<Array<boolean>>
  size: number
}

function emptyMatrix(version: number): Matrix {
  const size = version * 4 + 17
  return {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    reserved: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  }
}

function setCell(matrix: Matrix, row: number, col: number, dark: boolean) {
  matrix.modules[row]![col] = dark
  matrix.reserved[row]![col] = true
}

function setupFinder(matrix: Matrix, row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r
      const cc = col + c
      if (rr < 0 || rr >= matrix.size || cc < 0 || cc >= matrix.size) continue
      const inRing = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6)
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4
      setCell(matrix, rr, cc, inRing || inCore)
    }
  }
}

function setupAlignment(matrix: Matrix, version: number) {
  const positions = ALIGNMENT_POSITIONS[version - 1]!
  for (const row of positions) {
    for (const col of positions) {
      // Skip the corners covered by finder patterns
      if (matrix.reserved[row]![col]) continue
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          setCell(matrix, row + r, col + c, Math.max(Math.abs(r), Math.abs(c)) !== 1)
        }
      }
    }
  }
}

function setupTiming(matrix: Matrix) {
  for (let i = 8; i < matrix.size - 8; i++) {
    const dark = i % 2 === 0
    if (!matrix.reserved[6]![i]) setCell(matrix, 6, i, dark)
    if (!matrix.reserved[i]![6]) setCell(matrix, i, 6, dark)
  }
}

function reserveFormatInfo(matrix: Matrix, version: number) {
  const size = matrix.size
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      matrix.reserved[8]![i] = true
      matrix.reserved[i]![8] = true
    }
  }
  for (let i = 0; i < 8; i++) {
    matrix.reserved[8]![size - 1 - i] = true
    matrix.reserved[size - 1 - i]![8] = true
  }
  // Dark module
  setCell(matrix, size - 8, 8, true)
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      matrix.reserved[Math.floor(i / 3)]![(i % 3) + size - 11] = true
      matrix.reserved[(i % 3) + size - 11]![Math.floor(i / 3)] = true
    }
  }
}

function placeVersionInfo(matrix: Matrix, version: number) {
  if (version < 7) return
  const size = matrix.size
  const bits = versionInfoBits(version)
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) !== 0
    matrix.modules[Math.floor(i / 3)]![(i % 3) + size - 11] = dark
    matrix.modules[(i % 3) + size - 11]![Math.floor(i / 3)] = dark
  }
}

function placeData(matrix: Matrix, codewords: Array<number>, mask: MaskFn) {
  const bits: Array<number> = []
  for (const codeword of codewords) {
    for (let i = 7; i >= 0; i--) bits.push((codeword >>> i) & 1)
  }
  const size = matrix.size
  let bitIndex = 0
  let upward = true
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step
      for (const c of [col, col - 1]) {
        if (matrix.reserved[row]![c]) continue
        const bit = bitIndex < bits.length ? bits[bitIndex]! : 0
        bitIndex++
        matrix.modules[row]![c] = (bit === 1) !== mask(row, c)
      }
    }
    upward = !upward
  }
}

function placeFormatInfo(matrix: Matrix, mask: number) {
  const size = matrix.size
  const bits = formatInfoBits(mask)
  for (let i = 0; i < 15; i++) {
    const dark = ((bits >>> i) & 1) !== 0
    // Vertical copy around the top-left finder, continuing down the left edge
    if (i < 6) matrix.modules[i]![8] = dark
    else if (i < 8) matrix.modules[i + 1]![8] = dark
    else matrix.modules[size - 15 + i]![8] = dark
    // Horizontal copy, continuing across the top edge
    if (i < 8) matrix.modules[8]![size - i - 1] = dark
    else if (i < 9) matrix.modules[8]![15 - i] = dark
    else matrix.modules[8]![14 - i] = dark
  }
  matrix.modules[size - 8]![8] = true
}

function penaltyScore(modules: Array<Array<boolean>>): number {
  const size = modules.length
  let score = 0
  // Adjacent runs of five or more in rows and columns
  for (let row = 0; row < size; row++) {
    let col = 0
    while (col < size) {
      let run = 1
      while (col + run < size && modules[row]![col + run] === modules[row]![col]) run++
      if (run >= 5) score += 3 + (run - 5)
      col += run
    }
  }
  for (let col = 0; col < size; col++) {
    let row = 0
    while (row < size) {
      let run = 1
      while (row + run < size && modules[row + run]![col] === modules[row]![col]) run++
      if (run >= 5) score += 3 + (run - 5)
      row += run
    }
  }
  // 2x2 blocks of the same color
  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const cell = modules[row]![col]
      if (modules[row]![col + 1] === cell && modules[row + 1]![col] === cell && modules[row + 1]![col + 1] === cell) score += 3
    }
  }
  // Finder-like patterns in rows and columns
  const pattern1 = [true, false, true, true, true, false, true, false, false, false, false]
  const pattern2 = [false, false, false, false, true, false, true, true, true, false, true]
  const matchesPattern = (line: Array<boolean>, start: number) => {
    const a = pattern1.every((value, offset) => line[start + offset] === value)
    const b = pattern2.every((value, offset) => line[start + offset] === value)
    return a || b
  }
  for (let row = 0; row < size; row++) {
    const line = modules[row]!
    for (let col = 0; col + 11 <= size; col++) if (matchesPattern(line, col)) score += 40
  }
  for (let col = 0; col < size; col++) {
    const line = modules.map((rowCells) => rowCells[col]!)
    for (let row = 0; row + 11 <= size; row++) if (matchesPattern(line, row)) score += 40
  }
  // Dark module proportion
  let dark = 0
  for (const rowCells of modules) for (const cell of rowCells) if (cell) dark++
  const percent = (dark * 100) / (size * size)
  score += Math.floor(Math.abs(percent - 50) / 5) * 10
  return score
}

/** Encodes a string into a QR module matrix (true = dark). Exported for tests; prefer the QrCode component. */
export function encodeQrMatrix(value: string): Array<Array<boolean>> {
  const bytes = Array.from(new TextEncoder().encode(value))
  const version = chooseVersion(bytes.length)
  const codewords = interleave(buildDataCodewords(bytes, version), version)

  const base = emptyMatrix(version)
  setupFinder(base, 0, 0)
  setupFinder(base, base.size - 7, 0)
  setupFinder(base, 0, base.size - 7)
  setupAlignment(base, version)
  setupTiming(base)
  reserveFormatInfo(base, version)

  let best: Array<Array<boolean>> | null = null
  let bestScore = Infinity
  for (let mask = 0; mask < 8; mask++) {
    const candidate: Matrix = {
      size: base.size,
      modules: base.modules.map((row) => row.slice()),
      reserved: base.reserved.map((row) => row.slice()),
    }
    placeData(candidate, codewords, MASKS[mask]!)
    placeFormatInfo(candidate, mask)
    placeVersionInfo(candidate, version)
    const score = penaltyScore(candidate.modules)
    if (score < bestScore) {
      bestScore = score
      best = candidate.modules
    }
  }
  return best!
}

function matrixToPath(modules: Array<Array<boolean>>, margin: number): string {
  const parts: Array<string> = []
  for (let row = 0; row < modules.length; row++) {
    let col = 0
    while (col < modules.length) {
      if (!modules[row]![col]) {
        col++
        continue
      }
      let run = 1
      while (col + run < modules.length && modules[row]![col + run]) run++
      parts.push(`M${col + margin} ${row + margin}h${run}v1h${-run}z`)
      col += run
    }
  }
  return parts.join('')
}

// --- Component ---

export const QrCode = forwardRef<HTMLDivElement, QrCodeProps>(function QrCode(
  { className, label = 'QR code', level = 'L', margin = 4, size = 160, value, ...props },
  ref,
) {
  // Accepted for API stability; only level "L" is currently implemented, so the
  // encoder does not consume it.
  void level

  const matrix = useMemo(() => encodeQrMatrix(value), [value])
  const dimension = matrix.length + margin * 2
  const path = matrixToPath(matrix, margin)

  return (
    <div ref={ref} className={cn('teal-u-inline-flex', className)} {...props}>
      <svg
        role="img"
        aria-label={label}
        width={size}
        height={size}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="teal-u-block teal-u-text-on-surface"
      >
        <rect width={dimension} height={dimension} className="teal-u-fill-surface-container-lowest" />
        <path d={path} fill="currentColor" />
      </svg>
    </div>
  )
})
