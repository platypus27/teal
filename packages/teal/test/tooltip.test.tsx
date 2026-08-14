import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '../src/Tooltip'

describe('Tooltip', () => {
  it('opens on hover with the default top side', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Save changes" delayDuration={0}>
        <button type="button">Save</button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Save' }))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Save changes')
    expect(tooltip).toHaveAttribute('data-side', 'top')
  })

  it('maps the placement alias onto the Radix side', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Save changes" placement="bottom" delayDuration={0}>
        <button type="button">Save</button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'bottom')
  })

  it('lets placement win when both placement and side are given', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Save changes" placement="left" side="right" delayDuration={0}>
        <button type="button">Save</button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'left')
  })

  it('passes align through to the popper content', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Save changes" align="start" delayDuration={0}>
        <button type="button">Save</button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-align', 'start')
  })
})
