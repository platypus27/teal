import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '../src/FileUpload'

describe('FileUpload', () => {
  it('renders the label, dropzone copy, and browse button', () => {
    render(<FileUpload label="Attachments" description="Up to 10 MB per file" />)
    expect(screen.getByText('Attachments')).toBeInTheDocument()
    expect(screen.getByText('Drag files here or browse')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument()
    expect(screen.getByText('Up to 10 MB per file')).toBeInTheDocument()
  })

  it('adds files chosen through the input and lists them with formatted sizes', async () => {
    const user = userEvent.setup()
    const onFilesAdded = vi.fn()
    const onValueChange = vi.fn()
    render(<FileUpload label="Attachments" multiple onFilesAdded={onFilesAdded} onValueChange={onValueChange} />)

    const input = screen.getByLabelText('Attachments')
    const small = new File(['a'.repeat(512)], 'notes.txt', { type: 'text/plain' })
    const large = new File(['a'.repeat(2048)], 'report.pdf', { type: 'application/pdf' })
    await user.upload(input, [small, large])

    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(onFilesAdded.mock.calls[0]?.[0]).toHaveLength(2)
    expect(onValueChange).toHaveBeenLastCalledWith([
      { name: 'notes.txt', size: 512 },
      { name: 'report.pdf', size: 2048 },
    ])
    expect(screen.getByText('notes.txt')).toBeInTheDocument()
    expect(screen.getByText('512 B')).toBeInTheDocument()
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.0 KB')).toBeInTheDocument()
  })

  it('removes a file via its remove button', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FileUpload label="Attachments" multiple onValueChange={onValueChange} />)

    const input = screen.getByLabelText('Attachments')
    await user.upload(input, [
      new File(['a'], 'one.txt'),
      new File(['b'], 'two.txt'),
    ])
    await user.click(screen.getByRole('button', { name: 'Remove one.txt' }))

    expect(onValueChange).toHaveBeenLastCalledWith([{ name: 'two.txt', size: 1 }])
    expect(screen.queryByText('one.txt')).not.toBeInTheDocument()
    expect(screen.getByText('two.txt')).toBeInTheDocument()
  })

  it('highlights the dropzone while dragging over it', () => {
    render(<FileUpload label="Attachments" />)
    const dropzone = screen.getByText('Drag files here or browse').parentElement
    expect(dropzone).not.toBeNull()
    expect(dropzone).not.toHaveClass('teal-u-border-primary')

    fireEvent.dragOver(dropzone!)
    expect(dropzone).toHaveClass('teal-u-border-primary')
    expect(dropzone).toHaveClass('teal-u-bg-primary/5')

    fireEvent.dragLeave(dropzone!)
    expect(dropzone).not.toHaveClass('teal-u-border-primary')
  })

  it('adds dropped files', () => {
    const onFilesAdded = vi.fn()
    render(<FileUpload label="Attachments" onFilesAdded={onFilesAdded} />)
    const dropzone = screen.getByText('Drag files here or browse').parentElement

    fireEvent.drop(dropzone!, { dataTransfer: { files: [new File(['a'.repeat(1024 * 1024)], 'assets.zip')] } })
    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(screen.getByText('assets.zip')).toBeInTheDocument()
    expect(screen.getByText('1.0 MB')).toBeInTheDocument()
  })

  it('supports a controlled file list', () => {
    render(<FileUpload label="Attachments" value={[{ name: 'brief.docx', size: 100 }]} />)
    expect(screen.getByText('brief.docx')).toBeInTheDocument()
    expect(screen.getByText('100 B')).toBeInTheDocument()
  })
})
