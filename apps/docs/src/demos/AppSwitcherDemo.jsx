import { AppSwitcher, Button } from '@kryv/teal'
import { Camera, Gauge, LineChart } from 'lucide-react'

export function AppSwitcherDemo({ exampleIndex = 0 }) {
  return (
    <AppSwitcher
      trigger={<Button variant="secondary">Switch application</Button>}
      homeHref="https://home.kryvlabs.example"
      homeLabel="Home"
      apps={
        exampleIndex
          ? [{ id: 'yang', label: 'Yang Operations', href: 'https://yang.kryvlabs.example', icon: <Gauge /> }]
          : [
              { id: 'yang', label: 'Yang Operations', href: 'https://yang.kryvlabs.example', icon: <Gauge /> },
              { id: 'photos', label: 'Photos', href: 'https://photos.kryvlabs.example', icon: <Camera /> },
              { id: 'trict', label: 'Trict', href: 'https://trict.kryvlabs.example', icon: <LineChart />, current: true },
            ]
      }
    />
  )
}
