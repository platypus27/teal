import { render, screen } from '@testing-library/react'
import { MarkdownView } from '../src/MarkdownView'

describe('MarkdownView', () => {
  it('renders headings at the right levels', () => {
    render(<MarkdownView content={'# Title\n\n## Section'} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
  })

  it('renders bold, italic, and inline code', () => {
    const { container } = render(<MarkdownView content={'**bold** and *italic* and `code`'} />)

    expect(screen.getByText('bold').tagName).toBe('STRONG')
    expect(screen.getByText('italic').tagName).toBe('EM')
    expect(screen.getByText('code').tagName).toBe('CODE')
    expect(container.querySelector('pre')).not.toBeInTheDocument()
  })

  it('renders safe links as anchors', () => {
    render(<MarkdownView content="See the [docs](https://example.com/docs) for details" />)

    expect(screen.getByRole('link', { name: 'docs' })).toHaveAttribute('href', 'https://example.com/docs')
  })

  it('does not create anchors for unsafe link targets', () => {
    render(<MarkdownView content="Click [here](javascript:alert(1)) now" />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/javascript:alert/)).toBeInTheDocument()
  })

  it('renders unordered and ordered lists', () => {
    render(<MarkdownView content={'- one\n- two\n\n1. first\n2. second'} />)

    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('renders fenced code blocks verbatim', () => {
    render(<MarkdownView content={'```\nconst x = **not bold**\n```'} />)

    expect(screen.getByText('const x = **not bold**')).toBeInTheDocument()
    expect(screen.queryByText('not bold', { selector: 'strong' })).not.toBeInTheDocument()
  })

  it('renders blockquotes', () => {
    const { container } = render(<MarkdownView content={'> Simplicity is a virtue'} />)

    expect(container.querySelector('blockquote')).toHaveTextContent('Simplicity is a virtue')
  })

  it('renders raw HTML as literal text', () => {
    const { container } = render(<MarkdownView content={'<img src=x onerror=alert(1)>'} />)

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>')
  })

  it('joins soft-wrapped paragraph lines with a space', () => {
    render(<MarkdownView content={'first line\nsecond line'} />)

    expect(screen.getByText('first line second line')).toBeInTheDocument()
  })

  describe('link safety', () => {
    it('accepts same-origin paths with exactly one leading slash', () => {
      render(<MarkdownView content="Go to the [docs](/docs/page) for details" />)

      expect(screen.getByRole('link', { name: 'docs' })).toHaveAttribute('href', '/docs/page')
    })

    it('accepts fragment links', () => {
      render(<MarkdownView content="Jump to the [overview](#overview) section" />)

      expect(screen.getByRole('link', { name: 'overview' })).toHaveAttribute('href', '#overview')
    })

    it('accepts mailto links', () => {
      render(<MarkdownView content="Email the [team](mailto:team@example.com) for help" />)

      expect(screen.getByRole('link', { name: 'team' })).toHaveAttribute('href', 'mailto:team@example.com')
    })

    it('rejects protocol-relative URLs that would navigate off-site', () => {
      render(<MarkdownView content="Click [login](//attacker.example/login) now" />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText(/\/\/attacker\.example\/login/)).toBeInTheDocument()
    })

    it('rejects backslash-prefixed URLs', () => {
      render(<MarkdownView content={'Open [x](/\\attacker.example) and [y](\\\\attacker.example)'} />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText(/\/\\attacker\.example/)).toBeInTheDocument()
      expect(screen.getByText(/\\\\attacker\.example/)).toBeInTheDocument()
    })

    it('rejects mixed-case and percent-encoded scheme tricks', () => {
      render(<MarkdownView content={'Run [a](JaVaScRiPt:alert(1)) or [b](%6Aavascript:alert(1))'} />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText(/JaVaScRiPt:alert/)).toBeInTheDocument()
      expect(screen.getByText(/%6Aavascript:alert/)).toBeInTheDocument()
    })

    it('adds rel="noopener noreferrer" to absolute links', () => {
      render(
        <MarkdownView content={'[a](https://example.com) [b](http://example.com) [c](mailto:team@example.com)'} />,
      )

      for (const name of ['a', 'b', 'c']) {
        expect(screen.getByRole('link', { name })).toHaveAttribute('rel', 'noopener noreferrer')
      }
    })

    it('does not add rel to same-origin or fragment links', () => {
      render(<MarkdownView content={'[a](/docs) [b](#section)'} />)

      expect(screen.getByRole('link', { name: 'a' })).not.toHaveAttribute('rel')
      expect(screen.getByRole('link', { name: 'b' })).not.toHaveAttribute('rel')
    })
  })
})
