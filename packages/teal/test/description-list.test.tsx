import { render, screen } from '@testing-library/react'
import { DescriptionList } from '../src/DescriptionList'

const items = [
  { label: 'Owner', value: 'Avery Stone' },
  { label: 'Status', value: 'Active' },
  { label: 'Region', value: 'EU West' },
]

describe('DescriptionList', () => {
  it('renders every label and value as term/description pairs', () => {
    render(<DescriptionList items={items} />)

    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Avery Stone')).toBeInTheDocument()
    expect(screen.getAllByRole('term')).toHaveLength(3)
    expect(screen.getAllByRole('definition')).toHaveLength(3)
  })

  it('defaults to the stacked layout', () => {
    const { container } = render(<DescriptionList items={items} />)
    const list = container.querySelector('dl')
    expect(list).not.toHaveClass('teal-u-grid')
  })

  it('applies grid classes in the grid layout', () => {
    const { container } = render(<DescriptionList items={items} layout="grid" />)
    const list = container.querySelector('dl')
    expect(list).toHaveClass('teal-u-grid')
    expect(list).toHaveClass('sm:teal-u-grid-cols-2')
  })

  it('merges a caller className', () => {
    const { container } = render(<DescriptionList items={items} className="custom-class" />)
    expect(container.querySelector('dl')).toHaveClass('custom-class')
  })
})
