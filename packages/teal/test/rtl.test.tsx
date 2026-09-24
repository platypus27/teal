import { act } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DatePicker } from '../src/DatePicker'
import { Toaster, toast } from '../src/Toast'

/**
 * Layout classes use CSS logical properties (ps/pe/start/end), so components
 * mirror correctly under dir="rtl". These tests pin both the horizontal arrow
 * semantics of the date grid and the logical-class migration itself.
 */
describe('RTL support', () => {
  it('flips horizontal grid arrows in RTL so ArrowRight moves to the previous day', async () => {
    const { container } = render(
      <div dir="rtl">
        <DatePicker label="تاريخ" defaultValue={new Date(2024, 0, 15)} />
      </div>,
    )

    fireEvent.click(screen.getByRole('textbox', { name: 'تاريخ' }))
    await waitFor(() => expect(container.querySelector('button[tabindex="0"]')).toBeInTheDocument())
    expect(container.querySelector('button[tabindex="0"]')).toHaveTextContent('15')

    const grid = container.querySelector('button[tabindex="0"]')!.parentElement as HTMLElement
    fireEvent.keyDown(grid, { key: 'ArrowRight' })
    await waitFor(() => expect(container.querySelector('button[tabindex="0"]')).toHaveTextContent('14'))

    fireEvent.keyDown(grid, { key: 'ArrowLeft' })
    await waitFor(() => expect(container.querySelector('button[tabindex="0"]')).toHaveTextContent('15'))
  })

  it('renders overlay surfaces with logical positioning classes only', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Saved' })
    })

    const viewport = screen.getByText('Saved').closest('[class*="teal-u-fixed"]') as HTMLElement
    expect(viewport).not.toBeNull()
    expect(viewport.className).toContain('teal-u-end-')
    for (const element of [viewport, ...Array.from(viewport.querySelectorAll<HTMLElement>('[class*="teal-u-"]'))]) {
      expect(element.getAttribute('class')).not.toMatch(/teal-u-(left|right|pl|pr|ml|mr)-/)
    }
  })
})
