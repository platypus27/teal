import { useState } from 'react'

/**
 * Implements the controlled/uncontrolled contract shared by form components:
 * `value` wins whenever provided, otherwise the state lives internally. The
 * returned setter is a no-op while controlled, so components can call it
 * unconditionally from their own commit paths before notifying `onChange`.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | (() => T),
): [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const set = (next: T) => {
    if (value === undefined) setInternalValue(next)
  }
  return [value !== undefined ? value : internalValue, set]
}
