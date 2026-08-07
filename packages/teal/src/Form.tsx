import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react'

export interface FormContextValue {
  /** Validation messages keyed by field name, as passed to the Form. */
  errors: Record<string, ReactNode>
}

const FormContext = createContext<FormContextValue | null>(null)

/** Returns the error map of the enclosing Form, or an empty map outside one. */
export function useFormErrors(): Record<string, ReactNode> {
  return useContext(FormContext)?.errors ?? {}
}

/** Returns the error message the enclosing Form holds for `name`, if any. */
export function useFormFieldError(name: string): ReactNode | undefined {
  return useContext(FormContext)?.errors[name]
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Validation messages keyed by field name, exposed to descendants through context. */
  errors?: Record<string, ReactNode>
  /** Called with the collected field values on submit; the default page navigation is prevented. */
  onSubmit?: (values: Record<string, FormDataEntryValue | FormDataEntryValue[]>, event: FormEvent<HTMLFormElement>) => void
}

/**
 * A lightweight form wrapper: it collects field values with FormData on
 * submit and shares an error map with descendants through context, so plain
 * controls and Field compositions work without a form library.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, errors, onSubmit, ...props },
  ref,
) {
  const context = useMemo<FormContextValue>(() => ({ errors: errors ?? {} }), [errors])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onSubmit) return
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {}
    for (const name of new Set(data.keys())) {
      const entries = data.getAll(name)
      const first = entries[0]
      if (first === undefined) continue
      values[name] = entries.length > 1 ? entries : first
    }
    onSubmit(values, event)
  }

  return (
    <FormContext.Provider value={context}>
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  )
})
