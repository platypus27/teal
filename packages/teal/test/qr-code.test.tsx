import { render, screen } from '@testing-library/react'
import { QrCode, encodeQrMatrix } from '../src/QrCode'

describe('QrCode', () => {
  it('renders an SVG with an accessible name', () => {
    render(<QrCode value="https://example.com" label="QR code for example.com" />)

    expect(screen.getByRole('img', { name: 'QR code for example.com' })).toBeInTheDocument()
  })

  it('uses a default label and size', () => {
    render(<QrCode value="hello" />)

    const svg = screen.getByRole('img', { name: 'QR code' })
    expect(svg).toHaveAttribute('width', '160')
    expect(svg).toHaveAttribute('height', '160')
  })

  it('renders dark modules as a single path inside the quiet zone', () => {
    render(<QrCode value="HELLO WORLD" />)

    const svg = screen.getByRole('img', { name: 'QR code' })
    expect(svg).toHaveAttribute('viewBox', '0 0 29 29') // 21 modules + 4-module margin each side
    const path = svg.querySelector('path')
    expect(path?.getAttribute('d')).toContain('M4 4h7v1h-7z') // top-left finder, offset by the margin
  })

  it('respects a custom size and margin', () => {
    render(<QrCode value="HELLO WORLD" size={320} margin={2} />)

    const svg = screen.getByRole('img', { name: 'QR code' })
    expect(svg).toHaveAttribute('width', '320')
    expect(svg).toHaveAttribute('viewBox', '0 0 25 25')
  })

  it('encodes a verified v1-L matrix for HELLO WORLD', () => {
    // Golden values cross-checked by decoding with OpenCV's QRCodeDetector.
    const matrix = encodeQrMatrix('HELLO WORLD')

    expect(matrix).toHaveLength(21)
    expect(matrix.flat().filter(Boolean)).toHaveLength(230)
    expect(matrix[0]!.map((cell) => (cell ? '1' : '0')).join('')).toBe('111111101011101111111')
    expect(matrix[13]!.map((cell) => (cell ? '1' : '0')).join('')).toBe('000000001101001100101')
  })

  it('grows the matrix for longer values', () => {
    expect(encodeQrMatrix('a'.repeat(120))).toHaveLength(41) // version 6
    expect(encodeQrMatrix('汉字 unicode ✓')).toHaveLength(25) // version 2, UTF-8 byte mode
  })

  it('throws for values beyond byte-mode capacity', () => {
    expect(() => encodeQrMatrix('a'.repeat(400))).toThrow(/too long/)
  })
})
