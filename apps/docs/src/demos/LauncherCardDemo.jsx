import { Badge, LauncherCard, VoxelMotif } from '@kryv/teal'
import { Camera } from 'lucide-react'

export function LauncherCardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <LauncherCard
        href="#"
        label="Home"
        description="Household sign-in and settings"
        media={<VoxelMotif motif="home" size={72} />}
      />
    )
  }

  return exampleIndex ? (
    <LauncherCard
      href="#"
      label="Trict"
      description="Trading research and execution"
      disabled
    />
  ) : (
    <LauncherCard
      href="#"
      label="Photos"
      description="Household media, albums, and sharing"
      icon={<Camera />}
      status={<Badge variant="success">Healthy</Badge>}
    />
  )
}
