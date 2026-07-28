import { Button, StepUpNotice } from '@kryv/teal'

export function StepUpNoticeDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <StepUpNotice title="Session expiring" onDismiss={() => undefined}>
      Verify again to keep this session active.
    </StepUpNotice>
  ) : (
    <StepUpNotice
      title="Confirm it's you"
      action={<Button size="sm">Verify with passkey</Button>}
    >
      Approving a repair requires fresh verification before Yang continues.
    </StepUpNotice>
  )
}
