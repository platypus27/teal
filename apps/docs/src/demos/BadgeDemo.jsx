import { Badge } from '@kryv/teal'

export function BadgeDemo() {
  return (
    <>
      <Badge>Neutral</Badge>
      <Badge tone="info">Information</Badge>
      <Badge tone="success">Ready</Badge>
      <Badge tone="warning">Attention</Badge>
      <Badge tone="danger">Action required</Badge>
    </>
  )
}
