import { AppSwitcher, Button } from '@kryv/teal'
import { Camera, Gauge, LineChart } from 'lucide-react'

export function AppSwitcherDemo({ exampleIndex = 0 }) {
  return (
    <AppSwitcher
      trigger={<Button variant="secondary">Switch application</Button>}
      homeHref="#"
      homeLabel="Home"
      apps={
        exampleIndex
          ? [{ id: 'yang', label: 'Yang Operations', href: '#', icon: <Gauge /> }]
          : [
              { id: 'yang', label: 'Yang Operations', href: '#', icon: <Gauge /> },
              { id: 'photos', label: 'Photos', href: '#', icon: <Camera /> },
              { id: 'trict', label: 'Trict', href: '#', icon: <LineChart />, current: true },
            ]
      }
    />
  )
}
