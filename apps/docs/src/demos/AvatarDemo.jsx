import { Avatar } from '@kryv/teal'

export function AvatarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <>
        <Avatar name="Avery Chen" />
        <Avatar name="Morgan" />
        <Avatar />
      </>
    )
  }
  return (
    <>
      <Avatar name="Avery Chen" size="sm" />
      <Avatar name="Avery Chen" />
      <Avatar name="Avery Chen" size="lg" />
    </>
  )
}
