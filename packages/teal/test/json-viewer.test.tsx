import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JsonViewer } from '../src/JsonViewer'

const data = {
  name: 'teal',
  version: 5,
  stable: true,
  license: null,
  tags: ['design', 'system'],
  author: { name: 'Ada', active: true },
}

describe('JsonViewer', () => {
  it('renders the root expanded and nested containers collapsed by default', () => {
    render(<JsonViewer data={data} />)

    expect(screen.getByText('"teal"')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle $' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Toggle author' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('"Ada"')).not.toBeInTheDocument()
  })

  it('expands and collapses a nested object', async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={data} />)

    const toggle = screen.getByRole('button', { name: 'Toggle author' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('"Ada"')).toBeInTheDocument()

    await user.click(toggle)
    expect(screen.queryByText('"Ada"')).not.toBeInTheDocument()
  })

  it('respects defaultExpandedDepth', () => {
    render(<JsonViewer data={data} defaultExpandedDepth={2} />)

    expect(screen.getByRole('button', { name: 'Toggle author' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('"Ada"')).toBeInTheDocument()
  })

  it('renders primitive values of every type', () => {
    render(<JsonViewer data={data} defaultExpandedDepth={3} />)

    expect(screen.getByText('"teal"')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getAllByText('true').length).toBeGreaterThan(0)
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('shows a key-count summary on collapsed containers', () => {
    render(<JsonViewer data={data} />)

    expect(screen.getByText('[2 items]')).toBeInTheDocument()
    expect(screen.getByText('{2 keys}')).toBeInTheDocument()
  })

  it('copies the node path when copyable', async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={data} copyable />)

    await user.click(screen.getByRole('button', { name: 'Copy path $.version' }))
    expect(await window.navigator.clipboard.readText()).toBe('$.version')
  })

  it('builds bracket paths for array items and quoted keys', async () => {
    const user = userEvent.setup()
    render(<JsonViewer data={{ 'odd key': ['x'] }} copyable defaultExpandedDepth={3} />)

    await user.click(screen.getByRole('button', { name: 'Copy path $["odd key"][0]' }))
    expect(await window.navigator.clipboard.readText()).toBe('$["odd key"][0]')
  })

  it('hides copy buttons unless copyable', () => {
    render(<JsonViewer data={data} />)

    expect(screen.queryByRole('button', { name: /Copy path/ })).not.toBeInTheDocument()
  })
})
