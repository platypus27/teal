import { render } from '@testing-library/react'
import { HighlightText } from '../src/HighlightText'

describe('HighlightText', () => {
  it('renders the plain text when the query is empty', () => {
    const { container } = render(<HighlightText text="quarterly report" query="" />)

    expect(container).toHaveTextContent('quarterly report')
    expect(container.querySelector('mark')).not.toBeInTheDocument()
  })

  it('wraps every case-insensitive match in a mark element', () => {
    render(<HighlightText text="Report the REPORT to the reporter" query="report" />)

    const marks = document.querySelectorAll('mark')
    expect(marks).toHaveLength(3)
    expect(marks[0]).toHaveTextContent('Report')
    expect(marks[1]).toHaveTextContent('REPORT')
    expect(marks[2]).toHaveTextContent('report')
  })

  it('preserves the full text content', () => {
    const { container } = render(<HighlightText text="alpha beta gamma beta" query="beta" />)

    expect(container).toHaveTextContent('alpha beta gamma beta')
  })

  it('treats regex characters in the query as literal text', () => {
    const { container } = render(<HighlightText text="price is 10.00 (net)" query="10.00 (net)" />)

    expect(container.querySelector('mark')).toHaveTextContent('10.00 (net)')
  })

  it('renders no marks when the query does not match', () => {
    const { container } = render(<HighlightText text="nothing to see" query="absent" />)

    expect(container.querySelector('mark')).not.toBeInTheDocument()
    expect(container).toHaveTextContent('nothing to see')
  })

  it('renders adjacent matches without dropping text', () => {
    const { container } = render(<HighlightText text="aaa" query="a" />)

    expect(container.querySelectorAll('mark')).toHaveLength(3)
    expect(container).toHaveTextContent('aaa')
  })
})
