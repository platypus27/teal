import { render, screen } from '@testing-library/react'
import { AspectRatio } from '../src/AspectRatio'

describe('AspectRatio', () => {
  it('renders its child content', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img src="/photo.png" alt="A scenic view" />
      </AspectRatio>,
    )

    expect(screen.getByRole('img', { name: 'A scenic view' })).toBeInTheDocument()
  })

  it('applies the ratio as a padding-bottom spacer', () => {
    const { container } = render(
      <AspectRatio ratio={2}>
        <div>Wide</div>
      </AspectRatio>,
    )

    expect(container.querySelector('[style*="padding-bottom: 50%"]')).not.toBeNull()
  })

  it('merges a caller className', () => {
    render(
      <AspectRatio ratio={1} data-testid="ratio" className="teal-u-mt-4">
        <div>Square</div>
      </AspectRatio>,
    )

    expect(screen.getByTestId('ratio').className).toContain('teal-u-mt-4')
  })
})
