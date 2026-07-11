import { Component } from 'react'

export class DemoErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="w-full rounded-xl border border-error/40 p-4 text-sm text-on-surface">
          <p className="font-semibold text-error">This example failed to render.</p>
          <pre className="mt-2 overflow-x-auto text-xs text-on-surface-variant">
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
