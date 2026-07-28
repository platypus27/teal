import { forwardRef, type ReactNode } from 'react'
import { Alert } from './Alert'

export interface StepUpNoticeProps {
  /** Caller-supplied verification control, such as a passkey button. The notice never starts verification itself. */
  action?: ReactNode
  /** Explanation of why fresh verification is required. */
  children: ReactNode
  className?: string
  /** Renders a dismiss control and calls this when pressed. */
  onDismiss?: () => void
  /** Bold leading text of the notice. */
  title: ReactNode
}

export const StepUpNotice = forwardRef<HTMLDivElement, StepUpNoticeProps>(function StepUpNotice(
  { action, children, className, onDismiss, title },
  ref,
) {
  return (
    <Alert
      ref={ref}
      variant="warning"
      title={title}
      {...(onDismiss !== undefined ? { onDismiss } : {})}
      {...(className !== undefined ? { className } : {})}
    >
      <p>{children}</p>
      {action ? <div className="teal-u-mt-3">{action}</div> : null}
    </Alert>
  )
})
