import { Component, type ErrorInfo, type ReactNode } from 'react'

export interface ErrorBoundaryProps {
  /** Content protected by the boundary. */
  children?: ReactNode
  /** Rendered instead of children when an error is caught. As a function it receives the error and a reset callback. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  /** Called with the error and component stack when an error is caught. */
  onError?: (error: Error, info: ErrorInfo) => void
  /** Resets the boundary whenever any of these values change. */
  resetKeys?: unknown[]
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error !== null && this.hasResetKeysChanged(prevProps.resetKeys)) {
      this.reset()
    }
  }

  hasResetKeysChanged(prevKeys: unknown[] = []): boolean {
    const keys = this.props.resetKeys ?? []
    return keys.length !== prevKeys.length || keys.some((key, index) => !Object.is(key, prevKeys[index]))
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props
    if (error !== null) {
      if (typeof fallback === 'function') return fallback(error, this.reset)
      return fallback ?? null
    }
    return children
  }
}
