import { Badge, LauncherCard } from '@kryv/teal'
import { Camera } from 'lucide-react'

export function LauncherCardDemo({ exampleIndex = 0 }) {
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
