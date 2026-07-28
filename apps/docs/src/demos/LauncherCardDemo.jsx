import { Badge, LauncherCard } from '@kryv/teal'
import { Camera } from 'lucide-react'

export function LauncherCardDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <LauncherCard
      href="https://trict.kryvlabs.example"
      label="Trict"
      description="Trading research and execution"
      disabled
    />
  ) : (
    <LauncherCard
      href="https://photos.kryvlabs.example"
      label="Photos"
      description="Household media, albums, and sharing"
      icon={<Camera />}
      status={<Badge variant="success">Healthy</Badge>}
    />
  )
}
