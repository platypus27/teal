import { render, screen } from '@testing-library/react'
import { LauncherCard } from '../src/LauncherCard'

describe('LauncherCard media slot', () => {
  it('renders media as a block above the icon and label row', () => {
    render(
      <LauncherCard
        href="https://home.example"
        label="Home"
        icon={<svg data-testid="icon" />}
        media={<svg data-testid="media" />}
      />,
    )
    const media = screen.getByTestId('media')
    const icon = screen.getByTestId('icon')
    expect(media.compareDocumentPosition(icon) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('omits the media block when no media is provided', () => {
    const { container } = render(<LauncherCard href="https://home.example" label="Home" />)
    expect(container.querySelector('[data-slot="launcher-card-media"]')).not.toBeInTheDocument()
  })

  it('keeps icon-only rendering unchanged', () => {
    render(
      <LauncherCard
        href="https://photos.example"
        label="Photos"
        description="Household media and albums"
        icon={<svg data-testid="icon" />}
      />,
    )
    const link = screen.getByRole('link', { name: /Photos/ })
    expect(link).toHaveAttribute('href', 'https://photos.example')
    expect(link).toHaveTextContent('Household media and albums')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
