import { Button, ButtonGroup } from '@kryv/teal'

export function ButtonGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ButtonGroup orientation="vertical">
        <Button variant="secondary">Project settings</Button>
        <Button variant="secondary">Members</Button>
        <Button variant="secondary">Danger zone</Button>
      </ButtonGroup>
    )
  }

  return (
    <ButtonGroup>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  )
}
