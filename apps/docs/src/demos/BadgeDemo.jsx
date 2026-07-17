import { Badge } from '@kryv/teal'

export function BadgeDemo() {
  return (
    <>
      <Badge>Neutral</Badge>
      <Badge variant="info">Information</Badge>
      <Badge variant="success">Ready</Badge>
      <Badge variant="warning">Attention</Badge>
      <Badge variant="danger">Action required</Badge>
    </>
  )
}
