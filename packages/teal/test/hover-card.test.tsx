import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HoverCard } from '../src/HoverCard'

describe('HoverCard', () => {
  it('reveals its content on hover', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0} trigger={<button type="button">@avery</button>}>
        <p>Avery Stone — Design lead</p>
      </HoverCard>,
    )

    expect(screen.queryByText('Avery Stone — Design lead')).not.toBeInTheDocument()
    await user.hover(screen.getByRole('button', { name: '@avery' }))
    expect(await screen.findByText('Avery Stone — Design lead')).toBeInTheDocument()
  })

  it('reveals its content on keyboard focus', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0} trigger={<button type="button">@blake</button>}>
        <p>Blake Moreno — Platform team</p>
      </HoverCard>,
    )

    await user.tab()
    expect(screen.getByRole('button', { name: '@blake' })).toHaveFocus()
    expect(await screen.findByText('Blake Moreno — Platform team')).toBeInTheDocument()
  })

  it('honors the requested side', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0} side="top" trigger={<button type="button">@avery</button>}>
        <p>Card body</p>
      </HoverCard>,
    )

    await user.hover(screen.getByRole('button', { name: '@avery' }))
    const content = await screen.findByText('Card body')
    expect(content.closest('[data-side]')).toHaveAttribute('data-side', 'top')
  })
})
