import { Tabs } from '@kryv/teal'

export function TabsDemo() {
  return (
    <div className="w-full max-w-xl">
      <Tabs
        aria-label="Project details"
        defaultValue="overview"
        items={[
          { value: 'overview', label: 'Overview', content: <p className="text-sm">Project overview content</p> },
          { value: 'activity', label: 'Activity', content: <p className="text-sm">Recent project activity</p> },
          { value: 'access', label: 'Access', content: <p className="text-sm">Workspace access settings</p> },
        ]}
      />
    </div>
  )
}
