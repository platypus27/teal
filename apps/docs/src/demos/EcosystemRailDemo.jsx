import { Camera, Gauge, Home, LayoutDashboard, LineChart, Settings } from 'lucide-react'
import { EcosystemRail, SidebarItem } from '@kryv/teal'

export function EcosystemRailDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="relative h-80 w-72 overflow-hidden rounded-xl border border-teal-outline-variant/30">
        <EcosystemRail
          className="absolute"
          mode="full"
          home={{
            href: 'https://home.kryvlabs.example',
            label: 'Home',
            icon: <Home className="size-5" />,
            current: true,
          }}
          destinations={[
            { id: 'yang', label: 'Yang Operations', href: 'https://yang.kryvlabs.example', icon: <Gauge className="size-5" /> },
            { id: 'photos', label: 'Photos', href: 'https://photos.kryvlabs.example', icon: <Camera className="size-5" />, status: 'degraded' },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="relative h-80 w-72 overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <EcosystemRail
        className="absolute"
        brand={
          <span className="flex w-16 items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-primary text-teal-on-primary">
              <LayoutDashboard className="size-5" />
            </span>
          </span>
        }
        home={{ href: 'https://home.kryvlabs.example', label: 'Home', icon: <Home className="size-5" /> }}
        destinations={[
          { id: 'yang', label: 'Yang Operations', href: 'https://yang.kryvlabs.example', icon: <Gauge className="size-5" />, current: true, status: 'healthy' },
          { id: 'photos', label: 'Photos', href: 'https://photos.kryvlabs.example', icon: <Camera className="size-5" /> },
          { id: 'trict', label: 'Trict', href: 'https://trict.kryvlabs.example', icon: <LineChart className="size-5" />, status: 'stale' },
        ]}
        footer={<SidebarItem icon={<Settings className="size-5" />}>Account</SidebarItem>}
      />
    </div>
  )
}
