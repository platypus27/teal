import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadProgress } from '../src/UploadProgress'

describe('UploadProgress', () => {
  it('renders the file name and a labeled determinate progressbar', () => {
    render(<UploadProgress fileName="report.pdf" progress={40} />)

    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    const bar = screen.getByRole('progressbar', { name: 'Uploading report.pdf' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
  })

  it('clamps out-of-range progress values', () => {
    render(<UploadProgress fileName="report.pdf" progress={150} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('formats and shows the file size', () => {
    render(<UploadProgress fileName="video.mp4" progress={10} size={1572864} />)

    expect(screen.getByText(/1\.5 MB/)).toBeInTheDocument()
  })

  it('supports a custom size formatter', () => {
    render(<UploadProgress fileName="video.mp4" progress={10} size={2048} formatSize={(bytes) => `${bytes} bytes`} />)

    expect(screen.getByText(/2048 bytes/)).toBeInTheDocument()
  })

  it('renders a cancel button that calls onCancel', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<UploadProgress fileName="report.pdf" progress={40} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancel upload of report.pdf' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('omits the cancel button without an onCancel handler', () => {
    render(<UploadProgress fileName="report.pdf" progress={40} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
