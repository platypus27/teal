import { Tabs } from '@kryv/teal'

export function TabsDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xl">
        <Tabs
          aria-label="Profile sections"
          defaultValue="general"
          items={[
            { value: 'general', label: 'General', content: <p className="text-sm">Name, handle, and avatar for this profile</p> },
            { value: 'security', label: 'Security', content: <p className="text-sm">Sign-in and verification settings</p> },
            { value: 'notifications', label: 'Notifications', content: <p className="text-sm">Delivery preferences for this profile</p> },
          ]}
        />
      </div>
    )
  }
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
