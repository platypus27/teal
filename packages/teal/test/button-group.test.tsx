import { render, screen } from '@testing-library/react'
import { Button } from '../src/Button'
import { ButtonGroup } from '../src/ButtonGroup'

describe('ButtonGroup', () => {
  it('renders its children inside a group', () => {
    render(
      <ButtonGroup>
        <Button variant="secondary">Day</Button>
        <Button variant="secondary">Week</Button>
        <Button variant="secondary">Month</Button>
      </ButtonGroup>,
    )

    const group = screen.getByRole('group')
    expect(group).toContainElement(screen.getByRole('button', { name: 'Day' }))
    expect(group).toContainElement(screen.getByRole('button', { name: 'Week' }))
    expect(group).toContainElement(screen.getByRole('button', { name: 'Month' }))
  })

  it('squares inner corners and collapses seams horizontally by default', () => {
    render(
      <ButtonGroup>
        <Button variant="secondary">One</Button>
        <Button variant="secondary">Two</Button>
      </ButtonGroup>,
    )

    const group = screen.getByRole('group')
    expect(group.className).toContain('[&_button]:teal-u-rounded-none')
    expect(group.className).toContain('-teal-u-space-x-px')
    expect(group.className).toContain('[&>:first-child]:teal-u-rounded-l-full')
    expect(group.className).toContain('[&>:last-child]:teal-u-rounded-r-full')
  })

  it('applies vertical stacking classes for orientation="vertical"', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button variant="secondary">One</Button>
        <Button variant="secondary">Two</Button>
      </ButtonGroup>,
    )

    const group = screen.getByRole('group')
    expect(group.className).toContain('teal-u-flex-col')
    expect(group.className).toContain('-teal-u-space-y-px')
    expect(group.className).toContain('[&>:first-child]:teal-u-rounded-t-full')
    expect(group.className).toContain('[&>:last-child]:teal-u-rounded-b-full')
  })

  it('merges a caller className', () => {
    render(
      <ButtonGroup className="custom-class">
        <Button variant="secondary">One</Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('group').className).toContain('custom-class')
  })
})
