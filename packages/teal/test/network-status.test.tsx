import { fireEvent, render, screen } from '@testing-library/react'
import { NetworkStatus } from '../src/NetworkStatus'

describe('NetworkStatus', () => {
  it('shows the online state by default', () => {
    render(<NetworkStatus />)

    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('updates when the browser fires offline and online events', () => {
    render(<NetworkStatus />)

    fireEvent(window, new Event('offline'))
    expect(screen.getByText('Offline')).toBeInTheDocument()

    fireEvent(window, new Event('online'))
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('supports custom labels', () => {
    render(<NetworkStatus onlineLabel="Connected" offlineLabel="Disconnected" />)

    expect(screen.getByText('Connected')).toBeInTheDocument()
    fireEvent(window, new Event('offline'))
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('passes the online state to a render prop', () => {
    render(<NetworkStatus>{(online) => <span>{online ? 'has connection' : 'no connection'}</span>}</NetworkStatus>)

    expect(screen.getByText('has connection')).toBeInTheDocument()
    fireEvent(window, new Event('offline'))
    expect(screen.getByText('no connection')).toBeInTheDocument()
  })
})
