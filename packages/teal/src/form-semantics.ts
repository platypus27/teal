import { createContext, useContext, useId } from 'react'

export interface FormSemantics {
  controlId: string
  descriptionId: string | undefined
  errorId: string | undefined
  invalid: boolean
  required: boolean
}

export const FormSemanticsContext = createContext<FormSemantics | null>(null)

export function useFormSemanticsContext() {
  return useContext(FormSemanticsContext)
}

export function mergeDescriptionIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(' ')
  return value || undefined
}

export function isAriaTrue(value: unknown) {
  return value === true || value === 'true' ? true : undefined
}

export function hasFormContent(value: unknown) {
  return value !== undefined && value !== null && value !== false && value !== ''
}

interface UseFormSemanticsOptions {
  description?: unknown | undefined
  error?: unknown | undefined
  id?: string | undefined
  invalid?: boolean | undefined
  prefix: string
  required?: boolean | undefined
}

/**
 * Resolves the id and ARIA relationship shared by every labeled control.
 * Nested controls inherit a Field's semantics while standalone controls get a
 * stable React id without leaking implementation details into their APIs.
 */
export function useFormSemantics({
  description,
  error,
  id,
  invalid,
  prefix,
  required,
}: UseFormSemanticsOptions): FormSemantics {
  const parent = useFormSemanticsContext()
  const generatedId = useId()
  const controlId = id ?? parent?.controlId ?? `${prefix}-${generatedId.replaceAll(':', '')}`
  const hasOwnDescription = hasFormContent(description)
  const hasOwnError = hasFormContent(error)
  const descriptionId = hasOwnDescription
    ? `${controlId}-description`
    : parent?.descriptionId
  const errorId = hasOwnError ? `${controlId}-error` : parent?.errorId

  return {
    controlId,
    descriptionId,
    errorId,
    invalid: invalid ?? parent?.invalid ?? hasOwnError,
    required: required ?? parent?.required ?? false,
  }
}
