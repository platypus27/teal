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
        <div role="alert" className="w-full rounded-xl border border-teal-error/40 p-4 text-sm text-teal-on-surface">
          <p className="font-semibold text-teal-error">This example failed to render.</p>
          <pre className="mt-2 overflow-x-auto text-xs text-teal-on-surface-variant">
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
